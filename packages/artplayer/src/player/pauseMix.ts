import type { PauseHost } from '../media/hosts'
import type { PlaybackMethods } from '../media/types'
import { def } from '../utils'

export default function pauseMix<Media extends Pick<PlaybackMethods, 'pause'>>(art: PauseHost<Media>): asserts art is PauseHost<Media> & { pause: () => ReturnType<Media['pause']> } {
  const {
    template: { $video },
    i18n,
    notice,
  } = art

  def(art, 'pause', {
    value() {
      const result = $video.pause()
      notice.show = i18n.get('Pause')
      art.emit('pause')
      return result
    },
  })
}
