export class ArtPlayerError extends Error {
    constructor(message, context) {
        super(message);
        if (typeof Error.captureStackTrace === 'function') {
            Error.captureStackTrace(this, context || this.constructor);
        }
        this.name = 'ArtPlayerError';
    }
}

export function errorHandle(condition, msg) {
    const isFun = typeof condition === 'function';
    if (isFun ? !isFun() : !condition) {
        throw new ArtPlayerError(msg);
    }
}
