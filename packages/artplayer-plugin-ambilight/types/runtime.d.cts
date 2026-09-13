import type { RuntimeFactory } from './artplayer-plugin-ambilight.js'

declare const artplayerPluginAmbilight: RuntimeFactory
// eslint-disable-next-line ts/no-redeclare -- Ambient merge exposes types on the CommonJS factory.
declare namespace artplayerPluginAmbilight {
  type Option = import('./artplayer-plugin-ambilight.js').Option
  type Result = import('./artplayer-plugin-ambilight.js').Result
  type RuntimeFactory = import('./artplayer-plugin-ambilight.js').RuntimeFactory
}
export = artplayerPluginAmbilight
