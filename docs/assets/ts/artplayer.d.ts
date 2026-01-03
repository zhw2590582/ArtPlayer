export interface Utils {
  isBrowser: boolean
  userAgent: string
  isMobile: boolean
  isSafari: boolean
  isIOS: boolean
  isIOS13: boolean

  query: <T extends Element = Element>(selector: string, parent?: Document | HTMLElement) => T | null
  queryAll: <T extends Element = Element>(selector: string, parent?: Document | HTMLElement) => T[]
  addClass: (target: HTMLElement, className: string) => void
  removeClass: (target: HTMLElement, className: string) => void
  hasClass: (target: HTMLElement, className: string) => boolean
  append: (target: HTMLElement, child: HTMLElement | string) => Element | ChildNode
  remove: (target: HTMLElement) => HTMLElement
  replaceElement: (newChild: HTMLElement, oldChild: HTMLElement) => HTMLElement
  siblings: (target: HTMLElement) => HTMLElement[]
  inverseClass: (target: HTMLElement, className: string) => void
  createElement: <K extends keyof HTMLElementTagNameMap>(tag: K) => HTMLElementTagNameMap[K]
  setStyle: <T extends keyof CSSStyleDeclaration>(
    element: HTMLElement,
    key: T,
    value: string | CSSStyleDeclaration[T],
  ) => HTMLElement
  setStyles: (element: HTMLElement, styles: Partial<CSSStyleDeclaration>) => HTMLElement
  getStyle: {
    (element: HTMLElement, key: keyof CSSStyleDeclaration, numberType?: true): number
    (element: HTMLElement, key: keyof CSSStyleDeclaration, numberType: false): string
  }
  setStyleText: (id: string, cssText: string) => void
  getRect: (el: HTMLElement) => { top: number, left: number, width: number, height: number }
  tooltip: (target: HTMLElement, msg: string, pos?: string) => void
  isInViewport: (target: HTMLElement, offset?: number) => boolean
  includeFromEvent: (event: Event, target: HTMLElement) => boolean

  srtToVtt: (srtText: string) => string
  vttToBlob: (vttText: string) => string
  assToVtt: (assText: string) => string

  getExt: (url: string) => string
  download: (url: string, name: string) => void
  loadImg: (url: string, scale?: number) => Promise<HTMLImageElement>

  errorHandle: <T extends boolean>(condition: T, msg: string) => T extends true ? T : never
  def: (obj: object, name: string, value: unknown) => void
  has: (obj: object, name: PropertyKey) => boolean
  get: (obj: object, name: PropertyKey) => PropertyDescriptor | undefined
  mergeDeep: <T extends object[]>(...args: T) => T[number]

  sleep: (ms: number) => Promise<void>
  debounce: <F extends (...args: any[]) => any>(func: F, wait: number, context?: object) => (...args: Parameters<F>) => ReturnType<F>
  throttle: <F extends (...args: any[]) => any>(func: F, wait: number) => (...args: Parameters<F>) => ReturnType<F>

  clamp: (num: number, a: number, b: number) => number
  secondToTime: (second: number) => string
  escape: (str: string) => string
  capitalize: (str: string) => string

  getIcon: (key?: string, html?: string | HTMLElement) => HTMLElement
  getComposedPath: (event: Event) => EventTarget[]
  supportsFlex: () => boolean
}

export interface Template {
  readonly html: string
  readonly $container: HTMLDivElement
  readonly $player: HTMLDivElement
  readonly $video: HTMLVideoElement
  readonly $track: HTMLTrackElement
  readonly $poster: HTMLDivElement
  readonly $subtitle: HTMLDivElement
  readonly $danmuku: HTMLDivElement
  readonly $bottom: HTMLDivElement
  readonly $progress: HTMLDivElement
  readonly $controls: HTMLDivElement
  readonly $controlsLeft: HTMLDivElement
  readonly $controlsCenter: HTMLDivElement
  readonly $controlsRight: HTMLDivElement
  readonly $layer: HTMLDivElement
  readonly $loading: HTMLDivElement
  readonly $notice: HTMLDivElement
  readonly $noticeInner: HTMLDivElement
  readonly $mask: HTMLDivElement
  readonly $state: HTMLDivElement
  readonly $setting: HTMLDivElement
  readonly $info: HTMLDivElement
  readonly $infoPanel: HTMLDivElement
  readonly $infoClose: HTMLDivElement
  readonly $contextmenu: HTMLDivElement
}

