import type { PlayHost } from '../media/hosts'
import type { PlaybackMethods } from '../media/types'
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
      const result = await $video.play()
      notice.show = i18n.get('Play')
      art.emit('play')

      if (option.mutex) {
        for (let index = 0; index < instances.length; index++) {
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
