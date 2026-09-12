export const CANCELLED = Symbol('cancelled')

export default class AudioTask {
  cancelled = false
  private waits = new Set<() => void>()
  private timers = new Map<ReturnType<typeof setTimeout>, (active: boolean) => void>()

  wait<T>(pending: Promise<T>): Promise<T | typeof CANCELLED> {
    return new Promise((resolve, reject) => {
      const cancel = () => resolve(CANCELLED)
      if (this.cancelled)
        cancel()
      else
        this.waits.add(cancel)
      pending.then((value) => {
        this.waits.delete(cancel)
        resolve(value)
      }, (error) => {
        this.waits.delete(cancel)
        reject(error)
      })
    })
  }

  delay(ms: number): Promise<boolean> {
    if (this.cancelled)
      return Promise.resolve(false)
    return new Promise((resolve) => {
      const timer = setTimeout(() => {
        this.timers.delete(timer)
        resolve(!this.cancelled)
      }, ms)
      this.timers.set(timer, resolve)
    })
  }

  cancel(): void {
    if (this.cancelled)
      return
    this.cancelled = true
    for (const cancel of this.waits)
      cancel()
    this.waits.clear()
    for (const [timer, resolve] of this.timers) {
      clearTimeout(timer)
      resolve(false)
    }
    this.timers.clear()
  }
}
