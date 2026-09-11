import type { FullscreenHost } from '../display/types'
import { fullscreenAdapter } from '../display/fullscreen-adapter'
import { nativeFullscreen } from '../display/native-fullscreen'
import { videoFullscreen } from '../display/video-fullscreen'
import { getScope, isClosing } from '../lifecycle/instance'
import { def, get } from '../utils'

export default function fullscreenMix(art: FullscreenHost): void {
  const { i18n, notice, template: { $video, $player } } = art
  const metadata = () => {
    if (isClosing(art))
      return
    const adapter = fullscreenAdapter($player)
    if (adapter) {
      def(art, 'fullscreen', nativeFullscreen(art, adapter))
    }
    else if ($video.webkitSupportsFullscreen && typeof $video.webkitEnterFullscreen === 'function' && typeof $video.webkitExitFullscreen === 'function') {
      def(art, 'fullscreen', videoFullscreen(art))
    }
    else {
      def(art, 'fullscreen', {
        get: () => false,
        set() {
          if (!isClosing(art))
            notice.show = i18n.get('Fullscreen Not Supported')
        },
      })
    }
    def(art, 'fullscreen', get(art, 'fullscreen')!)
  }
  art.once('video:loadedmetadata', metadata)
  getScope(art).add(() => {
    art.off('video:loadedmetadata', metadata)
  })
}
