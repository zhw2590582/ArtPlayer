import type { AudioPort } from './engine-ports'
import type EventTarget from './EventTarget'

// Exact coordinator-facing port; implementation migration and decoder ownership are MB-06.
declare const AudioEngine: new (events: EventTarget) => AudioPort
export default AudioEngine
