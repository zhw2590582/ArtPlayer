import type factory from '../types/artplayer-proxy-mediabunny'
import type EventTarget from './EventTarget'
import type { MediaEvent } from './EventTarget'
import type { getHlsState } from './hls-state'

export type ProxyOptions = NonNullable<Parameters<typeof factory>[0]>
export type HlsState = Awaited<ReturnType<typeof getHlsState>>

export interface ShimHost {
  constructor: { config: { events: readonly string[] } }
  option: { url?: unknown }
  emit: (type: string, event: MediaEvent) => unknown
}

export interface EngineOptions {
  canvas: HTMLCanvasElement
  ctx: CanvasRenderingContext2D | null
  events: EventTarget
  option?: ProxyOptions
}

// Transitional boundary for the coordinator; replaced by its strict implementation in MB-04.
export interface EnginePort {
  readonly currentTime: number
  readonly duration: number
  readonly videoWidth: number
  readonly videoHeight: number
  paused: boolean
  ended: boolean
  seeking: boolean
  readyState: number
  networkState: number
  error: { code: number, message: string } | null
  play: () => Promise<void>
  pause: () => void
  load: (source: unknown) => Promise<void>
  seek: (time: number) => Promise<void>
  destroy: () => void
  setVolume: (volume: number, muted: boolean) => void
  setPlaybackRate: (rate: number) => void
  getHlsState: () => Promise<HlsState>
  selectHlsQuality: (value: unknown) => Promise<void>
  selectHlsAudio: (value: unknown) => Promise<void>
}
