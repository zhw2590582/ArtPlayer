import type { RuntimeFactory } from './runtime-api.js'

declare const artplayerPluginAutoThumbnail: RuntimeFactory
// eslint-disable-next-line ts/no-redeclare -- Ambient merge exposes types on the CommonJS factory.
declare namespace artplayerPluginAutoThumbnail {
  type Option = import('./runtime-api.js').Option
  type Result = import('./runtime-api.js').Result
  type Factory = import('./runtime-api.js').Factory
  type RuntimeFactory = import('./runtime-api.js').RuntimeFactory
}
export = artplayerPluginAutoThumbnail
