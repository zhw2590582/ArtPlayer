import { getScope } from '../lifecycle/instance'
import { wait } from '../lifecycle/resources'
import { def, getExt } from '../utils'

export default function urlMix(art) {
  const {
    option,
    template: { $video },
  } = art

  def(art, 'url', {
    get() {
      return $video.src
    },
    async set(newUrl) {
      if (newUrl) {
        const oldUrl = art.url
        const typeName = option.type || getExt(newUrl)
        const typeCallback = option.customType[typeName]

        if (typeName && typeCallback) {
          if (!await wait(getScope(art)) || getScope(art).closed)
            return
          art.loading.show = true
          typeCallback.call(art, $video, newUrl, art)
        }
        else {
          URL.revokeObjectURL(oldUrl)
          $video.src = newUrl
        }

        if (oldUrl !== art.url) {
          art.option.url = newUrl
          if (art.isReady && oldUrl) {
            art.once('video:canplay', () => {
              art.emit('restart', newUrl)
            })
          }
        }
      }
      else {
        if (!await wait(getScope(art)) || getScope(art).closed)
          return
        art.loading.show = true
      }
    },
  })
}
