import type { PlaybackHost } from './engine-ports'
import type { PlaybackMedia } from './media'
import { publish } from './readiness'
import { resolveDuration } from './tracks'

interface Completion {
  promise: Promise<void>
  resolve: () => void
  reject: (error: unknown) => void
}

interface Operation extends Completion {
  source: number
  complete: Completion
}

function completion(): Completion {
  let resolve!: () => void
  let reject!: (error: unknown) => void
  const promise = new Promise<void>((yes, no) => {
    resolve = yes
    reject = no
  })
  return { promise, resolve, reject }
}

export default class Playback {
  private wanted = false
  private playing: Operation | null = null
  private seeking: Operation | null = null

  constructor(private host: PlaybackHost) {}

  private operation(): Operation {
    return { ...completion(), source: this.host.loadSeq, complete: completion() }
  }

  private current(operation: Operation, kind: 'playing' | 'seeking'): boolean {
    return !this.host.destroyed && operation.source === this.host.loadSeq && this[kind] === operation
  }

  private cancelPlay(): void {
    const previous = this.playing
    this.playing = null
    previous?.resolve()
  }

  invalidate(): void {
    this.cancelPlay()
    this.wanted = false
    const previous = this.seeking
    this.seeking = null
    previous?.complete.resolve()
    previous?.resolve()
    this.host.seeking = false
  }

  ended(): void {
    this.wanted = false
    this.cancelPlay()
  }

  private stop(): void {
    if (this.host.paused)
      return
    this.host.paused = true
    this.stopEngines()
    this.host.events.emit('pause')
  }

  private stopEngines(): void {
    const failures: unknown[] = []
    for (const stop of [() => this.host.audio.pause(), () => this.host.video.stop()]) {
      try {
        stop()
      }
      catch (error) { failures.push(error) }
    }
    if (failures.length)
      throw failures[0]
  }

  pause(): void {
    this.wanted = false
    this.cancelPlay()
    this.stop()
  }

  play(): Promise<void> {
    if (this.host.destroyed)
      return Promise.resolve()
    this.wanted = true
    if (this.playing)
      return this.playing.promise
    if (this.host.ended)
      return this.seek(0, true)
    if (!this.host.paused && !this.seeking)
      return Promise.resolve()
    const operation = this.operation()
    this.playing = operation
    this.runPlay(operation).then(operation.resolve, operation.reject)
    return operation.promise
  }

  private async runPlay(operation: Operation): Promise<void> {
    const current = () => this.current(operation, 'playing') && this.wanted
    try {
      while (this.seeking) {
        await this.seeking.complete.promise
        if (!current())
          return
      }
      if (!current())
        return
      this.host.paused = false
      await this.host.audio.play()
      if (!current()) {
        if (!this.wanted || this.host.destroyed)
          this.host.audio.pause()
        return
      }
      this.host.video.start(this.host.audio)
      publish(this.host.events, current, ['play', 'playing'])
    }
    catch (error) {
      if (!current())
        return
      this.wanted = false
      this.host.paused = true
      try {
        this.stopEngines()
      }
      catch (failure) { console.warn('MediaBunny play cleanup error:', failure) }
      throw error
    }
    finally {
      if (this.playing === operation)
        this.playing = null
    }
  }

  seek(time: number, resume?: boolean): Promise<void> {
    return this.position(async (current) => {
      const audio = this.host.audio.seek(time)
      const video = current() ? this.host.video.seek(time) : Promise.resolve()
      await Promise.all([audio, video])
    }, ['seeked'], false, resume)
  }

  replace(media: PlaybackMedia, time: number): Promise<void> {
    return this.position(async (current) => {
      media.duration = await resolveDuration(media)
      if (!current())
        return
      this.host.media = media
      await Promise.all([this.host.video.load(media), this.host.audio.load(media)])
      if (!current())
        return
      await Promise.all([this.host.video.seek(time), this.host.audio.seek(time)])
      if (current()) {
        this.host.readyState = 4
        this.host.networkState = 1
      }
    }, ['loadedmetadata', 'durationchange', 'progress', 'loadeddata', 'canplay', 'canplaythrough', 'seeked'], true)
  }

  private position(work: (current: () => boolean) => Promise<void>, events: readonly string[], pauseFirst: boolean, resume?: boolean): Promise<void> {
    if (this.host.destroyed)
      return Promise.resolve()
    this.wanted = resume ?? (this.seeking ? this.wanted : !this.host.paused)
    this.cancelPlay()
    const previous = this.seeking
    const operation = this.operation()
    this.seeking = operation
    previous?.complete.resolve()
    previous?.resolve()
    this.runPosition(operation, work, events, pauseFirst).then(operation.resolve, operation.reject)
    return operation.promise
  }

  private async runPosition(operation: Operation, work: (current: () => boolean) => Promise<void>, events: readonly string[], pauseFirst: boolean): Promise<void> {
    const current = () => this.current(operation, 'seeking')
    let resume = false
    try {
      if (pauseFirst)
        this.stop()
      if (!current())
        return
      this.host.ended = false
      this.host.seeking = true
      publish(this.host.events, current, ['seeking', 'waiting'])
      if (!current())
        return
      if (!pauseFirst)
        this.stop()
      if (!current())
        return
      await work(current)
      if (!current())
        return
      this.host.seeking = false
      operation.complete.resolve()
      publish(this.host.events, current, events)
      if (!current())
        return
      this.seeking = null
      resume = this.wanted
    }
    catch (error) {
      if (!current())
        return
      this.host.seeking = false
      this.wanted = false
      this.cancelPlay()
      this.host.reportError(error)
      throw error
    }
    finally {
      operation.complete.resolve()
      if (this.seeking === operation)
        this.seeking = null
    }
    if (resume)
      await this.play()
  }
}
