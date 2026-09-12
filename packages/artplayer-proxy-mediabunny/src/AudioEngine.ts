import type { AudioBufferSink as AudioSink, Input } from 'mediabunny'
import type { AudioIterator } from './audio-pump'
import type { AudioPort } from './engine-ports'
import type EventTarget from './EventTarget'
import type { PlaybackMedia } from './media'
import { AudioBufferSink } from 'mediabunny'
import { mediaTime } from './audio-clock'
import ContextOwner from './audio-context'
import NodeQueue from './audio-nodes'
import AudioPump from './audio-pump'
import AudioTask, { CANCELLED } from './audio-task'

export default class AudioEngine implements AudioPort {
  declare events: EventTarget
  declare input: Input | null
  declare audioSink: AudioSink | null
  declare audioIterator: AudioIterator | null
  declare audioContext: AudioContext | null
  declare gainNode: GainNode | null
  declare audioContextStartTime: number
  declare playbackTimeAtStart: number
  declare latestScheduledEndTime: number
  declare duration: number
  declare paused: boolean
  declare volume: number
  declare muted: boolean
  declare playbackRate: number
  declare asyncId: number
  declare queuedNodes: Set<AudioBufferSourceNode>
  #closed = false
  #generation = 0
  #contexts: ContextOwner
  #nodes: NodeQueue
  #pump: AudioPump
  #playTask: AudioTask | null = null
  #playing: Promise<void> | null = null
  #loading: Promise<void> | null = null
  #onError: ((error: unknown) => void) | undefined

  constructor(events: EventTarget, onError?: (error: unknown) => void) {
    this.events = events
    this.input = null
    this.audioSink = null
    this.audioIterator = null
    this.audioContext = null
    this.gainNode = null
    this.audioContextStartTime = 0
    this.playbackTimeAtStart = 0
    this.latestScheduledEndTime = 0
    this.duration = Number.NaN
    this.paused = true
    this.volume = 0.7
    this.muted = false
    this.playbackRate = 1
    this.asyncId = 0
    this.queuedNodes = new Set()
    this.#contexts = new ContextOwner(this)
    this.#nodes = new NodeQueue(this)
    this.#pump = new AudioPump(this, this.#contexts, this.#nodes)
    this.#onError = onError
  }

  get currentTime(): number {
    return mediaTime(this)
  }

  ensureAudioContext(sampleRate?: number): void {
    this.#contexts.ensure(sampleRate)
  }

  updateGain(): void {
    this.#contexts.updateGain()
  }

  stopQueuedNodes(): void {
    this.#nodes.stop()
  }

  async stopIterator(): Promise<void> {
    await this.#pump.stopIterator()
  }

