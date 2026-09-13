// Internal contracts only. Public declarations retain their historical entrypoint.
export interface ThumbnailOptions {
  url?: string
  width?: number
  number?: number
  scale?: number
  height?: number
}

export interface ExtractionConfig {
  url: string
  width: number
  number: number
  scale: number
}

export interface SheetConfig {
  height: number
  column: number
  number: number
  width: number
  scale: number
}

export interface ThumbnailSheet extends SheetConfig { url: string }
export type Cleanup = () => void

export interface ExtractionJob {
  active: () => boolean
  own: (action: Cleanup) => void
  dispose: Cleanup
  fail: (error: unknown) => void
  guard: <Args extends unknown[], Result>(callback: (...args: Args) => Result) => (...args: Args) => Result | undefined
  publish: (blob: Blob | null, config: SheetConfig) => void
}

export interface ThumbnailHost {
  option: { url: string }
  // A host may already hold a partial user configuration; generated sheets are complete.
  thumbnails: { url: string } & Partial<SheetConfig>
  on: (event: string, callback: Cleanup) => unknown
  off: (event: string, callback: Cleanup) => unknown
}
