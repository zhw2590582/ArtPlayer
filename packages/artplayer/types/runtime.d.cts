// Generated from public/runtime.cts by yarn build:types. Do not edit.
/* eslint-disable ts/no-redeclare -- Constructor, instance and named types share the export. */
import type * as Definition from './runtime.js'

declare const Artplayer: typeof Definition.default
type Artplayer = Definition.default
declare namespace Artplayer {
  type ArtplayerConstructor = Definition.ArtplayerConstructor
  type OptionInput = Definition.OptionInput
  type Option = Definition.Option
  type Events = Definition.Events
  type Plugins = Definition.Plugins
  type PluginFactory<Result = unknown> = Definition.PluginFactory<Result>
  type PluginHost = Definition.PluginHost
  type ProxyHost = Definition.ProxyHost
  type CustomTypeHost = Definition.CustomTypeHost
  type LayerHost = Definition.LayerHost
  type ControlHost = Definition.ControlHost
  type ContextmenuHost = Definition.ContextmenuHost
  type PluginRegistration<Result, Registry> = Definition.PluginRegistration<Result, Registry>
  type Component = Definition.Component
  type Controls = Definition.Controls
  type Setting = Definition.Setting
  type Subtitle = Definition.Subtitle
  type Notice = Definition.Notice
  type Utils = Definition.Utils
  type MediaSurface = Definition.MediaSurface
  type NativeMedia = Definition.NativeMedia
  type CanvasMedia = Definition.CanvasMedia
  type Player<Media extends MediaSurface = MediaSurface> = Definition.Player<Media>
  type Template<Host = Artplayer, Media extends MediaSurface = MediaSurface> = Definition.Template<Host, Media>
  type Icons = Definition.Icons
  type Config = Definition.Config
  type EventRegistry = Definition.EventRegistry
  type Storage = Definition.Storage
  type I18n<Host = Artplayer> = Definition.I18n<Host>
  type Hotkey<Host = Artplayer> = Definition.Hotkey<Host>
  type Languages = Definition.Languages
  type Dictionary = Definition.Dictionary
  type QualityItem = Definition.QualityItem
  type SettingItem<Host = Artplayer> = Definition.SettingItem<Host>
  type ComponentInput<Host = Artplayer> = Definition.ComponentInput<Host>
  type ComponentOption<Host = Artplayer> = Definition.ComponentOption<Host>
  type ControlInput<Host = Artplayer> = Definition.ControlInput<Host>
  type ControlOption<Host = Artplayer> = Definition.ControlOption<Host>
  type SelectorItem = Definition.SelectorItem
  type SubtitleCue = Definition.SubtitleCue
  type SubtitleOption = Definition.SubtitleOption
  type Emitter<Events extends {
    [Name in keyof Events]: readonly unknown[];
  } = Record<PropertyKey, unknown[]>> = Definition.Emitter<Events>
}
export = Artplayer
