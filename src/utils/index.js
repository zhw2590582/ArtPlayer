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

export function setStyle(element, styles) {
  Object.keys(styles).forEach(key => {
    element.style[key] = styles[key];
  });
  return element;
}

export function secondToTime(second) {
  const add0 = num => (num < 10 ? `0${num}` : String(num));
  const hour = Math.floor(second / 3600);
  const min = Math.floor((second - hour * 3600) / 60);
  const sec = Math.floor(second - hour * 3600 - min * 60);
  return (hour > 0 ? [hour, min, sec] : [min, sec]).map(add0).join(':');
}

export function deepMerge(...sources) {
  const isObject = value => value !== null && typeof value === 'object';
  let returnValue = {};
  for (const source of sources) {
    if (Array.isArray(source)) {
      if (!Array.isArray(returnValue)) {
        returnValue = [];
      }
      returnValue = [...returnValue, ...source];
    } else if (isObject(source)) {
      for (let [key, value] of Object.entries(source)) {
        if (isObject(value) && Reflect.has(returnValue, key)) {
          value = deepMerge(returnValue[key], value);
        }
        returnValue = { ...returnValue, [key]: value };
      }
    }
  }
  return returnValue;
}

export function getStorage(key) {
  const storage = JSON.parse(localStorage.getItem('artplayer_settings')) || {};
  return key ? storage[key] : storage;
}

export function setStorage(key, value) {
  const storage = Object.assign({}, getStorage(), {
    [key]: value
  });
  localStorage.setItem('artplayer_settings', JSON.stringify(storage));
}
