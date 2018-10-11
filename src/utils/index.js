import ArtPlayerError from './ArtPlayerError';
export * from './verification';

export function errorHandle(condition, msg) {
  if (!condition) {
    throw new ArtPlayerError(msg);
  }
}
