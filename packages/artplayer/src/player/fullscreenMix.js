import screenfull from '../libs/screenfull'
import { addClass, def, removeClass } from '../utils'

export default function fullscreenMix(art) {
  const {
    i18n,
    notice,
    template: { $video, $player },
  } = art

  const nativeScreenfull = (art) => {
    const onChange = () => {
      art.emit('fullscreen', art.fullscreen)

      if (art.fullscreen) {
        art.state = 'fullscreen'
        addClass($player, 'art-fullscreen')
      }
      else {
        removeClass($player, 'art-fullscreen')
      }

      art.emit('resize')
    }

    art.events.proxy(document, screenfull.raw.fullscreenchange, onChange)
    art.events.proxy(document, screenfull.raw.fullscreenerror, (event) => {
      art.emit('fullscreenError', event)
    })

    def(art, 'fullscreen', {
      get() {
        return document[screenfull.raw.fullscreenElement] === $player
      },
      async set(value) {
        try {
          if (value) {
            await screenfull.request($player)
          }
          else {
            await screenfull.exit()
          }
        }
        catch (error) {
          art.emit('fullscreenError', error)
        }
      },
    })
  }

  const webkitScreenfull = (art) => {
    art.on('document:webkitfullscreenchange', () => {
      art.emit('fullscreen', art.fullscreen)
      art.emit('resize')
    })

    def(art, 'fullscreen', {
      get() {
        return document.fullscreenElement === $video
      },
      set(value) {
        if (value) {
          art.state = 'fullscreen'
          $video.webkitEnterFullscreen()
        }
        else {
          $video.webkitExitFullscreen()
        }
      },
    })
  }

  art.once('video:loadedmetadata', () => {
    if (screenfull.isEnabled) {
      nativeScreenfull(art)
    }
    else if ($video.webkitSupportsFullscreen) {
      webkitScreenfull(art)
    }
    else {
      def(art, 'fullscreen', {
        get() {
          return false
        },
        set() {
          notice.show = i18n.get('Fullscreen Not Supported')
        },
      })
    }
  })
}
