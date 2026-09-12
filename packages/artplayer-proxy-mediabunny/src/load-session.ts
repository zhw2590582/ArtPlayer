import type { Input } from 'mediabunny'

export default class LoadSession {
  private active = true
  private input: Input | null = null
  private timers = new Set<ReturnType<typeof setTimeout>>()
  private deadline: ReturnType<typeof setTimeout> | undefined
  private controller = typeof AbortController === 'undefined' ? undefined : new AbortController()
  private resolveCancellation!: () => void
  private cancellation = new Promise<void>((resolve) => {
    this.resolveCancellation = resolve
  })

  get signal(): AbortSignal | undefined {
    return this.controller?.signal
  }

  own(input: Input): void {
    if (this.active)
      this.input = input
    else input.dispose()
  }

  defer(callback: () => void): void {
    if (!this.active)
      return
    const timer = setTimeout(() => {
      this.timers.delete(timer)
      if (this.active)
        callback()
    }, 0)
    this.timers.add(timer)
  }

  async wait(operation: Promise<void>, milliseconds: number): Promise<void> {
    try {
      await Promise.race([
        operation,
        this.cancellation,
        milliseconds > 0 ? this.timeout(milliseconds) : new Promise<void>(() => {}),
      ])
    }
    finally {
      if (this.deadline !== undefined) {
        clearTimeout(this.deadline)
        this.deadline = undefined
      }
    }
  }

  timeout(milliseconds: number): Promise<never> {
    return new Promise((_, reject) => {
      this.deadline = setTimeout(() => reject(new Error('Load timeout')), milliseconds)
    })
  }

  disposeInput(): void {
    const input = this.input
    this.input = null
    input?.dispose()
  }

  cancel(): void {
    if (!this.active)
      return
    this.active = false
    for (const timer of this.timers) clearTimeout(timer)
    this.timers.clear()
    if (this.deadline !== undefined) {
      clearTimeout(this.deadline)
      this.deadline = undefined
    }
    this.resolveCancellation()
    this.controller?.abort()
    this.disposeInput()
  }
}
