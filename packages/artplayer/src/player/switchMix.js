import { def, silencePromise } from '../utils'

export default function switchMix(art) {
  let switchSeq = 0

  function switchUrl(url, currentTime) {
    return new Promise((resolve, reject) => {
      if (url === art.url) {
        resolve()
        return
      }
      const id = ++switchSeq
      const { playing, aspectRatio, playbackRate } = art

      art.pause()
      art.url = url
      art.notice.show = ''

      const handlers = {}

      handlers.error = (error) => {
        if (id !== switchSeq)
          return
        art.off('video:canplay', handlers.canplay)
        art.off('video:loadedmetadata', handlers.metadata)
        reject(error)
      }

      handlers.metadata = () => {
        if (id !== switchSeq)
          return
        art.currentTime = currentTime
      }

      handlers.canplay = async () => {
        if (id !== switchSeq) {
          resolve()
          return
        }
        art.off('video:error', handlers.error)
        art.playbackRate = playbackRate
        art.aspectRatio = aspectRatio

        if (playing) {
          await silencePromise(art.play())
        }

        art.notice.show = ''

        resolve()
      }

      art.once('video:error', handlers.error)
      art.once('video:loadedmetadata', handlers.metadata)
      art.once('video:canplay', handlers.canplay)
    })
  }

  def(art, 'switchQuality', {
    value: (url) => {
      return switchUrl(url, art.currentTime)
    },
  })

  def(art, 'switchUrl', {
    value: (url) => {
      return switchUrl(url, 0)
    },
  })

  def(art, 'switch', {
    set: art.switchUrl,
  })
}
