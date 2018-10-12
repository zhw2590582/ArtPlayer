export default class ArtPlayerError extends Error {
  constructor(message, context) {
    super(message);
    if (typeof Error.captureStackTrace === 'function') {
      Error.captureStackTrace(this, context || this.constructor);
    }
    this.name = 'ArtPlayerError';
  }
}
