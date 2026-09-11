import type ResourceScope from '../lifecycle/scope'
import { getScope } from '../lifecycle/instance'

export type Disposer = () => void
export type Listener = EventListenerOrEventListenerObject | null
export interface ListenerRegistry {
  destroyEvents: Set<Disposer>
}

interface State {
  scope: ResourceScope
  cleaning: boolean
}
const states = new WeakMap<ListenerRegistry, State>()

export function ownListeners(registry: ListenerRegistry, art: object): void {
  states.set(registry, { scope: getScope(art), cleaning: false })
}

function stateOf(registry: ListenerRegistry): State {
  const state = states.get(registry)
  if (!state)
    throw new Error('ArtPlayer event registry has not been initialized')
  return state
}

export function proxyListener(registry: ListenerRegistry, target: EventTarget, names: string[], callback: Listener, option?: boolean | AddEventListenerOptions | null): Disposer[]
export function proxyListener(registry: ListenerRegistry, target: EventTarget, names: string, callback: Listener, option?: boolean | AddEventListenerOptions | null): Disposer
export function proxyListener(registry: ListenerRegistry, target: EventTarget, names: string | string[], callback: Listener, option: boolean | AddEventListenerOptions | null = {}): Disposer | Disposer[] {
  if (Array.isArray(names)) {
    const created: Disposer[] = []
    try {
      return names.map((name) => {
        const dispose = proxyListener(registry, target, name, callback, option)
        created.push(dispose)
        return dispose
      })
    }
    catch (error) {
      for (const dispose of created.reverse()) {
        try {
          dispose()
        }
        catch (cleanupError) {
          console.warn('Failed to roll back event listener:', cleanupError)
        }
      }
      throw error
    }
  }
  const name = names
  const state = stateOf(registry)
  if (state.scope.closed || state.cleaning)
    return () => {}
  // Snapshot native dictionary values, especially capture, without wrapping the callback.
  const options = typeof option === 'boolean'
    ? option
    : {
        capture: Boolean(option?.capture),
        once: Boolean(option?.once),
        passive: option?.passive,
        signal: option?.signal,
      }
  const capture = typeof options === 'boolean' ? options : options.capture
  const signal = typeof options === 'boolean' ? undefined : options.signal
  if (state.scope.closed || state.cleaning || signal?.aborted)
    return () => {}
  let active = true
  function clean(force = false): void {
    if (!active && !force)
      return
    target.removeEventListener(name, callback, capture)
    signal?.removeEventListener('abort', dispose)
    active = false
    registry.destroyEvents.delete(dispose)
  }
  function dispose(): void {
    clean()
  }
  registry.destroyEvents.add(dispose)
  try {
    target.addEventListener(name, callback, options)
    // A custom target may synchronously destroy the player before adding the listener.
    if (!active || state.scope.closed || state.cleaning)
      clean(true)
    else if (signal?.aborted)
      dispose()
    else
      signal?.addEventListener('abort', dispose, { once: true })
  }
  catch (error) {
    try {
      clean(true)
    }
    catch (cleanupError) {
      console.warn('Failed to roll back event listener:', cleanupError)
    }
    throw error
  }
  return dispose
}

export function removeListener(registry: ListenerRegistry, dispose: Disposer): void {
  if (!registry.destroyEvents.has(dispose))
    return
  try {
    dispose()
    registry.destroyEvents.delete(dispose)
  }
  catch (error) {
    // Retain a failed removal so a later remove/destroy can retry it.
    console.warn('Failed to remove event listener:', error)
  }
}

export function destroyListeners(registry: ListenerRegistry): void {
  const state = stateOf(registry)
  if (state.cleaning)
    return
  state.cleaning = true
  try {
    for (const dispose of registry.destroyEvents) {
      try {
        dispose()
        registry.destroyEvents.delete(dispose)
      }
      catch (error) {
        console.warn('Failed to destroy event listener:', error)
      }
    }
  }
  finally {
    state.cleaning = false
  }
}
