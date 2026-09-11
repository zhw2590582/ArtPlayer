import type { MediaHost } from '../media/hosts'
import type { Position } from '../media/playback'
import { advancePosition } from '../media/position-revision'
import { clamp, def } from '../utils'

export default function currentTimeMix(art: MediaHost<Pick<HTMLMediaElement, 'currentTime'>> & Pick<Position, 'duration'>): asserts art is typeof art & Position {
  const { $video } = art.template
  def(art, 'currentTime', {
    get: () => $video.currentTime || 0,
    set: (time: number | string) => {
      // parseFloat performs the historical JS coercion; a cast must not change it.
      const parsed = Number.parseFloat(time as string)
      if (Number.isNaN(parsed))
        return
      advancePosition(art)
      $video.currentTime = clamp(parsed, 0, art.duration)
    },
  })
}
