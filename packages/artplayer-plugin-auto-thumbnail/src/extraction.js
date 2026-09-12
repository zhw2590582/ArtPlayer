import { sheetSize } from './options'

export default function extract(job, config) {
  const video = document.createElement('video')
  job.own(() => video.load())
  job.own(() => video.removeAttribute('src'))
  job.own(() => video.pause())
  for (const property of ['onloadedmetadata', 'onseeked', 'onerror'])
    job.own(() => { video[property] = null })
  if (!job.active())
    return
  video.crossOrigin = 'anonymous'
  video.onerror = job.guard(() => {
    throw video.error || new Error('Auto-thumbnail media failed to load')
  })
  video.onloadedmetadata = job.guard(() => {
    video.onloadedmetadata = null
    const duration = video.duration
    const { height, canvasWidth, canvasHeight } = sheetSize(config, {
      duration,
      videoHeight: video.videoHeight,
      videoWidth: video.videoWidth,
    })
    if (!job.active())
      return
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
      video.onseeked = job.guard(() => {
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
        video.currentTime = duration * index / config.number
    })
    seek()
  })
  if (job.active())
    video.src = config.url
}
