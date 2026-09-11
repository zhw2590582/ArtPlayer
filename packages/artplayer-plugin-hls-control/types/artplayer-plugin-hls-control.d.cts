/* eslint-disable ts/no-redeclare -- CommonJS callable export and named-type namespace intentionally merge. */
import type * as Definition from './artplayer-plugin-hls-control.js'

declare const artplayerPluginHlsControl: typeof Definition.default

declare namespace artplayerPluginHlsControl {
  type QualityLevel = Definition.QualityLevel
  type AudioTrack = Definition.AudioTrack
  type Config<Item extends object = object> = Definition.Config<Item>
  type Option<Level extends object = QualityLevel, Track extends object = AudioTrack> = Definition.Option<Level, Track>
  type Result = Definition.Result
}

export = artplayerPluginHlsControl
