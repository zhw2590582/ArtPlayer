import type { ComponentHost, EntryOption } from './types'
import { addClass, append, setStyles, tooltip } from '../utils/dom'

export function renderEntry<Host extends ComponentHost>(element: HTMLDivElement, parent: HTMLElement, kind: string, name: string, id: number, option: EntryOption<Host>): void {
  addClass(element, `art-${kind}`)
  addClass(element, `art-${kind}-${name}`)
  const children = Array.from(parent.children) as HTMLElement[]
  element.dataset.index = String(option.index || id)
  const next = children.find(child => Number(child.dataset.index) >= Number(element.dataset.index))
  if (next)
    next.insertAdjacentElement('beforebegin', element)
  else
    append(parent, element)
  if (option.html)
    append(element, option.html)
  if (option.style)
    setStyles(element, option.style)
  if (option.tooltip)
    tooltip(element, option.tooltip)
}

// Builtin renderers append known element markup or existing icon wrappers.
export function appendElement(parent: Element, child: string | Element): HTMLElement {
  return append(parent, child) as HTMLElement
}

export function queryElement(selector: string, parent: ParentNode): HTMLElement {
  return parent.querySelector<HTMLElement>(selector)!
}
