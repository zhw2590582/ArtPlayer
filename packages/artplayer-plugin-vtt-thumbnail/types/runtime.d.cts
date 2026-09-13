import type { RuntimeFactory } from './artplayer-plugin-vtt-thumbnail.js'

declare const artplayerPluginVttThumbnail: RuntimeFactory
// eslint-disable-next-line ts/no-redeclare -- Ambient merge exposes types on the CommonJS factory.
declare namespace artplayerPluginVttThumbnail {
  type Option = import('./artplayer-plugin-vtt-thumbnail.js').Option
  type Result = import('./artplayer-plugin-vtt-thumbnail.js').Result
  type Factory = import('./artplayer-plugin-vtt-thumbnail.js').Factory
  type RuntimeFactory = import('./artplayer-plugin-vtt-thumbnail.js').RuntimeFactory
}
export = artplayerPluginVttThumbnail
