interface Option {
  eventDelay?: number
  loadTimeout?: number
  timeupdateInterval?: number
  avSyncTolerance?: number
  dropLateFrames?: boolean
  poster?: string
  source?: string | Blob | ReadableStream<Uint8Array>
  preflightRange?: boolean
}

type Result = HTMLCanvasElement

declare const artplayerProxyMediabunny: (option?: Option) => (art: Artplayer) => Result

export default artplayerProxyMediabunny

export = artplayerProxyMediabunny;
export as namespace artplayerProxyMediabunny;
