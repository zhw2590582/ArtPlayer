import FlvError from './flvError';

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

export function string2Bin(str) {
    const result = [];
    for (let i = 0; i < str.length; i += 1) {
        result.push(Number(str.charCodeAt(i).toString(10)));
    }
    return result;
}

export function bin2String(array) {
    return String.fromCharCode.call(String, ...array);
}

export function bin2Float(array) {
    const view = new DataView(new ArrayBuffer(array.length));
    array.forEach((b, i) => {
        view.setUint8(i, b);
    });
    return view.getFloat64(0);
}

export function bin2Boolean(bin) {
    return bin === 1;
}

export function log(name, msg = '') {
    console.log(`[${name}] ${msg}`);
}

export function readUint8(uint8) {
    let index = 0;
    return function read(length) {
        const tempUint8 = new Uint8Array(length);
        for (let i = 0; i < length; i += 1) {
            tempUint8[i] = uint8[index];
            index += 1;
        }
        read.index = index;
        return tempUint8;
    };
}
