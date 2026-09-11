import type ResourceScope from '../lifecycle/scope'
import { listen } from '../lifecycle/resources'
import { claimKey, plainKey } from './keyboard'

/** Preserve the existing click path and keep owned keys out of player hotkeys. */
export function keyboardButton(scope: ResourceScope, element: HTMLElement, activate = () => element.click(), active = () => true): void {
  if (scope.closed)
    return
  if (!element.hasAttribute('role'))
    element.setAttribute('role', 'button')
  if (!element.hasAttribute('tabindex'))
    element.tabIndex = 0
  let space = false
  const enabled = () => active() && element.getAttribute('aria-disabled') !== 'true' && !element.hasAttribute('disabled')
  const own = (event: KeyboardEvent) => (event.composedPath()[0] || event.target) === element
  listen(scope, element, 'keydown', (value) => {
    const event = value as KeyboardEvent
    if (!own(event) || !plainKey(event) || event.defaultPrevented)
      return
    if (event.key === 'Enter') {
      claimKey(event)
      if (!event.repeat && enabled())
        activate()
    }
    else if (event.key === ' ') {
      claimKey(event)
      if (!event.repeat && enabled())
        space = true
    }
  })
  listen(scope, element, 'keyup', (value) => {
    const event = value as KeyboardEvent
    if (event.key !== ' ')
      return
    const armed = space
    space = false
    if (armed && own(event) && plainKey(event) && !event.defaultPrevented && enabled() && element.ownerDocument.activeElement === element) {
      claimKey(event)
      activate()
    }
  })
  listen(scope, element, 'blur', () => {
    space = false
  })
  scope.add(() => {
    space = false
  })
}
