import type { NativeFullscreenAdapter } from './types'
import screenfull from '../libs/screenfull'

interface MethodMap {
  requestFullscreen: string
  exitFullscreen: string
  fullscreenElement: string
  fullscreenEnabled: string
  fullscreenchange: string
  fullscreenerror: string
}

function call(target: object, name: string, ...args: unknown[]): unknown {
  const method: unknown = Reflect.get(target, name)
  if (typeof method !== 'function')
    throw new TypeError(`Fullscreen method ${name} is not available`)
  return method.apply(target, args)
}

export function fullscreenAdapter(target: HTMLElement): NativeFullscreenAdapter | undefined {
  // Reuse the audited vendor mapping, not its unscoped request-promise listeners.
  const raw = screenfull.raw as MethodMap | false
  const document = target.ownerDocument
  if (!raw || !Reflect.get(document, raw.fullscreenEnabled))
    return undefined
  return {
    document,
    target,
    get element(): Element | null {
      return Reflect.get(document, raw.fullscreenElement) as Element | null
    },
    elementProperty: raw.fullscreenElement,
    changeEvent: raw.fullscreenchange,
    errorEvent: raw.fullscreenerror,
    request: () => call(target, raw.requestFullscreen, undefined),
    exit: () => call(document, raw.exitFullscreen),
  }
}
