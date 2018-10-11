export default class ArtPlayerError extends Error {
  constructor(message) {
    super(message);
    Error.captureStackTrace(this, this.constructor);
    this.name = 'ArtPlayerError';
  }
}
