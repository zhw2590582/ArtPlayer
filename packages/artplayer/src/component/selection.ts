import type { Cleanup } from '../lifecycle/scope'

const selections = new WeakMap<Event, () => boolean>()

export function trackSelection(event: Event, active: () => boolean): Cleanup {
  selections.set(event, active)
  return () => {
    if (selections.get(event) === active)
      selections.delete(event)
  }
}

export function captureSelection(event?: Event): () => boolean {
  return (event && selections.get(event)) || (() => true)
}