export interface Subtitle {
  /**
   * The subtitle url
   */
  url?: string

  /**
   * The subtitle name
   */
  name?: string

  /**
   * The subtitle type
   */
  type?: 'vtt' | 'srt' | 'ass' | (string & Record<never, never>)

  /**
   * The subtitle style object
   */
  style?: Partial<CSSStyleDeclaration>

  /**
   * The subtitle encoding, default utf-8
   */
  encoding?: string

  /**
   * Whether use escape, default true
   */
  escape?: boolean

  /**
   * Change the vtt text
   */
  onVttLoad?: (vtt: string) => string
}



export interface SettingOption extends Omit<Setting, 'html' | 'icon' | 'tooltip'> {
  html: string
  icon: string | undefined
  tooltip: string | undefined
  $item: HTMLDivElement
  $icon: HTMLDivElement | undefined
  $html: HTMLDivElement
  $tooltip: HTMLDivElement | undefined
  $switch: HTMLDivElement | undefined
  $range: HTMLInputElement | undefined
  $parent: SettingOption | undefined
  $parents: SettingOption[]
  $option: SettingOption[]
  $events: Array<() => void>
  $formatted: boolean
}

export interface Setting {
  /**
   * Html string or html element of setting name
   */
  html: string | HTMLElement

  /**
   * Html string or html element of setting icon
   */
  icon?: string | HTMLElement

  /**
   * The width of setting
   */
  width?: number

  /**
   * The tooltip of setting
   */
  tooltip?: string | HTMLElement

  /**
   * Whether the default is selected
   */
  default?: boolean

  /**
   * Custom selector list
   */
  selector?: Setting[]

  /**
   * When the setting was mounted
   */
  mounted?: (this: Artplayer, panel: HTMLDivElement, item: Setting) => void

  /**
   * When selector item click
   */
  onSelect?: (this: Artplayer, item: SettingOption, element: HTMLDivElement, event: Event) => void

  /**
   * Custom switch item
   */
  switch?: boolean

  /**
   * When switch item click
   */
  onSwitch?: (this: Artplayer, item: SettingOption, element: HTMLDivElement, event: Event) => void

  /**
   * Custom range item
   */
  range?: [value?: number, min?: number, max?: number, step?: number]

  /**
   * When range item change
   */
  onRange?: (this: Artplayer, item: SettingOption, element: HTMLDivElement, event: Event) => void

  /**
   * When range item change in real time
   */
  onChange?: (this: Artplayer, item: SettingOption, element: HTMLDivElement, event: Event) => void

  /**
   * When range item change in real time
   */
  onClick?: (this: Artplayer, item: SettingOption, element: HTMLDivElement, event: Event) => void

  /**
   * Allow custom properties
   */
  [key: string]: any
}

export interface Quality {
  /**
   * Whether the default is selected
   */
  default?: boolean

  /**
   * Html string of quality
   */
  html: string | HTMLElement

  /**
   * Video quality url
   */
  url: string
}





export type AspectRatio = 'default' | '4:3' | '16:9' | (`${number}:${number}` & Record<never, never>)
export type PlaybackRate = 0.5 | 0.75 | 1.0 | 1.25 | 1.5 | 1.75 | 2.0 | (number & Record<never, never>)
export type Flip = 'normal' | 'horizontal' | 'vertical' | (string & Record<never, never>)
export type State = 'standard' | 'mini' | 'pip' | 'fullscreen' | 'fullscreenWeb'

export declare class Player {
  get aspectRatio(): AspectRatio
  set aspectRatio(ratio: AspectRatio)

  get state(): State
  set state(state: State)

  get type(): CustomType
  set type(name: CustomType)

  get playbackRate(): PlaybackRate
  set playbackRate(rate: PlaybackRate)

  get currentTime(): number
  set currentTime(time: number)

  get duration(): number
  get played(): number
  get playing(): boolean

  get flip(): Flip
  set flip(state: Flip)

  get fullscreen(): boolean
  set fullscreen(state: boolean)

  get fullscreenWeb(): boolean
  set fullscreenWeb(state: boolean)

  get loaded(): number
  get loadedTime(): number

  get mini(): boolean
  set mini(state: boolean)

  get pip(): boolean
  set pip(state: boolean)

  get poster(): string
  set poster(url: string)

  get rect(): DOMRect
  get bottom(): number
  get height(): number
  get left(): number
  get right(): number
  get top(): number
  get width(): number
  get x(): number
  get y(): number

