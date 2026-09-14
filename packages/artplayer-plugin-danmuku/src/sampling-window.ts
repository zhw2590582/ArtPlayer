import type Danmuku from './danmuku'
import type { DanmuItem } from './types'

// Public readys remains a point-in-time query; automatic playback can bridge a stalled frame.
export default class SamplingWindow {
  private time: number | undefined
  private rows = new Set<DanmuItem>()
  private waiting = new Set<DanmuItem>()
  private document: Document | undefined
  private visibility = () => this.clear()

  capture(owner: Danmuku, rows: DanmuItem[], time: number) {
    const doc = owner.$player.ownerDocument
    if (doc !== this.document) {
      this.document?.removeEventListener('visibilitychange', this.visibility)
      this.document = doc
      doc?.addEventListener('visibilitychange', this.visibility)
      this.clear()
    }
    if (!Number.isFinite(time) || doc?.visibilityState === 'hidden' || owner.art.video?.seeking) {
      this.clear()
      return rows
    }
    const previousTime = this.time
    const previousRows = this.rows
    const previousWaiting = this.waiting
    this.time = time
    this.rows = new Set(rows)
    this.waiting = new Set(owner.states.wait)
    if (previousTime === undefined || time <= previousTime)
      return rows
    const missed = owner.states.wait.filter(row => previousWaiting.has(row) && !previousRows.has(row)
      && row.time >= previousTime - 0.1 && row.time < time - 0.1)
    for (const row of missed) this.rows.add(row)
    return [...rows.filter(row => row.$state === 'ready'), ...missed, ...rows.filter(row => row.$state !== 'ready')]
  }

  clear() {
    this.time = undefined
    this.rows.clear()
    this.waiting.clear()
  }

  destroy() {
    this.document?.removeEventListener('visibilitychange', this.visibility)
    this.document = undefined
    this.clear()
  }
}
