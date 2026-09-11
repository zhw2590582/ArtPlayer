import type { RafEvents, RafHost } from './scheduling-types'
import { getScope, isClosing } from '../lifecycle/instance'
import { animationFrame } from '../lifecycle/resources'
import { eventSubscriptions } from './subscriptions'

export default function updateInit(art: RafHost): void {
  if (!art.constructor.USE_RAF)
    return
  const scope = getScope(art)
  let cancel = () => {}
  const update = () => {
    if (isClosing(art))
      return
    if (art.playing)
      art.emit('raf')
    if (!isClosing(art))
      cancel = animationFrame(scope, update)
  }
  update()
  eventSubscriptions<RafEvents>(art)('destroy', () => cancel())
}
