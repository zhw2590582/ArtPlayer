import type Artplayer from 'artplayer'
import type { Subtitle, Utils } from 'artplayer'
import type legacyFactory from '../types/artplayer-plugin-multiple-subtitles'
import type { ParseResult } from './parser'

export type LegacyOption = Parameters<typeof legacyFactory>[0]
export type TrackOption = LegacyOption['subtitles'][number]
export interface Option {
  subtitles?: TrackOption[]
}
export interface Result {
  name: 'multipleSubtitles'
  tracks: (names?: string[]) => void
  reset: () => void
}
export interface Track extends ParseResult {
  url: string | undefined
  name: string | undefined
}
export type Converters = Pick<Utils, 'getExt' | 'srtToVtt' | 'assToVtt'>
export type Cleanup = () => void
export interface Lifetime {
  readonly closed: boolean
  own: (cleanup: Cleanup) => () => boolean
  wait: <Value>(value: Value | PromiseLike<Value>) => Promise<Value | void>
  dispose: Cleanup
}
export type LifetimeHost = Pick<Artplayer, 'isDestroy' | 'on' | 'off'>
export interface RenderHost {
  option: { subtitle?: Subtitle }
  subtitle: { init: (option: Subtitle) => unknown }
}
export interface OwnedURL {
  free: Cleanup
}
