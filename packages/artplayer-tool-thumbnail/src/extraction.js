import { cancellation, cleanupAll, stateFor } from './lifecycle'
import { replaceThumbnail } from './source'
import { clamp } from './utils'

function prepare(tool, job) {
  const { video } = job
  const { width, number, begin, end } = tool.option
  const height = (video.videoHeight / video.videoWidth) * width
  const guard = (condition, message) => {
    try {
      tool.errorHandle(condition, message)
    }
    catch (error) {
      job.reported = error
      job.wasReported = true
      throw error
    }
  }
  tool.option.height = height
  tool.option.begin = clamp(begin, 0, video.duration)
  tool.option.end = clamp(end || video.duration, begin, video.duration)
  guard(tool.option.end > tool.option.begin, 'End time must be greater than the start time')
  guard(Number.isFinite(video.duration), 'Video duration must be finite')
  tool.duration = tool.option.end - tool.option.begin
  tool.density = number / tool.duration
  guard(tool.file && video, 'Please select the video file first')
  guard(!tool.processing, 'There is currently a task in progress, please wait a moment...')
  guard(tool.density <= 1, `The preview density cannot be greater than 1, but got ${tool.density}`)
  const points = tool.creatScreenshotDate()
  const canvas = tool.creatCanvas()
  const context = canvas.getContext('2d')
  tool.emit('canvas', canvas)
  return { width, height, number, points, canvas, context }
}

function createJob(tool, state) {
  let epoch = state.epoch
  const video = tool.video
  let resolve
  let reject
  let timer
  let settled = false
  let running = false
  let job
  let frameCleanup = () => {}
  const listeners = []
  const promise = new Promise((yes, no) => {
    resolve = yes
    reject = no
  })
  // Consumers still receive the rejecting promise; ignored cancellation is owned.
  promise.catch(() => {})
  const live = () => !settled && !state.closed && state.epoch === epoch && state.job === job
  function finish() {
    if (settled)
      return false
    settled = true
    if (state.job === job) {
      state.job = null
      tool.processing = false
    }
    cleanupAll([() => clearTimeout(timer), frameCleanup, ...listeners.splice(0)])
    return true
  }
  function fail(error, report = true) {
    if (settled)
      return
    try {
      finish()
    }
    catch (cleanupError) {
      error ||= cleanupError
    }
    if (report) {
      try {
        tool.emit('error', error?.message)
      }
      catch (listenerError) {
        error = listenerError
      }
    }
    reject(error)
  }
  function complete() {
    if (!live())
      return
    try {
      finish()
      tool.emit('done')
      resolve()
    }
    catch (error) {
      let failure = error
      try {
        tool.emit('error', error?.message)
      }
      catch (listenerError) {
        failure = listenerError
      }
      reject(failure)
    }
  }
  function extract(plan) {
    if (!live())
      return
    running = true
    tool.processing = true
    let index = 0
    const next = () => {
      if (!live())
        return
      if (index === plan.points.length) {
        complete()
        return
      }
      const point = plan.points[index]
      let drawing = false
      let encoded = false
      const previous = video.oncanplay
      const draw = () => {
        if (!live() || drawing || video.seeking || (video.readyState !== undefined && video.readyState < 2))
          return
        drawing = true
        try {
          frameCleanup()
          plan.context.drawImage(video, point.x, point.y, plan.width, plan.height)
          if (!live())
            return
          plan.canvas.toBlob((blob) => {
            if (!live() || encoded)
              return
            encoded = true
            try {
              if (!blob)
                throw new Error('Unable to create thumbnail image')
              const url = replaceThumbnail(tool, blob, live)
              if (!url)
                return
              tool.emit('update', url, (index + 1) / plan.number)
              index++
              Promise.resolve().then(next)
            }
            catch (error) {
              fail(error)
            }
          })
        }
        catch (error) {
          fail(error)
        }
      }
      frameCleanup = () => {
        if (video.oncanplay === draw)
          video.oncanplay = previous
        video.removeEventListener('seeked', draw)
      }
      try {
        video.oncanplay = draw
        video.addEventListener('seeked', draw)
        video.currentTime = point.time
        if (video.readyState >= 2 && !video.seeking)
          Promise.resolve().then(draw)
      }
      catch (error) {
        fail(error)
      }
    }
    Promise.resolve().then(next)
  }
  function ready(synchronous = false) {
    if (!live() || running)
      return
    clearTimeout(timer)
    if (!state.loading && video.duration) {
      running = true
      try {
        const plan = prepare(tool, job)
        extract(plan)
      }
      catch (error) {
        fail(error, !synchronous && !(job.wasReported && error === job.reported))
        if (synchronous)
          throw error
      }
    }
    else {
      timer = setTimeout(() => ready(), 1000)
      if (!live())
        clearTimeout(timer)
    }
  }
  job = {
    video,
    promise,
    ready,
    fail,
    cancel(reason) { fail(cancellation(reason), false) },
    adopt(sourceEpoch) {
      if (settled || running || video !== tool.video)
        return false
      epoch = sourceEpoch
      return true
    },
  }
  state.job = job
  try {
    for (const [name, callback] of [
      ['error', () => {
        if (live())
          fail(new Error(`Unable to load video: media error ${video.error?.code || 0}`))
      }],
      ['loadedmetadata', () => ready()],
      ['durationchange', () => ready()],
    ]) {
      listeners.push(() => video.removeEventListener(name, callback))
      video.addEventListener(name, callback)
      if (!live()) {
        cleanupAll([() => video.removeEventListener(name, callback), ...listeners.splice(0)])
        return promise
      }
    }
    if (video.error)
      fail(new Error(`Unable to load video: media error ${video.error.code}`))
    else
      ready(true)
  }
  catch (error) {
    fail(error, false)
    throw error
  }
  return promise
}

export function startExtraction(tool) {
  const state = stateFor(tool)
  if (state.closed) {
    const promise = Promise.reject(cancellation('destroyed'))
    promise.catch(() => {})
    return promise
  }
  tool.errorHandle(!state.job, 'There is currently a task in progress, please wait a moment...')
  return createJob(tool, state)
}
