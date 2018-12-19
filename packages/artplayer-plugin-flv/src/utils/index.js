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

export function getTagBodySize(dataSize) {
    return dataSize[0] * 256 ** 2 + dataSize[1] * 256 + dataSize[2];
}
