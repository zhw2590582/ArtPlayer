import type { GlobalEventSource } from '../../packages/artplayer/src/events/global-types'
import type { ViewEvents, ViewHost } from '../../packages/artplayer/src/events/scheduling-types'
import type { EventsHost } from '../../packages/artplayer/src/events/types'
import Events from '../../packages/artplayer/src/events'
import { eventSubscriptions } from '../../packages/artplayer/src/events/subscriptions'

declare const host: EventsHost
declare const view: ViewHost
declare const source: GlobalEventSource
const events = new Events(host)
const target = document.createElement('button')
const dispose: () => void = events.proxy(target, 'click', event => event.preventDefault(), null)
const disposers: (() => void)[] = events.proxy(target, ['click', 'mouseenter'], { handleEvent: event => event.preventDefault() })
events.remove(dispose)
disposers.forEach(remove => remove())
events.bindGlobalEvents(source)
// @ts-expect-error Native registration requires a string name or array.
events.proxy(target, 123, () => {})
// @ts-expect-error Public hover supplies an Event, not a narrower keyboard event.
events.hover(target, (event: KeyboardEvent) => event.code)
const on = eventSubscriptions<ViewEvents>(view)
on('view', (visible) => {
  const value: boolean = visible
  return value
})
// @ts-expect-error View payloads are boolean.
on('view', (visible: string) => visible)
// @ts-expect-error The subscription factory only accepts its declared event map.
on('resize', () => {})
