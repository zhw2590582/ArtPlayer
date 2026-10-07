/**
 * Event Target Implementation
 * Simple event system for video events
 */
export default class EventTarget {
  constructor() {
    this.listeners = new Map()
  }

  addEventListener(type, fn) {
    if (!this.listeners.has(type)) {
      this.listeners.set(type, [])
    }
    this.listeners.get(type).push(fn)
  }

  removeEventListener(type, fn) {
    const list = this.listeners.get(type)
    if (!list)
      return

    const index = list.indexOf(fn)
    if (index >= 0) {
      list.splice(index, 1)
    }
  }

  emit(type, detail) {
    const evt = new Event(type)
    evt.detail = detail

    const list = this.listeners.get(type)
    if (list) {
      // Snapshot: a listener that removes itself during dispatch would
      // otherwise skip its neighbours (todo P3-8).
      list.slice().forEach(fn => fn(evt))
    }
  }
}
