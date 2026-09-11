/* eslint-disable ts/no-redeclare -- CommonJS callable export and named-type namespace intentionally merge. */
import type * as Definition from './artplayer-plugin-audio-track.js'

declare const artplayerPluginAudioTrack: typeof Definition.default

declare namespace artplayerPluginAudioTrack {
  type Option = Definition.Option
  type UpdateOption = Definition.UpdateOption
  type Result = Definition.Result
  type RuntimeResult = Definition.RuntimeResult
  type RuntimeFactory = Definition.RuntimeFactory
}

export = artplayerPluginAudioTrack
