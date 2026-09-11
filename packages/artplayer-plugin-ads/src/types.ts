import type Artplayer from 'artplayer'

export interface Translations {
  close: string
  countdown: string
  detail: string
  canBeClosed: string
}

export interface Options {
  html?: string
  video?: string
  url?: string
  playDuration: number
  totalDuration: number
  muted?: boolean
  i18n: Translations
}

export type Input = Partial<Options>
export type Host = Pick<Artplayer, 'on' | 'off' | 'emit' | 'play' | 'pause' | 'template' | 'icons' | 'fullscreen' | 'isDestroy'>
export type Utilities = Pick<typeof Artplayer.utils, 'append' | 'query' | 'setStyle'>
export type Icons = Pick<Artplayer['icons'], 'volume' | 'volumeClose' | 'fullscreenOn' | 'fullscreenOff' | 'loading'>
export type Cleanup = () => void

export interface Result {
  name: 'artplayerPluginAds'
  skip: Cleanup
  pause: Cleanup
  play: Cleanup
}
