import type { PlayHost } from '../media/hosts'
import type { PlaybackMethods } from '../media/types'
import { captureSourcePlayback, requestSourcePlayback } from '../source/operation'
import { def } from '../utils'

export default function playMix<Media extends Pick<PlaybackMethods, 'play'>>(art: PlayHost<Media>): asserts art is PlayHost<Media> & { play: () => Promise<Awaited<ReturnType<Media['play']>>> } {
  const {
    i18n,
    notice,
    option,
    constructor: { instances },
    template: { $video },
  } = art

  def(art, 'play', {
    async value() {
      requestSourcePlayback(art, true)
      const active = captureSourcePlayback(art)
      const result = await $video.play()
      if (!active())
        return result
      const message = i18n.get('Play')
      if (!active())
        return result
      notice.show = message
      if (!active())
        return result
      art.emit('play')

      if (option.mutex) {
        for (let index = 0; index < instances.length; index++) {
          if (!active())
            break
          const instance = instances[index]!
          if (instance !== art) {
            instance.pause()
          }
        }
      }

      return result
    },
  })
}
