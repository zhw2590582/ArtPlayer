import type { DanmuItem } from './types'

// Sampling owns references only; the public state pools stay under Danmuku's control.
export default class SchedulingBuffer {
  private pending = new Set<DanmuItem>()
  private reserved = new Set<DanmuItem>()

  capture(items: DanmuItem[], failed: Set<DanmuItem>) {
    for (const item of items) {
      if (!this.reserved.has(item) && !failed.has(item))
        this.pending.add(item)
    }
  }

  take() {
    const ready: DanmuItem[] = []
    const waiting: DanmuItem[] = []
    for (const item of this.pending) {
      if (item.$state === 'ready')
        ready.push(item)
      else if (item.$state === 'wait')
        waiting.push(item)
    }
    this.pending.clear()
    const batch = [...ready, ...waiting]
    this.reserved = new Set(batch)
    return batch
  }

  complete() {
    this.reserved.clear()
  }

  clear() {
    this.pending.clear()
    this.reserved.clear()
  }
}
