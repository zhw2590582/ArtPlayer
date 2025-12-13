import {
  ALL_FORMATS,
  BlobSource,
  CanvasSink,
  Input,
  ReadableStreamSource,
  UrlSource,
} from 'mediabunny'

export default function createVideoEngine({
  canvas,
  ctx,
  events,
  timeupdateInterval = 250,
  avSyncTolerance = 0.12,
  dropLateFrames = false,
  poster = '',
  preflightRange = false,
}) {
  let input = null
  let videoSink = null
  let videoIterator = null

  let nextFrame = null
  let rafId = 0
  let asyncId = 0

  let _width = 0
  let _height = 0
  let _duration = Number.NaN

  let audioClock = null
  let lastTimeUpdate = 0
  let stalled = false
  let playbackRate = 1
  let posterDrawn = false

  function normalizeSource(src) {
    if (typeof src === 'string')
      return new UrlSource(src)
    if (src instanceof Blob)
      return new BlobSource(src)
    if (typeof ReadableStream !== 'undefined' && src instanceof ReadableStream)
      return new ReadableStreamSource(src)
    return src
  }

  async function preflight(url) {
    if (!preflightRange || typeof url !== 'string')
      return true
    try {
      const res = await fetch(url, { method: 'HEAD' })
      const acceptRanges = res.headers.get('accept-ranges')
      if (!acceptRanges || acceptRanges === 'none') {
        events.emit('error', new Event('RangeNotSupported'))
        return false
      }
      return true
    }
    catch (e) {
      console.warn('preflight failed', e)
      return true
    }
  }

  function drawPoster() {
    if (!poster || posterDrawn)
      return
    const img = new Image()
    img.onload = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      canvas.width = img.naturalWidth || canvas.width
      canvas.height = img.naturalHeight || canvas.height
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
      posterDrawn = true
    }
    img.src = poster
  }

  async function stopIterator() {
    await videoIterator?.return()
    videoIterator = null
  }

  function clear() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
  }

  async function load(src, onMetadata) {
    asyncId++
    const id = asyncId

    await stopIterator()
    clear()
    posterDrawn = false

    if (!(await preflight(src)))
      return

    const source = normalizeSource(src)
    if (!source) {
      drawPoster()
      return
    }

    input = new Input({
      source,
      formats: ALL_FORMATS,
    })

    _duration = await input.computeDuration()
    if (id !== asyncId)
      return

    const videoTrack = await input.getPrimaryVideoTrack()
    if (!videoTrack) {
      videoSink = null
      _width = 0
      _height = 0
      canvas.width = 0
      canvas.height = 0
      drawPoster()
      if (onMetadata)
        onMetadata()
      return
    }

    if (videoTrack.codec === null || !(await videoTrack.canDecode())) {
      videoSink = null
      _width = 0
      _height = 0
      canvas.width = 0
      canvas.height = 0
      clear()
      drawPoster()
      if (onMetadata)
        onMetadata()
      return
    }

    const transparent = await videoTrack.canBeTransparent()
    videoSink = new CanvasSink(videoTrack, {
      poolSize: 2,
      fit: 'contain',
      alpha: transparent,
    })

    _width = videoTrack.displayWidth
    _height = videoTrack.displayHeight

    canvas.width = _width
    canvas.height = _height

    if (onMetadata)
      onMetadata()

    await resetIterator(0)
  }

  async function resetIterator(time) {
    await stopIterator()

    if (!videoSink)
      return

    videoIterator = videoSink.canvases(time)

    const first = (await videoIterator.next()).value ?? null
    const second = (await videoIterator.next()).value ?? null

    nextFrame = second

    if (first) {
      ctx.drawImage(first.canvas, 0, 0)
      events.emit('loadeddata')
    }
    else {
      drawPoster()
    }
  }

  async function updateNextFrame(localId) {
    if (!videoIterator)
      return

    while (true) {
      const frame = (await videoIterator.next()).value ?? null
      if (!frame)
        return
      if (localId !== asyncId)
        return

      const t = audioClock.currentTime
      if (dropLateFrames) {
        const tolerance = Math.max(0.06, avSyncTolerance / Math.max(1, playbackRate))
        if (frame.timestamp < t - tolerance) {
          continue
        }
        if (frame.timestamp <= t + tolerance) {
          ctx.clearRect(0, 0, canvas.width, canvas.height)
          ctx.drawImage(frame.canvas, 0, 0)
        }
        else {
          nextFrame = frame
          return
        }
      }
      else {
        if (frame.timestamp <= t) {
          ctx.clearRect(0, 0, canvas.width, canvas.height)
          ctx.drawImage(frame.canvas, 0, 0)
        }
        else {
          nextFrame = frame
          return
        }
      }
    }
  }

  function render() {
    if (!audioClock)
      return

    const t = audioClock.currentTime
    const now = Date.now()
    if (now - lastTimeUpdate >= timeupdateInterval) {
      events.emit('timeupdate')
      lastTimeUpdate = now
    }

    if (Number.isFinite(_duration) && t >= _duration) {
      stop()
      stalled = false
      events.emit('ended')
      events.emit('pause')
      events.emit('canplay')
      return
    }

    if (nextFrame && nextFrame.timestamp <= t) {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.drawImage(nextFrame.canvas, 0, 0)
      nextFrame = null
      updateNextFrame(asyncId)
      if (stalled) {
        events.emit('canplay')
        events.emit('playing')
        stalled = false
      }
    }
    else if (!nextFrame) {
      updateNextFrame(asyncId)
      if (!nextFrame && Number.isFinite(_duration) && t < _duration && !stalled) {
        stalled = true
        events.emit('waiting')
      }
    }

    rafId = requestAnimationFrame(render)
  }

  function start(audioEngine) {
    audioClock = audioEngine
    asyncId++
    stalled = false
    updateNextFrame(asyncId)
    rafId = requestAnimationFrame(render)
  }

  function stop() {
    cancelAnimationFrame(rafId)
  }

  async function seek(time) {
    asyncId++
    await resetIterator(time)
  }

  function setPlaybackRate(rate) {
    playbackRate = Math.max(0.1, Number(rate) || 1)
  }

  function destroy() {
    asyncId++
    stop()
    stopIterator()
    posterDrawn = false
    input = null
    videoSink = null
  }

  return {
    load,
    start,
    stop,
    seek,
    setPlaybackRate,
    destroy,

    get width() {
      return _width
    },
    get height() {
      return _height
    },
    get duration() {
      return _duration
    },
  }
}
