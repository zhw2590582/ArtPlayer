import type { Component } from './component'
import type { Config } from './config'
import type { ArtplayerConstants } from './constants'
import type { Events } from './events'
import type { I18n } from './i18n'
import type { Icons } from './icons'
import type { Option } from './option'
import type { Player } from './player'
import type { Setting, SettingOption } from './setting'
import type { Subtitle } from './subtitle'
import type { Template } from './template'
import type { Utils } from './utils'

export type {
  ArtplayerConstants,
  Config,
  Events,
  I18n,
  Icons,
  Option,
  Player,
  Setting,
  SettingOption,
  Subtitle,
  Template,
  Utils,
}

export default class Artplayer extends Player {
  constructor(option: Option, readyCallback?: (this: Artplayer, art: Artplayer) => unknown)

  get Config(): Config
  get Events(): Events
  get Utils(): Utils
  get Player(): Player
  get Option(): Option
  get Subtitle(): Subtitle
  get Icons(): Icons
  get Template(): Template
  get I18n(): I18n
  get Setting(): Setting
  get SettingOption(): SettingOption
  get Component(): Component

  // Readonly static properties
  static readonly instances: Artplayer[]
  static readonly version: string
  static readonly env: string
  static readonly build: string
  static readonly config: Config
  static readonly utils: Utils
  static readonly scheme: Record<keyof Option, unknown>
  static readonly Emitter: new (...args: unknown[]) => unknown
  static readonly validator: <T extends object>(option: T, scheme: object) => T
  static readonly kindOf: (item: unknown) => string
  static readonly html: Artplayer['template']['html']
  static readonly option: Option

  // Static constants - grouped by category for better organization
  static STYLE: ArtplayerConstants['STYLE']
  static DEBUG: ArtplayerConstants['DEBUG']
  static CONTEXTMENU: ArtplayerConstants['CONTEXTMENU']

  // Time constants
  static NOTICE_TIME: ArtplayerConstants['NOTICE_TIME']
  static RESIZE_TIME: ArtplayerConstants['RESIZE_TIME']
  static SCROLL_TIME: ArtplayerConstants['SCROLL_TIME']
  static AUTO_PLAYBACK_TIMEOUT: ArtplayerConstants['AUTO_PLAYBACK_TIMEOUT']
  static RECONNECT_SLEEP_TIME: ArtplayerConstants['RECONNECT_SLEEP_TIME']
  static CONTROL_HIDE_TIME: ArtplayerConstants['CONTROL_HIDE_TIME']
  static DBCLICK_TIME: ArtplayerConstants['DBCLICK_TIME']
  static AUTO_ORIENTATION_TIME: ArtplayerConstants['AUTO_ORIENTATION_TIME']
  static INFO_LOOP_TIME: ArtplayerConstants['INFO_LOOP_TIME']
  static FAST_FORWARD_TIME: ArtplayerConstants['FAST_FORWARD_TIME']

  // UI constants
  static SETTING_WIDTH: ArtplayerConstants['SETTING_WIDTH']
  static SETTING_ITEM_WIDTH: ArtplayerConstants['SETTING_ITEM_WIDTH']
  static SETTING_ITEM_HEIGHT: ArtplayerConstants['SETTING_ITEM_HEIGHT']
  static SCROLL_GAP: ArtplayerConstants['SCROLL_GAP']

  // Playback constants
  static AUTO_PLAYBACK_MAX: ArtplayerConstants['AUTO_PLAYBACK_MAX']
  static AUTO_PLAYBACK_MIN: ArtplayerConstants['AUTO_PLAYBACK_MIN']
  static RECONNECT_TIME_MAX: ArtplayerConstants['RECONNECT_TIME_MAX']
  static FAST_FORWARD_VALUE: ArtplayerConstants['FAST_FORWARD_VALUE']
  static TOUCH_MOVE_RATIO: ArtplayerConstants['TOUCH_MOVE_RATIO']
  static VOLUME_STEP: ArtplayerConstants['VOLUME_STEP']
  static SEEK_STEP: ArtplayerConstants['SEEK_STEP']
  static PLAYBACK_RATE: ArtplayerConstants['PLAYBACK_RATE']
  static ASPECT_RATIO: ArtplayerConstants['ASPECT_RATIO']
  static FLIP: ArtplayerConstants['FLIP']

