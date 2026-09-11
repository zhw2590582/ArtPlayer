import { clamp, getRect, isMobile, secondToTime } from '../../utils'

export type ProgressEvent = MouseEvent | TouchEvent
export interface ProgressPositionHost {
  template: { $progress: HTMLElement }
  duration: number
  isRotate: boolean
  top: number
  height: number
  seek: number | string
  emit: (name: 'setBar', kind: 'played', percentage: number, event: ProgressEvent) => unknown
}

export function getPosFromEvent(art: ProgressPositionHost, event: ProgressEvent) {
  const { $progress } = art.template
  const { left } = getRect($progress)
  const eventLeft = isMobile ? (event as TouchEvent).touches[0]!.clientX : (event as MouseEvent).clientX
  const width = clamp(eventLeft - left, 0, $progress.clientWidth)
  const second = (width / $progress.clientWidth) * art.duration
  const time = secondToTime(second)
  const percentage = clamp(width / $progress.clientWidth, 0, 1)
  return { second, time, width, percentage }
}

export function setCurrentTime(art: ProgressPositionHost, event: ProgressEvent, active: () => boolean = () => true) {
  if (!active())
    return
  if (art.isRotate) {
    const percentage = ((event as TouchEvent).touches[0]!.clientY - art.top) / art.height
    const second = percentage * art.duration
    if (!active())
      return
    art.emit('setBar', 'played', percentage, event)
    if (active())
      art.seek = second
  }
  else {
    const { second, percentage } = getPosFromEvent(art, event)
    if (!active())
      return
    art.emit('setBar', 'played', percentage, event)
    if (active())
      art.seek = second
  }
}
