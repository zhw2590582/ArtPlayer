import { isMobile } from '../utils/compatibility'
import { addClass, append, createElement } from './tree'

export function tooltip(target: Element, msg: string | number, pos = 'top'): void {
  if (isMobile)
    return
  target.setAttribute('aria-label', msg as string)
  addClass(target, 'hint--rounded')
  addClass(target, `hint--${pos}`)
}

export function getIcon(key = '', html: string | HTMLElement = ''): HTMLElement {
  const icon = createElement('i')
  addClass(icon, 'art-icon')
  addClass(icon, `art-icon-${key}`)
  append(icon, html)
  return icon
}
