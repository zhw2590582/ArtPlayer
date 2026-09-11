import type { MoveHost, PointerRegistry } from '../input/pointer-types'
import { isClosing } from '../lifecycle/instance'

export default function moveInit(art: MoveHost, events: Pick<PointerRegistry, 'proxy'>): void {
  const { $player } = art.template
  events.proxy($player, 'mousemove', (event) => {
    if (!isClosing(art))
      art.emit('mousemove', event)
  })
}
