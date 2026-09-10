import type { SubscriptionHost } from '../component/resources'
import type { ComponentHost } from '../component/types'
import type { UIEvents } from './types'
import { proxyEntry, subscribeEntry } from '../component/resources'

export function controlEvents(art: ComponentHost & SubscriptionHost<UIEvents>, element: HTMLElement) {
  return {
    on: <Name extends keyof UIEvents>(name: Name, callback: (...args: [...UIEvents[Name]]) => unknown): void => {
      subscribeEntry<UIEvents, Name>(art, element, name, callback)
    },
    proxy: <Name extends keyof HTMLElementEventMap>(target: EventTarget, name: Name, callback: (event: HTMLElementEventMap[Name]) => unknown): (() => void) => proxyEntry(art, element, target, name, callback),
  }
}
