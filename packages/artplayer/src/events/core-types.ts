import type { UIEvents } from '../control/types'

// The emitter stays open to extension names. Known native events retain their
// payloads so subsystem subscriptions are checked against the assembled player.
export interface CoreEvents extends UIEvents, Record<PropertyKey, unknown[]> {
  [name: `video:${string}`]: [event: Event]
  'ready': []
  'error': [error: unknown, attempt: number]
  'fullscreenError': [error: unknown]
  'destroy': []
  'restart': [string]
  'focus': [Event]
  'lock': [boolean]
  'view': [boolean]
  'subtitleOffset': [number]
  'seek': [time: number, requestedTime: number | string]
  'document:click': [Event]
  'document:contextmenu': [Event]
  'document:keydown': [KeyboardEvent]
  'document:touchmove': [Event]
  'document:touchend': [Event]
  'document:touchcancel': [Event]
  'window:resize': [Event]
  'window:orientationchange': [Event]
  'window:scroll': [Event]
}

export interface CoreEmission<Names extends keyof CoreEvents = keyof CoreEvents> {
  emit: <Name extends Names>(name: Name, ...args: [...CoreEvents[Name]]) => unknown
}
