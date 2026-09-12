import type { Input, WrappedCanvas } from 'mediabunny'
import type { VideoOptions, VideoPort } from './engine-ports'
import type EventTarget from './EventTarget'
import type { PlaybackMedia } from './media'
import type { FrameIterator } from './video-frames'
import { CanvasSink } from 'mediabunny'
import { preflightRange } from './preflight'
import { readCanvas, releaseIterator } from './video-frames'
import Poster from './video-poster'
import Renderer from './video-renderer'

export default class VideoEngine implements VideoPort {
  declare canvas: HTMLCanvasElement
  declare ctx: CanvasRenderingContext2D | null
  declare events: EventTarget
  declare timeupdateInterval: number
  declare avSyncTolerance: number
  declare dropLateFrames: boolean
  declare poster: string
  declare preflightRange: boolean
  declare input: Input | null
  declare videoSink: CanvasSink | null
  declare videoIterator: FrameIterator | null
  declare nextFrame: WrappedCanvas | null
  declare rafId: number
  declare asyncId: number
  declare width: number
  declare height: number
  declare duration: number
  declare audioClock: { readonly currentTime: number } | null
  declare lastTimeUpdate: number
  declare stalled: boolean
  declare playbackRate: number
  declare posterDrawn: boolean
  declare isFetching: boolean
  #generation = 0
  #iteration = 0
  #loading: Promise<void> | null = null
  #createSink: (() => CanvasSink) | null = null
  #usedSink: CanvasSink | null = null
  #destroyed = false
  #preparing = false
  #poster = new Poster()
  #renderer: Renderer
  #onError: ((error: unknown) => void) | undefined

  constructor({ canvas, ctx, events, timeupdateInterval = 250, avSyncTolerance = 0.12, dropLateFrames = false, poster = '', preflightRange = false, onError }: VideoOptions) {
    this.canvas = canvas
    this.ctx = ctx
    this.events = events
    this.timeupdateInterval = timeupdateInterval
    this.avSyncTolerance = avSyncTolerance
    this.dropLateFrames = dropLateFrames
    this.poster = poster
    this.preflightRange = preflightRange
    this.input = null
    this.videoSink = null
    this.videoIterator = null
    this.nextFrame = null
    this.rafId = 0
    this.asyncId = 0
    this.width = 0
    this.height = 0
    this.duration = Number.NaN
    this.audioClock = null
    this.lastTimeUpdate = 0
    this.stalled = false
    this.playbackRate = 1
    this.posterDrawn = false
    this.isFetching = false
    this.#onError = onError
    this.#renderer = new Renderer(this, () => !this.#preparing, frame => this.#draw(frame, true), error => this.#report(error))
  }

