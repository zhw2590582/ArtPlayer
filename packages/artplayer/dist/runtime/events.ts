import type { Events as LegacyEvents } from '../events'
import type { SubtitleCue, SubtitleOption } from './subtitle'

type NativeEvents = { [Name in Extract<keyof LegacyEvents, `video:${string}`>]: [event: Event] }

interface BuiltinEvents {
  [name: `video:${string}`]: [event: Event]
  'document:keydown': [KeyboardEvent]
  'document:mousemove': [MouseEvent]
  'document:mouseup': [MouseEvent]
  'mousemove': [MouseEvent]
  'click': [MouseEvent]
  'blur': [Event]
  'error': [error: unknown, attempt: number]
  'fullscreenError': [error: unknown]
  'aspectRatio': [string]
  'flip': [string]
  'seek': [time: number, requestedTime: number | string]
  'setBar': [type: string, percentage: number, event?: MouseEvent | TouchEvent]
  'subtitleBeforeUpdate': [cues: SubtitleCue[]]
  'subtitleAfterUpdate': [cues: SubtitleCue[]]
  'subtitleLoad': [cues: SubtitleCue[], option: SubtitleOption | null]
}

/** Legacy custom event augmentation is retained; builtin payload corrections take precedence. */
export interface Events extends Omit<LegacyEvents, keyof BuiltinEvents>, NativeEvents, BuiltinEvents, Record<PropertyKey, unknown[]> {}
