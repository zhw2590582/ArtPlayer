import type { RuntimeFactory } from './artplayer-plugin-multiple-subtitles.js'

declare const artplayerPluginMultipleSubtitles: RuntimeFactory
// eslint-disable-next-line ts/no-redeclare -- Ambient merge exposes types on the CommonJS factory.
declare namespace artplayerPluginMultipleSubtitles {
  type Result = import('./artplayer-plugin-multiple-subtitles.js').Result
  type RuntimeFactory = import('./artplayer-plugin-multiple-subtitles.js').RuntimeFactory
  type RuntimeOption = import('./artplayer-plugin-multiple-subtitles.js').RuntimeOption
  type TrackOption = import('./artplayer-plugin-multiple-subtitles.js').TrackOption
}
export = artplayerPluginMultipleSubtitles
