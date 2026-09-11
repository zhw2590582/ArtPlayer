import type ResourceScope from '../lifecycle/scope'
import type { LockHost } from './lock'
import { keyboardButton } from '../accessibility/button'
import { claimKey, plainKey } from '../accessibility/keyboard'
import { suspendFocus } from '../accessibility/suspend-focus'
import { isClosing } from '../lifecycle/instance'
import { listen } from '../lifecycle/resources'

export function lockKeyboard(art: LockHost, element: HTMLElement, scope: ResourceScope, locked: () => boolean): (state: boolean) => void {
  let suspension: ResourceScope | undefined
  const active = () => !scope.closed && !isClosing(art)
  const label = art.i18n.get('Lock')
  if (!active())
    return () => {}
  element.setAttribute('aria-label', label)
  keyboardButton(scope, element)
  listen(scope, element, 'keydown', (input) => {
    const event = input as KeyboardEvent
    if (active() && locked() && plainKey(event) && !event.defaultPrevented && event.key === 'Escape') {
      claimKey(event)
      element.click()
    }
  })
  const update = (state: boolean) => {
    if (!active())
      return
    element.setAttribute('aria-pressed', String(state))
    if (state && !suspension) {
      const { $player, $bottom } = art.template
      const hiddenFocus = $bottom.contains($bottom.ownerDocument.activeElement) && $player.classList.contains('art-keyboard-focus')
      suspension = scope.child()
      suspendFocus(suspension, $bottom)
      if (active() && hiddenFocus)
        element.focus({ preventScroll: true })
    }
    else if (!state && suspension) {
      const previous = suspension
      suspension = undefined
      previous.dispose()
    }
  }
  update(locked())
  return update
}
