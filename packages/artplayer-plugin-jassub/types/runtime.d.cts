import type { RuntimeFactory } from './runtime-api.js'

declare const artplayerPluginJassub: RuntimeFactory
// eslint-disable-next-line ts/no-redeclare -- Ambient merge exposes types on the CommonJS factory.
declare namespace artplayerPluginJassub {
  type FontSource = import('./runtime-api.js').FontSource
  type RuntimeOption = import('./runtime-api.js').RuntimeOption
  type AssEvent = import('./runtime-api.js').AssEvent
  type AssStyle = import('./runtime-api.js').AssStyle
  type AssEventInput = import('./runtime-api.js').AssEventInput
  type AssStyleInput = import('./runtime-api.js').AssStyleInput
  type WorkerRequestError = import('./runtime-api.js').WorkerRequestError
  type EventsCallback = import('./runtime-api.js').EventsCallback
  type StylesCallback = import('./runtime-api.js').StylesCallback
  type RuntimeEventMap = import('./runtime-api.js').RuntimeEventMap
  type RuntimeInstance = import('./runtime-api.js').RuntimeInstance
  type RuntimeResult = import('./runtime-api.js').RuntimeResult
  type RuntimeFactory = import('./runtime-api.js').RuntimeFactory
}
export = artplayerPluginJassub
