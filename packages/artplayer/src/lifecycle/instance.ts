import ResourceScope, { ResourceCleanupError } from './scope'

interface LifecycleOwner {
  isDestroy: boolean
  reset: () => void
  emit: (name: 'destroy') => unknown
  template?: { $video?: unknown, destroy: (removeHtml: boolean) => void }
}

interface State {
  scope: ResourceScope
  destroying: boolean
  rollback?: () => void
  releaseContainer?: () => void
}

const states = new WeakMap<object, State>()
const containers = new WeakMap<Element, object>()

export function beginLifecycle(owner: object): void {
  states.set(owner, { scope: new ResourceScope(), destroying: false })
}

function stateOf(owner: object): State {
  const state = states.get(owner)
  if (!state)
    throw new Error('ArtPlayer lifecycle has not been initialized')
  return state
}

export function getScope(owner: object): ResourceScope {
  return stateOf(owner).scope
}

export function isClosing(owner: object): boolean {
  const state = stateOf(owner)
  return state.destroying || state.scope.closed
}

export function ownContainer(owner: object, container: Element, rollback: () => void): void {
  const current = containers.get(container)
  if (current && current !== owner)
    throw new Error('Cannot mount multiple instances on the same dom element')
  const state = stateOf(owner)
  state.rollback = rollback
  containers.set(container, owner)
  state.releaseContainer = () => {
    if (containers.get(container) === owner)
      containers.delete(container)
  }
}

export function finishLifecycle(owner: object): boolean {
  const state = stateOf(owner)
  state.rollback = undefined
  return !state.scope.closed
}

export function destroyInstance(owner: LifecycleOwner, instances: LifecycleOwner[], removeHtml: boolean, removeSource: boolean, failed = false): void {
  const state = stateOf(owner)
  if (state.destroying || state.scope.closed)
    return
  state.destroying = true
  const errors: unknown[] = []
  const attempt = (cleanup: () => void) => {
    try {
      cleanup()
    }
    catch (error) {
      errors.push(...(error instanceof ResourceCleanupError ? error.errors : [error]))
    }
  }
  if (removeSource && owner.template?.$video)
    attempt(() => owner.reset())
  attempt(() => state.scope.dispose())
  attempt(() => owner.template?.destroy(removeHtml))
  const index = instances.indexOf(owner)
  if (index !== -1)
    instances.splice(index, 1)
  owner.isDestroy = true
  if (!failed) {
    state.releaseContainer?.()
    state.releaseContainer = undefined
  }
  attempt(() => owner.emit('destroy'))
  if (failed && state.rollback)
    attempt(state.rollback)
  state.rollback = undefined
  state.releaseContainer?.()
  state.releaseContainer = undefined
  // Preserve the first thrown value while making additional failures observable.
  for (const error of errors.slice(1))
    console.warn('Additional ArtPlayer cleanup failure:', error)
  if (errors.length)
    throw errors[0]
}
