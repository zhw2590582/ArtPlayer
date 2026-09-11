import type * as Definition from './artplayer.js'

declare const Artplayer: typeof Definition.default
// eslint-disable-next-line ts/no-redeclare -- CJS constructor value and instance type share the export.
type Artplayer = Definition.default

// eslint-disable-next-line ts/no-redeclare, ts/no-namespace -- Namespace merging carries named types on the existing CJS export.
declare namespace Artplayer {
  type Config = Definition.Config
  type Emitter<Events extends { [Name in keyof Events]: readonly unknown[] } = Record<PropertyKey, unknown[]>> = Definition.Emitter<Events>
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

// eslint-disable-next-line no-restricted-syntax -- Preserve the real CommonJS constructor export.
export = Artplayer
