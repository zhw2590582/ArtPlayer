import type { HoverHost, PointerRegistry } from '../input/pointer-types'
import { isClosing } from '../lifecycle/instance'
import { addClass, removeClass } from '../utils/dom'

export default function hoverInit(art: HoverHost, events: Pick<PointerRegistry, 'hover'>): void {
  const { $player } = art.template
  events.hover(
    $player,
    (event) => {
      if (isClosing(art))
        return
      addClass($player, 'art-hover')
      art.emit('hover', true, event)
    },
    (event) => {
      if (isClosing(art))
        return
      removeClass($player, 'art-hover')
      art.emit('hover', false, event)
    },
  )
}
