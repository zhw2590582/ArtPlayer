import { cleanupAll } from './session'

export default function createFrameReader(job, video) {
  const presentedFrames = typeof video.requestVideoFrameCallback === 'function'
    && typeof video.cancelVideoFrameCallback === 'function'
  let pending

  function clear() {
    const previous = pending
    pending = undefined
    video.onloadeddata = null
    video.onseeked = null
    if (!previous)
      return
    const result = cleanupAll([
      () => clearTimeout(previous.timer),
      () => {
        if (previous.frame !== null)
          video.cancelVideoFrameCallback(previous.frame)
      },
    ])
    if (result.failed)
      throw result.failure
  }
  job.own(clear)

  return (target, draw) => {
    clear()
    if (!job.active())
      return
    const current = { frame: null, timer: null, sought: false, presented: !presentedFrames, retries: 0, sequence: 0, started: false }
    pending = current
    const active = () => job.active() && pending === current
    const finish = job.guard(() => {
      if (!active() || !current.sought || !current.presented)
        return
      clear()
      if (job.active())
        draw()
    })
    const requestFrame = () => {
      if (!presentedFrames)
        return
      const sequence = ++current.sequence
      current.presented = false
      const previous = current.frame
      current.frame = null
      if (previous !== null)
        video.cancelVideoFrameCallback(previous)
      if (!active())
        return
      let delivered = false
      const id = video.requestVideoFrameCallback(job.guard(() => {
        if (!active() || sequence !== current.sequence || delivered)
          return
        delivered = true
        current.frame = null
        current.presented = true
        finish()
      }))
      if (active() && sequence === current.sequence && !delivered)
        current.frame = id
      else
        video.cancelVideoFrameCallback(id)
    }
    const seek = () => {
      current.sought = false
      requestFrame()
      if (active())
        video.currentTime = target
    }
    const begin = job.guard(() => {
      if (!active() || current.started)
        return
      current.started = true
      video.onloadeddata = null
      video.onseeked = job.guard(() => {
        if (!active() || video.seeking)
          return
        const time = video.currentTime
        if (!active())
          return
        if (!Number.isFinite(time) || Math.abs(time - target) > 0.05) {
          if (++current.retries > 3)
            throw new Error('Auto-thumbnail seek did not reach the requested time')
          seek()
          return
        }
        current.sought = true
        finish()
      })
      seek()
    })
    current.timer = setTimeout(job.guard(() => {
      if (active())
        throw new Error('Auto-thumbnail frame readiness timed out')
    }), 30000)
    if (!active()) {
      clearTimeout(current.timer)
      return
    }
    const ready = !presentedFrames || video.readyState >= 2
    if (!active())
      return
    if (!ready)
      video.onloadeddata = begin
    else
      begin()
  }
}