  handleNoAudioTrack(): void {
    if (this.#closed)
      return
    this.audioSink = null
    this.ensureAudioContext()
  }

  cancelPending(): void {
    this.#generation++
    try {
      this.pause()
    }
    finally {
      this.#loading = null
      this.input = null
      this.audioSink = null
    }
  }

  async load(media: PlaybackMedia, onMetadata?: () => void): Promise<void> {
    if (this.#closed)
      return
    this.cancelPending()
    const generation = this.#generation
    this.playbackTimeAtStart = 0
    this.audioContextStartTime = 0
    this.latestScheduledEndTime = 0
    const pending = Promise.resolve().then(() => this.#load(media, generation, onMetadata))
    this.#loading = pending
    try {
      await pending
    }
    finally {
      if (this.#loading === pending)
        this.#loading = null
    }
  }

  async #load({ input, audioTrack, duration }: PlaybackMedia, generation: number, onMetadata?: () => void): Promise<void> {
    const current = () => !this.#closed && this.#generation === generation
    if (!current())
      return
    this.input = input
    this.duration = duration
    try {
      const decodable = audioTrack && audioTrack.codec !== null && await audioTrack.canDecode()
      if (!current())
        return
      if (!decodable) {
        this.handleNoAudioTrack()
      }
      else {
        this.ensureAudioContext(audioTrack.sampleRate)
        if (!current())
          return
        this.audioSink = new AudioBufferSink(audioTrack)
      }
      if (current())
        onMetadata?.()
    }
    catch (error) {
      if (current())
        throw error
    }
  }

  async runIterator(localId: number): Promise<void> {
    if (this.#closed)
      return
    await this.#pump.run(localId)
  }

  #startPump(id: number): void {
    void this.runIterator(id).catch((error) => {
      if (this.#closed || id !== this.asyncId)
        return
      try {
        this.pause()
      }
      catch (failure) { console.warn('MediaBunny audio failure cleanup:', failure) }
      try {
        if (this.#onError)
          this.#onError(error)
        else
          this.events.emit('error', error)
      }
      catch (failure) { console.warn('MediaBunny audio error listener:', failure) }
    })
  }

  async play(): Promise<void> {
    if (this.#closed)
      return
    if (this.#playing)
      return this.#playing
    if (!this.paused)
      return
    const task = new AudioTask()
    this.#playTask = task
    const generation = this.#generation
    const pending = this.#play(task, generation)
    this.#playing = pending
    try {
      await pending
    }
    finally {
      if (this.#playTask === task) {
        this.#playTask = null
        this.#playing = null
      }
    }
  }

  async #play(task: AudioTask, generation: number): Promise<void> {
    const current = () => !this.#closed && !task.cancelled && this.#generation === generation
    try {
      const context = this.#contexts.ensure()
      if (!context || !current())
        return
      if (context.state === 'suspended') {
        const resumed = await task.wait(this.#contexts.resume(context))
        if (resumed === CANCELLED || !current())
          return
      }
      if (this.#loading) {
        const loaded = await task.wait(this.#loading)
        if (loaded === CANCELLED || !current())
          return
      }
      this.audioContextStartTime = context.currentTime
      this.latestScheduledEndTime = this.playbackTimeAtStart
      this.paused = false
      this.#startPump(++this.asyncId)
    }
    catch (error) {
      if (current())
        throw error
    }
  }

  pause(): void {
    if (!this.paused)
      this.playbackTimeAtStart = this.currentTime
    this.paused = true
    this.asyncId++
    this.#playTask?.cancel()
    this.#playTask = null
    this.#playing = null
    this.#pump.cancel()
    this.stopQueuedNodes()
  }

  async seek(time: number): Promise<void> {
    if (this.#closed)
      return
    const playing = !this.paused
    this.#pump.cancel()
    this.stopQueuedNodes()
    this.playbackTimeAtStart = Math.max(0, time)
    this.audioContextStartTime = this.audioContext?.currentTime ?? 0
    this.latestScheduledEndTime = this.playbackTimeAtStart
    const id = ++this.asyncId
    if (playing)
      this.#startPump(id)
  }

  setVolume(volume: number, muted: boolean): void {
    this.volume = volume
    this.muted = muted
    this.updateGain()
  }

  setPlaybackRate(rate: number): void {
    if (this.#closed || rate === this.playbackRate)
      return
    const time = this.currentTime
    this.#pump.cancel()
    this.stopQueuedNodes()
    this.playbackTimeAtStart = time
    this.audioContextStartTime = this.audioContext?.currentTime ?? 0
    this.playbackRate = rate
    this.latestScheduledEndTime = time
    const id = ++this.asyncId
    if (!this.paused)
      this.#startPump(id)
  }

  destroy(): void {
    if (this.#closed)
      return
    this.#closed = true
    this.#generation++
    const failures: unknown[] = []
    for (const release of [() => this.pause(), () => this.#contexts.destroy()]) {
      try {
        release()
      }
      catch (error) { failures.push(error) }
    }
    this.input = null
    this.audioSink = null
    this.#loading = null
    if (failures.length)
      throw failures[0]
  }
}
