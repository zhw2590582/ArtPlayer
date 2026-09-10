import type { MediaEventHost, Reconnect } from './types'
import { isClosing } from '../../lifecycle/instance'
import { captureSource } from '../../source/operation'
import { isMobile, setStyle, silencePromise } from '../../utils'
import { listenMedia, showMediaUI } from './listen'

export function installEnded(art: MediaEventHost): void {
  const { option } = art
  listenMedia(art, 'video:ended', () => {
    if (option.loop) {
      const active = captureSource(art)
      art.seek = 0
      if (isClosing(art) || !active())
        return
      silencePromise(art.play())
      if (active())
        showMediaUI(art, [['controls', false], ['mask', false]], active)
    }
    else {
      showMediaUI(art, [['controls', true], ['mask', true]])
    }
  })
}

export function installPlaybackUI(art: MediaEventHost, reconnect: Reconnect): void {
  const { template: { $poster } } = art
  listenMedia(art, 'video:loadedmetadata', () => {
    art.emit('resize')
    if (isMobile)
      showMediaUI(art, [['loading', false], ['controls', true], ['mask', true]])
  })
  listenMedia(art, 'video:loadstart', () => {
    reconnect.loadStart()
    showMediaUI(art, [['loading', true], ['mask', false], ['controls', true]])
  })
  listenMedia(art, 'video:pause', () => {
    showMediaUI(art, [['controls', true], ['mask', true]])
  })
  listenMedia(art, 'video:play', () => {
    showMediaUI(art, [['mask', false]])
    if (!isClosing(art))
      setStyle($poster, 'display', 'none')
  })
  listenMedia(art, 'video:playing', () => showMediaUI(art, [['mask', false]]))
  listenMedia(art, 'video:progress', () => {
    if (art.playing)
      showMediaUI(art, [['loading', false]])
  })
  listenMedia(art, 'video:seeked', () => showMediaUI(art, [['loading', false], ['mask', true]]))
  listenMedia(art, 'video:seeking', () => showMediaUI(art, [['loading', true], ['mask', false]]))
  listenMedia(art, 'video:timeupdate', () => showMediaUI(art, [['mask', false]]))
  listenMedia(art, 'video:waiting', () => showMediaUI(art, [['loading', true], ['mask', false]]))
}
