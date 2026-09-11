import type { SubscriptionHost } from '../component/resources'
import type { NoticeSink } from '../notice'

export interface ResizeEvents {
  'resize': []
  'window:resize': [Event]
  'window:orientationchange': [Event]
}

export interface ResizeHost extends SubscriptionHost<ResizeEvents> {
  template: { $player: HTMLElement }
  option: { autoSize: boolean }
  constructor: { RESIZE_TIME: number }
  aspectRatio: string
  state: string
  autoSize: () => unknown
  notice: NoticeSink
  emit: (name: 'resize') => unknown
}

export interface ViewEvents { 'window:scroll': [Event], 'view': [boolean] }
export interface ViewHost extends SubscriptionHost<ViewEvents> {
  template: { $container: HTMLElement }
  option: { autoMini: boolean }
  constructor: { SCROLL_GAP: number, SCROLL_TIME: number }
  mini: boolean
  emit: (name: 'view', visible: boolean) => unknown
}

export interface RafEvents { destroy: [] }
export interface RafHost extends SubscriptionHost<RafEvents> {
  constructor: { USE_RAF: boolean }
  playing: boolean
  emit: (name: 'raf') => unknown
}
