import type ResourceScope from '../lifecycle/scope'
import { requestController } from '../lifecycle/resources'

// Cancellation settles callers even when a fetch adapter ignores AbortSignal.
export default class SubtitleRequest {
  readonly scope: ResourceScope
  readonly signal?: AbortSignal
  private readonly cancelled: Promise<undefined>

  constructor(parent: ResourceScope) {
    this.scope = parent.child()
    this.cancelled = new Promise((resolve) => {
      this.scope.add(() => {
        resolve(undefined)
      })
    })
    this.signal = requestController(this.scope)?.signal
  }

  get active(): boolean {
    return !this.scope.closed
  }

  cancel(): void {
    this.scope.dispose()
  }

  async run<Result>(work: () => Promise<Result>): Promise<Result | undefined> {
    if (!this.active)
      return undefined
    try {
      return await Promise.race([work(), this.cancelled])
    }
    finally {
      this.cancel()
    }
  }
}
