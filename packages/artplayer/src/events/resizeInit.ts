import type { PointerRegistry } from '../input/pointer-types'
import type { ResizeEvents, ResizeHost } from './scheduling-types'
import { getScope, isClosing } from '../lifecycle/instance'
import { timeout } from '../lifecycle/resources'
import { eventSubscriptions } from './subscriptions'

export default function resizeInit(art: ResizeHost, events: Pick<PointerRegistry, 'proxy'>): void {
  const { option, constructor } = art
  const on = eventSubscriptions<ResizeEvents>(art)
  on('resize', () => {
    const { aspectRatio, notice } = art
    if (art.state === 'standard' && option.autoSize)
      art.autoSize()
    if (isClosing(art))
      return
    art.aspectRatio = aspectRatio
    if (!isClosing(art))
      notice.show = ''
  })

  const scope = getScope(art)
  let cancel = () => {}
  const resize = () => {
    if (isClosing(art))
      return
    cancel()
    cancel = timeout(scope, () => art.emit('resize'), constructor.RESIZE_TIME)
  }
  on('window:orientationchange', resize)
  on('window:resize', resize)

  const orientation = art.template.$player.ownerDocument.defaultView?.screen?.orientation
  if (typeof orientation?.addEventListener === 'function')
    events.proxy(orientation, 'change', resize)
}
