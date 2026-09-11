import type ResourceScope from '../lifecycle/scope'
import type { InfoHost } from './poll'
import { keyboardButton } from '../accessibility/button'
import { claimKey, plainKey } from '../accessibility/keyboard'
import { resolveFocusOrigin } from '../accessibility/overlay-focus'
import { focusPlayer } from '../accessibility/player-focus'
import { isClosing } from '../lifecycle/instance'
import { listen } from '../lifecycle/resources'

const origins = new WeakMap<InfoHost, HTMLElement>()

export function infoKeyboard(art: InfoHost, scope: ResourceScope, close: () => void): void {
  const { $player, $info, $infoClose } = art.template
  if (!$info)
    return
  const active = () => !scope.closed && !isClosing(art)
  const visible = () => $player.classList.contains('art-info-show')
  const closeLabel = art.i18n.get('Close')
  if (!active())
    return
  const groupLabel = art.i18n.get('Video Info')
  if (!active())
    return
  $infoClose.setAttribute('aria-label', closeLabel)
  $info.setAttribute('role', 'group')
  $info.setAttribute('aria-label', groupLabel)
  keyboardButton(scope, $infoClose, () => $infoClose.click(), visible)
  listen(scope, $info, 'keydown', (input) => {
    const event = input as KeyboardEvent
    if (active() && visible() && plainKey(event) && !event.defaultPrevented && event.key === 'Escape') {
      claimKey(event)
      close()
    }
  })
  const changed = (show: boolean) => {
    if (!active())
      return
    const doc = $player.ownerDocument
    const focused = doc.activeElement as HTMLElement | null
    if (show) {
      if (!$info.contains(focused)) {
        origins.delete(art)
        if (focused && $player.contains(focused)) {
          origins.set(art, resolveFocusOrigin(focused))
          if ($player.classList.contains('art-keyboard-focus'))
            $infoClose.focus({ preventScroll: true })
        }
      }
    }
    else {
      const origin = origins.get(art)
      origins.delete(art)
      if (!$info.contains(focused))
        return
      const visibility = origin && doc.defaultView?.getComputedStyle(origin).visibility
      if (origin?.isConnected && $player.contains(origin) && origin.getClientRects().length && visibility !== 'hidden' && visibility !== 'collapse' && !origin.matches(':disabled') && !origin.closest('[inert]') && origin.getAttribute('aria-disabled') !== 'true')
        origin.focus({ preventScroll: true })
      else
        focusPlayer(art)
    }
  }
  art.on('info', changed)
  scope.add(() => {
    art.off('info', changed)
  })
}
