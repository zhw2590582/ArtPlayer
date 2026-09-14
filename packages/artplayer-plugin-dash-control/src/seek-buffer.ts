import type { Cleanup, Valid } from './types'

type MediaType = 'audio' | 'video'

interface BufferController {
  getRangeAt?: (time: number) => { end: number } | null
  getIsPruningInProgress?: () => boolean
  getAllRangesWithSafetyFactor?: (time: number) => unknown[]
}

interface Stream {
  getProcessors?: () => {
    getType?: () => string
    getBufferController?: () => BufferController | null
  }[]
}

interface LegacySDK {
  getVersion?: () => string
  getVideoElement?: () => { currentTime: number, seeking: boolean } | null
  getActiveStream?: () => Stream | null
  getDashMetrics?: () => {
    getCurrentBufferLevel?: (type: MediaType) => number
    addBufferLevel?: (type: MediaType, at: Date, level: 0) => void
  } | null
}

export function createSeekRecovery(value: object, active: Valid): Cleanup | undefined {
  const sdk = value as LegacySDK
  try {
    if (typeof sdk.getVersion !== 'function' || sdk.getVersion() !== '4.5.2')
      return
    if (typeof sdk.getVideoElement !== 'function' || typeof sdk.getActiveStream !== 'function' || typeof sdk.getDashMetrics !== 'function')
      return
  }
  catch {
    return
  }
  let running = false
  return () => {
    if (running || !active())
      return
    running = true
    try {
      const video = sdk.getVideoElement?.()
      if (!video?.seeking || !Number.isFinite(video.currentTime))
        return
      const time = video.currentTime
      const stream = sdk.getActiveStream?.()
      const metrics = sdk.getDashMetrics?.()
      const processors = stream?.getProcessors?.()
      if (!Array.isArray(processors) || typeof metrics?.getCurrentBufferLevel !== 'function' || typeof metrics.addBufferLevel !== 'function')
        return
      for (const processor of processors) {
        if (!active())
          return
        const type = processor.getType?.()
        if (type !== 'audio' && type !== 'video')
          continue
        const buffer = processor.getBufferController?.()
        if (typeof buffer?.getRangeAt !== 'function' || typeof buffer.getIsPruningInProgress !== 'function' || typeof buffer.getAllRangesWithSafetyFactor !== 'function')
          continue
        const cached = metrics.getCurrentBufferLevel(type)
        const range = buffer.getRangeAt(time)
        const empty = range === null || (range && Number.isFinite(range.end) && range.end <= time)
        if (!Number.isFinite(cached) || cached <= 0 || !empty || buffer.getIsPruningInProgress() !== false)
          continue
        const removals = buffer.getAllRangesWithSafetyFactor(time)
        if (!Array.isArray(removals) || removals.length !== 0)
          continue
        if (!active() || sdk.getActiveStream?.() !== stream || sdk.getDashMetrics?.() !== metrics || sdk.getVideoElement?.() !== video || video.currentTime !== time || !video.seeking || !active())
          return
        // SDK 4.5.2 schedules from metric history, not BufferController's getter.
        // Record the measured empty range; leave buffers, media events and time intact.
        metrics.addBufferLevel(type, new Date(), 0)
      }
    }
    catch (error) {
      console.warn('ArtPlayer DASH seek buffer refresh failed:', error)
    }
    finally {
      running = false
    }
  }
}
