import createMediabunnyEngine from '../engine/mediabunnyEngine.js'
import clamp from '../utils/clamp.js'
import { createVideoEventTarget } from './videoEvents.js'

export default function createMediabunnyVideoShim({ art, canvas, ctx, option }) {
  const events = createVideoEventTarget()
  const engine = createMediabunnyEngine({ canvas, ctx, events, option })

  let _src = null
  let _volume = option.volume ?? 0.7
  let _muted = !!option.muted
  let _playbackRate = 1

  engine.setVolume(_volume, _muted)

  const { events: artEvents } = art.constructor.config
  artEvents.forEach((name) => {
    events.addEventListener(name, (e) => {
      art.emit(`video:${e.type}`, e)
    })
  })

  const shim = {
    addEventListener: events.addEventListener,
    removeEventListener: events.removeEventListener,

    get src() {
      return _src
    },
    set src(v) {
      _src = v
      if (v)
        engine.load(v)
    },

    get currentTime() {
      return engine.currentTime
    },
    set currentTime(t) {
      engine.seek(Number(t) || 0)
    },

    get duration() {
      return engine.duration
    },

    get buffered() {
      const duration = engine.duration
      if (!duration || Number.isNaN(duration)) {
        return {
          length: 0,
          start: () => 0,
          end: () => 0,
        }
      }
      return {
        length: 1,
        start: () => 0,
        end: () => duration,
      }
    },

    get played() {
      const duration = engine.duration
      const currentTime = engine.currentTime
      if (!duration || Number.isNaN(duration) || currentTime <= 0) {
        return {
          length: 0,
          start: () => 0,
          end: () => 0,
        }
      }
      return {
        length: 1,
        start: () => 0,
        end: () => currentTime,
      }
    },

    get paused() {
      return engine.paused
    },
    get playing() {
      return !engine.paused && !engine.ended
    },
    get ended() {
      return engine.ended
    },

    get readyState() {
      return engine.readyState
    },

    get networkState() {
      return engine.networkState
    },

    get error() {
      return engine.error
    },

    get seeking() {
      return engine.seeking
    },

    get seekable() {
      const duration = engine.duration
      if (!duration || Number.isNaN(duration)) {
        return {
          length: 0,
          start: () => 0,
          end: () => 0,
        }
      }
      return {
        length: 1,
        start: () => 0,
        end: () => duration,
      }
    },

    get playbackRate() {
      return _playbackRate
    },
    set playbackRate(v) {
      const rate = Number(v)
      if (Number.isNaN(rate) || rate <= 0)
        return
      _playbackRate = rate
      engine.setPlaybackRate(rate)
      events.emit('ratechange')
    },

    get volume() {
      return _volume
    },
    set volume(v) {
      _volume = clamp(v, 0, 1)
      _muted = false
      engine.setVolume(_volume, _muted)
      events.emit('volumechange')
    },

    get muted() {
      return _muted
    },
    set muted(v) {
      _muted = !!v
      engine.setVolume(_volume, _muted)
      events.emit('volumechange')
    },

    play() {
      return engine.play()
    },
    pause() {
      engine.pause()
    },
    load() {
      if (_src)
        engine.load(_src)
    },

    destroy() {
      engine.destroy()
    },

    get videoWidth() {
      return engine.videoWidth
    },
    get videoHeight() {
      return engine.videoHeight
    },

    get playsInline() {
      return true
    },
    set playsInline(v) {},

    get autoplay() {
      return option.autoplay || false
    },
    set autoplay(v) {},

    get loop() {
      return option.loop || false
    },
    set loop(v) {},

    get controls() {
      return false
    },
    set controls(v) {},

    get crossOrigin() {
      return option.crossOrigin || ''
    },
    set crossOrigin(v) {},

    get currentSrc() {
      return _src
    },

    get poster() {
      return option.poster || ''
    },
    set poster(v) {
      option.poster = v
    },

    get preload() {
      return 'auto'
    },
    set preload(v) {},

    get defaultMuted() {
      return false
    },
    set defaultMuted(v) {},

    get defaultPlaybackRate() {
      return 1
    },
    set defaultPlaybackRate(v) {},

    canPlayType(_type) {
      return 'maybe'
    },

    getBoundingClientRect() {
      return canvas.getBoundingClientRect()
    },

    requestVideoFrameCallback(callback) {
      const id = requestAnimationFrame((time) => {
        callback(time, {
          presentationTime: engine.currentTime,
          expectedDisplayTime: time + 16.6,
          width: engine.videoWidth,
          height: engine.videoHeight,
          mediaTime: engine.currentTime,
          presentedFrames: 0,
          processingDuration: 0,
          captureTime: time,
          receiveTime: time,
          rtpTimestamp: 0,
        })
      })
      return id
    },

    cancelVideoFrameCallback(id) {
      cancelAnimationFrame(id)
    },

    setAttribute(name, value) {
      if (name === 'src')
        this.src = value
      else if (name === 'autoplay')
        this.autoplay = value
      else if (name === 'loop')
        this.loop = value
      else if (name === 'muted')
        this.muted = true
      else
        canvas.setAttribute(name, value)
    },
  }

  if (option.source) {
    shim.src = option.source
  }
  else if (art.option?.url) {
    shim.src = art.option.url
  }

  return shim
}
