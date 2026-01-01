import EventTarget from './EventTarget.js'
/**
 * Video Element Shim
 * Simulates HTMLVideoElement interface for MediaBunny
 */
import MediaBunnyEngine from './MediaBunnyEngine.js'

function clamp(v, min, max) {
  return Math.max(min, Math.min(max, Number(v) || 0))
}

export default class VideoShim {
  constructor({ art, canvas, ctx, option }) {
    this.art = art
    this.canvas = canvas
    this.option = option

    // Event system
    this.events = new EventTarget()

    // MediaBunny engine
    this.engine = new MediaBunnyEngine({ canvas, ctx, events: this.events, option })

    // Internal state
    this._src = null
    this._volume = option.volume ?? 0.7
    this._muted = !!option.muted
    this._playbackRate = 1

    // Apply initial volume
    this.engine.setVolume(this._volume, this._muted)

    // Forward events to ArtPlayer
    this.setupEventForwarding()

    // Auto-load source
    if (option.source) {
      this.src = option.source
    }
    else if (art.option?.url) {
      this.src = art.option.url
    }
  }

  setupEventForwarding() {
    const { events: artEvents } = this.art.constructor.config
    artEvents.forEach((name) => {
      this.events.addEventListener(name, (e) => {
        this.art.emit(`video:${e.type}`, e)
      })
    })
  }

  // Event methods
  addEventListener(type, fn) {
    this.events.addEventListener(type, fn)
  }

  removeEventListener(type, fn) {
    this.events.removeEventListener(type, fn)
  }

  // Source
  get src() {
    return this._src
  }

  set src(v) {
    this._src = v
    if (v)
      this.engine.load(v)
  }

  get currentSrc() {
    return this._src
  }

  // Time
  get currentTime() {
    return this.engine.currentTime
  }

  set currentTime(t) {
    this.engine.seek(Number(t) || 0)
  }

  get duration() {
    return this.engine.duration
  }

  // Buffered/Played/Seekable
  get buffered() {
    return this.createTimeRanges(0, this.engine.duration)
  }

  get played() {
    return this.createTimeRanges(0, this.engine.currentTime)
  }

  get seekable() {
    return this.createTimeRanges(0, this.engine.duration)
  }

  createTimeRanges(start, end) {
    const duration = this.engine.duration
    if (!duration || Number.isNaN(duration) || end <= 0) {
      return { length: 0, start: () => 0, end: () => 0 }
    }
    return {
      length: 1,
      start: () => start,
      end: () => end,
    }
  }

  // Playback state
  get paused() {
    return this.engine.paused
  }

  get playing() {
    return !this.engine.paused && !this.engine.ended
  }

  get ended() {
    return this.engine.ended
  }

  get seeking() {
    return this.engine.seeking
  }

  // Ready state
  get readyState() {
    return this.engine.readyState
  }

  get networkState() {
    return this.engine.networkState
  }

  get error() {
    return this.engine.error
  }

  // Playback rate
  get playbackRate() {
    return this._playbackRate
  }

  set playbackRate(v) {
    const rate = Number(v)
    if (Number.isNaN(rate) || rate <= 0)
      return

    this._playbackRate = rate
    this.engine.setPlaybackRate(rate)
    this.events.emit('ratechange')
  }

  // Volume
  get volume() {
    return this._volume
  }

  set volume(v) {
    this._volume = clamp(v, 0, 1)
    this._muted = false
    this.engine.setVolume(this._volume, this._muted)
    this.events.emit('volumechange')
  }

  get muted() {
    return this._muted
  }

  set muted(v) {
    this._muted = !!v
    this.engine.setVolume(this._volume, this._muted)
    this.events.emit('volumechange')
  }

  // Playback methods
  play() {
    return this.engine.play()
  }

  pause() {
    this.engine.pause()
  }

  load() {
    if (this._src)
      this.engine.load(this._src)
  }

  // Video dimensions
  get videoWidth() {
    return this.engine.videoWidth
  }

  get videoHeight() {
    return this.engine.videoHeight
  }

  // Other properties
  get poster() {
    return this.option.poster || ''
  }

  set poster(v) {
    this.option.poster = v
  }

  get autoplay() {
    return this.option.autoplay || false
  }

  set autoplay(v) {}

  get loop() {
    return this.option.loop || false
  }

  set loop(v) {}

  get controls() {
    return false
  }

  set controls(v) {}

  get playsInline() {
    return true
  }

  set playsInline(v) {}

  get crossOrigin() {
    return this.option.crossOrigin || ''
  }

  set crossOrigin(v) {}

  get preload() {
    return 'auto'
  }

  set preload(v) {}

  get defaultMuted() {
    return false
  }

  set defaultMuted(v) {}

  get defaultPlaybackRate() {
    return 1
  }

  set defaultPlaybackRate(v) {}

  // Methods
  canPlayType(_type) {
    return 'maybe'
  }

  getBoundingClientRect() {
    return this.canvas.getBoundingClientRect()
  }

  requestVideoFrameCallback(callback) {
    const id = requestAnimationFrame((time) => {
      callback(time, {
        presentationTime: this.engine.currentTime,
        expectedDisplayTime: time + 16.6,
        width: this.engine.videoWidth,
        height: this.engine.videoHeight,
        mediaTime: this.engine.currentTime,
        presentedFrames: 0,
        processingDuration: 0,
        captureTime: time,
        receiveTime: time,
        rtpTimestamp: 0,
      })
    })
    return id
  }

  cancelVideoFrameCallback(id) {
    cancelAnimationFrame(id)
  }

  setAttribute(name, value) {
    if (name === 'src') {
      this.src = value
    }
    else if (name === 'autoplay') {
      this.autoplay = value
    }
    else if (name === 'loop') {
      this.loop = value
    }
    else if (name === 'muted') {
      this.muted = true
    }
    else {
      this.canvas.setAttribute(name, value)
    }
  }

  destroy() {
    this.engine.destroy()
  }
}
