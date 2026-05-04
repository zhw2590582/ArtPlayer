/**
 * Main MediaBunny Engine
 * Coordinates audio and video playback
 */
import AudioEngine from './AudioEngine.js'
import { createInput, getHlsState, resolveDuration, selectPlaybackTracks } from './input.js'
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
    this.input = null
    this.media = null

    // Listen to ended event
    events.addEventListener?.('ended', () => {
      this.ended = true
      this.paused = true
    })
  }

  async load(src) {
    const id = ++this.loadSeq

    this.pause()
    this.disposeInput()
    this.ended = false
    this.error = null
    this.networkState = 2 // NETWORK_LOADING
    this.readyState = 0 // HAVE_NOTHING

    setTimeout(() => this.events.emit('waiting'), 0)
    setTimeout(() => this.events.emit('loadstart'), 0)

    const loadTimeout = Number.isFinite(this.option.loadTimeout)
      ? this.option.loadTimeout
      : 0

    try {
      await Promise.race([
        this.performLoad(src, id),
        loadTimeout > 0 ? this.createTimeout(loadTimeout) : new Promise(() => {}),
      ])
    }
    catch (err) {
      if (id !== this.loadSeq)
        return

      this.loadSeq++
      this.error = { code: 4, message: err.message }
      this.networkState = 3 // NETWORK_NO_SOURCE
      this.events.emit('error')
    }
  }

  async performLoad(src, id) {
    if (!(await this.video.preflight(src)))
      return

    const input = createInput(src)
    if (!input) {
      this.video.handleNoVideoTrack()
      this.audio.handleNoAudioTrack()
      return
    }

    const media = await selectPlaybackTracks(input, src)
    if (id !== this.loadSeq) {
      input.dispose()
      return
    }

    this.disposeInput()
    this.input = input
    this.media = media

    let videoMetadataLoaded = !media.videoTrack
    let audioMetadataLoaded = !media.audioTrack

    const checkMetadata = () => {
      if (videoMetadataLoaded && audioMetadataLoaded) {
        this.readyState = 1 // HAVE_METADATA
        this.events.emit('loadedmetadata')
        this.events.emit('durationchange')
        this.events.emit('progress')
      }
    }

    try {
      await Promise.all([
        this.video.load(media, () => {
          if (id !== this.loadSeq)
            return
          videoMetadataLoaded = true
          checkMetadata()
        }),
        this.audio.load(media, () => {
          if (id !== this.loadSeq)
            return
          audioMetadataLoaded = true
          checkMetadata()
        }),
      ])

      if (id !== this.loadSeq)
        return

      this.readyState = 4 // HAVE_ENOUGH_DATA
      this.networkState = 1 // NETWORK_IDLE
      this.events.emit('loadeddata')
      this.events.emit('canplay')
      this.events.emit('canplaythrough')
      this.events.emit('progress')
    }
    catch (err) {
      if (id !== this.loadSeq)
        return

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

  disposeInput() {
    this.input?.dispose()
    this.input = null
    this.media = null
  }

  async replaceTracks({ videoTrack, audioTrack, videoMode, audioMode }) {
    if (!this.media)
      return

    const nextMedia = {
      ...this.media,
      videoTrack,
      audioTrack,
      videoMode,
      audioMode,
    }

    const shouldResume = !this.paused
    const currentTime = this.currentTime

    this.pause()
    this.ended = false
    this.seeking = true
    this.events.emit('seeking')
    this.events.emit('waiting')

    nextMedia.duration = await resolveDuration(nextMedia)
    this.media = nextMedia

    await Promise.all([
      this.video.load(nextMedia),
      this.audio.load(nextMedia),
    ])

    await Promise.all([
      this.video.seek(currentTime),
      this.audio.seek(currentTime),
    ])

    this.readyState = 4
    this.networkState = 1
    this.seeking = false
    this.events.emit('loadedmetadata')
    this.events.emit('durationchange')
    this.events.emit('progress')
    this.events.emit('loadeddata')
    this.events.emit('canplay')
    this.events.emit('canplaythrough')
    this.events.emit('seeked')

    if (shouldResume) {
      await this.play()
    }
  }

  async selectHlsQuality(value) {
    if (!this.media?.isHls || !this.input)
      return

    const videoTracks = await this.input.getVideoTracks()
    const videoTrack = value === 'auto'
      ? await this.input.getPrimaryVideoTrack()
      : videoTracks.find(track => track.id === value) ?? this.media.videoTrack

    if (!videoTrack)
      return

    let audioTrack = this.media.audioTrack
    let audioMode = this.media.audioMode

    if (!audioTrack || !videoTrack.canBePairedWith(audioTrack)) {
      audioTrack = await videoTrack.getPrimaryPairableAudioTrack()
      audioMode = 'auto'
    }

    await this.replaceTracks({
      videoTrack,
      audioTrack,
      videoMode: value === 'auto' ? 'auto' : 'manual',
      audioMode,
    })
  }

  async selectHlsAudio(value) {
    if (!this.media?.isHls || !this.input)
      return

    const audioTracks = await this.input.getAudioTracks()
    const audioTrack = value === 'auto'
      ? this.media.videoTrack
        ? await this.media.videoTrack.getPrimaryPairableAudioTrack()
        : await this.input.getPrimaryAudioTrack()
      : audioTracks.find(track => track.id === value) ?? this.media.audioTrack

    if (!audioTrack)
      return

    let videoTrack = this.media.videoTrack
    let videoMode = this.media.videoMode

    if (!videoTrack || !audioTrack.canBePairedWith(videoTrack)) {
      videoTrack = await audioTrack.getPrimaryPairableVideoTrack()
      videoMode = 'auto'
    }

    await this.replaceTracks({
      videoTrack,
      audioTrack,
      videoMode,
      audioMode: value === 'auto' ? 'auto' : 'manual',
    })
  }

  getHlsState() {
    return getHlsState(this.media)
  }

  async play() {
    if (!this.paused)
      return

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
    if (this.paused)
      return

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
    this.disposeInput()
    this.audio.destroy()
    this.video.destroy()
  }

  // Getters
  get currentTime() {
    return this.audio.currentTime
  }

  get duration() {
    return this.media?.duration ?? this.audio.duration ?? this.video.duration
  }

  get videoWidth() {
    return this.video.width
  }

  get videoHeight() {
    return this.video.height
  }
}
