import ArtPlayerError from './ArtPlayerError';

export function errorHandle(condition, msg) {
  if (!condition) {
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
  return parent;
}

export function setStyle(element, styles) {
  Object.keys(styles).forEach(key => {
    element.style[key] = styles[key];
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
