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

export function mergeTypedArrays(a, b) {
    const c = new a.constructor(a.length + b.length);
    c.set(a);
    c.set(b, a.length);
    return c;
}

export function sleep(ms = 0) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export function getUint8Sum(arr) {
    return arr.reduce((totle, num, index) => totle + num * 256 ** (arr.length - index - 1), 0);
}
