import { errorHandle } from './error';

export const def = Object.defineProperty;

const { hasOwnProperty } = Object.prototype;
export function has(obj, name) {
    return hasOwnProperty.call(obj, name);
}

export function proxyPropertys(target, ...sources) {
    return sources.reduce((result, source) => {
        Object.getOwnPropertyNames(source).forEach(key => {
            errorHandle(!has(result, key), `Target attribute name is duplicated: ${key}`);
            def(result, key, Object.getOwnPropertyDescriptor(source, key));
        });
        return result;
    }, target);
}

export function mergeDeep(...objects) {
    const isObject = item => item && typeof item === 'object' && !Array.isArray(item);
    return objects.reduce((prev, obj) => {
        Object.keys(obj).forEach(key => {
            const pVal = prev[key];
            const oVal = obj[key];
            if (Array.isArray(pVal) && Array.isArray(oVal)) {
                prev[key] = pVal.concat(...oVal);
            } else if (isObject(pVal) && isObject(oVal) && !(oVal instanceof Element)) {
                prev[key] = mergeDeep(pVal, oVal);
            } else {
                prev[key] = oVal;
            }
        });
        return prev;
    }, {});
}
