// Generated from public/runtime.ts by yarn build:types. Do not edit.
/* eslint-disable ts/no-redeclare -- Constructor, instance and named types share the export. */
import type LegacyArtplayer from './artplayer'
import type { Emitter } from './emitter'
import type { OptionInput as LegacyOptionInput } from './option'
import type { PluginFactory as LegacyPluginFactory, Plugins as LegacyPlugins } from './plugin'
import type { ComponentInput, Component as ComponentView, ControlInput, Controls as ControlsView } from './runtime/component'
import type { ContextmenuHost, ControlHost, CustomTypeHost, LayerHost, PluginHost, ProxyHost } from './runtime/construction'
import type { Events } from './runtime/events'
import type { MediaSurface } from './runtime/media'
import type { OptionInput as OptionInputView, Option as OptionView } from './runtime/option'
import type { Player } from './runtime/player'
import type { PluginFactory as FactoryView, PluginRegistration, Plugins as PluginsView } from './runtime/plugin'
import type { Config, EventRegistry, Hotkey, I18n, Scheme, Storage, ValidatorPath } from './runtime/services'
import type { Setting as SettingView } from './runtime/setting'
import type { Notice as NoticeView, Subtitle as SubtitleView } from './runtime/subtitle'
import type { Icons, Template } from './runtime/template'
import type { Utils } from './runtime/utils'

export type { Emitter } from './emitter'
export type { ComponentInput, ComponentOption, ControlInput, ControlOption, SelectorItem } from './runtime/component'
export type { ContextmenuHost, ControlHost, CustomTypeHost, LayerHost, PluginHost, ProxyHost } from './runtime/construction'
export type { Events } from './runtime/events'
export type { CanvasMedia, MediaSurface, NativeMedia } from './runtime/media'
export type { Player, QualityItem } from './runtime/player'
export type { PluginRegistration } from './runtime/plugin'
export type { Config, Dictionary, EventRegistry, Hotkey, I18n, Languages, Storage } from './runtime/services'
export type { SettingItem } from './runtime/setting'
export type { SubtitleCue, SubtitleOption } from './runtime/subtitle'
export type { Icons, Template } from './runtime/template'
export type { Utils } from './runtime/utils'
export type PluginFactory<Result = unknown> = FactoryView<PluginHost, Result>
export interface OptionInput extends Omit<OptionInputView<Artplayer>, 'plugins' | 'proxy' | 'customType' | 'layers' | 'controls' | 'contextmenu'> {
  plugins?: PluginFactory[]
  proxy?: (this: ProxyHost, art: ProxyHost) => MediaSurface
  customType?: Record<string, ((this: CustomTypeHost, video: MediaSurface, url: string, art: CustomTypeHost) => unknown) | undefined>
  layers?: ComponentInput<LayerHost>[]
  controls?: ControlInput<ControlHost>[]
  contextmenu?: ComponentInput<ContextmenuHost>[]
}
export interface Option extends OptionView<Artplayer> {
}
export interface Component extends ComponentView<Artplayer> {
}
export interface Controls extends ControlsView<Artplayer> {
}
export interface Setting extends SettingView<Artplayer> {
}
export interface Subtitle extends SubtitleView, Omit<Component, keyof SubtitleView> {
}
export interface Notice extends NoticeView {
  art: Artplayer
}
/** Augment with installed results. Factories are not wrapped or converted. */
export interface PluginAdd<Registry> {
  <Result>(plugin: FactoryView<Artplayer, Result>): PluginRegistration<Result, Registry>
  <Result>(plugin: LegacyPluginFactory<LegacyArtplayer, Result>): PluginRegistration<Result, Registry>
}
type LegacyPluginResults = {
  [Name in keyof LegacyPlugins as string extends Name ? never : number extends Name ? never : Name extends keyof PluginsView<Artplayer> ? never : Name]: LegacyPlugins[Name];
}
export interface Plugins extends Omit<PluginsView<Artplayer>, 'add'>, LegacyPluginResults {
  add: PluginAdd<this>
  [name: string]: unknown
}
/** Public view of the existing constructor; this interface emits no runtime fields. */
interface Artplayer extends Player, Emitter<Events> {
  constructor: ArtplayerConstructor
  id: number
  option: Option
  isLock: boolean
  isReady: boolean
  isFocus: boolean
  isInput: boolean
  isRotate: boolean
  isDestroy: boolean
  flv?: unknown
  m3u8?: unknown
  hls?: unknown
  ts?: unknown
  mpd?: unknown
  torrent?: unknown
  template: Template<Artplayer>
  events: EventRegistry
  storage: Storage
  icons: Icons
  i18n: I18n<Artplayer>
  notice: Notice
  /** The descriptor installer has no public instance members. */
  player: object
  layers: Component
  controls: Controls
  contextmenu: Component & {
    init: () => void
  }
  subtitle: Subtitle
  info: Component & {
    init: () => void
  }
  loading: Component
  hotkey: Hotkey<Artplayer>
  mask: Component
  setting: Setting
  plugins: Plugins
  readonly query: Template<Artplayer>['query']
  readonly proxy: EventRegistry['proxy']
  readonly video: MediaSurface
  reset: () => void
  destroy: (removeHtml?: boolean) => void
}
type StaticOptions = Pick<typeof LegacyArtplayer, Extract<keyof typeof LegacyArtplayer, Uppercase<string>>>
export interface ArtplayerConstructor extends StaticOptions {
  new (option: OptionInput, readyCallback?: (this: Artplayer, art: Artplayer) => unknown): Artplayer
  new (option: LegacyOptionInput, readyCallback?: (this: Artplayer, art: Artplayer) => unknown): Artplayer
  readonly prototype: Artplayer
  readonly instances: Artplayer[]
  readonly version: string
  readonly config: Config
  readonly utils: Utils
  readonly scheme: Record<keyof Option, Scheme>
  readonly Emitter: new <Events extends {
    [Name in keyof Events]: readonly unknown[];
  } = Record<PropertyKey, unknown[]>>(...args: unknown[]) => Emitter<Events>
  readonly validator: <T>(option: T, scheme: Scheme, paths?: ValidatorPath) => T
  readonly kindOf: (value: unknown) => string
  readonly html: string
  readonly option: Option
}
declare const Artplayer: ArtplayerConstructor
export default Artplayer
