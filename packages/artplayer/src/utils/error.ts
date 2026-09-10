type StackFrame = ((...args: never[]) => unknown) | (abstract new (...args: never[]) => object)

export class ArtPlayerError extends Error {
  constructor(message?: string, context?: StackFrame) {
    super(message)
    if ('captureStackTrace' in Error && typeof Error.captureStackTrace === 'function') {
      Error.captureStackTrace(this, context || this.constructor)
    }
    this.name = 'ArtPlayerError'
  }
}

export function errorHandle<T>(condition: T, msg?: string): T {
  if (!condition) {
    throw new ArtPlayerError(msg)
  }
  return condition
}

// Handle internal play rejections without changing the public play/toggle promises.
// Values without catch (including synchronous pause results) pass through unchanged.
export function silencePromise<T>(value: T): T extends Promise<infer Result> ? Promise<Result | undefined> : T
export function silencePromise(value: unknown): unknown {
  const candidate = value as { catch?: unknown } | null | undefined
  if (candidate && typeof candidate.catch === 'function') {
    return candidate.catch(() => {})
  }
  return value
}
