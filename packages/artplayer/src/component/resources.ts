import type ResourceScope from '../lifecycle/scope'
import type { ComponentHost } from './types'
import { getScope } from '../lifecycle/instance'

const scopes = new WeakMap<HTMLElement, ResourceScope>()

export function ownEntry(art: ComponentHost, element: HTMLElement): ResourceScope {
  const scope = getScope(art).child()
  scopes.set(element, scope)
  return scope
}

export function entryScope(element: HTMLElement): ResourceScope {
  const scope = scopes.get(element)
  if (!scope)
    throw new Error('ArtPlayer component has not been registered')
  return scope
}

export function releaseEntry(element: HTMLElement): void {
  scopes.get(element)?.dispose()
}

export function proxyEntry<Name extends keyof HTMLElementEventMap>(art: ComponentHost, element: HTMLElement, target: EventTarget, name: Name, callback: (event: HTMLElementEventMap[Name]) => unknown): () => void {
  const scope = entryScope(element)
  if (scope.closed)
    return () => {}
  const cleanup = art.events.proxy(target, name, (event) => {
    if (!scope.closed)
      return callback(event as HTMLElementEventMap[Name])
  })
  return scope.add(() => {
    art.events.remove(cleanup)
  })
}

export interface SubscriptionHost<Events extends { [Name in keyof Events]: readonly unknown[] }> {
  on: <Name extends keyof Events>(name: Name, callback: (...args: [...Events[Name]]) => unknown) => unknown
  off: <Name extends keyof Events>(name: Name, callback: (...args: [...Events[Name]]) => unknown) => unknown
}

export function subscribeEntry<Events extends { [Name in keyof Events]: readonly unknown[] }, Name extends keyof Events>(art: SubscriptionHost<Events>, element: HTMLElement, name: Name, callback: (...args: [...Events[Name]]) => unknown): void {
  const scope = entryScope(element)
  if (scope.closed)
    return
  const guarded = (...args: [...Events[Name]]) => {
    if (!scope.closed)
      return callback(...args)
  }
  art.on(name, guarded)
  scope.add(() => {
    art.off(name, guarded)
  })
}
