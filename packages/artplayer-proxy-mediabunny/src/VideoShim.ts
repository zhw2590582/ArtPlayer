import type { EngineOptions, EnginePort, ProxyOptions, ShimHost } from './engine-types'
import type { MediaListener } from './EventTarget'
import EventTarget from './EventTarget'
import MediaBunnyEngine from './MediaBunnyEngine.js'
import { cancelFrame, closeFrames, requestFrame } from './shim-frames'
import { clampVolume, timeRanges } from './shim-values'

export default class VideoShim {
  declare art: ShimHost
  declare canvas: HTMLCanvasElement
  declare option: ProxyOptions
  declare events: EventTarget
  declare engine: EnginePort
  declare _src: unknown
  declare _volume: number
  declare _muted: boolean
  declare _playbackRate: number

  constructor({ art, canvas, ctx, option }: Omit<EngineOptions, 'events' | 'option'> & { art: ShimHost, option: ProxyOptions }) {
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
  addEventListener(type: string, fn: MediaListener) {
    this.events.addEventListener(type, fn)
  }

  removeEventListener(type: string, fn: MediaListener) {
    this.events.removeEventListener(type, fn)
  }

  // Source
  get src() {
    return this._src
  }

  set src(v: unknown) {
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

  set currentTime(t: unknown) {
    // The coordinator reports active failures; the synchronous setter must observe rejection.
    void Promise.resolve(this.engine.seek(Number(t) || 0)).catch(() => {})
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

  createTimeRanges(start: number, end: number): TimeRanges {
    return timeRanges(this.engine.duration, start, end)
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

  set playbackRate(v: unknown) {
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

  set volume(v: unknown) {
    this._volume = clampVolume(v)
    this._muted = false
    this.engine.setVolume(this._volume, this._muted)
    this.events.emit('volumechange')
  }

  get muted() {
    return this._muted
  }

  set muted(v: unknown) {
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

  getM3u8State() {
    return this.engine.getHlsState()
  }

  switchM3u8Quality(value: unknown) {
    return this.engine.selectHlsQuality(value)
  }

  switchM3u8Audio(value: unknown) {
    return this.engine.selectHlsAudio(value)
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

  set poster(v: string) {
    this.option.poster = v
  }

  get autoplay() {
    return this.option.autoplay || false
  }

  set autoplay(v: unknown) {}

  get loop() {
    return this.option.loop || false
  }

  set loop(v: unknown) {}

  get controls() {
    return false
  }

  set controls(v: unknown) {}

  get playsInline() {
    return true
  }

  set playsInline(v: unknown) {}

  get crossOrigin() {
    return this.option.crossOrigin || ''
  }

  set crossOrigin(v: unknown) {}

  get preload() {
    return 'auto'
  }

  set preload(v: unknown) {}

  get defaultMuted() {
    return false
  }

  set defaultMuted(v: unknown) {}

  get defaultPlaybackRate() {
    return 1
  }

  set defaultPlaybackRate(v: unknown) {}

  // Methods
  canPlayType(_type: string) {
    return 'maybe'
  }

  getBoundingClientRect() {
    return this.canvas.getBoundingClientRect()
  }

  requestVideoFrameCallback(callback: VideoFrameRequestCallback): number {
    return requestFrame(this, callback)
  }

  cancelVideoFrameCallback(id: number): void {
    cancelFrame(this, id)
  }

  setAttribute(name: string, value: unknown) {
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
      Reflect.apply(this.canvas.setAttribute, this.canvas, [name, value])
    }
  }

  destroy(): void {
    if (!closeFrames(this))
      return
    try {
      this.engine.destroy()
    }
    finally {
      this.events.destroy()
    }
  }
}
