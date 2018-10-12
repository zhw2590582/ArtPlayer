import ArtPlayerError from './ArtPlayerError';

export function errorHandle(condition, msg) {
  if (!condition) {
    throw new ArtPlayerError(msg);
  }
}

export function clamp(num, a, b) {
  return Math.max(Math.min(num, Math.max(a, b)), Math.min(a, b));
}
