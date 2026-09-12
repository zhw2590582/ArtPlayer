export type MediaEvent = Event & { detail: unknown }
export type MediaListener = (event: MediaEvent) => unknown

export default class EventTarget {
  declare listeners: Map<string, MediaListener[]>
  #closed = false

  constructor() {
    this.listeners = new Map()
  }

  addEventListener(type: string, fn: MediaListener): void {
    if (this.#closed)
      return
    if (!this.listeners.has(type))
      this.listeners.set(type, [])
    this.listeners.get(type)?.push(fn)
  }

  removeEventListener(type: string, fn: MediaListener): void {
    const list = this.listeners.get(type)
    if (!list)
      return
    const index = list.indexOf(fn)
    if (index >= 0)
      list.splice(index, 1)
  }

  emit(type: string, detail?: unknown): void {
    if (this.#closed)
      return
    const event = Object.assign(new Event(type), { detail })
    // Keep historical live-array forEach semantics and uncaught listener exceptions.
    this.listeners.get(type)?.forEach((fn) => {
      if (!this.#closed)
        fn(event)
    })
  }

  destroy(): void {
    this.#closed = true
    this.listeners.clear()
  }
}
