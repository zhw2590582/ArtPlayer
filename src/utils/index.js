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

export function secondToTime(second) {
  const add0 = num => num < 10 ? `0${num}` : String(num);
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
      if (source instanceof Element) {
        return source;
      }
      for (const key in source) {
        if (source.hasOwnProperty(key)) {
          let value = source[key];
          if (isObject(value) && key in returnValue) {
            value = deepMerge(returnValue[key], value);
          }
          returnValue = { ...returnValue, [key]: value };
        }
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

export function debounce(func, wait, context) {
  let timeout;
  function fn() {
    const args = arguments;
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
