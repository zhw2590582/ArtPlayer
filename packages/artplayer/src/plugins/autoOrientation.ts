import type { OrientationHost } from '../display/orientation-types'
import { nativeOrientation } from '../display/orientation-native'
import { webOrientation } from '../display/orientation-web'
import { positiveSize } from '../display/sizing'
import { getScope } from '../lifecycle/instance'

export default function autoOrientation(art: OrientationHost): { name: string, readonly state: boolean } {
  const { $player, $video } = art.template
  const needRotate = () => {
    const media = { width: $video.videoWidth, height: $video.videoHeight }
    const viewport = $player.ownerDocument.documentElement
    const view = { width: viewport.clientWidth, height: viewport.clientHeight }
    return positiveSize(media) && positiveSize(view)
      && ((media.width > media.height && view.width < view.height) || (media.width < media.height && view.width > view.height))
  }
  const web = webOrientation(art, needRotate)
  const native = nativeOrientation(art, needRotate)
  art.on('fullscreenWeb', web)
  art.on('fullscreen', native)
  getScope(art).add(() => {
    art.off('fullscreenWeb', web)
    art.off('fullscreen', native)
  })
  return {
    name: 'autoOrientation',
    get state() {
      return $player.classList.contains('art-auto-orientation')
    },
  }
}