  set seek(time: number)
  get seek(): number

  set forward(time: number)
  get forward(): number

  set backward(time: number)
  get backward(): number

  get url(): string
  set url(url: string)

  get volume(): number
  set volume(percentage: number)

  get muted(): boolean
  set muted(state: boolean)

  get theme(): string
  set theme(theme: string)

  get subtitleOffset(): number
  set subtitleOffset(time: number)

  get switch(): string
  set switch(url: string)

  get quality(): Quality[]
  set quality(quality: Quality[])

  get thumbnails(): Thumbnails
  set thumbnails(thumbnails: Thumbnails)

  pause(): void
  play(): Promise<void>
  toggle(): void

  attr(key: string, value?: unknown): unknown
  cssVar<T extends keyof CssVar>(key: T, value?: CssVar[T]): CssVar[T]

  switchUrl(url: string): Promise<void>
  switchQuality(url: string): Promise<void>

  getDataURL(): Promise<string>
  getBlobUrl(): Promise<string>
  screenshot(name?: string): Promise<string>

  airplay(): void
  autoSize(): void
  autoHeight(): void
  reset(): void
}










export type CustomType
  = | 'flv'
    | 'm3u8'
    | 'hls'
    | 'ts'
    | 'mpd'
    | 'torrent'
    | (string & Record<never, never>)

export interface Thumbnails {
  /**
   * The thumbnail image url
   */
  url: string

  /**
   * The thumbnail item number
   */
  number?: number

  /**
   * The thumbnail column size
   */
  column?: number

  /**
   * The thumbnail width
   */
  width?: number

  /**
   * The thumbnail height
   */
  height?: number

  /**
   * The thumbnail scale
   */
  scale?: number
}

export interface Option {
  /**
   * The player id
   */
  id?: string

  /**
   * The container mounted by the player
   */
  container: string | HTMLDivElement

  /**
   * Video url
   */
  url: string

  /**
   * Video poster image url
   */
  poster?: string

  /**
   * Video url type
   */
  type?: CustomType

  /**
   * Player color theme
   */
  theme?: string

  /**
   * Player language
   */
  lang?: keyof I18n

  /**
   * Player default volume
   */
  volume?: number

  /**
   * Whether live broadcast mode
   */
  isLive?: boolean

  /**
   * Whether video muted
   */
  muted?: boolean

  /**
   * Whether video auto play
   */
  autoplay?: boolean

  /**
   * Whether player auto resize
   */
  autoSize?: boolean

  /**
   * Whether player auto run mini mode
   */
  autoMini?: boolean

  /**
   * Whether video auto loop
   */
  loop?: boolean

  /**
   * Whether show video flip button
   */
  flip?: boolean

  /**
   * Whether show video playback rate button
   */
  playbackRate?: boolean

  /**
   * Whether show video aspect ratio button
   */
  aspectRatio?: boolean

  /**
   * Whether show video screenshot button
   */
  screenshot?: boolean

  /**
   * Whether show video setting button
   */
  setting?: boolean

  /**
   * Whether to enable player hotkey
   */
  hotkey?: boolean

  /**
   * Whether show video pip button
   */
  pip?: boolean

  /**
   * Do you want to run only one player at a time
   */
  mutex?: boolean

  /**
   * Whether use backdrop in UI
   */
  backdrop?: boolean

  /**
   * Whether show video window fullscreen button
   */
  fullscreen?: boolean

  /**
   * Whether show video web fullscreen button
   */
  fullscreenWeb?: boolean

  /**
   * Whether to enable player subtitle offset
   */
  subtitleOffset?: boolean

  /**
   * Whether to enable player mini progress bar
   */
  miniProgressBar?: boolean

  /**
   * Whether use SSR function
   */
  useSSR?: boolean

  /**
   * Whether use playsInline in mobile
   */
  playsInline?: boolean

  /**
   * Whether use lock in mobile
   */
  lock?: boolean

  /**
   * Whether use gesture in mobile
   */
  gesture?: boolean

  /**
   * Whether use fast forward in mobile
   */
  fastForward?: boolean

  /**
   * Whether use auto playback
   */
  autoPlayback?: boolean

  /**
   * Whether use auto orientation in mobile
   */
  autoOrientation?: boolean

  /**
   * Whether use airplay
   */
  airplay?: boolean

  /**
   * Custom video proxy
   */
  proxy?: (this: Artplayer, art: Artplayer) => HTMLCanvasElement | HTMLVideoElement | undefined

