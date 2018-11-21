export const instances = [];

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

export function append(parent, child) {
    if (child instanceof Element) {
        parent.appendChild(child);
    } else {
        parent.insertAdjacentHTML('beforeend', child);
    }
    return parent.lastElementChild;
}

export function insertByIndex(parent, child, index) {
    const childs = Array.from(parent.children);
    child.dataset.index = index;
    const nextChild = childs.find(item => Number(item.dataset.index) >= Number(index));
    if (nextChild) {
        nextChild.insertAdjacentElement('beforebegin', child);
    } else {
        append(parent, child);
    }
    return child;
}

export function setStyle(element, key, value) {
    element.style[key] = value;
    return element;
}

export function setStyles(element, styles) {
    Object.keys(styles).forEach(key => {
        setStyle(element, key, styles[key]);
    });
    return element;
}

export function getStyle(element, key, numberType = true) {
    const value = window.getComputedStyle(element, null).getPropertyValue(key);
    return numberType ? parseFloat(value) : value;
}

export function secondToTime(second) {
    const add0 = num => (num < 10 ? `0${num}` : String(num));
    const hour = Math.floor(second / 3600);
    const min = Math.floor((second - hour * 3600) / 60);
    const sec = Math.floor(second - hour * 3600 - min * 60);
    return (hour > 0 ? [hour, min, sec] : [min, sec]).map(add0).join(':');
}

export function tooltip(target, msg, pos = 'up') {
    target.setAttribute('data-balloon', msg);
    target.setAttribute('data-balloon-pos', pos);
}

export function sleep(ms = 0) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export function sublings(target) {
    return Array.from(target.parentElement.children).filter(item => item !== target);
}

export function inverseClass(target, className) {
    sublings(target).forEach(item => item.classList.remove(className));
    target.classList.add(className);
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
