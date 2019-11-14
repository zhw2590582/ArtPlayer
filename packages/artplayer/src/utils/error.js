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
    if (!condition) {
        throw new ArtPlayerError(msg);
    }
    return condition;
}
