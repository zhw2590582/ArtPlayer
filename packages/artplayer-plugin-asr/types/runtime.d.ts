import type { RuntimeFactory } from './artplayer-plugin-asr.js'

declare const artplayerPluginAsr: RuntimeFactory
// eslint-disable-next-line ts/no-redeclare -- Ambient merge exposes types on the CommonJS factory.
declare namespace artplayerPluginAsr {
  type AudioChunk = import('./artplayer-plugin-asr.js').AudioChunk
  type RuntimeFactory = import('./artplayer-plugin-asr.js').RuntimeFactory
  type RuntimeOption = import('./artplayer-plugin-asr.js').RuntimeOption
  type RuntimeResult = import('./artplayer-plugin-asr.js').RuntimeResult
}
export = artplayerPluginAsr
