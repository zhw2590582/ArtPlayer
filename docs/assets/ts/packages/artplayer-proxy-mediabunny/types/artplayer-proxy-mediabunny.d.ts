interface Option {
  /**
   * Timeout for loading media in milliseconds
   * @default 0
   */
  loadTimeout?: number

  /**
   * Interval for timeupdate events in milliseconds
   * @default 250
   */
  timeupdateInterval?: number

  /**
   * Audio-video synchronization tolerance in seconds
   * @default 0.12
   */
  avSyncTolerance?: number

  /**
   * Whether to drop late video frames
   * @default false
   */
  dropLateFrames?: boolean

  /**
   * Poster image URL
   */
  poster?: string

  /**
   * Media source (URL, Blob, or ReadableStream)
   */
  source?: string | Blob | ReadableStream<Uint8Array>

  /**
   * Check if server supports range requests before loading
   * @default false
   */
  preflightRange?: boolean

  /**
   * Initial volume (0-1)
   * @default 0.7
   */
  volume?: number

  /**
   * Initial muted state
   * @default false
   */
  muted?: boolean

  /**
   * Autoplay
   * @default false
   */
  autoplay?: boolean

  /**
   * Loop playback
   * @default false
   */
  loop?: boolean

  /**
   * Cross-origin setting
   */
  crossOrigin?: string
}

type Result = HTMLCanvasElement

declare const artplayerProxyMediabunny: (option?: Option) => (art: Artplayer) => Result

export default artplayerProxyMediabunny

export = packages\artplayerProxyMediabunny\types\artplayerProxyMediabunny;
export as namespace packages\artplayerProxyMediabunny\types\artplayerProxyMediabunny;