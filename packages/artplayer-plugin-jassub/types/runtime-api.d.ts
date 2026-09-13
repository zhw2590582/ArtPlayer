// Core exposes a default constructor in Node10/ESM and export= in NodeNext CJS.
// Extract the same instance without requiring esModuleInterop in consumers.
type CoreModule = typeof import('artplayer')
type Artplayer = CoreModule extends { default: { prototype: infer Instance } }
  ? Instance
  : CoreModule extends { prototype: infer Instance } ? Instance : never

export type FontSource = string | Uint8Array

/** Options are read when the registrar runs; the host supplies video by default. */
export interface RuntimeOption {
  video?: HTMLVideoElement | null
  canvas?: HTMLCanvasElement
  blendMode?: 'js' | 'wasm'
  asyncRender?: boolean
  offscreenRender?: boolean
  onDemandRender?: boolean
  targetFps?: number
  timeOffset?: number
  debug?: boolean
  prescaleFactor?: number
  prescaleHeightLimit?: number
  maxRenderHeight?: number
  dropAllAnimations?: boolean
  dropAllBlur?: boolean
  workerUrl?: string
  wasmUrl?: string
  legacyWasmUrl?: string
  modernWasmUrl?: string
  subUrl?: string
  subContent?: string
  fonts?: FontSource[]
  availableFonts?: Record<string, FontSource>
  fallbackFont?: string
  useLocalFonts?: boolean
  libassMemoryLimit?: number
  libassGlyphLimit?: number
}

/** Fields actually serialized by the frozen worker's getEvents response. */
export interface AssEvent {
  /** Milliseconds; distinct from setCurrentTime's seconds. */
  Start: number
  Duration: number
  /** Numeric libass style index, not the ASS text format's style name. */
  Style: number
  Name: string
  MarginL: number
  MarginR: number
  MarginV: number
  Effect: string
  Text: string
  ReadOrder: number
  Layer: number
}

/** Fields actually serialized by the frozen worker's getStyles response. */
export interface AssStyle {
  Name: string
  FontName: string
  FontSize: number
  PrimaryColour: number
  SecondaryColour: number
  OutlineColour: number
  BackColour: number
  Bold: number
  Italic: number
  Underline: number
  StrikeOut: number
  ScaleX: number
  ScaleY: number
  Spacing: number
  Angle: number
  BorderStyle: number
  Outline: number
  Shadow: number
  Alignment: number
  MarginL: number
  MarginR: number
  MarginV: number
  Encoding: number
  treat_fontname_as_pattern: number
  Blur: number
  Justify: number
}

/** Worker mutation handlers assign supplied keys; unspecified fields are not sent. */
export type AssEventInput = Partial<AssEvent>
export type AssStyleInput = Partial<AssStyle>

/** Timeout errors and native Worker error events are separate channels. */
export type WorkerRequestError = Error | ErrorEvent
/**
 * Success supplies null plus an array. Error payloads are absent.
 * The frozen vendor currently throws before notifying this callback on request
 * errors/timeouts; PKG-JASSUB-07 owns that defect. These types do not guarantee
 * callback delivery or claim that the error path has been repaired.
 */
export type EventsCallback = (error: WorkerRequestError | null, events?: AssEvent[]) => void
export type StylesCallback = (error: WorkerRequestError | null, styles?: AssStyle[]) => void

export interface RuntimeEventMap {
  ready: CustomEvent<null>
  error: ErrorEvent
}

/** The actual vendor EventTarget instance, rather than an adapter copy. */
export interface RuntimeInstance extends EventTarget {
  timeOffset: number
  debug: boolean
  prescaleFactor: number
  prescaleHeightLimit: number
  maxRenderHeight: number
  /** Present when the selected rendering path uses demand/busy state. */
  busy?: boolean
  /** These two fields were explicitly exposed by npm jassub 1.8.8. */
  _canvas: HTMLCanvasElement
  _ctx: CanvasRenderingContext2D | false | null

  resize: (width?: number, height?: number, top?: number, left?: number, force?: boolean) => void
  setVideo: (video: HTMLVideoElement) => void
  runBenchmark: () => void
  setTrackByUrl: (url: string) => void
  setTrack: (content: string) => void
  freeTrack: () => void
  setIsPaused: (isPaused: boolean) => void
  setRate: (rate: number) => void
  /** Current time is measured in seconds. */
  setCurrentTime: (isPaused?: boolean, currentTime?: number, rate?: number) => void
  createEvent: (event: AssEventInput) => void
  setEvent: (event: AssEventInput, index: number) => void
  removeEvent: (index: number) => void
  getEvents: (callback: EventsCallback) => void
  createStyle: (style: AssStyleInput) => void
  setStyle: (style: AssStyleInput, index: number) => void
  removeStyle: (index: number) => void
  getStyles: (callback: StylesCallback) => void
  styleOverride: (style: AssStyleInput) => void
  disableStyleOverride: () => void
  setDefaultFont: (font: string) => void
  addFont: (font: FontSource) => void
  /** Resolves after posting the message; it is not a Worker-operation acknowledgement. */
  sendMessage: (target: string, data?: Record<string, unknown> | null, transferable?: Transferable[]) => Promise<void>
  destroy: (() => void) & ((error: Error) => Error) & ((error: string) => Error | '') & ((error: Error | string | undefined) => Error | '' | undefined)

  addEventListener: (<Name extends keyof RuntimeEventMap>(type: Name, listener: (this: RuntimeInstance, event: RuntimeEventMap[Name]) => void, options?: boolean | AddEventListenerOptions) => void) & ((type: string, listener: EventListenerOrEventListenerObject | null, options?: boolean | AddEventListenerOptions) => void)
  removeEventListener: (<Name extends keyof RuntimeEventMap>(type: Name, listener: (this: RuntimeInstance, event: RuntimeEventMap[Name]) => void, options?: boolean | EventListenerOptions) => void) & ((type: string, listener: EventListenerOrEventListenerObject | null, options?: boolean | EventListenerOptions) => void)
}

export interface RuntimeResult {
  name: 'artplayerPluginJassub'
  instance: RuntimeInstance
}

export type RuntimeFactory = (option?: RuntimeOption) => (art: Artplayer) => RuntimeResult
