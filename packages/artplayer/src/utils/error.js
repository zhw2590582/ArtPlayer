export class ArtPlayerError extends Error {
  constructor(message, context) {
    super(message)
    if (typeof Error.captureStackTrace === 'function') {
      Error.captureStackTrace(this, context || this.constructor)
    }
    this.name = 'ArtPlayerError'
  }
}

export function errorHandle(condition, msg) {
  if (!condition) {
    throw new ArtPlayerError(msg)
  }
  return condition
}

/**
 * Attach a no-op catch to a promise that is intentionally not awaited.
 *
 * `art.play()` resolves the native `video.play()` promise, which rejects when the
 * request is interrupted (a `pause()`, a `load()`, a new `src`, or the element
 * being removed while the request is still pending) or when autoplay is blocked.
 * Internal call sites fire it from event handlers and cannot await it, so the
 * rejection escapes as a global `unhandledrejection` and error trackers report it
 * as a crash even though the player recovers on its own.
 *
 * Nothing is hidden from users of the public API: `art.play()` and `art.toggle()`
 * still return the original promise, so an application that calls them keeps its
 * own rejection to handle. Only the internal, non-awaited copy is silenced.
 *
 * Returns a promise that always fulfills, so an internal caller may await it
 * without inheriting the rejection. A non-thenable value is returned untouched
 * (`art.toggle()` yields `art.pause()`, which is synchronous).
 */
export function silencePromise(value) {
  if (value && typeof value.catch === 'function') {
    return value.catch(() => {})
  }
  return value
}
