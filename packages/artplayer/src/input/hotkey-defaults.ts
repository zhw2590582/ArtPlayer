import type { HotkeyCallback, HotkeyHost } from './hotkey-types'
import { silencePromise } from '../utils/error'

export function defaultHotkeys<Host extends HotkeyHost>(art: Host): Record<string, HotkeyCallback<Host>> {
  const { constructor } = art
  return {
    Escape: () => {
      if (art.fullscreenWeb)
        art.fullscreenWeb = false
    },
    Space: () => {
      silencePromise(art.toggle())
    },
    ArrowLeft: () => {
      art.backward = constructor.SEEK_STEP
    },
    ArrowUp: () => {
      art.volume += constructor.VOLUME_STEP
    },
    ArrowRight: () => {
      art.forward = constructor.SEEK_STEP
    },
    ArrowDown: () => {
      art.volume -= constructor.VOLUME_STEP
    },
  }
}
