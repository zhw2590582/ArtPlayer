export function query<T extends Element = Element>(selector: string, parent: ParentNode = document): T | null {
  return parent.querySelector<T>(selector)
}

export function queryAll<T extends Element = Element>(selector: string, parent: ParentNode = document): T[] {
  return Array.from(parent.querySelectorAll<T>(selector))
}

export function addClass(target: Pick<Element, 'classList'>, className: string): void {
  return target.classList.add(className)
}

export function removeClass(target: Pick<Element, 'classList'>, className: string): void {
  return target.classList.remove(className)
}

export function hasClass(target: Pick<Element, 'classList'>, className: string): boolean {
  return target.classList.contains(className)
}

export function append(parent: Element, child: unknown): Element | ChildNode | null {
  if (child instanceof Element) {
    parent.appendChild(child)
  }
  else {
    parent.insertAdjacentHTML('beforeend', String(child))
  }
  return parent.lastElementChild || parent.lastChild
}

export function remove<T extends Node>(child: T): T {
  // Detached nodes retain their historical failure rather than becoming no-ops.
  return child.parentNode!.removeChild(child)
}

export function siblings(target: Element): Element[] {
  return Array.from(target.parentElement!.children).filter(item => item !== target)
}

export function inverseClass(target: Element, className: string): void {
  siblings(target).forEach(item => removeClass(item, className))
  addClass(target, className)
}

export function replaceElement<T extends Node>(newChild: T, oldChild: Node): T {
  oldChild.parentNode!.replaceChild(newChild, oldChild)
  return newChild
}

export function createElement<K extends keyof HTMLElementTagNameMap>(tag: K): HTMLElementTagNameMap[K]
export function createElement(tag: string): HTMLElement
export function createElement(tag: string): HTMLElement {
  return document.createElement(tag)
}
