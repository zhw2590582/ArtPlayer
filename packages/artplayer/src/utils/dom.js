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

export function sublings(target) {
    return Array.from(target.parentElement.children).filter(item => item !== target);
}

export function inverseClass(target, className) {
    sublings(target).forEach(item => item.classList.remove(className));
    target.classList.add(className);
}

export function tooltip(target, msg, pos = 'up') {
    target.setAttribute('data-balloon', msg);
    target.setAttribute('data-balloon-pos', pos);
}