  #current(generation: number): boolean {
    return !this.#destroyed && this.#generation === generation
  }

  #context(): CanvasRenderingContext2D {
    if (!this.ctx)
      throw new Error('Canvas 2D context is unavailable.')
    return this.ctx
  }

  #report(error: unknown): void {
    if (this.#destroyed)
      return
    this.#release()
    if (this.#onError)
      this.#onError(error)
    else
      this.events.emit('error', error)
  }

  #release(): void {
    void this.stopIterator().catch(error => console.warn('MediaBunny iterator cleanup error:', error))
  }

  #draw(frame: WrappedCanvas, clear: boolean): void {
    this.#poster.cancel()
    if (clear)
      this.clear()
    this.#context().drawImage(frame.canvas, 0, 0)
  }

  async preflight(source: unknown, signal?: AbortSignal, current?: () => boolean): Promise<boolean> {
    return preflightRange(source, this.preflightRange, this.events, signal, current)
  }

  drawPoster(): void {
    if (this.#destroyed || !this.poster || this.posterDrawn)
      return
    const generation = this.#generation
    this.#poster.draw(this.poster, () => this.#current(generation), (image) => {
      this.clear()
      this.canvas.width = image.naturalWidth || this.canvas.width
      this.canvas.height = image.naturalHeight || this.canvas.height
      this.#context().drawImage(image, 0, 0, this.canvas.width, this.canvas.height)
      this.posterDrawn = true
    }, error => this.#report(error))
  }

  async stopIterator(): Promise<void> {
    const iterator = this.videoIterator
    this.videoIterator = null
    this.nextFrame = null
    await releaseIterator(iterator)
  }

  clear(): void {
    this.#context().clearRect(0, 0, this.canvas.width, this.canvas.height)
  }

  cancelPending(): void {
    this.#generation++
    this.#iteration++
    this.stop()
    this.#release()
    this.#poster.cancel()
    this.#preparing = false
    this.#loading = null
    this.#createSink = null
    this.#usedSink = null
    this.videoSink = null
    this.input = null
  }

  async load(media: PlaybackMedia, onMetadata?: () => void): Promise<void> {
    if (this.#destroyed)
      return
    this.cancelPending()
    const generation = this.#generation
    const iteration = this.#iteration
    this.#preparing = true
    const pending = Promise.resolve().then(() => this.#load(media, generation, iteration, onMetadata))
    this.#loading = pending
    try {
      await pending
    }
    finally {
      if (this.#loading === pending)
        this.#loading = null
    }
  }

  async #load(media: PlaybackMedia, generation: number, iteration: number, onMetadata?: () => void): Promise<void> {
    if (!this.#current(generation))
      return
    try {
      this.clear()
      this.posterDrawn = false
      const { input, videoTrack, duration } = media
      this.input = input
      this.duration = duration
      if (!videoTrack) {
        this.handleNoVideoTrack()
        onMetadata?.()
        return
      }
      const decodable = videoTrack.codec !== null && await videoTrack.canDecode()
      if (!this.#current(generation))
        return
      if (!decodable) {
        this.handleNoVideoTrack()
        onMetadata?.()
        return
      }
      const transparent = await videoTrack.canBeTransparent()
      if (!this.#current(generation))
        return
      this.#createSink = () => new CanvasSink(videoTrack, { poolSize: 2, fit: 'contain', alpha: transparent })
      this.videoSink = this.#createSink()
      this.width = videoTrack.displayWidth
      this.height = videoTrack.displayHeight
      this.canvas.width = this.width
      this.canvas.height = this.height
      onMetadata?.()
      if (this.#current(generation))
        await this.#reset(0, generation, iteration)
    }
    catch (error) {
      if (this.#current(generation)) {
        this.#release()
        throw error
      }
    }
    finally {
      if (this.#current(generation) && this.#iteration === iteration)
        this.#preparing = false
    }
  }

  handleNoVideoTrack(): void {
    if (this.#destroyed)
      return
    this.videoSink = null
    this.width = 0
    this.height = 0
    this.canvas.width = 0
    this.canvas.height = 0
    this.clear()
    this.drawPoster()
  }

  async #reset(time: number, generation: number, iteration: number): Promise<void> {
    if (!this.#current(generation) || this.#iteration !== iteration)
      return
    this.#release()
    if (this.#createSink && this.videoSink === this.#usedSink)
      this.videoSink = this.#createSink()
    const sink = this.videoSink
    if (!sink || !this.#current(generation))
      return
    this.#usedSink = sink
    const iterator = sink.canvases(time)
    this.videoIterator = iterator
    const current = () => this.#current(generation) && this.#iteration === iteration && this.videoIterator === iterator
    const first = await readCanvas(iterator)
    if (!current())
      return
    const second = await readCanvas(iterator)
    if (!current())
      return
    this.nextFrame = second
    if (first)
      this.#draw(first, false)
    else
      this.drawPoster()
  }

  async resetIterator(time: number): Promise<void> {
    if (this.#destroyed)
      return
    const generation = this.#generation
    const iteration = ++this.#iteration
    const loading = this.#loading
    this.stop()
    this.#poster.cancel()
    this.#preparing = true
    try {
      if (loading)
        await loading
      await this.#reset(time, generation, iteration)
    }
    catch (error) {
      if (this.#current(generation) && this.#iteration === iteration) {
        this.#release()
        throw error
      }
    }
    finally {
      if (this.#current(generation) && this.#iteration === iteration)
        this.#preparing = false
    }
  }

  async updateNextFrame(localId: number): Promise<void> {
    await this.#renderer.update(localId)
  }

  render(): void {
    this.#renderer.render()
  }

  start(audio: { readonly currentTime: number }): void {
    this.#renderer.start(audio)
  }

  stop(): void {
    this.#renderer.stop()
  }

  async seek(time: number): Promise<void> {
    await this.resetIterator(time)
  }

  setPlaybackRate(rate: number): void {
    this.playbackRate = Math.max(0.1, Number(rate) || 1)
  }

  destroy(): void {
    if (this.#destroyed)
      return
    this.#destroyed = true
    this.#generation++
    this.#renderer.destroy()
    this.#poster.cancel()
    this.#release()
    this.posterDrawn = false
    this.#createSink = null
    this.#usedSink = null
    this.videoSink = null
    this.input = null
    this.audioClock = null
  }
}
