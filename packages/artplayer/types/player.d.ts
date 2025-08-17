import type { CssVar } from './cssVar'
import type { CustomType, Thumbnails } from './option'
import type { Quality } from './quality'

export type AspectRatio = 'default' | '4:3' | '16:9' | (`${number}:${number}` & Record<never, never>)
export type PlaybackRate = 0.5 | 0.75 | 1.0 | 1.25 | 1.5 | 1.75 | 2.0 | (number & Record<never, never>)
export type Flip = 'normal' | 'horizontal' | 'vertical' | (string & Record<never, never>)
export type State = 'standard' | 'mini' | 'pip' | 'fullscreen' | 'fullscreenWeb'

export declare class Player {
  get aspectRatio(): AspectRatio
  set aspectRatio(ratio: AspectRatio)

  get state(): State
  set state(state: State)

  get type(): CustomType
  set type(name: CustomType)

  get playbackRate(): PlaybackRate
  set playbackRate(rate: PlaybackRate)

  get currentTime(): number
  set currentTime(time: number)

  get duration(): number
  get played(): number
  get playing(): boolean

  get flip(): Flip
  set flip(state: Flip)

  get fullscreen(): boolean
  set fullscreen(state: boolean)

  get fullscreenWeb(): boolean
  set fullscreenWeb(state: boolean)

  get loaded(): number
  get loadedTime(): number

  get mini(): boolean
  set mini(state: boolean)

  get pip(): boolean
  set pip(state: boolean)

  get poster(): string
  set poster(url: string)

  get rect(): DOMRect
  get bottom(): number
  get height(): number
  get left(): number
  get right(): number
  get top(): number
  get width(): number
  get x(): number
  get y(): number

  set seek(time: number)
  get seek(): number

  set forward(time: number)
  get forward(): number

  set backward(time: number)
  get backward(): number

  get url(): string
  set url(url: string)

  get volume(): number
  set volume(percentage: number)

  get muted(): boolean
  set muted(state: boolean)

  get title(): string
  set title(title: string)

  get theme(): string
  set theme(theme: string)

  get subtitleOffset(): number
  set subtitleOffset(time: number)

  get switch(): string
  set switch(url: string)

  get quality(): Quality[]
  set quality(quality: Quality[])

  get thumbnails(): Thumbnails
  set thumbnails(thumbnails: Thumbnails)

  pause(): void
  play(): Promise<void>
  toggle(): void

  attr(key: string, value?: unknown): unknown
  cssVar<T extends keyof CssVar>(key: T, value?: CssVar[T]): CssVar[T]

  switchUrl(url: string): Promise<void>
  switchQuality(url: string): Promise<void>

  getDataURL(): Promise<string>
  getBlobUrl(): Promise<string>
  screenshot(name?: string): Promise<string>

  airplay(): void
  autoSize(): void
  autoHeight(): void
}
