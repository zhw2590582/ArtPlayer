import type ResourceScope from '../lifecycle/scope'

const pauses = new WeakMap<ResourceScope, number>()

export function settingScopeActive(scope: ResourceScope): boolean {
  return !scope.closed && !pauses.get(scope)
}

export function pauseSettingScope(scope: ResourceScope): () => void {
  pauses.set(scope, (pauses.get(scope) || 0) + 1)
  let paused = true
  return () => {
    if (!paused)
      return
    paused = false
    const count = (pauses.get(scope) || 1) - 1
    if (count)
      pauses.set(scope, count)
    else
      pauses.delete(scope)
  }
}
