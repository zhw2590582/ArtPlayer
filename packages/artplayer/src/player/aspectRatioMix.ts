import type { AspectRatioHost } from '../display/sizing-types'
import { containSize } from '../display/sizing'
import { isClosing } from '../lifecycle/instance'
import { def } from '../utils'

export default function aspectRatioMix(art: AspectRatioHost): void {
  const { i18n, notice, template: { $video, $player } } = art
  def(art, 'aspectRatio', {
    get: () => $player.dataset.aspectRatio || 'default',
    set(ratio: string) {
      if (isClosing(art))
        return
      if (!ratio)
        ratio = 'default'
      if (ratio === 'default') {
        $video.style.width = ''
        $video.style.height = ''
        $video.style.margin = ''
        delete $player.dataset.aspectRatio
      }
      else {
        // Keep the legacy split/Number coercion and dataset even for invalid ratios.
        const parts = ratio.split(':').map(Number)
        const size = containSize({ width: $player.clientWidth, height: $player.clientHeight }, parts[0]! / parts[1]!)
        if (isClosing(art))
          return
        if (size?.axis === 'width') {
          $video.style.width = `${size.width}px`
          $video.style.height = '100%'
          $video.style.margin = '0 auto'
        }
        else if (size) {
          $video.style.width = '100%'
          $video.style.height = `${size.height}px`
          $video.style.margin = 'auto 0'
        }
        $player.dataset.aspectRatio = ratio
      }
      notice.show = `${i18n.get('Aspect Ratio')}: ${ratio === 'default' ? i18n.get('Default') : ratio}`
      if (!isClosing(art))
        art.emit('aspectRatio', ratio)
    },
  })
}
