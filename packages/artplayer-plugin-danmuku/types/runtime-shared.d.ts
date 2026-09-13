import type Artplayer from 'artplayer'

export type Mode = 0 | 1 | 2
export type State = 'wait' | 'ready' | 'emit' | 'stop'
export type Margin = [number | string, number | string]
/** Mutable tuples: historical custom heatmap rendering adjusts the second coordinate. */
export type Point = [number, number]

export interface Danmu {
  text: string
  id?: string
  mode?: number
  color?: string
  time?: number
  border?: boolean
  style?: Partial<CSSStyleDeclaration>
  [extension: string]: unknown
}

/** Input fields have been filled before filter runs; queue fields do not exist yet. */
export interface NormalizedDanmu extends Danmu {
  mode: number
  color: string
  time: number
  style: Partial<CSSStyleDeclaration>
}

/** The actual mutable queue entry supplied to beforeVisible and visible/loaded events. */
export interface Item extends NormalizedDanmu {
  $state: State
  $index: number
  $ref: HTMLDivElement | null
  $restTime: number
  $lastStartTime: number
}

/** Functions run without an option receiver. Arrays are also valid synchronous results. */
export type Input = Danmu[] | string | Promise<Danmu[]> | (() => Danmu[] | Promise<Danmu[]>)
export interface SliderStep<Value = number> { name?: string, value?: Value, hide?: boolean, show?: boolean }
export interface Slider<Value = number> { min?: number, max?: number, steps?: SliderStep<Value>[] }
export interface Heatmap {
  xMin?: number
  xMax?: number
  yMin?: number
  yMax?: number
  scale?: number
  opacity?: number
  minHeight?: number
  sampling?: number
  smoothing?: number
  flattening?: number
}

export interface NormalizedOption {
  danmuku: Input
  speed: number
  margin: Margin
  opacity: number
  color: string
  /** Numeric inputs are clamped; values other than 0, 1 and 2 are not emitted. */
  mode: number
  modes: number[]
  fontSize: number | string
  antiOverlap: boolean
  synchronousPlayback: boolean
  mount: HTMLDivElement | string | undefined
  heatmap: boolean | Heatmap
  width: number
  /** Stored configuration; send the points event to draw custom points. */
  points: Point[]
  /** A truthy result accepts the row. */
  filter: (this: NormalizedOption, danmu: NormalizedDanmu) => unknown
  /** Only a result equal to true sends the row; callbacks may be asynchronous. */
  beforeEmit: (this: NormalizedOption, danmu: Danmu) => unknown
  /** A truthy result displays the queue entry; callbacks may be asynchronous. */
  beforeVisible: (this: NormalizedOption, danmu: Item) => unknown
  visible: boolean
  emitter: boolean
  maxLength: number
  lockTime: number
  theme: string
  OPACITY: Slider
  FONT_SIZE: Slider
  MARGIN: Slider<Margin>
  SPEED: Slider
  COLOR: string[]
}

/** The argument object is required; every option inside it is optional. */
export type RuntimeOption = Partial<NormalizedOption>

/** The owner returned by commands is different from the registered plugin facade. */
export interface Owner {
  art: Artplayer
  option: NormalizedOption
  isHide: boolean
  isStop: boolean
  queue: Item[]
  states: Record<State, Item[]>
  readonly readys: Item[]
  readonly speed: number
  readonly fontSize: number
  readonly marginTop: number
  readonly marginBottom: number | string
  readonly isRotate: boolean | undefined
  emit: (danmu: Danmu) => Promise<Owner>
  /** No argument replaces the configured source; a provided argument appends rows. */
  load: (danmuku?: Input) => Promise<Owner>
  config: (option: RuntimeOption) => Owner
  hide: () => Owner
  show: () => Owner
  reset: () => Owner
  start: () => Owner
  stop: () => Owner
  continue: () => Owner
  suspend: () => Owner
  update: () => Owner
  resize: () => void
  seek: () => void
  destroy: () => void
}

export interface RuntimeResult {
  name: 'artplayerPluginDanmuku'
  emit: (danmu: Danmu) => Promise<Owner>
  load: (danmuku?: Input) => Promise<Owner>
  config: (option: RuntimeOption) => Owner
  hide: () => Owner
  show: () => Owner
  reset: () => Owner
  /** The live setting requires a valid mount; omitting it does not select a default. */
  mount: (target: HTMLDivElement | string) => void
  readonly option: NormalizedOption
  readonly isHide: boolean
  readonly isStop: boolean
}

export interface Icons {
  $on: string
  $off: string
  $config: string
  $style: string
  $mode_0_off: string
  $mode_0_on: string
  $mode_1_off: string
  $mode_1_on: string
  $mode_2_off: string
  $mode_2_on: string
  $check_on: string
  $check_off: string
}

export interface RuntimeFactory {
  (option: RuntimeOption): (art: Artplayer) => RuntimeResult
  icons: Icons
}

/** Explicit payload map; importing /runtime does not augment historical Artplayer events. */
export interface EventMap {
  'artplayerPluginDanmuku:points': [points: Point[]]
  'artplayerPluginDanmuku:loaded': [queue: Item[]]
  'artplayerPluginDanmuku:visible': [item: Item]
  'artplayerPluginDanmuku:config': [option: NormalizedOption]
  'artplayerPluginDanmuku:error': [error: unknown]
  'artplayerPluginDanmuku:show': []
  'artplayerPluginDanmuku:hide': []
  'artplayerPluginDanmuku:start': []
  'artplayerPluginDanmuku:stop': []
  'artplayerPluginDanmuku:reset': []
  'artplayerPluginDanmuku:destroy': []
}
