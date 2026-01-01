/**
 * Audio Engine for MediaBunny
 * Handles audio playback using Web Audio API
 */
import {
  ALL_FORMATS,
  AudioBufferSink,
  BlobSource,
  Input,
  ReadableStreamSource,
  UrlSource,
} from 'mediabunny'

export default class AudioEngine {
  constructor(events) {
    this.events = events

    // MediaBunny instances
    this.input = null
    this.audioSink = null
    this.audioIterator = null

    // Web Audio API
    this.audioContext = null
    this.gainNode = null

    // Playback state
    this.audioContextStartTime = 0
    this.playbackTimeAtStart = 0
    this.latestScheduledEndTime = 0
    this.duration = Number.NaN
    this.paused = true

    // Audio settings
    this.volume = 0.7
    this.muted = false
    this.playbackRate = 1

    // Async control
    this.asyncId = 0
    this.queuedNodes = new Set()
  }

  get currentTime() {
    if (this.paused)
      return this.playbackTimeAtStart

    return (
      (this.audioContext.currentTime - this.audioContextStartTime) * this.playbackRate
      + this.playbackTimeAtStart
    )
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

  ensureAudioContext(sampleRate) {
    if (this.audioContext)
      return

    const AudioContext = window.AudioContext || window.webkitAudioContext

    try {
      this.audioContext = new AudioContext({ sampleRate })
    }
    catch {
      this.audioContext = new AudioContext()
    }

    this.gainNode = this.audioContext.createGain()
    this.gainNode.connect(this.audioContext.destination)
    this.updateGain()
  }

  updateGain() {
    if (!this.gainNode)
      return
    const v = this.muted ? 0 : this.volume
    this.gainNode.gain.value = v * v
  }

  stopQueuedNodes() {
    this.queuedNodes.forEach(node => node.stop())
    this.queuedNodes.clear()
  }

  async stopIterator() {
    await this.audioIterator?.return()
    this.audioIterator = null
  }

  async load(src, onMetadata) {
    const id = ++this.asyncId

    await this.stopIterator()
    this.stopQueuedNodes()

    this.paused = true
    this.playbackTimeAtStart = 0
    this.audioContextStartTime = 0

    const source = this.normalizeSource(src)
    if (!source)
      return

    this.input = new Input({
      source,
      formats: ALL_FORMATS,
    })

    this.duration = await this.input.computeDuration()
    if (id !== this.asyncId)
      return

    const audioTrack = await this.input.getPrimaryAudioTrack()
    if (!audioTrack) {
      this.audioSink = null
      this.ensureAudioContext()
      onMetadata?.()
      return
    }

    if (audioTrack.codec === null || !(await audioTrack.canDecode())) {
      this.audioSink = null
      this.ensureAudioContext()
      onMetadata?.()
      return
    }

    this.ensureAudioContext(audioTrack.sampleRate)
    this.audioSink = new AudioBufferSink(audioTrack)

    onMetadata?.()
  }

  async runIterator(localId) {
    if (!this.audioSink)
      return

    await this.stopIterator()
    this.audioIterator = this.audioSink.buffers(this.currentTime)

    while (true) {
      if (localId !== this.asyncId || this.paused)
        return

      const nextPromise = this.audioIterator.next()

      // Monitor for buffer starvation
      const checkStarvation = setInterval(() => {
        if (localId !== this.asyncId || this.paused) {
          clearInterval(checkStarvation)
          return
        }

        if (
          this.audioContext.state === 'running'
          && this.audioContext.currentTime >= this.latestScheduledEndTime - 0.2
        ) {
          this.audioContext.suspend()
          this.events.emit('waiting')
        }
      }, 50)

      let result
      try {
        result = await nextPromise
      }
      catch (e) {
        console.error('Audio iterator error:', e)
        break
      }
      finally {
        clearInterval(checkStarvation)
      }

      if (localId !== this.asyncId || this.paused)
        return

      // Resume if was suspended
      if (this.audioContext.state === 'suspended') {
        await this.audioContext.resume()
        this.events.emit('canplay')
        this.events.emit('playing')
      }

      if (result.done)
        break

      const { buffer, timestamp } = result.value

      // Schedule audio buffer
      const node = this.audioContext.createBufferSource()
      node.buffer = buffer
      node.connect(this.gainNode)
      node.playbackRate.value = this.playbackRate

      const startAt
        = this.audioContextStartTime
          + (timestamp - this.playbackTimeAtStart) / this.playbackRate

      const duration = buffer.duration
      const endAt = startAt + duration / this.playbackRate

      if (endAt > this.latestScheduledEndTime) {
        this.latestScheduledEndTime = endAt
      }

      if (startAt >= this.audioContext.currentTime) {
        node.start(startAt)
      }
      else {
        node.start(
          this.audioContext.currentTime,
          (this.audioContext.currentTime - startAt) * this.playbackRate,
        )
      }

      this.queuedNodes.add(node)
      node.onended = () => this.queuedNodes.delete(node)
    }
  }

  async play() {
    if (!this.paused)
      return

    if (!this.audioContext) {
      this.ensureAudioContext()
    }

    if (this.audioContext.state === 'suspended') {
      await this.audioContext.resume()
    }

    this.audioContextStartTime = this.audioContext.currentTime
    this.latestScheduledEndTime = this.audioContextStartTime
    this.paused = false

    const id = ++this.asyncId
    this.runIterator(id)
  }

  pause() {
    if (this.paused)
      return

    this.playbackTimeAtStart = this.currentTime
    this.paused = true

    this.stopIterator()
    this.stopQueuedNodes()
  }

  async seek(time) {
    this.playbackTimeAtStart = Math.max(0, time)
    this.audioContextStartTime = this.audioContext.currentTime
    this.latestScheduledEndTime = this.audioContextStartTime

    const id = ++this.asyncId
    if (!this.paused) {
      this.runIterator(id)
    }
  }

  setVolume(volume, muted) {
    this.volume = volume
    this.muted = muted
    this.updateGain()
  }

  setPlaybackRate(rate) {
    if (rate === this.playbackRate)
      return

    if (!this.paused) {
      this.playbackTimeAtStart = this.currentTime
      this.audioContextStartTime = this.audioContext.currentTime
    }

    this.playbackRate = rate

    if (!this.paused) {
      const id = ++this.asyncId
      this.runIterator(id)
    }
  }

  destroy() {
    this.asyncId++
    this.pause()
    this.audioContext?.close()
    this.audioContext = null
    this.input = null
    this.audioSink = null
  }
}
