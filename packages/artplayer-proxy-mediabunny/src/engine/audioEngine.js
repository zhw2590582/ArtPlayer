import {
  ALL_FORMATS,
  AudioBufferSink,
  BlobSource,
  Input,
  ReadableStreamSource,
  UrlSource,
} from 'mediabunny'

export default function createAudioEngine(events) {
  let input = null
  let audioSink = null

  let audioContext = null
  let gainNode = null

  let audioIterator = null
  let audioContextStartTime = 0
  let playbackTimeAtStart = 0
  let latestScheduledEndTime = 0

  let _duration = Number.NaN
  let _paused = true

  let _volume = 0.7
  let _muted = false
  let _playbackRate = 1

  let asyncId = 0
  const queuedNodes = new Set()

  function getCurrentTime() {
    if (_paused)
      return playbackTimeAtStart
    return (
      (audioContext.currentTime - audioContextStartTime) * _playbackRate
      + playbackTimeAtStart
    )
  }

  function updateGain() {
    if (!gainNode)
      return
    const v = _muted ? 0 : _volume
    gainNode.gain.value = v * v
  }

  function ensureAudioContext(sampleRate) {
    if (audioContext)
      return

    const AudioContext
      = window.AudioContext || window.webkitAudioContext

    try {
      audioContext = new AudioContext({ sampleRate })
    }
    catch {
      audioContext = new AudioContext()
    }

    gainNode = audioContext.createGain()
    gainNode.connect(audioContext.destination)
    updateGain()
  }

  function stopQueuedNodes() {
    for (const node of queuedNodes) {
      node.stop()
    }
    queuedNodes.clear()
  }

  async function stopIterator() {
    await audioIterator?.return()
    audioIterator = null
  }

  function normalizeSource(src) {
    if (typeof src === 'string')
      return new UrlSource(src)
    if (src instanceof Blob)
      return new BlobSource(src)
    if (typeof ReadableStream !== 'undefined' && src instanceof ReadableStream)
      return new ReadableStreamSource(src)
    return src
  }

  async function load(src, onMetadata) {
    asyncId++
    const id = asyncId

    await stopIterator()
    stopQueuedNodes()

    _paused = true
    playbackTimeAtStart = 0
    audioContextStartTime = 0

    const source = normalizeSource(src)
    if (!source)
      return

    input = new Input({
      source,
      formats: ALL_FORMATS,
    })

    _duration = await input.computeDuration()
    if (id !== asyncId)
      return

    const audioTrack = await input.getPrimaryAudioTrack()
    if (!audioTrack) {
      audioSink = null
      ensureAudioContext()
      if (onMetadata)
        onMetadata()
      return
    }

    if (audioTrack.codec === null || !(await audioTrack.canDecode())) {
      audioSink = null
      ensureAudioContext()
      if (onMetadata)
        onMetadata()
      return
    }

    ensureAudioContext(audioTrack.sampleRate)
    audioSink = new AudioBufferSink(audioTrack)

    if (onMetadata)
      onMetadata()
  }

  async function runIterator(localId) {
    if (!audioSink)
      return

    await stopIterator()
    audioIterator = audioSink.buffers(getCurrentTime())

    while (true) {
      if (localId !== asyncId)
        return
      if (_paused)
        return

      const nextPromise = audioIterator.next()

      const checkStarvation = setInterval(() => {
        if (localId !== asyncId || _paused) {
          clearInterval(checkStarvation)
          return
        }
        if (audioContext.state === 'running'
          && audioContext.currentTime >= latestScheduledEndTime - 0.2) {
          audioContext.suspend()
          events.emit('waiting')
        }
      }, 50)

      let result
      try {
        result = await nextPromise
      }
      catch (e) {
        console.error(e)
        break
      }
      finally {
        clearInterval(checkStarvation)
      }

      if (localId !== asyncId)
        return
      if (_paused)
        return

      if (audioContext.state === 'suspended') {
        await audioContext.resume()
        events.emit('canplay')
        events.emit('playing')
      }

      if (result.done)
        break

      const { buffer, timestamp } = result.value

      const node = audioContext.createBufferSource()
      node.buffer = buffer
      node.connect(gainNode)
      node.playbackRate.value = _playbackRate

      const startAt
        = audioContextStartTime
          + (timestamp - playbackTimeAtStart) / _playbackRate

      const duration = buffer.duration
      const endAt = startAt + duration / _playbackRate

      if (endAt > latestScheduledEndTime) {
        latestScheduledEndTime = endAt
      }

      if (startAt >= audioContext.currentTime) {
        node.start(startAt)
      }
      else {
        node.start(
          audioContext.currentTime,
          (audioContext.currentTime - startAt) * _playbackRate,
        )
      }

      queuedNodes.add(node)
      node.onended = () => queuedNodes.delete(node)
    }
  }

  async function play() {
    if (!_paused)
      return

    if (!audioContext) {
      ensureAudioContext()
    }

    if (audioContext.state === 'suspended') {
      await audioContext.resume()
    }

    audioContextStartTime = audioContext.currentTime
    latestScheduledEndTime = audioContextStartTime
    _paused = false

    asyncId++
    runIterator(asyncId)
  }

  function pause() {
    if (_paused)
      return

    playbackTimeAtStart = getCurrentTime()
    _paused = true

    stopIterator()
    stopQueuedNodes()
  }

  async function seek(time) {
    playbackTimeAtStart = Math.max(0, time)
    audioContextStartTime = audioContext.currentTime
    latestScheduledEndTime = audioContextStartTime

    asyncId++
    if (!_paused) {
      runIterator(asyncId)
    }
  }

  function destroy() {
    asyncId++
    pause()
    audioContext?.close()
    audioContext = null
    input = null
    audioSink = null
  }

  return {
    load,
    play,
    pause,
    seek,
    destroy,

    setVolume(v, muted) {
      _volume = v
      _muted = muted
      updateGain()
    },

    setPlaybackRate(rate) {
      if (rate === _playbackRate)
        return

      if (!_paused) {
        playbackTimeAtStart = getCurrentTime()
        audioContextStartTime = audioContext.currentTime
      }

      _playbackRate = rate

      if (!_paused) {
        asyncId++
        runIterator(asyncId)
      }
    },

    get currentTime() {
      return getCurrentTime()
    },

    get duration() {
      return _duration
    },

    get paused() {
      return _paused
    },
  }
}