  /**
   * Custom plugin list
   */
  plugins?: ((this: Artplayer, art: Artplayer) => unknown | Promise<unknown>)[]

  /**
   * Custom layer list
   */
  layers?: ComponentOption[]

  /**
   * Custom contextmenu list
   */
  contextmenu?: ComponentOption[]

  /**
   * Custom control list
   */
  controls?: ComponentOption[]

  /**
   * Custom setting list
   */
  settings?: Setting[]

  /**
   * Custom video quality list
   */
  quality?: Quality[]

  /**
   * Custom highlight list
   */
  highlight?: {
    /**
     * The highlight time
     */
    time: number

    /**
     * The highlight text
     */
    text: string
  }[]

  /**
   * Custom thumbnail
   */
  thumbnails?: Thumbnails

  /**
   * Custom subtitle option
   */
  subtitle?: Subtitle

  /**
   * Other video attribute
   */
  moreVideoAttr?: Partial<Readonly<{
    [K in keyof HTMLVideoElement as HTMLVideoElement[K] extends (...args: unknown[]) => unknown
      ? never
      : K]: HTMLVideoElement[K]
  }>>

  /**
   * Custom i18n
   */
  i18n?: I18n

  /**
   * Custom default icons
   */
  icons?: {
    [key in keyof Icons]?: HTMLElement | string
  }

  /**
   * Custom css variables
   */
  cssVar?: Partial<CssVar>

  /**
   * Custom video type function
   */
  customType?: Partial<
    Record<
      CustomType,
      (this: Artplayer, video: HTMLVideoElement, url: string, art: Artplayer) => unknown | Promise<unknown>
    >
  >
}

export interface Icons {
  readonly loading: HTMLDivElement
  readonly state: HTMLDivElement
  readonly play: HTMLDivElement
  readonly pause: HTMLDivElement
  readonly check: HTMLDivElement
  readonly volume: HTMLDivElement
  readonly volumeClose: HTMLDivElement
  readonly screenshot: HTMLDivElement
  readonly setting: HTMLDivElement
  readonly pip: HTMLDivElement
  readonly arrowLeft: HTMLDivElement
  readonly arrowRight: HTMLDivElement
  readonly playbackRate: HTMLDivElement
  readonly aspectRatio: HTMLDivElement
  readonly config: HTMLDivElement
  readonly lock: HTMLDivElement
  readonly flip: HTMLDivElement
  readonly unlock: HTMLDivElement
  readonly fullscreenOff: HTMLDivElement
  readonly fullscreenOn: HTMLDivElement
  readonly fullscreenWebOff: HTMLDivElement
  readonly fullscreenWebOn: HTMLDivElement
  readonly switchOn: HTMLDivElement
  readonly switchOff: HTMLDivElement
  readonly error: HTMLDivElement
  readonly close: HTMLDivElement
  readonly airplay: HTMLDivElement
  readonly [key: string]: HTMLDivElement
}

type I18nKeys
  = | 'en'
    | 'zh-cn'
    | 'zh-tw'
    | 'pl'
    | 'cs'
    | 'es'
    | 'fa'
    | 'fr'
    | 'id'
    | 'ru'
    | 'tr'
    | 'ar'
    | 'vi'
    | (string & Record<never, never>)

interface I18nValue {
  'Video Info': string
  'Close': string
  'Video Load Failed': string
  'Volume': string
  'Play': string
  'Pause': string
  'Rate': string
  'Mute': string
  'Video Flip': string
  'Horizontal': string
  'Vertical': string
  'Reconnect': string
  'Show Setting': string
  'Hide Setting': string
  'Screenshot': string
  'Play Speed': string
  'Aspect Ratio': string
  'Default': string
  'Normal': string
  'Open': string
  'Switch Video': string
  'Switch Subtitle': string
  'Fullscreen': string
  'Exit Fullscreen': string
  'Web Fullscreen': string
  'Exit Web Fullscreen': string
  'Mini Player': string
  'PIP Mode': string
  'Exit PIP Mode': string
  'PIP Not Supported': string
  'Fullscreen Not Supported': string
  'Subtitle Offset': string
  'Last Seen': string
  'Jump Play': string
  'AirPlay': string
  'AirPlay Not Available': string
}

export type I18n = Partial<Record<I18nKeys, Partial<I18nValue>>>

declare module 'artplayer/i18n/*' {
  const lang: Partial<I18nValue>
  // @ts-expect-error TS2666
  export default lang
}




