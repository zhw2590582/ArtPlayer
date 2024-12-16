import { isMobile } from './compatibility';

export function query(selector, parent = document) {
    return parent.querySelector(selector);
}

export function queryAll(selector, parent = document) {
    return Array.from(parent.querySelectorAll(selector));
}

export function addClass(target, className) {
    return target.classList.add(className);
}

export function removeClass(target, className) {
    return target.classList.remove(className);
}

export function hasClass(target, className) {
    return target.classList.contains(className);
}

export function append(parent, child) {
    if (child instanceof Element) {
        parent.appendChild(child);
    } else {
        parent.insertAdjacentHTML('beforeend', String(child));
    }
    return parent.lastElementChild || parent.lastChild;
}

export function remove(child) {
    return child.parentNode.removeChild(child);
}

export function setStyle(element, key, value) {
    element.style[key] = value;
    return element;
}

export function setStyles(element, styles) {
    for (const key in styles) {
        setStyle(element, key, styles[key]);
    }
    return element;
}

export function getStyle(element, key, numberType = true) {
    const value = window.getComputedStyle(element, null).getPropertyValue(key);
    return numberType ? parseFloat(value) : value;
}

export function sublings(target) {
    return Array.from(target.parentElement.children).filter((item) => item !== target);
}

export function inverseClass(target, className) {
    sublings(target).forEach((item) => removeClass(item, className));
    addClass(target, className);
}

export function tooltip(target, msg, pos = 'top') {
    if (isMobile) return;
    target.setAttribute('aria-label', msg);
    addClass(target, 'hint--rounded');
    addClass(target, `hint--${pos}`);
}

export function isInViewport(el, offset = 0) {
    const rect = el.getBoundingClientRect();
    const windowHeight = window.innerHeight || document.documentElement.clientHeight;
    const windowWidth = window.innerWidth || document.documentElement.clientWidth;
    const vertInView = rect.top - offset <= windowHeight && rect.top + rect.height + offset >= 0;
    const horInView = rect.left - offset <= windowWidth + offset && rect.left + rect.width + offset >= 0;
    return vertInView && horInView;
}

export function includeFromEvent(event, target) {
    return event.composedPath && event.composedPath().indexOf(target) > -1;
}

export function replaceElement(newChild, oldChild) {
    oldChild.parentNode.replaceChild(newChild, oldChild);
    return newChild;
}

export function createElement(tag) {
    return document.createElement(tag);
}

export function getIcon(key = '', html = '') {
    const icon = createElement('i');
    addClass(icon, 'art-icon');
    addClass(icon, `art-icon-${key}`);
    append(icon, html);
    return icon;
}

export function setStyleText(id, style) {
    let $style = document.getElementById(id);
    if (!$style) {
        $style = document.createElement('style');
        $style.id = id;
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                document.head.appendChild($style);
            });
        } else {
            (document.head || document.documentElement).appendChild($style);
        }
    }
    $style.textContent = style;
}

export function supportsFlex() {
    const div = document.createElement('div');
    div.style.display = 'flex';
    return div.style.display === 'flex';
}

export function getRect(el) {
    return el.getBoundingClientRect();
}

export function loadImg(url, scale) {
    return new Promise((resolve, reject) => {
        const img = new Image();

        img.onload = function () {
            if (!scale || scale === 1) {
                resolve(img);
            } else {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                canvas.width = img.width * scale;
                canvas.height = img.height * scale;
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

                canvas.toBlob((blob) => {
                    const blobUrl = URL.createObjectURL(blob);
                    const scaledImg = new Image();

                    scaledImg.onload = function () {
                        resolve(scaledImg);
                    };

                    scaledImg.onerror = function () {
                        URL.revokeObjectURL(blobUrl);
                        reject(new Error(`Image load failed: ${url}`));
                    };

                    scaledImg.src = blobUrl;
                });
            }
        };

        img.onerror = function () {
            reject(new Error(`Image load failed: ${url}`));
        };

        img.src = url;
    });
}
