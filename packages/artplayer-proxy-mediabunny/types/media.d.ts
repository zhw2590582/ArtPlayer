import type Artplayer from 'artplayer'

export interface HlsLevel {
  id: number
  index: number
  name: string | null
  height: number
  bitrate: number
  /** SDK object; narrow with the SDK version used by your application. */
  track: unknown
}

export interface HlsAudio {
  id: number
  index: number
  name: string | null
  lang: string
  language: string
  bitrate: number
  /** SDK object; narrow with the SDK version used by your application. */
  track: unknown
}

export interface HlsState {
  levels: HlsLevel[]
  audios: HlsAudio[]
  currentLevel: HlsLevel | null
  currentAudio: HlsAudio | null
  videoMode: 'auto' | 'manual'
  audioMode: 'auto' | 'manual'
}

/** Historical RAF estimates, not decoded-frame or network timing measurements. */
export interface SyntheticFrameMetadata {
  /** Historical media time in seconds, unlike the native video API. */
  presentationTime: number
  expectedDisplayTime: number
  width: number
  height: number
  mediaTime: number
  presentedFrames: number
  processingDuration: number
  captureTime: number
  receiveTime: number
  rtpTimestamp: number
}

export type SyntheticFrameCallback = (now: number, metadata: SyntheticFrameMetadata) => void
export type MediaListener = (event: Event & { detail: unknown }) => unknown

/** Opt-in media surface of art.mediabunny; decoder internals are not part of this view. */
export interface MediaBunnyShim {
  canvas: HTMLCanvasElement
  /** Runtime also accepts SDK sources; the default Option keeps its historical input union. */
  src: unknown
  readonly currentSrc: unknown
  currentTime: number
  readonly duration: number
  /** Synthetic full-duration/current-time ranges, not measured network buffers. */
  readonly buffered: TimeRanges
  readonly played: TimeRanges
  readonly seekable: TimeRanges
  readonly paused: boolean
  readonly playing: boolean
  readonly ended: boolean
  readonly seeking: boolean
  readonly readyState: number
  readonly networkState: number
  readonly error: { code: number, message: string } | null
  volume: number
  muted: boolean
  playbackRate: number
  readonly videoWidth: number
  readonly videoHeight: number
  poster: string
  /** The following setters are inert; use Option for autoplay/loop/crossOrigin. */
  autoplay: boolean
  loop: boolean
  controls: boolean
  playsInline: boolean
  crossOrigin: string
  preload: string
  defaultMuted: boolean
  defaultPlaybackRate: number
  play: () => Promise<void>
  pause: () => void
  load: () => void
  /** Always returns "maybe"; it does not probe codec/browser support. */
  canPlayType: (type: string) => 'maybe'
  getM3u8State: () => Promise<HlsState | null>
  switchM3u8Quality: (value: unknown) => Promise<void>
  switchM3u8Audio: (value: unknown) => Promise<void>
  createTimeRanges: (start: number, end: number) => TimeRanges
  requestVideoFrameCallback: (callback: SyntheticFrameCallback) => number
  cancelVideoFrameCallback: (id: number) => void
  addEventListener: (type: string, listener: MediaListener) => void
  removeEventListener: (type: string, listener: MediaListener) => void
  getBoundingClientRect: () => DOMRect
  setAttribute: (name: string, value: unknown) => void
  destroy: () => void
}

/** Native Canvas methods win collisions, including DOM event and attribute methods. */
export type MediaBunnyCanvas = HTMLCanvasElement & Omit<MediaBunnyShim, keyof HTMLCanvasElement>

/** The alias is installed by the proxy and removed on player destruction. */
export type MediaBunnyPlayer = Artplayer & { mediabunny?: MediaBunnyShim }