export type Bar = 'loaded' | 'played' | 'hover'

export interface Events {
  'document:click': [event: Event]
  'document:mouseup': [event: Event]
  'document:keydown': [event: Event]
  'document:touchend': [event: Event]
  'document:touchmove': [event: Event]
  'document:mousemove': [event: Event]
  'document:pointerup': [event: Event]
  'document:contextmenu': [event: Event]
  'document:pointermove': [event: Event]
  'document:visibilitychange': [event: Event]
  'document:webkitfullscreenchange': [event: Event]

  'window:resize': [event: Event]
  'window:scroll': [event: Event]
  'window:orientationchange': [event: Event]

  'video:abort': [event: Event]
  'video:canplay': [event: Event]
  'video:canplaythrough': [event: Event]
  'video:complete': [event: Event]
  'video:durationchange': [event: Event]
  'video:emptied': [event: Event]
  'video:encrypted': [event: Event]
  'video:ended': [event: Event]
  'video:error': [error: Error]
  'video:loadeddata': [event: Event]
  'video:loadedmetadata': [event: Event]
  'video:loadstart': [event: Event]
  'video:pause': [event: Event]
  'video:play': [event: Event]
  'video:playing': [event: Event]
  'video:progress': [event: Event]
  'video:ratechange': [event: Event]
  'video:seeked': [event: Event]
  'video:seeking': [event: Event]
  'video:stalled': [event: Event]
  'video:suspend': [event: Event]
  'video:timeupdate': [event: Event]
  'video:volumechange': [event: Event]
  'video:waiting': [event: Event]

  'info': [state: boolean]
  'layer': [state: boolean]
  'loading': [state: boolean]
  'mask': [state: boolean]
  'subtitle': [state: boolean]
  'contextmenu': [state: boolean]
  'control': [state: boolean]
  'setting': [state: boolean]
  'hotkey': [event: KeyboardEvent]

  'destroy': []

  'subtitleOffset': [offset: number]
  'subtitleBeforeUpdate': [cue: VTTCue]
  'subtitleAfterUpdate': [cue: VTTCue]
  'subtitleLoad': [cues: VTTCue[], option: Subtitle]

  'focus': [event: Event]
  'blur': [event: Event]
  'dblclick': [event: Event]
  'click': [event: Event]
  'hover': [state: boolean, event: Event]
  'mousemove': [event: Event]

  'resize': []
  'view': [state: boolean]
  'lock': [state: boolean]
  'aspectRatio': [aspectRatio: AspectRatio]
  'autoHeight': [height: number]
  'autoSize': [size: { width: number, height: number }]
  'ready': []
  'airplay': []
  'raf': []

  'error': [error: Error, reconnectTime: number]
  'flip': [flip: Flip]
  'fullscreen': [state: boolean]
  'fullscreenError': [event: Event]
  'fullscreenWeb': [state: boolean]
  'mini': [state: boolean]
  'pause': []
  'pip': [state: boolean]
  'play': []
  'screenshot': [dataUri: string]
  'seek': [currentTime: number, time: number]
  'restart': [url: string]
  'muted': [state: boolean]
  'setBar': [type: Bar, percentage: number, event?: Event | undefined]
  'keydown': [event: KeyboardEvent]
}

export interface CssVar {
  '--art-theme': string
  '--art-font-color': string
  '--art-background-color': string
  '--art-text-shadow-color': string
  '--art-transition-duration': string
  '--art-padding': string
  '--art-border-radius': string
  '--art-progress-height': string
  '--art-progress-color': string
  '--art-progress-top-gap': string
  '--art-hover-color': string
  '--art-loaded-color': string
  '--art-state-size': string
  '--art-state-opacity': number
  '--art-bottom-height': string
  '--art-bottom-offset': string
  '--art-bottom-gap': string
  '--art-highlight-width': string
  '--art-highlight-color': string
  '--art-control-height': string
  '--art-control-opacity': number
  '--art-control-icon-size': string
  '--art-control-icon-scale': number
  '--art-volume-height': string
  '--art-volume-handle-size': string
  '--art-lock-size': string
  '--art-indicator-scale': number
  '--art-indicator-size': string
  '--art-fullscreen-web-index': 9999
  '--art-settings-icon-size': string
  '--art-settings-max-height': string
  '--art-selector-max-height': string
  '--art-contextmenus-min-width': string
  '--art-subtitle-font-size': string
  '--art-subtitle-gap': string
  '--art-subtitle-bottom': string
  '--art-subtitle-border': string
  '--art-widget-background': string
  '--art-tip-background': string
  '--art-scrollbar-size': string
  '--art-scrollbar-background': string
  '--art-scrollbar-background-hover': string
  '--art-mini-progress-height': string
}

