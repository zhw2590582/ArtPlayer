import type ResourceScope from '../lifecycle/scope'
import type { SettingEvents, SettingHost, SettingItem, SettingManager } from './types'
import { getScope, isClosing } from '../lifecycle/instance'
import { ResourceCleanupError } from '../lifecycle/scope'
import { pauseSettingScope, settingScopeActive } from './activity'
import { hasTreeBinding, treeBinding } from './model'
import { releaseSettingPanel } from './panels'

const scopes = new WeakMap<SettingItem, ResourceScope>()
const owners = new WeakMap<SettingItem, ResourceScope>()
const eventLists = new WeakMap<ResourceScope, (() => void)[]>()

function releaseEvents(art: SettingHost, events: (() => void)[]): void {
  const pending = events.splice(0)
  const failures: unknown[] = []
  for (const cleanup of pending) {
    try {
      art.events.remove(cleanup)
    }
    catch (error) {
      failures.push(error)
    }
  }
  if (failures.length)
    throw new ResourceCleanupError(failures)
}

export function ownSettingItem(art: SettingHost, item: SettingItem, owner = getScope(art)): ResourceScope {
  const previous = scopes.get(item)
  if (!previous || settingScopeActive(previous) || previous.closed)
    releaseSettingItem(art, item)
  const scope = owner.child()
  scopes.set(item, scope)
  owners.set(item, owner)
  eventLists.set(scope, treeBinding(item).events)
  scope.add(() => {
    releaseEvents(art, eventLists.get(scope)!)
  })
  return scope
}

export function settingItemOwner(item: SettingItem): ResourceScope | undefined {
  return owners.get(item)
}

export function settingScope(item: SettingItem): ResourceScope {
  const scope = scopes.get(item)
  if (!scope)
    throw new Error('Setting item has not been rendered')
  return scope
}

export function releaseSettingItem(art: SettingHost, item: SettingItem): void {
  const scope = scopes.get(item)
  if (scope && !scope.closed)
    scope.dispose()
  else if (hasTreeBinding(item))
    releaseEvents(art, treeBinding(item).events)
}

export interface SettingSuspension {
  resume: () => void
  dispose: () => void
}

export function suspendSettingItem(art: SettingHost, item: SettingItem): SettingSuspension | undefined {
  const previous = scopes.get(item)
  if (!previous || previous.closed)
    return
  if (!settingScopeActive(previous))
    throw new Error('Setting item update is already in progress')
  const owner = owners.get(item)!
  const events = treeBinding(item).events
  const saved = events.splice(0)
  eventLists.set(previous, saved)
  const unpause = pauseSettingScope(previous)
  let pending = true
  return {
    resume() {
      if (!pending)
        return
      pending = false
      const failures: unknown[] = []
      const current = scopes.get(item)
      for (const cleanup of [() => {
        if (current && current !== previous)
          current.dispose()
      }, () => releaseEvents(art, events)]) {
        try {
          cleanup()
        }
        catch (error) {
          if (error instanceof ResourceCleanupError)
            failures.push(...error.errors)
          else
            failures.push(error)
        }
      }
      if (!previous.closed && !isClosing(art)) {
        events.push(...saved.splice(0))
        eventLists.set(previous, events)
        scopes.set(item, previous)
        owners.set(item, owner)
      }
      unpause()
      if (failures.length)
        throw new ResourceCleanupError(failures)
    },
    dispose() {
      if (!pending)
        return
      pending = false
      try {
        previous.dispose()
      }
      finally {
        unpause()
      }
    },
  }
}

export function proxySetting(art: SettingHost, item: SettingItem, target: EventTarget, name: string, callback: (event: Event) => unknown, owner?: ResourceScope): void {
  const scope = owner || settingScope(item)
  if (!settingScopeActive(scope) || isClosing(art))
    return
  const event = art.proxy(target, name, (event) => {
    if (settingScopeActive(scope) && !isClosing(art)) {
      try {
        return callback(event)
      }
      catch (error) {
        console.warn('ArtPlayer setting callback failed:', error)
      }
    }
  })
  if (!settingScopeActive(scope) || isClosing(art)) {
    art.events.remove(event)
  }
  else {
    treeBinding(item).events.push(event)
    if (owner && owner !== scopes.get(item)) {
      owner.add(() => {
        const events = treeBinding(item).events
        const index = events.indexOf(event)
        if (index >= 0) {
          events.splice(index, 1)
          art.events.remove(event)
        }
      })
    }
  }
}

export function subscribeSetting<Name extends keyof SettingEvents>(art: SettingHost, item: SettingItem, name: Name, callback: (...args: SettingEvents[Name]) => unknown): void {
  const scope = settingScope(item)
  if (!settingScopeActive(scope) || isClosing(art))
    return
  const guarded = (...args: SettingEvents[Name]) => {
    if (settingScopeActive(scope) && !isClosing(art))
      return callback(...args)
  }
  art.on(name, guarded)
  scope.add(() => {
    art.off(name, guarded)
  })
}

export function releaseSettingTree(setting: SettingManager, item: SettingItem): void {
  const failures: unknown[] = []
  const visited = new Set<SettingItem>()
  const visit = (item: SettingItem) => {
    if (visited.has(item))
      return
    visited.add(item)
    for (const child of item.selector || [])
      visit(child)
    if (item.selector) {
      const panel = setting.cache.get(item.selector)
      setting.cache.delete(item.selector)
      try {
        if (panel)
          releaseSettingPanel(panel)
      }
      catch (error) {
        failures.push(error)
      }
    }
    try {
      releaseSettingItem(setting.art, item)
    }
    catch (error) {
      if (error instanceof ResourceCleanupError)
        failures.push(...error.errors)
      else
        failures.push(error)
    }
  }
  visit(item)
  if (failures.length)
    throw new ResourceCleanupError(failures)
}
