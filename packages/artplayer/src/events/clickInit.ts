import type { ClickHost, PointerRegistry } from '../input/pointer-types'
import { pointerFocus } from '../input/pointer-focus'
import { isClosing } from '../lifecycle/instance'
import { isMobile } from '../utils/compatibility'
import { silencePromise } from '../utils/error'

export default function clickInit(art: ClickHost, events: Pick<PointerRegistry, 'proxy'>): void {
  const { constructor, template: { $video } } = art
  pointerFocus(art)

  let clickTimes: number[] = []
  events.proxy($video, 'click', (event) => {
    if (isClosing(art))
      return
    const now = Date.now()
    clickTimes.push(now)
    const { MOBILE_CLICK_PLAY, DBCLICK_TIME, MOBILE_DBCLICK_PLAY, DBCLICK_FULLSCREEN } = constructor
    const clicks = clickTimes.filter(t => now - t <= DBCLICK_TIME)
    switch (clicks.length) {
      case 1:
        art.emit('click', event)
        if (isClosing(art))
          return
        if (!isMobile || (!art.isLock && MOBILE_CLICK_PLAY))
          silencePromise(art.toggle())
        clickTimes = clicks
        break
      case 2:
        art.emit('dblclick', event)
        if (isClosing(art))
          return
        if (isMobile) {
          if (!art.isLock && MOBILE_DBCLICK_PLAY)
            silencePromise(art.toggle())
        }
        else if (DBCLICK_FULLSCREEN) {
          art.fullscreen = !art.fullscreen
        }
        clickTimes = []
        break
      default:
        clickTimes = []
    }
  })
}
