import type { google, ImaSdk } from '@alugha/ima'
import type { Player, PlayerOptions } from '@glomex/vast-ima-player'
import type Artplayer from 'artplayer'

export type Utilities = Pick<typeof Artplayer.utils, 'createElement' | 'setStyles'>
export type RequestConfig = Record<string, unknown>

export interface Context {
  art: Artplayer
  playUrl: (url: string, config?: RequestConfig) => void
  playRes: (response: string, config?: RequestConfig) => void
  init: () => Player | null
  ima: ImaSdk
  adsRenderingSettings: google.ima.AdsRenderingSettings
  playerOptions: PlayerOptions
  readonly imaPlayer: Player | null
  readonly container: HTMLDivElement | null
}

export type Callback = (context: Context) => unknown
export interface Result {
  name: 'artplayerPluginVast'
  destroy: () => void
}
