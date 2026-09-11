import type { GlobalEventSource } from './global-types'
import type { Disposer, Listener } from './listener-registry'
import type { EventsHost } from './types'
import { getScope } from '../lifecycle/instance'
import clickInit from './clickInit'
import gestureInit from './gestureInit'
import globalInit from './globalInit'
import hoverInit from './hoverInit'
import { destroyListeners, ownListeners, proxyListener, removeListener } from './listener-registry'
import moveInit from './moveInit'
import resizeInit from './resizeInit'
import updateInit from './updateInit'
import viewInit from './viewInit'

export default class Events {
  declare destroyEvents: Set<Disposer>
  declare bindGlobalEvents: (source?: GlobalEventSource) => void

  constructor(art: EventsHost) {
    this.destroyEvents = new Set()
    ownListeners(this, art)
    getScope(art).add(() => {
      this.destroy()
    })
    this.proxy = this.proxy.bind(this)
    this.hover = this.hover.bind(this)

    clickInit(art, this)
    hoverInit(art, this)
    moveInit(art, this)
    resizeInit(art, this)
    gestureInit(art, this)
    viewInit(art)
    globalInit(art, this)
    updateInit(art)
  }

  proxy(target: EventTarget, name: string, callback: Listener, option?: boolean | AddEventListenerOptions | null): Disposer
  proxy(target: EventTarget, name: string[], callback: Listener, option?: boolean | AddEventListenerOptions | null): Disposer[]
  proxy(target: EventTarget, name: string | string[], callback: Listener, option?: boolean | AddEventListenerOptions | null): Disposer | Disposer[]
  proxy(target: EventTarget, name: string | string[], callback: Listener, option: boolean | AddEventListenerOptions | null = {}): Disposer | Disposer[] {
    return Array.isArray(name) ? proxyListener(this, target, name, callback, option) : proxyListener(this, target, name, callback, option)
  }

  hover(target: EventTarget, mouseenter?: (event: Event) => unknown, mouseleave?: (event: Event) => unknown): void {
    if (mouseenter)
      this.proxy(target, 'mouseenter', mouseenter)
    if (mouseleave)
      this.proxy(target, 'mouseleave', mouseleave)
  }

  remove(dispose: Disposer): void {
    removeListener(this, dispose)
  }

  destroy(): void {
    destroyListeners(this)
  }
}
