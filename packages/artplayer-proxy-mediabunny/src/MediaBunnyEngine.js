/**
 * Main MediaBunny Engine
 * Coordinates audio and video playback
 */
import AudioEngine from './AudioEngine.js'
import VideoEngine from './VideoEngine.js'

export default class MediaBunnyEngine {
  constructor({ canvas, ctx, events, option = {} }) {
    this.events = events
    this.option = option
    
    // Create audio and video engines
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
    })

    // Playback state
    this.paused = true
    this.ended = false
    this.readyState = 0
    this.networkState = 0
    this.error = null
    this.seeking = false
    this.loadSeq = 0

    // Listen to ended event
    events.addEventListener?.('ended', () => {
      this.ended = true
      this.paused = true
    })
  }

  async load(src) {
    const id = ++this.loadSeq
    
    this.pause()
    this.ended = false
    this.error = null
    this.networkState = 2 // NETWORK_LOADING
    this.readyState = 0 // HAVE_NOTHING
    
    setTimeout(() => this.events.emit('waiting'), 0)
    setTimeout(() => this.events.emit('loadstart'), 0)

    const loadTimeout = Number.isFinite(this.option.loadTimeout)
      ? this.option.loadTimeout
      : 12000

    try {
      await Promise.race([
        this.performLoad(src, id),
        loadTimeout > 0 ? this.createTimeout(loadTimeout) : Promise.resolve(),
      ])
    } catch (err) {
      if (id !== this.loadSeq) return
      
      this.loadSeq++
      this.error = { code: 4, message: err.message }
      this.networkState = 3 // NETWORK_NO_SOURCE
      this.events.emit('error')
    }
  }

  async performLoad(src, id) {
    let videoMetadataLoaded = false
    let audioMetadataLoaded = false

    const checkMetadata = () => {
      if (videoMetadataLoaded && audioMetadataLoaded) {
        this.readyState = 1 // HAVE_METADATA
        this.events.emit('loadedmetadata')
        this.events.emit('durationchange')
      }
    }

    try {
      await Promise.all([
        this.video.load(src, () => {
          if (id !== this.loadSeq) return
          videoMetadataLoaded = true
          checkMetadata()
        }),
        this.audio.load(src, () => {
          if (id !== this.loadSeq) return
          audioMetadataLoaded = true
          checkMetadata()
        }),
      ])

      if (id !== this.loadSeq) return

      this.readyState = 4 // HAVE_ENOUGH_DATA
      this.networkState = 1 // NETWORK_IDLE
      this.events.emit('loadeddata')
      this.events.emit('canplay')
      this.events.emit('canplaythrough')
    } catch (err) {
      if (id !== this.loadSeq) return
      
      this.error = { code: 4, message: err.message }
      this.networkState = 3
      this.events.emit('error')
      console.error('MediaBunny load error:', err)
    }
  }

  createTimeout(ms) {
    return new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Load timeout')), ms)
    })
  }

  async play() {
    if (!this.paused) return

    if (this.ended) {
      this.ended = false
      await this.seek(0)
    }

    this.paused = false
    
    await this.audio.play()
    this.video.start(this.audio)
    
    this.events.emit('play')
    this.events.emit('playing')
  }

  pause() {
    if (this.paused) return

    this.paused = true
    
    this.audio.pause()
    this.video.stop()
    
    this.events.emit('pause')
  }

  async seek(time) {
    const shouldResume = !this.paused
    
    this.ended = false
    this.seeking = true
    
    this.events.emit('seeking')
    this.events.emit('waiting')
    
    this.pause()
    
    await Promise.all([
      this.audio.seek(time),
      this.video.seek(time),
    ])
    
    this.seeking = false
    this.events.emit('seeked')
    
    if (shouldResume && !this.ended) {
      await this.play()
    }
  }

  setVolume(volume, muted) {
    this.audio.setVolume(volume, muted)
  }

  setPlaybackRate(rate) {
    this.audio.setPlaybackRate(rate)
    this.video.setPlaybackRate(rate)
  }

  destroy() {
    this.pause()
    this.audio.destroy()
    this.video.destroy()
  }

  // Getters
  get currentTime() {
    return this.audio.currentTime
  }

  get duration() {
    return this.audio.duration || this.video.duration
  }

  get videoWidth() {
    return this.video.width
  }

  get videoHeight() {
    return this.video.height
  }
}
