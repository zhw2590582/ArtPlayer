import type { WrappedCanvas } from 'mediabunny'
import type EventTarget from './EventTarget'
import type { FrameIterator } from './video-frames'
import { publish } from './readiness'
import { frameAction, readCanvas } from './video-frames'

export interface RenderHost {
  events: EventTarget
  audioClock: { readonly currentTime: number } | null
  videoIterator: FrameIterator | null
  nextFrame: WrappedCanvas | null
  rafId: number
  asyncId: number
  duration: number
  lastTimeUpdate: number
  timeupdateInterval: number
  avSyncTolerance: number
  dropLateFrames: boolean
  playbackRate: number
  stalled: boolean
  isFetching: boolean
}

export default class Renderer {
  private stopped = false
  private closed = false
  private scheduled: number | null = null
  private fetching: object | null = null

  constructor(private host: RenderHost, private ready: () => boolean, private draw: (frame: WrappedCanvas) => void, private failure: (error: unknown) => void) {}

  private current(id: number): boolean {
    return !this.closed && !this.stopped && this.host.asyncId === id
  }

  async update(id: number): Promise<void> {
    const iterator = this.host.videoIterator
    if (!iterator || !this.ready() || !this.current(id) || this.host.isFetching)
      return
    const request = {}
    this.fetching = request
    this.host.isFetching = true
    const current = () => this.current(id) && this.host.videoIterator === iterator
    try {
      while (current()) {
        const frame = await readCanvas(iterator)
        if (!current() || !frame)
          return
        const time = this.host.audioClock?.currentTime
        if (time === undefined)
          return
        const action = frameAction(frame.timestamp, time, this.host.dropLateFrames, this.host.avSyncTolerance, this.host.playbackRate)
        if (action === 'skip')
          continue
        if (action === 'draw') {
          this.draw(frame)
        }
        else {
          this.host.nextFrame = frame
          return
        }
      }
    }
    catch (error) {
      if (current())
        throw error
    }
    finally {
      if (this.fetching === request) {
        this.fetching = null
        this.host.isFetching = false
      }
    }
  }

  private request(id: number): void {
    void this.update(id).catch((error) => {
      if (!this.current(id))
        return
      this.stop()
      this.report(error)
    })
  }

  private report(error: unknown): void {
    try {
      this.failure(error)
    }
    catch (failure) {
      console.warn('MediaBunny video error listener:', failure)
    }
  }

  private cancelFrame(): void {
    if (this.scheduled === null)
      return
    cancelAnimationFrame(this.scheduled)
    this.scheduled = null
  }

  private schedule(id: number): void {
    if (!this.current(id))
      return
    this.cancelFrame()
    const frame = requestAnimationFrame(() => {
      if (this.scheduled !== frame || !this.current(id))
        return
      this.scheduled = null
      try {
        this.render()
      }
      catch (error) {
        this.stop()
        this.report(error)
      }
    })
    this.scheduled = frame
    this.host.rafId = frame
  }

  render(): void {
    const id = this.host.asyncId
    const current = () => this.current(id)
    if (!current() || !this.host.audioClock)
      return
    const time = this.host.audioClock.currentTime
    const now = Date.now()
    if (now - this.host.lastTimeUpdate >= this.host.timeupdateInterval) {
      this.host.events.emit('timeupdate')
      if (!current())
        return
      this.host.lastTimeUpdate = now
    }
    if (!this.ready()) {
      this.schedule(id)
      return
    }
    if (Number.isFinite(this.host.duration) && time >= this.host.duration) {
      this.stop()
      this.host.stalled = false
      const ended = this.host.asyncId
      publish(this.host.events, () => !this.closed && this.host.asyncId === ended, ['ended', 'pause', 'canplay'])
      return
    }
    if (this.host.nextFrame && this.host.nextFrame.timestamp <= time) {
      this.draw(this.host.nextFrame)
      this.host.nextFrame = null
      this.request(id)
      if (this.host.stalled) {
        publish(this.host.events, current, ['canplay', 'playing'])
        if (!current())
          return
        this.host.stalled = false
      }
    }
    else if (!this.host.nextFrame) {
      this.request(id)
      if (Number.isFinite(this.host.duration) && time < this.host.duration && !this.host.stalled) {
        this.host.stalled = true
        this.host.events.emit('waiting')
      }
    }
    this.schedule(id)
  }

  start(clock: { readonly currentTime: number }): void {
    if (this.closed)
      return
    this.stop()
    this.stopped = false
    this.host.audioClock = clock
    this.host.stalled = false
    if (!this.host.nextFrame)
      this.request(this.host.asyncId)
    this.schedule(this.host.asyncId)
  }

  stop(): void {
    this.stopped = true
    this.host.asyncId++
    this.cancelFrame()
    this.fetching = null
    this.host.isFetching = false
  }

  destroy(): void {
    if (this.closed)
      return
    this.stop()
    this.closed = true
  }
}
