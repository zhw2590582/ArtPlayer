import ArtPlayerError from './ArtPlayerError';

export function errorHandle(condition, msg) {
  if (!condition) {
    throw new ArtPlayerError(msg);
  }
}

export function clamp(num, a, b) {
  return Math.max(Math.min(num, Math.max(a, b)), Math.min(a, b));
}

export function request(url) {
  return fetch(url)
    .then(response => response.arrayBuffer())
    .catch(err => {
      throw new ArtPlayerError(err.message);
    });
}

export function getExt(url) {
  if (url.includes('?')) {
    return getExt(url.split('?')[0]);
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
    parent.innerHTML = child;
  }
  return parent;
}

export function setStyle(element, styles) {
  Object.keys(styles).forEach(key => {
    element.style[key] = styles[key];
  });
  return element;
}
