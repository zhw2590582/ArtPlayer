import type { MediaHost } from '../media/hosts'
import type { MediaState } from '../media/types'
import { def } from '../utils'

export default function durationMix(art: MediaHost<Pick<MediaState, 'duration'>>): asserts art is MediaHost<Pick<MediaState, 'duration'>> & { readonly duration: number } {
  def(art, 'duration', {
    get: () => {
      const { duration } = art.template.$video
      if (duration === Infinity)
        return 0
      return duration || 0
    },
  })
}
