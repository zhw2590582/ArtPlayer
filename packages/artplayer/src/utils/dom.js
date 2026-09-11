import { isMobile } from './compatibility'

export { loadImg } from '../image/load'
export { setStyleText } from '../style/inject'

/** @param {string} selector @param {ParentNode} parent */
export function query(selector, parent = document) {
  return parent.querySelector(selector)
}

export function queryAll(selector, parent = document) {
  return Array.from(parent.querySelectorAll(selector))
}

export function addClass(target, className) {
  return target.classList.add(className)
}

export function removeClass(target, className) {
  return target.classList.remove(className)
}

export function hasClass(target, className) {
  return target.classList.contains(className)
}

export function append(parent, child) {
  if (child instanceof Element) {
    parent.appendChild(child)
  }
  else {
    parent.insertAdjacentHTML('beforeend', String(child))
  }
  return parent.lastElementChild || parent.lastChild
}

export function remove(child) {
  return child.parentNode.removeChild(child)
}

export function setStyle(element, key, value) {
  element.style[key] = value
  return element
}

export function setStyles(element, styles) {
  for (const key in styles) {
    setStyle(element, key, styles[key])
  }
  return element
}

export function getStyle(element, key, numberType = true) {
  const value = window.getComputedStyle(element, null).getPropertyValue(key)
  return numberType ? Number.parseFloat(value) : value
}

export function siblings(target) {
  return Array.from(target.parentElement.children).filter(item => item !== target)
}

export function inverseClass(target, className) {
  siblings(target).forEach(item => removeClass(item, className))
  addClass(target, className)
}

export function tooltip(target, msg, pos = 'top') {
  if (isMobile)
    return
  target.setAttribute('aria-label', msg)
  addClass(target, 'hint--rounded')
  addClass(target, `hint--${pos}`)
}

export function isInViewport(el, offset = 0) {
  const rect = el.getBoundingClientRect()
  const windowHeight = window.innerHeight || document.documentElement.clientHeight
  const windowWidth = window.innerWidth || document.documentElement.clientWidth
  const vertInView = rect.top - offset <= windowHeight && rect.top + rect.height + offset >= 0
  const horInView = rect.left - offset <= windowWidth + offset && rect.left + rect.width + offset >= 0
  return vertInView && horInView
}

export function includeFromEvent(event, target) {
  return getComposedPath(event).includes(target)
}

export function replaceElement(newChild, oldChild) {
  oldChild.parentNode.replaceChild(newChild, oldChild)
  return newChild
}

export function createElement(tag) {
  return document.createElement(tag)
}

/** @param {string} key @param {string | HTMLElement} html */
export function getIcon(key = '', html = '') {
  const icon = createElement('i')
  addClass(icon, 'art-icon')
  addClass(icon, `art-icon-${key}`)
  append(icon, html)
  return icon
}

export function supportsFlex() {
  const div = document.createElement('div')
  div.style.display = 'flex'
  return div.style.display === 'flex'
}

export function getRect(el) {
  return el.getBoundingClientRect()
}

export function getComposedPath(event) {
  if (event.composedPath)
    return event.composedPath()
  const path = []
  let node = event.target
  while (node) {
    path.push(node)
    node = node.parentNode
  }
  if (!path.includes(window) && window !== undefined) {
    path.push(window)
  }
  return path
}

export function getSafeAreaInsets() {
  const div = document.createElement('div')
  div.style.cssText
    = 'position:fixed;top:env(safe-area-inset-top,0px);right:env(safe-area-inset-right,0px);bottom:env(safe-area-inset-bottom,0px);left:env(safe-area-inset-left,0px);pointer-events:none;visibility:hidden;'
  document.body.appendChild(div)
  const style = getComputedStyle(div)
  const insets = {
    top: Number.parseFloat(style.top) || 0,
    right: Number.parseFloat(style.right) || 0,
    bottom: Number.parseFloat(style.bottom) || 0,
    left: Number.parseFloat(style.left) || 0,
  }
  div.remove()
  return insets
}