  // Feature flags
  static DBCLICK_FULLSCREEN: ArtplayerConstants['DBCLICK_FULLSCREEN']
  static MOBILE_DBCLICK_PLAY: ArtplayerConstants['MOBILE_DBCLICK_PLAY']
  static MOBILE_CLICK_PLAY: ArtplayerConstants['MOBILE_CLICK_PLAY']
  static FULLSCREEN_WEB_IN_BODY: ArtplayerConstants['FULLSCREEN_WEB_IN_BODY']
  static LOG_VERSION: ArtplayerConstants['LOG_VERSION']
  static USE_RAF: ArtplayerConstants['USE_RAF']

  readonly id: number
  readonly option: Option
  readonly isLock: boolean
  readonly isReady: boolean
  readonly isFocus: boolean
  readonly isInput: boolean
  readonly isRotate: boolean
  readonly isDestroy: boolean

  flv?: unknown
  m3u8?: unknown
  hls?: unknown
  ts?: unknown
  mpd?: unknown
  torrent?: unknown

  on<T extends keyof Events>(name: T, fn: (...args: Events[T]) => unknown, ctx?: object): this
  on(name: string, fn: (...args: unknown[]) => unknown, ctx?: object): this

  once<T extends keyof Events>(name: T, fn: (...args: Events[T]) => unknown, ctx?: object): this
  once(name: string, fn: (...args: unknown[]) => unknown, ctx?: object): this

  emit<T extends keyof Events>(name: T, ...args: Events[T]): this
  emit(name: string, ...args: unknown[]): this

  off<T extends keyof Events>(name: T, callback?: (...args: Events[T]) => unknown): this
  off(name: string, callback?: (...args: unknown[]) => unknown): this

  query: Artplayer['template']['query']
  proxy: Artplayer['events']['proxy']
  video: Artplayer['template']['$video']

  e: { [K in keyof Events]?: { fn: (...args: Events[K]) => unknown, ctx: unknown }[] }

  destroy(removeHtml?: boolean): void

  readonly template: {
    get html(): string
    query: (str: string) => HTMLElement
  } & Template

  readonly events: {
    proxy: <KW extends keyof WindowEventMap, KH extends keyof HTMLElementEventMap>(
      element: HTMLDivElement | Document | Window,
      eventName: KW | KH,
      handler: (event: WindowEventMap[KW] | HTMLElementEventMap[KH] | Event) => void,
      options?: boolean | AddEventListenerOptions,
    ) => () => void
    hover: (element: HTMLElement, mouseenter?: (event: Event) => any, mouseleave?: (event: Event) => any) => void
    remove: (event: Event) => void
    bindGlobalEvents: (source?: { window?: Window, document?: Document }) => void
  }

  readonly storage: {
    name: string
    settings: Record<string, unknown>
    get: (key: string) => unknown
    set: (key: string, value: unknown) => void
    del: (key: string) => boolean
    clear: () => void
  }

  readonly icons: Icons

  readonly i18n: {
    readonly languages: I18n
    get: (key: string) => string
    update: (language: Partial<I18n>) => void
  }

  readonly notice: {
    timer: number
    set show(msg: string)
  }

  readonly layers: Record<string, HTMLElement> & Component
  readonly controls: Record<string, HTMLElement> & Component
  readonly contextmenu: Record<string, HTMLElement> & Component

  readonly subtitle: {
    get url(): string
    set url(url: string)
    get textTrack(): TextTrack
    get activeCues(): VTTCue[]
    get cues(): VTTCue[]
    style: (name: string | Partial<CSSStyleDeclaration>, value?: string) => void
    switch: (url: string, option?: Subtitle) => Promise<string>
  } & Component

  readonly info: Component
  readonly loading: Component

  readonly hotkey: {
    keys: Record<string, ((event: Event) => any)[]>
    add: (key: string, callback: (this: Artplayer, event: Event) => any) => Artplayer['hotkey']
    remove: (key: string, callback: (event: Event) => any) => Artplayer['hotkey']
  }

  readonly mask: Component

  readonly setting: {
    option: SettingOption[]
    updateStyle: (width?: number) => void
    find: (name: string) => SettingOption
    add: (setting: Setting) => SettingOption[]
    update: (settings: Setting) => SettingOption[]
    remove: (name: string) => SettingOption[]
  } & Component

  readonly plugins: {
    add: (
      plugin: (this: Artplayer, art: Artplayer) => unknown | Promise<unknown>,
    ) => Promise<Artplayer['plugins']> | Artplayer['plugins']
  } & Record<string, unknown>
}
