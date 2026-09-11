// Generated from public/runtime/media.ts by yarn build:types. Do not edit.
export type MediaState = Pick<HTMLMediaElement, 'currentTime' | 'duration' | 'paused' | 'ended' | 'readyState'> & {
  readonly playing?: boolean
}
export interface PlaybackMethods<PlayResult = unknown, PauseResult = unknown> {
  play: () => PlayResult
  pause: () => PauseResult
}
export interface OptionalMediaCapabilities {
  readonly textTracks?: ArrayLike<TextTrack>
  readonly error?: unknown
  requestPictureInPicture?: () => Promise<PictureInPictureWindow>
  requestVideoFrameCallback?: (callback: VideoFrameRequestCallback) => number
  cancelVideoFrameCallback?: (handle: number) => void
  webkitEnterFullscreen?: () => void
  webkitExitFullscreen?: () => void
  readonly webkitSupportsFullscreen?: boolean
  webkitShowPlaybackTargetPicker?: () => void
  webkitSupportsPresentationMode?: (mode: string) => boolean
  webkitSetPresentationMode?: (mode: string) => void
  readonly webkitPresentationMode?: string
  readonly webkitDisplayingFullscreen?: boolean
}
export type NativeMedia = Omit<HTMLVideoElement, keyof OptionalMediaCapabilities> & OptionalMediaCapabilities
export type CanvasMedia = HTMLCanvasElement & MediaState & PlaybackMethods & OptionalMediaCapabilities & {
  src: string | null
  readonly currentSrc: string | null
  readonly videoWidth: number
  readonly videoHeight: number
  readonly buffered: TimeRanges
  volume: number
  muted: boolean
  playbackRate: number
  load: () => unknown
}
/** Check optional capabilities before calling them on a native or proxy surface. */
export type MediaSurface = NativeMedia | CanvasMedia
