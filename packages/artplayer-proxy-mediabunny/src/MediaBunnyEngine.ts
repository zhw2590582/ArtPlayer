import type { Input } from 'mediabunny'
import type { AudioPort, VideoPort } from './engine-ports'
import type { EngineOptions, EnginePort, ProxyOptions } from './engine-types'
import type EventTarget from './EventTarget'
import type { SelectedTracks } from './hls-selection'
import type { PlaybackMedia } from './media'
import AudioEngine from './AudioEngine.js'
import { selectAudio, selectQuality } from './hls-selection'
import { getHlsState } from './hls-state'
import { createInput } from './input'
import LoadSession from './load-session'
import Playback from './playback'
import { metadataBarrier, publish } from './readiness'
import { selectPlaybackTracks } from './tracks'
import VideoEngine from './VideoEngine.js'

export default class MediaBunnyEngine implements EnginePort {
  declare events: EventTarget
  declare option: ProxyOptions
  declare audio: AudioPort
  declare video: VideoPort
  declare paused: boolean
  declare ended: boolean
  declare readyState: number
  declare networkState: number
  declare error: { code: number, message: string } | null
  declare seeking: boolean
  declare loadSeq: number
  declare input: Input | null
  declare media: PlaybackMedia | null
  declare loadSession: LoadSession | null
  declare destroyed: boolean
  #playback: Playback

  constructor({ canvas, ctx, events, option = {} }: EngineOptions) {
    this.events = events
    this.option = option
    this.audio = new AudioEngine(events)
    this.video = new VideoEngine({
      canvas,
      ctx,
      events,
      timeupdateInterval: option.timeupdateInterval ?? 250,
      avSyncTolerance: option.avSyncTolerance ?? 0.12,
      dropLateFrames: option.dropLateFrames ?? false,
      poster: option.poster ?? '',
      preflightRange: option.preflightRange ?? false,
      onError: (error) => {
        try {
          this.pause()
        }
        catch (failure) {
          console.warn('MediaBunny video failure cleanup:', failure)
        }
        this.reportError(error)
      },
    })
    this.paused = true
    this.ended = false
    this.readyState = 0
    this.networkState = 0
    this.error = null
    this.seeking = false
    this.loadSeq = 0
    this.input = null
    this.media = null
    this.loadSession = null
    this.destroyed = false
    this.#playback = new Playback(this)
    events.addEventListener('ended', () => {
      if (this.destroyed)
        return
      this.ended = true
      this.paused = true
      this.#playback.ended()
    })
  }

  async load(src: unknown): Promise<void> {
    if (this.destroyed)
      return
    const id = ++this.loadSeq
    this.#playback.invalidate()
    this.video.cancelPending()
    this.loadSession?.cancel()
    if (id !== this.loadSeq || this.destroyed)
      return
    this.pause()
    if (id !== this.loadSeq || this.destroyed)
      return
    this.disposeInput()
    const session = new LoadSession()
    this.loadSession = session
    this.ended = false
    this.error = null
    this.networkState = 2
    this.readyState = 0
    session.defer(() => this.events.emit('waiting'))
    session.defer(() => this.events.emit('loadstart'))
    const timeout = Number.isFinite(this.option.loadTimeout) ? this.option.loadTimeout ?? 0 : 0
    try {
      await session.wait(this.performLoad(src, id, session), timeout)
    }
    catch (error) {
      if (id !== this.loadSeq)
        return
      const failed = ++this.loadSeq
      this.#playback.invalidate()
      this.video.cancelPending()
      session.cancel()
      if (failed !== this.loadSeq || this.destroyed)
        return
      this.disposeInput()
      this.reportError(error)
    }
  }

  async performLoad(src: unknown, id: number, session = this.loadSession): Promise<void> {
    const current = () => !this.destroyed && id === this.loadSeq
    if (!session || !(await this.video.preflight(src, session.signal, current)) || !current())
      return
    const input = createInput(src)
    if (!input) {
      this.video.handleNoVideoTrack()
      if (current())
        this.audio.handleNoAudioTrack()
      return
    }
    session.own(input)
    const media = await selectPlaybackTracks(input, src)
    if (!current())
      return
    if (!media.videoTrack && !media.audioTrack) {
      this.video.handleNoVideoTrack()
      this.video.duration = Number.NaN
      this.audio.duration = Number.NaN
      throw new Error('Input has no audio or video tracks.')
    }
    this.input = input
    this.media = media
    const metadata = metadataBarrier(() => {
      this.readyState = 1
      publish(this.events, current, ['loadedmetadata', 'durationchange', 'progress'])
    }, current)
    try {
      const video = this.video.load(media, metadata.video)
      const audio = current() ? this.audio.load(media, metadata.audio) : Promise.resolve()
      await Promise.all([video, audio])
      if (!current())
        return
      this.readyState = 4
      this.networkState = 1
      publish(this.events, current, ['loadeddata', 'canplay', 'canplaythrough', 'progress'])
    }
    catch (error) {
      if (!current())
        return
      console.error('MediaBunny load error:', error)
      throw error
    }
  }

  createTimeout(ms: number): Promise<never> {
    return new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Load timeout')), ms)
    })
  }

  disposeInput(): void {
    this.loadSession?.disposeInput()
    this.input = null
    this.media = null
  }

  async replaceTracks(tracks: SelectedTracks): Promise<void> {
    if (!this.media || this.destroyed)
      return
    return this.#playback.replace({ ...this.media, ...tracks }, this.currentTime)
  }

  async selectHlsQuality(value: unknown): Promise<void> {
    return selectQuality(this, value)
  }

  async selectHlsAudio(value: unknown): Promise<void> {
    return selectAudio(this, value)
  }

  async getHlsState() {
    const media = this.media
    if (this.destroyed)
      return null
    try {
      const state = await getHlsState(media)
      return !this.destroyed && this.media === media ? state : null
    }
    catch (error) {
      if (this.destroyed || this.media !== media)
        return null
      throw error
    }
  }

  async play(): Promise<void> {
    return this.#playback.play()
  }

  pause(): void {
    this.#playback.pause()
  }

  async seek(time: number): Promise<void> {
    return this.#playback.seek(time)
  }

  setVolume(volume: number, muted: boolean): void {
    this.audio.setVolume(volume, muted)
  }

  setPlaybackRate(rate: number): void {
    this.audio.setPlaybackRate(rate)
    this.video.setPlaybackRate(rate)
  }

  reportError(error: unknown): void {
    if (this.destroyed)
      return
    const message: unknown = error && typeof error === 'object' ? Reflect.get(error, 'message') : undefined
    this.error = { code: 4, message: typeof message === 'string' ? message : String(error) }
    this.networkState = 3
    this.events.emit('error')
  }

  destroy(): void {
    if (this.destroyed)
      return
    this.destroyed = true
    this.loadSeq++
    this.#playback.invalidate()
    const failures: unknown[] = []
    for (const release of [() => this.loadSession?.cancel(), () => this.pause(), () => this.disposeInput(), () => this.audio.destroy(), () => this.video.destroy()]) {
      try {
        release()
      }
      catch (error) { failures.push(error) }
    }
    if (failures.length)
      throw failures[0]
  }

  get currentTime(): number {
    return this.audio.currentTime
  }

  get duration(): number {
    return this.media?.duration ?? this.audio.duration ?? this.video.duration
  }

  get videoWidth(): number {
    return this.video.width
  }

  get videoHeight(): number {
    return this.video.height
  }
}
