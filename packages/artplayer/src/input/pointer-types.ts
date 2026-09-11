import type { SubscriptionHost } from '../component/resources'
import type { Disposer, Listener } from '../events/listener-registry'

export interface PointerRegistry {
  proxy: (target: EventTarget, name: string, callback: Listener) => Disposer
  hover: (target: EventTarget, enter?: (event: Event) => unknown, leave?: (event: Event) => unknown) => void
}

export interface FocusHost extends SubscriptionHost<{ 'document:click': [Event], 'document:contextmenu': [Event] }> {
  template: { $player: HTMLElement }
  isInput: boolean
  isFocus: boolean
  emit: (name: 'focus' | 'blur', event: Event) => unknown
}

export interface ClickHost extends FocusHost {
  constructor: {
    MOBILE_CLICK_PLAY: boolean
    MOBILE_DBCLICK_PLAY: boolean
    DBCLICK_TIME: number
    DBCLICK_FULLSCREEN: boolean
  }

  template: { $player: HTMLElement, $video: EventTarget }
  isLock: boolean
  fullscreen: boolean
  toggle: () => unknown
  emit: (name: 'focus' | 'blur' | 'click' | 'dblclick', event: Event) => unknown
}

export interface HoverHost {
  template: { $player: HTMLElement }
  emit: (name: 'hover', state: boolean, event: Event) => unknown
}

export interface MoveHost {
  template: { $player: HTMLElement }
  emit: (name: 'mousemove', event: Event) => unknown
}
