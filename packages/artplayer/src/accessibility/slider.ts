import type ResourceScope from '../lifecycle/scope'
import { listen } from '../lifecycle/resources'
import { claimKey, plainKey } from './keyboard'

interface Range {
  min: number
  max: number
  value: number
  step: number
  text: (value: number) => string
}

const directions = new Map([['ArrowRight', 1], ['ArrowUp', 1], ['ArrowLeft', -1], ['ArrowDown', -1], ['PageUp', 10], ['PageDown', -10]])

export function keyboardSlider(scope: ResourceScope, element: HTMLElement, label: string, read: () => Range, write: (value: number) => void, orientation = 'horizontal'): () => void {
  const valid = (range: Range) => [range.min, range.max, range.value, range.step].every(Number.isFinite) && range.max > range.min && range.step > 0
  const clamp = (value: number, range: Range) => Math.min(range.max, Math.max(range.min, value))
  const update = () => {
    if (scope.closed)
      return
    const range = read()
    const enabled = valid(range)
    const value = enabled ? clamp(range.value, range) : 0
    element.setAttribute('aria-disabled', String(!enabled))
    element.setAttribute('aria-valuemin', String(enabled ? range.min : 0))
    element.setAttribute('aria-valuemax', String(enabled ? range.max : 0))
    element.setAttribute('aria-valuenow', String(value))
    element.setAttribute('aria-valuetext', range.text(value))
  }
  if (scope.closed)
    return update
  element.setAttribute('role', 'slider')
  element.tabIndex = 0
  element.setAttribute('aria-label', label)
  element.setAttribute('aria-orientation', orientation)
  listen(scope, element, 'keydown', (value) => {
    const event = value as KeyboardEvent
    if ((event.composedPath()[0] || event.target) !== element || !plainKey(event) || event.defaultPrevented)
      return
    const direction = directions.get(event.key)
    if (direction === undefined && event.key !== 'Home' && event.key !== 'End')
      return
    claimKey(event)
    const range = read()
    if (!valid(range)) {
      update()
      return
    }
    const next = event.key === 'Home' ? range.min : event.key === 'End' ? range.max : clamp(range.value, range) + direction! * range.step
    write(clamp(next, range))
    update()
  })
  update()
  return update
}
