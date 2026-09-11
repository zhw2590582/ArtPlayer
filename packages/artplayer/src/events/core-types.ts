import type { Events } from '../../types/runtime/events'

// The emitter stays open to extension names. Known native events retain their
// payloads so subsystem subscriptions are checked against the assembled player.
export interface CoreEvents extends Events {}

export interface CoreEmission<Names extends keyof CoreEvents = keyof CoreEvents> {
  emit: <Name extends Names>(name: Name, ...args: [...CoreEvents[Name]]) => unknown
}
