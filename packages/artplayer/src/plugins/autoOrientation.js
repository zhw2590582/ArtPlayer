import { addClass, hasClass, removeClass, setStyle } from '../utils'

export default function autoOrientation(art) {
  const {
    notice,
    constructor,
    template: { $player, $video },
  } = art

  const WEB_CLASS = 'art-auto-orientation'
  const FS_CLASS = 'art-auto-orientation-fullscreen'
  let fsLocked = false

  function applyWebRotate() {
    const viewWidth = document.documentElement.clientWidth
    const viewHeight = document.documentElement.clientHeight
    setStyle($player, 'width', `${viewHeight}px`)
    setStyle($player, 'height', `${viewWidth}px`)
    setStyle($player, 'transform-origin', '0 0')
    setStyle($player, 'transform', `rotate(90deg) translate(0, -${viewWidth}px)`)
    addClass($player, WEB_CLASS)
    art.isRotate = true
    art.emit('resize')
  }

  function clearWebRotate() {
    setStyle($player, 'width', '')
    setStyle($player, 'height', '')
    setStyle($player, 'transform-origin', '')
    setStyle($player, 'transform', '')
    removeClass($player, WEB_CLASS)
    art.isRotate = false
    art.emit('resize')
  }

  function needRotate() {
    const { videoWidth, videoHeight } = $video
    const vw = document.documentElement.clientWidth
    const vh = document.documentElement.clientHeight
    return (videoWidth > videoHeight && vw < vh) || (videoWidth < videoHeight && vw > vh)
  }

  art.on('fullscreenWeb', (state) => {
    if (state) {
      if (needRotate()) {
        const delay = Number(constructor.AUTO_ORIENTATION_TIME ?? 0)
        setTimeout(() => {
          if (art.fullscreenWeb && !hasClass($player, WEB_CLASS)) {
            applyWebRotate()
          }
        }, delay)
      }
    }
    else {
      if (hasClass($player, WEB_CLASS))
        clearWebRotate()
    }
  })

  art.on('fullscreen', async (state) => {
    const canLock = !!screen?.orientation?.lock

    if (state) {
      if (canLock && needRotate()) {
        try {
          const last = screen.orientation.type
          const opposite = last.startsWith('portrait') ? 'landscape' : 'portrait'
          await screen.orientation.lock(opposite)
          fsLocked = true
          addClass($player, FS_CLASS)
        }
        catch (err) {
          fsLocked = false
          notice.show = err
        }
      }
    }
    else {
      if (hasClass($player, FS_CLASS)) {
        removeClass($player, FS_CLASS)
      }
      if (canLock && fsLocked) {
        try {
          screen.orientation.unlock()
        }
        catch { }
        fsLocked = false
      }
    }
  })

  return {
    name: 'autoOrientation',
    get state() {
      return hasClass($player, WEB_CLASS)
    },
  }
}
