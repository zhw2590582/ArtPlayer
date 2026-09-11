// Generated from public/runtime/player.ts by yarn build:types. Do not edit.
import type { Thumbnails } from '../option'
import type { State } from '../player'
import type { MediaSurface } from './media'

export interface QualityItem {
  html: string | HTMLElement
  url: string
  default?: boolean
}
/** Player-facing descriptors; native/proxy method results retain their identity. */
export interface Player<Media extends MediaSurface = MediaSurface> {
  get currentTime(): number
  set currentTime(time: number | string)
  readonly duration: number
  get seek(): undefined
  set seek(time: number | string)
  get forward(): undefined
  set forward(time: number)
  get backward(): undefined
  set backward(time: number)
  get switch(): undefined
  set switch(url: string)
  get quality(): undefined
  set quality(items: QualityItem[])
  get url(): string | null
  set url(value: string)
  get state(): State
  set state(value: string)
  get pip(): Element | null | boolean
  set pip(value: boolean)
  /** The descriptor may be absent before metadata installs the available mode. */
  fullscreen?: boolean
  fullscreenWeb: boolean
  mini: boolean
  volume: number
  muted: boolean
  playbackRate: number
  aspectRatio: string
  flip: string
  poster: string
  theme: string
  type: string
  subtitleOffset: number
  thumbnails: Thumbnails
  readonly loaded: number
  readonly loadedTime: number
  readonly played: number
  readonly playing: boolean
  readonly rect: DOMRect
  readonly bottom: number
  readonly height: number
  readonly left: number
  readonly right: number
  readonly top: number
  readonly width: number
  readonly x: number
  readonly y: number
  play: () => Promise<Awaited<ReturnType<Media['play']>>>
  pause: () => ReturnType<Media['pause']>
  toggle: () => Promise<Awaited<ReturnType<Media['play']>>> | ReturnType<Media['pause']>
  switchUrl: (url: string) => Promise<void>
  switchQuality: (url: string) => Promise<void>
  autoSize: () => void
  autoHeight: () => void
  airplay: () => void
  getDataURL: () => Promise<string>
  getBlobUrl: () => Promise<string>
  screenshot: (name?: string) => Promise<string>
  attr: {
    (key: PropertyKey): unknown
    (key: PropertyKey, value: unknown): unknown
  }
  cssVar: {
    (key: string): string
    (key: string, value: unknown): string | void
  }
}
