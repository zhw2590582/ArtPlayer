import { sheetSize } from './options'
import createVideo from './video'

export default function extract(job, config) {
  const video = createVideo(job)
  if (!job.active())
    return
  video.onerror = job.guard(() => {
    throw video.error || new Error('Auto-thumbnail media failed to load')
  })
  video.onloadedmetadata = job.guard(() => {
    video.onloadedmetadata = null
    const duration = video.duration
    const videoHeight = video.videoHeight
    const videoWidth = video.videoWidth
    const { height, canvasWidth, canvasHeight } = sheetSize(config, {
      duration,
      videoHeight,
      videoWidth,
    })
    if (!job.active())
      return
    video.width = videoWidth
    video.height = videoHeight
    video.style.width = `${videoWidth}px`
    video.style.height = `${videoHeight}px`
    const canvas = document.createElement('canvas')
    if (!job.active())
      return
    canvas.width = canvasWidth
    canvas.height = canvasHeight
    const ctx = canvas.getContext('2d')
    if (!ctx)
      throw new Error('Auto-thumbnail canvas context is unavailable')
    if (!job.active())
      return
    let index = 0
    const seek = job.guard(() => {
      if (index >= config.number) {
        job.dispose()
        return
      }
      const target = duration * index / config.number
      let retries = 0
      video.onseeked = job.guard(() => {
        if (video.seeking)
          return
        const time = video.currentTime
        if (!job.active())
          return
        if (!Number.isFinite(time) || Math.abs(time - target) > 0.05) {
          if (++retries > 3)
            throw new Error('Auto-thumbnail seek did not reach the requested time')
          video.currentTime = target
          return
        }
        video.onseeked = null
        ctx.drawImage(video, (index % 10) * config.width, Math.floor(index / 10) * height, config.width, height)
        if (!job.active())
          return
        let delivered = false
        canvas.toBlob(job.guard((blob) => {
          if (delivered)
            return
          delivered = true
          job.publish(blob, { height, column: 10, number: config.number, width: config.width, scale: config.scale })
          if (job.active()) {
            index += 1
            seek()
          }
        }), 'image/jpeg')
      })
      if (job.active())
        video.currentTime = target
    })
    seek()
  })
  if (job.active())
    video.src = config.url
}
