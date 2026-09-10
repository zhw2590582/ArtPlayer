import type ResourceScope from '../lifecycle/scope'
import type { UrlTarget } from './types'
import { getScope, isClosing } from '../lifecycle/instance'

export interface SourceOperation {
  scope: ResourceScope
  assigned: boolean
  acceptingEvents: boolean
  onAssigned?: () => void
  onError?: (error: unknown) => void
  active: () => boolean
}

const current = new WeakMap<object, SourceOperation>()
const assignments = new WeakMap<object, SourceOperation>()

export function captureSource(owner: object): () => boolean {
  const operation = current.get(owner)
  return () => current.get(owner) === operation && (!operation || operation.active())
}

export function beginSource(owner: object): SourceOperation {
  const previous = current.get(owner)
  const scope = getScope(owner).child()
  const operation: SourceOperation = {
    scope,
    assigned: false,
    acceptingEvents: false,
    active: () => !isClosing(owner) && !scope.closed && current.get(owner) === operation,
  }
  current.set(owner, operation)
  scope.add(() => {
    if (current.get(owner) === operation)
      current.delete(owner)
    operation.onAssigned = undefined
    operation.onError = undefined
  })
  previous?.scope.dispose()
  return operation
}

export function takeAssignment(owner: object): SourceOperation {
  const operation = assignments.get(owner)
  assignments.delete(owner)
  return operation || beginSource(owner)
}

export function finishAssignment(operation: SourceOperation): void {
  operation.assigned = true
  const callback = operation.onAssigned
  operation.onAssigned = undefined
  if (operation.active())
    callback?.()
}

export function assignUrl(owner: UrlTarget, operation: SourceOperation, url: string): void {
  assignments.set(owner, operation)
  operation.acceptingEvents = true
  try {
    owner.url = url
  }
  finally {
    // Also support a host-provided URL setter without a core URL mixin.
    if (assignments.get(owner) === operation) {
      assignments.delete(owner)
      finishAssignment(operation)
    }
  }
}

export function failSource(operation: SourceOperation, error: unknown): void {
  if (!operation.active())
    return
  if (operation.onError)
    operation.onError(error)
  else
    console.warn('Failed to initialize ArtPlayer source:', error)
  operation.scope.dispose()
}
