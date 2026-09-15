import type { ExtractionConfig, ExtractionJob } from './types'
import createEncoder from './encoding'
import createFrameReader from './frames'
import { sheetSize } from './options'
import createVideo from './video'

export default function extract(job: ExtractionJob, config: ExtractionConfig) {
  const video = createVideo(job)
  if (!job.active())
    return
  let metadataTimer: ReturnType<typeof setTimeout> | null = null
  const clearMetadataTimer = () => {
    const previous = metadataTimer
    metadataTimer = null
    if (previous !== null)
      clearTimeout(previous)
  }
  job.own(clearMetadataTimer)
  video.onerror = job.guard(() => {
    throw video.error || new Error('Auto-thumbnail media failed to load')
  })
  video.onloadedmetadata = job.guard(() => {
    clearMetadataTimer()
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
    job.own(() => {
      canvas.height = 0
    })
    job.own(() => {
      canvas.width = 0
    })
    if (!job.active())
      return
    canvas.width = canvasWidth
    if (!job.active())
      return
    canvas.height = canvasHeight
    if (!job.active())
      return
    const ctx = canvas.getContext('2d')
    if (!ctx)
      throw new Error('Auto-thumbnail canvas context is unavailable')
    if (!job.active())
      return
    const readFrame = createFrameReader(job, video)
    const encode = createEncoder(job, canvas)
    let index = 0
    const seek = job.guard(() => {
      if (index >= config.number) {
        job.dispose()
        return
      }
      readFrame(duration * index / config.number, job.guard(() => {
        ctx.drawImage(video, (index % 10) * config.width, Math.floor(index / 10) * height, config.width, height)
        if (!job.active())
          return
        encode((blob) => {
          job.publish(blob, { height, column: 10, number: config.number, width: config.width, scale: config.scale })
          if (job.active()) {
            index += 1
            seek()
          }
        })
      }))
    })
    seek()
  })
  if (!job.active())
    return
  metadataTimer = setTimeout(job.guard(() => {
    if (metadataTimer !== null)
      throw new Error('Auto-thumbnail metadata timed out')
  }), 30000)
  if (!job.active()) {
    clearMetadataTimer()
    return
  }
  video.src = config.url
}