export interface Config {
  readonly properties: readonly [
    'audioTracks',
    'autoplay',
    'buffered',
    'controller',
    'controls',
    'crossOrigin',
    'currentSrc',
    'currentTime',
    'defaultMuted',
    'defaultPlaybackRate',
    'duration',
    'ended',
    'error',
    'loop',
    'mediaGroup',
    'muted',
    'networkState',
    'paused',
    'playbackRate',
    'played',
    'preload',
    'readyState',
    'seekable',
    'seeking',
    'src',
    'startDate',
    'textTracks',
    'videoTracks',
    'volume',
  ]
  readonly methods: readonly ['addTextTrack', 'canPlayType', 'load', 'play', 'pause']
  readonly events: readonly [
    'abort',
    'canplay',
    'canplaythrough',
    'durationchange',
    'emptied',
    'ended',
    'error',
    'loadeddata',
    'loadedmetadata',
    'loadstart',
    'pause',
    'play',
    'playing',
    'progress',
    'ratechange',
    'seeked',
    'seeking',
    'stalled',
    'suspend',
    'timeupdate',
    'volumechange',
    'waiting',
  ]
  readonly prototypes: readonly [
    'width',
    'height',
    'videoWidth',
    'videoHeight',
    'poster',
    'webkitDecodedFrameCount',
    'webkitDroppedFrameCount',
    'playsInline',
    'webkitSupportsFullscreen',
    'webkitDisplayingFullscreen',
    'onenterpictureinpicture',
    'onleavepictureinpicture',
    'disablePictureInPicture',
    'cancelVideoFrameCallback',
    'requestVideoFrameCallback',
    'getVideoPlaybackQuality',
    'requestPictureInPicture',
    'webkitEnterFullScreen',
    'webkitEnterFullscreen',
    'webkitExitFullScreen',
    'webkitExitFullscreen',
  ]
}



export interface Selector {
  /**
   * Whether the default is selected
   */
  default?: boolean

  /**
   * Html string of selector
   */
  html: string | HTMLElement

  /**
   * Value of selector item
   */
  value?: string | number

  /**
   * Allow custom properties
   */
  [key: string]: any
}

export interface Component {
  /**
   * Component self-increasing id
   */
  readonly id: number

  /**
   * Component parent name
   */
  readonly name: string | undefined

  /**
   * Component parent element
   */
  readonly $parent: HTMLElement | undefined

  /**
   * Whether to show component parent
   */
  get show(): boolean

  /**
   * Whether to show component parent
   */
  set show(state: boolean)

  /**
   * Toggle the component parent
   */
  toggle: () => void

  /**
   * Dynamic add a component
   */
  add: (option: ComponentOption | ((art: Artplayer) => ComponentOption)) => HTMLElement | undefined

  /**
   * Dynamic remove a component by name
   */
  remove: (name: string) => void

  /**
   * Dynamic update a component
   */
  update: (option: ComponentOption) => HTMLElement | undefined
}

export interface ComponentOption {
  /**
   * Html string or html element of component
   */
  html?: string | HTMLElement

  /**
   * Whether to disable component
   */
  disable?: boolean

  /**
   * Unique name for component
   */
  name?: string

  /**
   * Component sort index
   */
  index?: number

  /**
   * Component style object
   */
  style?: Partial<CSSStyleDeclaration>

  /**
   * Component click event
   */
  click?: (this: Artplayer, component: Component, event: Event) => void

  /**
   * When the component was mounted
   */
  mounted?: (this: Artplayer, element: HTMLElement) => void

  /**
   * When the component was before unmount
   */
  beforeUnmount?: (this: Artplayer, element: HTMLElement) => void

  /**
   * Component tooltip, use in controls
   */
  tooltip?: string

  /**
   * Component position, use in controls
   */
  position?: 'top' | 'left' | 'right' | (string & Record<never, never>)

  /**
   * Custom selector list, use in controls
   */
  selector?: Selector[]

  /**
   * When selector item click, use in controls
   */
  onSelect?: (this: Artplayer, selector: Selector, element: HTMLElement, event: Event) => void
}













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

export = Artplayer;
export as namespace Artplayer;