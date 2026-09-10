import type { MediaEventName, MediaEvents, MediaListener, MediaUI } from './types'
import { getScope, isClosing } from '../../lifecycle/instance'

export function listenMedia(art: MediaEvents, name: MediaEventName, callback: MediaListener, once = false): void {
  const guarded: MediaListener = (event) => {
    if (!isClosing(art))
      callback(event)
  }
  art[once ? 'once' : 'on'](name, guarded)
  getScope(art).add(() => {
    art.off(name, guarded)
  })
}

export function showMediaUI(art: MediaUI, changes: [keyof MediaUI, boolean][], active?: () => boolean): void {
  for (const [name, value] of changes) {
    if (isClosing(art) || (active && !active()))
      return
    art[name].show = value
  }
}
