import type { MiniHost } from './types'
import { resolveFocusOrigin } from '../accessibility/overlay-focus'
import { focusPlayer } from '../accessibility/player-focus'
import { isClosing } from '../lifecycle/instance'

export function miniFocus(art: MiniHost) {
  const player = art.template.$player
  let origin: HTMLElement | undefined
  return {
    entering(): (focus?: () => void) => void {
      const doc = player.ownerDocument
      const focused = doc.activeElement as HTMLElement | null
      const inside = focused && player.contains(focused)
      if (!art.template.$mini?.contains(focused))
        origin = inside ? resolveFocusOrigin(focused) : undefined
      const keyboard = inside && player.classList.contains('art-keyboard-focus')
      return (focus) => {
        if (keyboard && !isClosing(art) && (doc.activeElement === focused || doc.activeElement === doc.body))
          focus?.()
      }
    },
    leaving(popup?: HTMLElement): () => void {
      const doc = player.ownerDocument
      const inside = popup?.contains(doc.activeElement)
      return () => {
        if (!inside || isClosing(art) || (doc.activeElement !== doc.body && !popup?.contains(doc.activeElement)))
          return
        const visible = origin && doc.defaultView?.getComputedStyle(origin).visibility
        if (origin?.isConnected && origin.getClientRects().length && visible !== 'hidden' && visible !== 'collapse' && origin.getAttribute('aria-disabled') !== 'true' && !origin.matches(':disabled') && !origin.closest('[inert]'))
          origin.focus({ preventScroll: true })
        else
          focusPlayer(art)
      }
    },
  }
}
