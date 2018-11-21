import { ArtPlayerError } from '../utils';

export default function validElement(paths, value, type) {
    if (type === 'string') {
        if (value.trim() === '') {
            throw new ArtPlayerError(`${paths.join('.')} can not be empty`);
        } else {
            return true;
        }
    }

    if (value instanceof Element) {
        return true;
    }

    throw new ArtPlayerError(`${paths.join('.')} require 'string' or 'Element' type, but got '${type}'`);
}
