import type { AutoHeightHost } from '../display/sizing-types'
import { proportionalHeight } from '../display/sizing'
import { isClosing } from '../lifecycle/instance'
import { def } from '../utils'

export default function autoHeightMix(art: AutoHeightHost): void {
  const { $container, $video } = art.template
  def(art, 'autoHeight', {
    value() {
      if (isClosing(art))
        return
      const height = proportionalHeight($container.clientWidth, { width: $video.videoWidth, height: $video.videoHeight })
      if (height === undefined || isClosing(art))
        return
      $container.style.height = `${height}px`
      art.emit('autoHeight', height)
    },
  })
}
