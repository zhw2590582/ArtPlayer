import type { Drag, GestureHost } from './gesture-types'
import { setCurrentTime } from '../control/progress/position'
import { getScope, isClosing } from '../lifecycle/instance'
import { captureSource } from '../source/operation'
import { clamp, secondToTime } from '../utils'
import { slideDirection } from './gesture-direction'

export function gestureController(art: GestureHost) {
  let drag: Drag | undefined
  const cancel = () => {
    drag = undefined
  }
  const active = (current: Drag) => drag === current && !isClosing(art) && !art.isLock
    && !art.option.isLive && art.isRotate === current.rotated && current.sourceActive()
  const onLock = (locked: boolean) => {
    if (locked)
      cancel()
  }
  art.on('document:touchend', cancel)
  art.on('document:touchcancel', cancel)
  art.on('lock', onLock)
  getScope(art).add(() => {
    cancel()
    art.off('document:touchend', cancel)
    art.off('document:touchcancel', cancel)
    art.off('lock', onLock)
  })

  const start = (target: EventTarget, event: TouchEvent) => {
    cancel()
    const touch = event.touches[0]
    if (isClosing(art) || art.isLock || art.option.isLive || event.touches.length !== 1 || !touch)
      return
    if (![touch.pageX, touch.pageY, touch.clientX, touch.clientY, art.currentTime].every(Number.isFinite))
      return
    const current: Drag = {
      target,
      identifier: touch.identifier,
      x: touch.pageX,
      y: touch.pageY,
      time: art.currentTime,
      rotated: art.isRotate,
      sourceActive: captureSource(art),
    }
    drag = current
    if (target === art.template.$progress) {
      const size = art.isRotate ? art.height : art.template.$progress.clientWidth
      if (!Number.isFinite(size) || size <= 0 || !Number.isFinite(art.duration) || art.duration <= 0) {
        cancel()
        return
      }
      try {
        setCurrentTime(art, event, () => active(current))
      }
      catch (error) {
        if (drag === current)
          cancel()
        throw error
      }
      if (active(current))
        current.time = art.currentTime
    }
  }

  const move = (event: TouchEvent) => {
    const current = drag
    const touch = event.touches[0]
    if (!current)
      return
    if (!active(current) || event.touches.length !== 1 || !touch || touch.identifier !== current.identifier) {
      cancel()
      return
    }
    const size = current.rotated ? art.height : art.width
    const multiplier = current.target === art.template.$video ? art.constructor.TOUCH_MOVE_RATIO : 1
    if (![touch.pageX, touch.pageY, size, art.duration, multiplier].every(Number.isFinite) || size <= 0 || art.duration <= 0) {
      cancel()
      return
    }
    const direction = slideDirection(current.x, current.y, touch.pageX, touch.pageY)
    if (!(current.rotated ? direction === 1 || direction === 2 : direction === 3 || direction === 4))
      return
    const distance = current.rotated ? touch.pageY - current.y : touch.pageX - current.x
    const ratio = clamp(distance / size, -1, 1)
    const time = clamp(current.time + art.duration * ratio * multiplier, 0, art.duration)
    art.seek = time
    if (!active(current))
      return
    art.emit('setBar', 'played', clamp(time / art.duration, 0, 1), event)
    if (active(current))
      art.notice.show = `${secondToTime(time)} / ${secondToTime(art.duration)}`
  }
  return { start, move, cancel }
}
