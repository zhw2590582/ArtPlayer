import type ResourceScope from '../lifecycle/scope'

export function suspendFocus(scope: ResourceScope, root: HTMLElement): void {
  const original = new Map<HTMLElement, string | null>()
  const inert = root.hasAttribute('inert')
  const hidden = root.getAttribute('aria-hidden')
  const restore = (element: HTMLElement, value: string | null) => {
    if (element.getAttribute('tabindex') !== '-1')
      return
    if (value === null)
      element.removeAttribute('tabindex')
    else
      element.setAttribute('tabindex', value)
  }
  scope.add(() => {
    for (const [element, value] of original)
      restore(element, value)
    original.clear()
    if (!inert && root.getAttribute('inert') === '')
      root.removeAttribute('inert')
    if (root.getAttribute('aria-hidden') === 'true') {
      if (hidden === null)
        root.removeAttribute('aria-hidden')
      else
        root.setAttribute('aria-hidden', hidden)
    }
  })
  if (scope.closed)
    return
  if (!inert)
    root.setAttribute('inert', '')
  root.setAttribute('aria-hidden', 'true')
  const update = () => {
    if (scope.closed)
      return
    for (const [element, value] of original) {
      if (!root.contains(element)) {
        restore(element, value)
        original.delete(element)
      }
    }
    for (const element of root.querySelectorAll<HTMLElement>('[tabindex],button,input,select,textarea,a[href],[contenteditable]')) {
      if (!original.has(element)) {
        original.set(element, element.getAttribute('tabindex'))
        element.setAttribute('tabindex', '-1')
      }
    }
  }
  update()
  if (typeof MutationObserver !== 'undefined') {
    const observer = new MutationObserver(update)
    observer.observe(root, { childList: true, subtree: true })
    scope.add(() => {
      observer.disconnect()
    })
  }
}
