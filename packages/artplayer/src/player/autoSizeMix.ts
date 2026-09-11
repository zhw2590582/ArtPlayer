import type { AutoSizeHost } from '../display/sizing-types'
import { containSize, positiveSize } from '../display/sizing'
import { isClosing } from '../lifecycle/instance'
import { def, getRect } from '../utils'

export default function autoSizeMix(art: AutoSizeHost): void {
  const { $container, $player, $video } = art.template
  def(art, 'autoSize', {
    value() {
      if (isClosing(art))
        return
      const media = { width: $video.videoWidth, height: $video.videoHeight }
      if (!positiveSize(media))
        return
      const container = getRect($container)
      const size = containSize(container, media.width / media.height)
      if (!size || isClosing(art))
        return
      if (size.axis === 'width') {
        $player.style.width = `${(size.width / container.width) * 100}%`
        $player.style.height = '100%'
      }
      else {
        $player.style.width = '100%'
        $player.style.height = `${(size.height / container.height) * 100}%`
      }
      art.emit('autoSize', { width: art.width, height: art.height })
    },
  })
}
