// Generated from public/artplayer.cts by yarn build:types. Do not edit.
/* eslint-disable ts/no-redeclare -- Constructor, instance and named types share the export. */
import type * as Definition from './artplayer.js'

declare const Artplayer: typeof Definition.default
type Artplayer = Definition.default
declare namespace Artplayer {
  type Config = Definition.Config
  type Emitter<Events extends {
    [Name in keyof Events]: readonly unknown[];
  } = Record<PropertyKey, unknown[]>> = Definition.Emitter<Events>
  type Events = Definition.Events
  type I18n = Definition.I18n
  type Icons = Definition.Icons
  type Option = Definition.Option
  type OptionInput = Definition.OptionInput
  type Player = Definition.Player
  type PlaybackControls = Definition.PlaybackControls
  type PluginFactory<Host = Artplayer, Result = unknown> = Definition.PluginFactory<Host, Result>
  type Plugins = Definition.Plugins
  type Setting = Definition.Setting
  type SettingOption = Definition.SettingOption
  type Subtitle = Definition.Subtitle
  type SubtitleUpdateEvents = Definition.SubtitleUpdateEvents
  type Template = Definition.Template
  type Utils = Definition.Utils
}
export = Artplayer
