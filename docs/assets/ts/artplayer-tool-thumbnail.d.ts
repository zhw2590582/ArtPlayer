// Generated from the package public declaration by yarn build:ts. Do not edit.
/** Extract PNG thumbnail sheets from a locally selected video file. */
declare class ArtplayerToolThumbnail {
  constructor(option?: ArtplayerToolThumbnail.Option)
  static readonly DEFAULTS: ArtplayerToolThumbnail.SheetOptions
  static ondragover(event: DragEvent): void
  static creatVideo(): HTMLVideoElement
  processing: boolean
  option: ArtplayerToolThumbnail.ResolvedOption
  video: HTMLVideoElement
  duration: number
  density: number | undefined
  file: File | undefined
  videoUrl: string | undefined
  thumbnailUrl: string | undefined
  e?: ArtplayerToolThumbnail.EventRegistry
  setup(option?: ArtplayerToolThumbnail.Option): this
  inputChange(event: Event): void
  ondrop(event: DragEvent): void
  loadVideo(file?: File | null): void
  /** Ready-metadata preflight may throw synchronously. Cancellation rejects with AbortError. */
  start(): Promise<void>
  creatScreenshotDate(): ArtplayerToolThumbnail.ScreenshotPoint[]
  creatCanvas(): HTMLCanvasElement
  download(): this
  errorHandle(condition: unknown, message: string): void
  destroy(): void
  on<Name extends PropertyKey, Custom extends unknown[], Context>(name: Name, callback: (this: Context, ...args: ArtplayerToolThumbnail.EventArgs<Name, Custom>) => unknown, ctx?: Context): this
  once<Name extends PropertyKey, Custom extends unknown[], Context>(name: Name, callback: (this: Context, ...args: ArtplayerToolThumbnail.EventArgs<Name, Custom>) => unknown, ctx?: Context): this
  emit<Name extends PropertyKey, Custom extends unknown[]>(name: Name, ...args: ArtplayerToolThumbnail.EventArgs<Name, Custom>): this
  off<Name extends PropertyKey, Custom extends unknown[]>(name: Name, callback?: ArtplayerToolThumbnail.Listener<ArtplayerToolThumbnail.EventArgs<Name, Custom>>): this
}
declare namespace ArtplayerToolThumbnail {
  interface SheetOptions {
    number: number
    width: number
    height: number
    column: number
    begin: number
    end: number
  }
  /** fileInput must be a file input or an Element wrapper when constructing. */
  interface Option extends Partial<SheetOptions> {
    fileInput?: Element
    [name: string]: unknown
  }
  interface ResolvedOption extends SheetOptions {
    fileInput: HTMLInputElement
    [name: string]: unknown
  }
  interface ScreenshotPoint {
    time: number
    x: number
    y: number
  }
  interface Events {
    file: [
            file: File,
    ]
    video: [
            video: HTMLVideoElement,
    ]
    canvas: [
            canvas: HTMLCanvasElement,
    ]
    update: [
            url: string,
            progress: number,
    ]
    done: [
    ]
    download: [
            name: string,
    ]
    /** Built-in failures are strings; user callbacks may throw any message value. */
    error: [
            message: unknown,
    ]
    destroy: [
    ]
  }
  type EventArgs<Name extends PropertyKey, Custom extends unknown[] = unknown[]> = Name extends keyof Events ? [
    ...Events[Name],
  ] : Custom
  type Listener<Args extends unknown[]> = ((...args: Args) => unknown) & {
    _?: (...args: Args) => unknown
  }
  /** Heterogeneous listener storage; dispatch through emit to retain event argument checks. */
  type EventRegistry = Partial<Record<PropertyKey, {
    fn: Listener<never[]>
    ctx: unknown
  }[]>>
}
export = ArtplayerToolThumbnail
export as namespace ArtplayerToolThumbnail;
