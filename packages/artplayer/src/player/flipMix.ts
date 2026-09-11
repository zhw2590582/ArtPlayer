import type { FlipHost } from '../display/sizing-types'
import { isClosing } from '../lifecycle/instance'
import { capitalize, def } from '../utils'

export default function flipMix(art: FlipHost): void {
  const { template: { $player }, i18n, notice } = art
  def(art, 'flip', {
    get: () => $player.dataset.flip || 'normal',
    set(flip: string) {
      if (isClosing(art))
        return
      if (!flip)
        flip = 'normal'
      if (flip === 'normal')
        delete $player.dataset.flip
      else
        $player.dataset.flip = flip
      notice.show = `${i18n.get('Video Flip')}: ${i18n.get(capitalize(flip))}`
      if (!isClosing(art))
        art.emit('flip', flip)
    },
  })
}
