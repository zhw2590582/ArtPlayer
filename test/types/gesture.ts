import type { GestureHost } from '../../packages/artplayer/src/input/gesture-types'
import type Artplayer from '../../packages/artplayer/types/artplayer'
import { gestureController } from '../../packages/artplayer/src/input/gesture-controller'

declare const art: Artplayer
declare const host: GestureHost
const gesture = gestureController(host)
gesture.start(host.template.$video, new TouchEvent('touchstart'))
gesture.move(new TouchEvent('touchmove'))
gesture.cancel()
// @ts-expect-error Gesture input requires touch coordinates and identifiers.
gesture.move(new MouseEvent('mousemove'))
art.on('document:touchcancel', (event) => {
  const original: Event = event
  return original
})
