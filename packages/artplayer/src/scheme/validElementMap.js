import { ArtPlayerError } from '../utils';

export default function validElementMap(paths, value) {
  return Object.keys(value).every(key => {
    const mapValue = value[key];
    const mapType = typeof mapValue;
    if (mapValue instanceof Element || mapType === 'string') {
      return true;
    }
    throw new ArtPlayerError(`${paths.join('.')} require 'string' or 'Element' type, but got '${mapType}'`);
  });
}
