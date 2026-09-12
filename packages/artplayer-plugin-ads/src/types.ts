import type Artplayer from 'artplayer'
import type { CompatOption, Option, Result as PublicResult, Translations as PublicTranslations } from '../types/artplayer-plugin-ads'

export type Translations = PublicTranslations

export interface Options extends Option {
  playDuration: number
  totalDuration: number
  i18n: Translations
}

export type Input = CompatOption
export type Host = Pick<Artplayer, 'on' | 'off' | 'emit' | 'play' | 'pause' | 'template' | 'icons' | 'fullscreen' | 'isDestroy'>
export type Utilities = Pick<typeof Artplayer.utils, 'append' | 'query' | 'setStyle'>
export type Icons = Pick<Artplayer['icons'], 'volume' | 'volumeClose' | 'fullscreenOn' | 'fullscreenOff' | 'loading'>
export type Cleanup = () => void

export type Result = PublicResult
