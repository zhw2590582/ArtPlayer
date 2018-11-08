import { ArtPlayerError } from '../utils';

export default function validStringEmpty(paths, value, type) {
  if (type !== 'string') {
    throw new ArtPlayerError(`${paths.join('.')} required 'string' type.`);
  }

  if (value.trim() === '') {
    throw new ArtPlayerError(`${paths.join('.')} can not be empty`);
  }

  return true;
}
