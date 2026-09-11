import type { ViewEvents, ViewHost } from './scheduling-types'
import { getScope, isClosing } from '../lifecycle/instance'
import { timeout } from '../lifecycle/resources'
import { eventSubscriptions } from './subscriptions'
import { inViewport } from './viewport'

export default function viewInit(art: ViewHost): void {
  const { option, constructor, template: { $container } } = art
  const delay = constructor.SCROLL_TIME
  const scope = getScope(art)
  const on = eventSubscriptions<ViewEvents>(art)
  let waiting = false
  on('window:scroll', () => {
    if (waiting)
      return
    art.emit('view', inViewport($container, constructor.SCROLL_GAP))
    if (isClosing(art))
      return
    // Keep the leading-only throttle and its historical synchronous reentry timing.
    waiting = true
    timeout(scope, () => {
      waiting = false
    }, delay)
  })
  on('view', (visible) => {
    if (option.autoMini)
      art.mini = !visible
  })
}
