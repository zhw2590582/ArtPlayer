import type { ExtractionJob } from './types'

interface PendingEncoding {
  timer: ReturnType<typeof setTimeout> | null
}

export default function createEncoder(job: ExtractionJob, canvas: HTMLCanvasElement) {
  let pending: PendingEncoding | undefined
  function clear() {
    const previous = pending
    pending = undefined
    if (previous && previous.timer !== null)
      clearTimeout(previous.timer)
  }
  job.own(clear)

  return (publish: (blob: Blob | null) => void) => {
    if (!job.active())
      return
    if (pending)
      throw new Error('Auto-thumbnail encoding is already pending')
    const current: PendingEncoding = { timer: null }
    pending = current
    const active = () => job.active() && pending === current
    current.timer = setTimeout(job.guard(() => {
      if (active())
        throw new Error('Auto-thumbnail encoding timed out')
    }), 30000)
    if (!active()) {
      clearTimeout(current.timer)
      return
    }
    canvas.toBlob(job.guard((blob) => {
      if (!active())
        return
      clear()
      if (job.active())
        publish(blob)
    }), 'image/jpeg')
  }
}
