import type { VolumeHost } from '../media/playback'
import { clamp, def } from '../utils'

export default function volumeMix(art: VolumeHost): asserts art is VolumeHost & Pick<HTMLMediaElement, 'volume' | 'muted'> {
  const { template: { $video }, i18n, notice, storage } = art
  def(art, 'volume', {
    get: () => $video.volume || 0,
    set: (percentage: number) => {
      $video.volume = clamp(percentage, 0, 1)
      notice.show = `${i18n.get('Volume')}: ${Number.parseInt(String($video.volume * 100), 10)}`
      if ($video.volume !== 0)
        storage.set('volume', $video.volume)
    },
  })
  def(art, 'muted', {
    get: () => $video.muted,
    set: (muted: boolean) => {
      $video.muted = muted
      art.emit('muted', muted)
    },
  })
}
