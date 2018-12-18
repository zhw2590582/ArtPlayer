export class FlvError extends Error {
    constructor(message, context) {
        super(message);
        if (typeof Error.captureStackTrace === 'function') {
            Error.captureStackTrace(this, context || this.constructor);
        }
        this.name = 'FlvError';
    }
}

export function errorHandle(condition, msg) {
    if (!condition) {
        throw new FlvError(msg);
    }
}