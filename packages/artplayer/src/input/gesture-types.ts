import type { SubscriptionHost } from '../component/resources'
import type { ProgressPositionHost } from '../control/progress/position'

export interface GestureHost extends ProgressPositionHost, SubscriptionHost<{
  'document:touchend': [Event]
  'document:touchcancel': [Event]
  'lock': [boolean]
}> {
  template: { $video: EventTarget, $progress: HTMLElement }
  option: { isLive: boolean, gesture: boolean }
  constructor: { TOUCH_MOVE_RATIO: number }
  isLock: boolean
  width: number
  currentTime: number
  notice: { show: string }
}

export interface Drag {
  target: EventTarget
  identifier: number
  x: number
  y: number
  time: number
  rotated: boolean
  sourceActive: () => boolean
}
