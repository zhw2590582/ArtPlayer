export * from './error';
export * from './dom';
export * from './subtitle';

export function clamp(num, a, b) {
    return Math.max(Math.min(num, Math.max(a, b)), Math.min(a, b));
}

export function getExt(url) {
    if (url.includes('?')) {
        return getExt(url.split('?')[0]);
    }

    if (url.includes('#')) {
        return getExt(url.split('#')[0]);
    }

    return url
        .trim()
        .toLowerCase()
        .split('.')
        .pop();
}

export function secondToTime(second) {
    const add0 = num => (num < 10 ? `0${num}` : String(num));
    const hour = Math.floor(second / 3600);
    const min = Math.floor((second - hour * 3600) / 60);
    const sec = Math.floor(second - hour * 3600 - min * 60);
    return (hour > 0 ? [hour, min, sec] : [min, sec]).map(add0).join(':');
}

export function sleep(ms = 0) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export function debounce(func, wait, context) {
    let timeout;
    function fn(...args) {
        const later = function later() {
            timeout = null;
            func.apply(context, args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    }

    fn.clearTimeout = function ct() {
        clearTimeout(timeout);
    };

    return fn;
}
