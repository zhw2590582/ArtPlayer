import type { SubscriptionHost } from '../component/resources'
import type { LongPressHost } from '../input/long-press'
import type { PointerRegistry } from '../input/pointer-types'
import { eventSubscriptions } from '../events/subscriptions'
import { longPress } from '../input/long-press'
import { hasClass } from '../utils'

interface PressEvents {
  'document:touchmove': [Event]
  'document:touchend': [Event]
  'document:touchcancel': [Event]
  'video:pause': [Event]
  'lock': [boolean]
  'destroy': []
}

export interface FastForwardHost extends LongPressHost, SubscriptionHost<PressEvents> {
  template: { $player: HTMLElement, $video: EventTarget }
  proxy: PointerRegistry['proxy']
}

export default function fastForward(art: FastForwardHost): { name: string, readonly state: boolean } {
  const { proxy, template: { $player, $video } } = art
  const press = longPress(art)
  const subscribe = eventSubscriptions<PressEvents>(art)
  proxy($video, 'touchstart', event => press.start(event as TouchEvent))
  proxy($video, 'touchcancel', press.stop)
  subscribe('document:touchmove', press.stop)
  subscribe('document:touchend', press.stop)
  subscribe('document:touchcancel', press.stop)
  subscribe('video:pause', press.stop)
  subscribe('destroy', press.stop)
  subscribe('lock', (locked) => {
    if (locked)
      press.stop()
  })
  return {
    name: 'fastForward',
    get state() {
      return hasClass($player, 'art-fast-forward')
    },
  }
}
