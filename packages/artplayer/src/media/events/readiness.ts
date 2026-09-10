import type { MediaEventHost, Reconnect } from './types'
import { isClosing } from '../../lifecycle/instance'
import { listenMedia, showMediaUI } from './listen'

export function installReadiness(art: MediaEventHost, reconnect: Reconnect): void {
  listenMedia(art, 'video:canplay', () => {
    reconnect.reset()
    showMediaUI(art, [['loading', false]])
  })
  listenMedia(art, 'video:canplay', () => {
    showMediaUI(art, [['loading', false], ['controls', true], ['mask', true]])
    if (isClosing(art))
      return
    art.isReady = true
    art.emit('ready')
  }, true)
}
