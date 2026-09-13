import { createOutput, releaseOutput, renderMask } from './output'
import { loadSegmenter, releaseSegmenter } from './sdk'

export default class MaskController {
  constructor(art, config, { $video, $danmuku }) {
    this.art = art
    this.config = config
    this.video = $video
    this.layer = $danmuku
    this.closed = art.isDestroy
    this.run = null
    this.tail = Promise.resolve()
    this.start = this.start.bind(this)
    this.stop = this.stop.bind(this)
    this.destroy = this.destroy.bind(this)
    this.ready = () => {
      this.start().catch(error => console.error('Failed to start danmuku mask:', error))
    }
    if (!this.closed) {
      try {
        art.on('destroy', this.destroy)
        if (!this.closed)
          art.on('ready', this.ready)
      }
      catch (error) {
        this.closed = true
        this.halt()
        try {
          art.off('ready', this.ready)
        }
        catch {}
        try {
          art.off('destroy', this.destroy)
        }
        catch {}
        throw error
      }
    }
  }

  active(run) {
    return run === this.run && run.running && !this.closed && !this.art.isDestroy
  }

  release(run) {
    if (run.releasing)
      return run.releasing
    const segmenter = run.segmenter
    run.segmenter = null
    const output = run.output
    run.output = null
    run.releasing = (async () => {
      await Promise.resolve()
      try {
        // Frame work has settled; an SDK close must not retain this independent bitmap.
        releaseOutput(output)
      }
      finally {
        if (segmenter)
          await releaseSegmenter(segmenter)
      }
    })()
    return run.releasing
  }

  schedule(run) {
    if (!this.active(run) || run.frame !== null || run.busy)
      return
    run.frame = requestAnimationFrame(() => {
      run.frame = null
      this.tick(run)
    })
  }

  tick(run) {
    if (!this.active(run) || run.busy)
      return
    const video = this.video
    if (video.paused || video.ended || !(video.videoWidth > 0 && video.videoHeight > 0)) {
      this.schedule(run)
      return
    }
    run.busy = true
    const work = (async () => {
      try {
        // Reserve the work slot before SDK code can synchronously reenter start/stop.
        await Promise.resolve()
        if (this.active(run))
          await renderMask(run.output, video, this.layer, run.segmenter, this.config, () => this.active(run))
      }
      catch (error) {
        if (this.active(run))
          console.error('Error in segmentBody:', error)
      }
      finally {
        run.busy = false
        if (!this.active(run))
          await this.release(run)
        else this.schedule(run)
      }
    })()
    // A restart waits for uncancellable SDK work and disposal; it never overlaps it.
    this.tail = work.catch(error => console.warn('Failed to release danmuku mask resources:', error))
  }

  async start() {
    if (this.closed || this.art.isDestroy)
      return
    if (this.run?.running)
      return this.run.started
    let cancel
    const cancelled = new Promise(resolve => cancel = resolve)
    const run = { running: true, initializing: true, busy: false, frame: null, segmenter: null, output: null, cancel, started: null }
    const previous = this.tail
    this.run = run
    const initialize = (async () => {
      try {
        await previous
        if (!this.active(run))
          return
        if (!this.video || !this.layer?.style)
          throw new Error('Danmuku mask requires core video and danmuku template nodes')
        run.segmenter = await loadSegmenter(this.config, () => this.active(run))
        if (!this.active(run))
          return
        if (!run.segmenter) {
          run.running = false
          return
        }
        run.output = createOutput(this.layer)
      }
      catch (error) {
        if (this.active(run)) {
          run.running = false
          throw error
        }
      }
      finally {
        run.initializing = false
        if (!this.active(run))
          await this.release(run)
      }
      if (this.active(run))
        this.tick(run)
    })()
    this.tail = initialize.catch(() => {})
    // stop settles public start promptly; eventual SDK results remain observed by initialize.
    run.started = Promise.race([initialize, cancelled])
    return run.started
  }

  halt() {
    const run = this.run
    if (run) {
      run.running = false
      run.cancel()
      if (run.frame !== null) {
        cancelAnimationFrame(run.frame)
        run.frame = null
      }
      if (!run.initializing && !run.busy)
        this.tail = this.release(run).catch(error => console.warn('Failed to release danmuku mask resources:', error))
    }
  }

  stop() {
    this.halt()
    if (this.layer?.style)
      this.layer.style.maskImage = 'none'
  }

  destroy() {
    if (this.closed)
      return
    this.closed = true
    try {
      this.stop()
    }
    finally {
      try {
        this.art.off('ready', this.ready)
      }
      finally {
        this.art.off('destroy', this.destroy)
      }
    }
  }
}
