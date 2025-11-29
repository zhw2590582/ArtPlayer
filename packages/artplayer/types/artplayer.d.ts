import type { Component } from './component'
import type { Config } from './config'
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

  static readonly instances: Artplayer[]
  static readonly version: string
  static readonly env: 'development' | 'production'
  static readonly build: string
  static readonly config: Config
  static readonly utils: Utils
  static readonly scheme: Record<keyof Option, unknown>
  static readonly Emitter: new (...args: unknown[]) => unknown
  static readonly validator: <T extends object>(option: T, scheme: object) => T
  static readonly kindOf: (item: unknown) => string
  static readonly html: Artplayer['template']['html']
  static readonly option: Option

  static STYLE: string
  static DEBUG: boolean
  static CONTEXTMENU: boolean
  static NOTICE_TIME: number
  static SETTING_WIDTH: number
  static SETTING_ITEM_WIDTH: number
  static SETTING_ITEM_HEIGHT: number
  static RESIZE_TIME: number
  static SCROLL_TIME: number
  static SCROLL_GAP: number
  static AUTO_PLAYBACK_MAX: number
  static AUTO_PLAYBACK_MIN: number
  static AUTO_PLAYBACK_TIMEOUT: number
  static RECONNECT_TIME_MAX: number
  static RECONNECT_SLEEP_TIME: number
  static CONTROL_HIDE_TIME: number
  static DBCLICK_TIME: number
  static DBCLICK_FULLSCREEN: boolean
  static MOBILE_DBCLICK_PLAY: boolean
  static MOBILE_CLICK_PLAY: boolean
  static AUTO_ORIENTATION_TIME: number
  static INFO_LOOP_TIME: number
  static FAST_FORWARD_VALUE: number
  static FAST_FORWARD_TIME: number
  static TOUCH_MOVE_RATIO: number
  static VOLUME_STEP: number
  static SEEK_STEP: number
  static PLAYBACK_RATE: number[]
  static ASPECT_RATIO: string[]
  static FLIP: string[]
  static FULLSCREEN_WEB_IN_BODY: boolean
  static LOG_VERSION: boolean
  static USE_RAF: boolean
  static REMOVE_SRC_WHEN_DESTROY: boolean

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
  reset(): void

  readonly template: {
    get html(): string
    query: <T extends Element = Element>(selector: string) => T | null
  } & Template

  readonly events: {
    proxy: {
      (target: EventTarget, eventName: string, handler: (event: Event) => void, options?: boolean | AddEventListenerOptions): () => void
      (target: EventTarget, eventName: string[], handler: (event: Event) => void, options?: boolean | AddEventListenerOptions): Array<() => void>
    }
    hover: (element: HTMLElement, mouseenter?: (event: Event) => any, mouseleave?: (event: Event) => any) => void
    remove: (destroyEvent: () => void) => void
    destroy: () => void
    bindGlobalEvents: (source?: { window?: Window, document?: Document }) => void
  }

  readonly storage: {
    name: string
    settings: Record<string, unknown>
    get: {
      (key: string): unknown
      (): Record<string, unknown>
    }
    set: (key: string, value: unknown) => void
    del: (key: string) => void
    clear: () => void
  }

  readonly icons: Icons

  readonly i18n: {
    languages: I18n
    language: Partial<Record<string, string>>
    init: () => void
    get: (key: string) => string
    update: (language: Partial<I18n>) => void
  }

  readonly notice: {
    timer: number | null
    get show(): boolean
    set show(msg: string | Error | false | '')
    destroy: () => void
  }

  readonly layers: Record<string, HTMLElement | undefined> & Component
  readonly controls: Record<string, HTMLElement | undefined> & Component
  readonly contextmenu: Record<string, HTMLElement | undefined> & Component

  readonly subtitle: {
    get url(): string
    set url(url: string)
    get textTrack(): TextTrack | undefined
    get activeCues(): VTTCue[]
    get cues(): VTTCue[]
    style: (name: string | Partial<CSSStyleDeclaration>, value?: string) => void
    switch: (url: string, option?: Subtitle) => Promise<string>
    init: (subtitle: Subtitle) => Promise<string | null | undefined>
  } & Component

  readonly info: Component
  readonly loading: Component

  readonly hotkey: {
    keys: Record<string, ((event: KeyboardEvent) => any)[]>
    add: (key: string, callback: (this: Artplayer, event: KeyboardEvent) => any) => Artplayer['hotkey']
    remove: (key: string, callback: (event: KeyboardEvent) => any) => Artplayer['hotkey']
  }

  readonly mask: Component

  readonly setting: {
    option: SettingOption[]
    updateStyle: (width?: number) => void
    find: (name: string) => SettingOption | undefined
    add: (setting: Setting) => Artplayer['setting']
    update: (settings: Setting) => Artplayer['setting']
    remove: (name: string) => Artplayer['setting']
  } & Component

  readonly plugins: {
    add: (
      plugin: (this: Artplayer, art: Artplayer) => unknown | Promise<unknown>,
    ) => Promise<Artplayer['plugins']>
  } & Record<string, unknown>
}
