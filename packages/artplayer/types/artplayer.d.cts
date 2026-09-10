import type * as Definition from './artplayer.js'

declare const Artplayer: typeof Definition.default
type Artplayer = Definition.default

declare namespace Artplayer {
  type Config = Definition.Config
  type Events = Definition.Events
  type I18n = Definition.I18n
  type Icons = Definition.Icons
  type Option = Definition.Option
  type Player = Definition.Player
  type Setting = Definition.Setting
  type SettingOption = Definition.SettingOption
  type Subtitle = Definition.Subtitle
  type Template = Definition.Template
  type Utils = Definition.Utils
}

export = Artplayer
