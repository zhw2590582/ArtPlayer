import type { RuntimeFactory } from './runtime-api.js'

declare const artplayerPluginVast: RuntimeFactory
// eslint-disable-next-line ts/no-redeclare -- Ambient merge exposes types on the CommonJS factory.
declare namespace artplayerPluginVast {
  type ArtplayerPluginVastInstance = import('./runtime-api.js').ArtplayerPluginVastInstance
  type ArtplayerPluginVastOption = import('./runtime-api.js').ArtplayerPluginVastOption
  type CompatibilityOptions = import('./runtime-api.js').CompatibilityOptions
  type Context = import('./runtime-api.js').Context
  type PublishedContext = import('./runtime-api.js').PublishedContext
  type Registration = import('./runtime-api.js').Registration
  type RequestConfig = import('./runtime-api.js').RequestConfig
  type RuntimeCallback<T extends RuntimeContext = RuntimeContext> = import('./runtime-api.js').RuntimeCallback<T>
  type RuntimeContext = import('./runtime-api.js').RuntimeContext
  type RuntimeFactory = import('./runtime-api.js').RuntimeFactory
  type RuntimeResult = import('./runtime-api.js').RuntimeResult
  type WorkspaceContext = import('./runtime-api.js').WorkspaceContext
}
export = artplayerPluginVast
