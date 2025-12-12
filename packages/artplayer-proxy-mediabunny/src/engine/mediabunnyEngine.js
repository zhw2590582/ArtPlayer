import createAudioEngine from './audioEngine.js'
import createVideoEngine from './videoEngine.js'

export default function createMediabunnyEngine({
  canvas,
  ctx,
  events,
  option = {},
}) {
  const defaults = {
    timeupdateInterval: 250,
    avSyncTolerance: 0.12,
    loadTimeout: 12000,
    dropLateFrames: false,
    poster: '',
  }

  const audio = createAudioEngine(events)
  const video = createVideoEngine({
    canvas,
    ctx,
    events,
    timeupdateInterval: option.timeupdateInterval ?? defaults.timeupdateInterval,
    avSyncTolerance: option.avSyncTolerance ?? defaults.avSyncTolerance,
    dropLateFrames: option.dropLateFrames ?? defaults.dropLateFrames,
    poster: option.poster ?? defaults.poster,
    preflightRange: option.preflightRange ?? false,
  })

  let _paused = true
  let _ended = false
  let _readyState = 0
  let _networkState = 0
  let _error = null
  let _seeking = false
  let loadSeq = 0

  events.addEventListener?.('ended', () => {
    _ended = true
    _paused = true
  })

  async function load(src) {
    const id = ++loadSeq
    pause()
    _ended = false
    _error = null
    _networkState = 2
    _readyState = 0
    setTimeout(() => events.emit('waiting'), 0)
    setTimeout(() => events.emit('loadstart'), 0)

    const loadTimeout = Number.isFinite(option.loadTimeout)
      ? option.loadTimeout
      : defaults.loadTimeout

    let timer = null
    const timeoutPromise
      = loadTimeout > 0
        ? new Promise((_, reject) => {
            timer = setTimeout(() => reject(new Error('Load timeout')), loadTimeout)
          })
        : null

    const loadTask = (async () => {
      try {
        let videoMetadataLoaded = false
        let audioMetadataLoaded = false

        const checkMetadata = () => {
          if (videoMetadataLoaded && audioMetadataLoaded) {
            _readyState = 1
            events.emit('loadedmetadata')
            events.emit('durationchange')
          }
        }

        const p1 = video.load(src, () => {
          if (id !== loadSeq)
            return
          videoMetadataLoaded = true
          checkMetadata()
        })

        const p2 = audio.load(src, () => {
          if (id !== loadSeq)
            return
          audioMetadataLoaded = true
          checkMetadata()
        })

        await Promise.all([p1, p2])
        if (id !== loadSeq)
          return

        _readyState = 4
        _networkState = 1
        events.emit('loadeddata')
        events.emit('canplay')
        events.emit('canplaythrough')
      }
      catch (err) {
        if (id !== loadSeq)
          return
        _error = { code: 4, message: err.message }
        _networkState = 3
        events.emit('error')
        console.error(err)
      }
      finally {
        if (timer)
          clearTimeout(timer)
      }
    })()

    if (timeoutPromise) {
      try {
        await Promise.race([loadTask, timeoutPromise])
      }
      catch (err) {
        if (id !== loadSeq)
          return
        loadSeq++
        _error = { code: 4, message: err.message }
        _networkState = 3
        events.emit('error')
      }
    }
    else {
      await loadTask
    }
  }

  async function play() {
    if (!_paused)
      return
    _ended = false
    _paused = false
    await audio.play()
    video.start(audio)
    events.emit('play')
    events.emit('playing')
  }

  function pause() {
    if (_paused)
      return
    _paused = true
    audio.pause()
    video.stop()
    events.emit('pause')
  }

  async function seek(time) {
    const shouldResume = !_paused
    _ended = false
    _seeking = true
    events.emit('seeking')
    events.emit('waiting')
    pause()
    await audio.seek(time)
    await video.seek(time)
    _seeking = false
    events.emit('seeked')
    if (shouldResume && !_ended) {
      await play()
    }
  }

  function destroy() {
    pause()
    audio.destroy()
    video.destroy()
  }

  return {
    load,
    play,
    pause,
    seek,
    destroy,

    setVolume: audio.setVolume,
    setPlaybackRate(rate) {
      audio.setPlaybackRate(rate)
      video.setPlaybackRate(rate)
    },

    get currentTime() {
      return audio.currentTime
    },
    get duration() {
      return audio.duration || video.duration
    },
    get paused() {
      return _paused
    },
    get seeking() {
      return _seeking
    },
    get ended() {
      return _ended
    },
    get readyState() {
      return _readyState
    },
    get networkState() {
      return _networkState
    },
    get error() {
      return _error
    },
    get videoWidth() {
      return video.width
    },
    get videoHeight() {
      return video.height
    },
  }
}
