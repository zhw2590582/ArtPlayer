import type { MediaHost } from '../media/hosts'
import type { MediaState } from '../media/types'
import { def } from '../utils'

export default function playingMix(art: MediaHost<Omit<MediaState, 'duration'>>): asserts art is MediaHost<Omit<MediaState, 'duration'>> & { readonly playing: boolean } {
  const { $video } = art.template
  def(art, 'playing', {
    get: () => {
      if (typeof $video.playing === 'boolean')
        return $video.playing
      return !!($video.currentTime > 0 && !$video.paused && !$video.ended && $video.readyState > 2)
    },
  })
}
