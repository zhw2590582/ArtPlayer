import type { MediaHost } from '../media/hosts'
import type { PlaybackNotice } from '../media/playback'
import { def } from '../utils'

type RateHost = MediaHost<Pick<HTMLMediaElement, 'playbackRate'>> & PlaybackNotice

export default function playbackRateMix(art: RateHost): asserts art is RateHost & { playbackRate: number } {
  const { template: { $video }, i18n, notice } = art
  const target = art as RateHost & { playbackRate: number }
  def(art, 'playbackRate', {
    get() {
      return $video.playbackRate
    },
    set(rate: number) {
      if (rate) {
        if (rate === $video.playbackRate)
          return
        $video.playbackRate = rate
        notice.show = `${i18n.get('Rate')}: ${rate === 1.0 ? i18n.get('Normal') : `${rate}x`}`
      }
      else {
        target.playbackRate = 1
      }
    },
  })
}
