import type { GestureHost } from '../input/gesture-types'
import type { PointerRegistry } from '../input/pointer-types'
import { gestureController } from '../input/gesture-controller'
import { isMobile } from '../utils/compatibility'

export default function gestureInit(art: GestureHost, events: Pick<PointerRegistry, 'proxy'>): void {
  if (!isMobile || art.option.isLive)
    return
  const { $video, $progress } = art.template
  const gesture = gestureController(art)
  const bind = (target: EventTarget) => {
    events.proxy(target, 'touchstart', event => gesture.start(target, event as TouchEvent))
    events.proxy(target, 'touchmove', event => gesture.move(event as TouchEvent))
    events.proxy(target, 'touchcancel', gesture.cancel)
  }
  if (art.option.gesture)
    bind($video)
  bind($progress)
}
