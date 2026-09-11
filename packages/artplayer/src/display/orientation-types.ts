import type { SubscriptionHost } from '../component/resources'

export interface OrientationHost extends SubscriptionHost<{ fullscreenWeb: [boolean], fullscreen: [boolean] }> {
  constructor: { AUTO_ORIENTATION_TIME?: number }
  template: { $player: HTMLElement, $video: { readonly videoWidth: number, readonly videoHeight: number } }
  fullscreenWeb: boolean
  isRotate: boolean
  notice: { set show(value: unknown) }
  emit: (name: 'resize') => unknown
}

export interface OrientationLock {
  readonly type: string
  lock: (mode: 'portrait' | 'landscape') => Promise<void>
  unlock: () => void
}
