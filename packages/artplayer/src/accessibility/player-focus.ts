import type { ComponentHost } from '../component/types'
import { getScope, isClosing } from '../lifecycle/instance'

const owned = new WeakSet<HTMLElement>()

export function focusPlayer(art: Pick<ComponentHost, 'template'>): void {
  const player = art.template.$player
  if (isClosing(art) || !player.isConnected)
    return
  if (!player.hasAttribute('tabindex')) {
    player.setAttribute('tabindex', '-1')
    if (!owned.has(player)) {
      owned.add(player)
      getScope(art).add(() => {
        owned.delete(player)
        if (player.getAttribute('tabindex') === '-1')
          player.removeAttribute('tabindex')
      })
    }
  }
  player.focus({ preventScroll: true })
}
