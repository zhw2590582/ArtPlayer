export interface SheetOptions {
  number: number
  width: number
  height: number
  column: number
  begin: number
  end: number
}

export interface InputOptions extends Partial<SheetOptions> {
  fileInput?: Element
  [name: string]: unknown
}

export interface RuntimeOptions extends SheetOptions {
  fileInput: HTMLInputElement
  [name: string]: unknown
}

export interface ScreenshotPoint {
  time: number
  x: number
  y: number
}

export interface ThumbnailEvents extends Record<PropertyKey, unknown[]> {
  file: [file: File]
  video: [video: HTMLVideoElement]
  canvas: [canvas: HTMLCanvasElement]
  update: [url: string, progress: number]
  done: []
  download: [name: string]
  error: [message: string | undefined]
  destroy: []
}

export type Cleanup = () => void

export interface ExtractionJob {
  video: HTMLVideoElement
  promise: Promise<void>
  ready: (synchronous?: boolean) => void
  fail: (error: unknown, report?: boolean) => void
  cancel: (reason: string) => void
  adopt: (epoch: number) => boolean
  reported?: unknown
  wasReported?: boolean
}

export interface LifecycleState {
  closed: boolean
  epoch: number
  inputEpoch: number
  job: ExtractionJob | null
  video: HTMLVideoElement | null
  sourceUrl: string | null
  thumbnailUrl: string | null
  sourceUrls: Set<string>
  thumbnailUrls: Set<string>
  sourceListeners: Cleanup[]
  loading: boolean
}
