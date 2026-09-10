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

// Handle internal play rejections without changing the public play/toggle promises.
// Values without catch (including synchronous pause results) pass through unchanged.
export function silencePromise(value) {
  if (value && typeof value.catch === 'function') {
    return value.catch(() => {})
  }
  return value
}
