import type { Disposer, Listener } from './listener-registry'

export interface GlobalEventSource {
  document?: Document
  window?: Window
}

export interface GlobalEventHost {
  template: { $player: HTMLElement }
  emit: (name: string, event: Event) => unknown
}

export interface GlobalEventRegistry {
  proxy: (target: EventTarget, name: string, listener: Listener) => Disposer
  remove: (dispose: Disposer) => void
  bindGlobalEvents?: (source?: GlobalEventSource) => void
}
