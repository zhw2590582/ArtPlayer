import type { Input } from 'mediabunny'
import type { ProxyOptions } from './engine-types'
import type EventTarget from './EventTarget'
import type { PlaybackMedia } from './media'

export interface AudioPort {
  readonly currentTime: number
  duration: number
  paused: boolean
  load: (media: PlaybackMedia, metadata?: () => void) => Promise<void>
  play: () => Promise<void>
  pause: () => void
  seek: (time: number) => Promise<void>
  setVolume: (volume: number, muted: boolean) => void
  setPlaybackRate: (rate: number) => void
  handleNoAudioTrack: () => void
  destroy: () => void
}

export interface VideoPort {
  width: number
  height: number
  duration: number
  preflight: (source: unknown, signal?: AbortSignal, current?: () => boolean) => Promise<boolean>
  load: (media: PlaybackMedia, metadata?: () => void) => Promise<void>
  start: (clock: AudioPort) => void
  stop: () => void
  seek: (time: number) => Promise<void>
  setPlaybackRate: (rate: number) => void
  handleNoVideoTrack: () => void
  destroy: () => void
}

export interface VideoOptions {
  canvas: HTMLCanvasElement
  ctx: CanvasRenderingContext2D | null
  events: EventTarget
  timeupdateInterval: number
  avSyncTolerance: number
  dropLateFrames: boolean
  poster: string
  preflightRange: boolean
}

export interface PlaybackHost {
  audio: AudioPort
  video: VideoPort
  events: EventTarget
  readonly destroyed: boolean
  readonly loadSeq: number
  paused: boolean
  ended: boolean
  seeking: boolean
  readyState: number
  networkState: number
  media: PlaybackMedia | null
  input: Input | null
  option: ProxyOptions
  reportError: (error: unknown) => void
}
