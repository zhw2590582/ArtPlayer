/**
 * Video Engine for MediaBunny
 * Handles video frame rendering and synchronization
 */
import {
  ALL_FORMATS,
  BlobSource,
  CanvasSink,
  Input,
  ReadableStreamSource,
  UrlSource,
} from 'mediabunny'

export default class VideoEngine {
  constructor({
    canvas,
    ctx,
    events,
    timeupdateInterval = 250,
    avSyncTolerance = 0.12,
    dropLateFrames = false,
    poster = '',
    preflightRange = false,
  }) {
    this.canvas = canvas
    this.ctx = ctx
    this.events = events
    this.timeupdateInterval = timeupdateInterval
    this.avSyncTolerance = avSyncTolerance
    this.dropLateFrames = dropLateFrames
    this.poster = poster
    this.preflightRange = preflightRange

    // MediaBunny instances
    this.input = null
    this.videoSink = null
    this.videoIterator = null

    // Frame rendering
    this.nextFrame = null
    this.rafId = 0
    this.asyncId = 0

    // Video properties
    this.width = 0
    this.height = 0
    this.duration = Number.NaN

    // Playback state
    this.audioClock = null
    this.lastTimeUpdate = 0
    this.stalled = false
    this.playbackRate = 1
    this.posterDrawn = false
    this.isFetching = false
  }

  normalizeSource(src) {
    if (typeof src === 'string')
      return new UrlSource(src)
    if (src instanceof Blob)
      return new BlobSource(src)
    if (typeof ReadableStream !== 'undefined' && src instanceof ReadableStream) {
      return new ReadableStreamSource(src)
    }
    return src
  }

  async preflight(url) {
    if (!this.preflightRange || typeof url !== 'string')
      return true

    try {
      const res = await fetch(url, { method: 'HEAD' })
      const acceptRanges = res.headers.get('accept-ranges')
      if (!acceptRanges || acceptRanges === 'none') {
        this.events.emit('error', new Event('RangeNotSupported'))
        return false
      }
      return true
    }
    catch (e) {
      console.warn('Preflight check failed:', e)
      return true
    }
  }

  drawPoster() {
    if (!this.poster || this.posterDrawn)
      return

    const img = new Image()
    img.onload = () => {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
      this.canvas.width = img.naturalWidth || this.canvas.width
      this.canvas.height = img.naturalHeight || this.canvas.height
      this.ctx.drawImage(img, 0, 0, this.canvas.width, this.canvas.height)
      this.posterDrawn = true
    }
    img.src = this.poster
  }

  async stopIterator() {
    await this.videoIterator?.return()
    this.videoIterator = null
  }

  clear() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
  }

  async load(src, onMetadata) {
    const id = ++this.asyncId

    await this.stopIterator()
    this.clear()
    this.posterDrawn = false

    if (!(await this.preflight(src)))
      return

    const source = this.normalizeSource(src)
    if (!source) {
      this.drawPoster()
      return
    }

    this.input = new Input({
      source,
      formats: ALL_FORMATS,
    })

    this.duration = await this.input.computeDuration()
    if (id !== this.asyncId)
      return

    const videoTrack = await this.input.getPrimaryVideoTrack()
    if (!videoTrack) {
      this.handleNoVideoTrack()
      onMetadata?.()
      return
    }

    if (videoTrack.codec === null || !(await videoTrack.canDecode())) {
      this.handleNoVideoTrack()
      onMetadata?.()
      return
    }

    const transparent = await videoTrack.canBeTransparent()
    this.videoSink = new CanvasSink(videoTrack, {
      poolSize: 2,
      fit: 'contain',
      alpha: transparent,
    })

    this.width = videoTrack.displayWidth
    this.height = videoTrack.displayHeight

    this.canvas.width = this.width
    this.canvas.height = this.height

    onMetadata?.()

    await this.resetIterator(0)
  }

  handleNoVideoTrack() {
    this.videoSink = null
    this.width = 0
    this.height = 0
    this.canvas.width = 0
    this.canvas.height = 0
    this.clear()
    this.drawPoster()
  }

  async resetIterator(time) {
    await this.stopIterator()

    if (!this.videoSink)
      return

    this.videoIterator = this.videoSink.canvases(time)

    const first = (await this.videoIterator.next()).value ?? null
    const second = (await this.videoIterator.next()).value ?? null

    this.nextFrame = second

    if (first) {
      this.ctx.drawImage(first.canvas, 0, 0)
      this.events.emit('loadeddata')
    }
    else {
      this.drawPoster()
    }
  }

  async updateNextFrame(localId) {
    if (!this.videoIterator || this.isFetching)
      return

    this.isFetching = true
    try {
      while (true) {
        const frame = (await this.videoIterator.next()).value ?? null
        if (!frame || localId !== this.asyncId)
          return

        const t = this.audioClock.currentTime
        const tolerance = this.dropLateFrames
          ? Math.max(0.06, this.avSyncTolerance / Math.max(1, this.playbackRate))
          : 0

        if (this.dropLateFrames && frame.timestamp < t - tolerance) {
          // Skip late frame
          continue
        }

        if (frame.timestamp <= t + tolerance) {
          this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
          this.ctx.drawImage(frame.canvas, 0, 0)

          if (!this.dropLateFrames && frame.timestamp > t) {
            this.nextFrame = null
            return
          }
        }
        else {
          this.nextFrame = frame
          return
        }
      }
    }
    finally {
      this.isFetching = false
    }
  }

  render() {
    if (!this.audioClock)
      return

    const t = this.audioClock.currentTime
    const now = Date.now()

    // Emit timeupdate event
    if (now - this.lastTimeUpdate >= this.timeupdateInterval) {
      this.events.emit('timeupdate')
      this.lastTimeUpdate = now
    }

    // Check if reached end
    if (Number.isFinite(this.duration) && t >= this.duration) {
      this.stop()
      this.stalled = false
      this.events.emit('ended')
      this.events.emit('pause')
      this.events.emit('canplay')
      return
    }

    // Render next frame if ready
    if (this.nextFrame && this.nextFrame.timestamp <= t) {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
      this.ctx.drawImage(this.nextFrame.canvas, 0, 0)
      this.nextFrame = null
      this.updateNextFrame(this.asyncId)

      if (this.stalled) {
        this.events.emit('canplay')
        this.events.emit('playing')
        this.stalled = false
      }
    }
    else if (!this.nextFrame) {
      this.updateNextFrame(this.asyncId)

      if (!this.nextFrame && Number.isFinite(this.duration) && t < this.duration && !this.stalled) {
        this.stalled = true
        this.events.emit('waiting')
      }
    }

    this.rafId = requestAnimationFrame(() => this.render())
  }

  start(audioEngine) {
    this.audioClock = audioEngine
    this.asyncId++
    this.stalled = false
    this.updateNextFrame(this.asyncId)
    this.rafId = requestAnimationFrame(() => this.render())
  }

  stop() {
    cancelAnimationFrame(this.rafId)
  }

  async seek(time) {
    this.asyncId++
    await this.resetIterator(time)
  }

  setPlaybackRate(rate) {
    this.playbackRate = Math.max(0.1, Number(rate) || 1)
  }

  destroy() {
    this.asyncId++
    this.stop()
    this.stopIterator()
    this.posterDrawn = false
    this.input = null
    this.videoSink = null
  }
}
