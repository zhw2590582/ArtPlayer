import type { google, ImaSdk } from '@alugha/ima'
import type { Player, PlayerOptions } from '@glomex/vast-ima-player'
import type Artplayer from 'artplayer'

export type RequestConfig = Record<string, unknown>

export interface CompatibilityOptions {
  compatibility?: 'workspace-1.2'
}

export interface Context {
  art: Artplayer
  ima: ImaSdk
  adsRenderingSettings: google.ima.AdsRenderingSettings
  playerOptions: PlayerOptions
  playUrl: (url: string, config?: RequestConfig) => void
  playRes: (response: string, config?: RequestConfig) => void
  init: () => Player | null
  readonly container: HTMLDivElement | null
}

/** Published data fields retain their last allocation after release. */
export interface PublishedContext extends Context {
  imaPlayer: Player
  id: string
  $container: HTMLDivElement
}

/** Resource getters are null before initialization and after release. */
export interface WorkspaceContext extends Context {
  readonly imaPlayer: Player | null
  readonly id: string | null
  readonly $container: HTMLDivElement | null
}

export type RuntimeContext = PublishedContext | WorkspaceContext
export type RuntimeCallback<T extends RuntimeContext = RuntimeContext> = (context: T) => unknown

export interface RuntimeResult {
  name: 'artplayerPluginVast'
  destroy: () => void
}

export type Registration = (art: Artplayer) => Promise<RuntimeResult>

export interface RuntimeFactory {
  (callback?: RuntimeCallback<PublishedContext>, options?: { compatibility?: undefined }): Registration
  (callback: RuntimeCallback<WorkspaceContext> | undefined, options: { compatibility: 'workspace-1.2' }): Registration
  (callback: RuntimeCallback | undefined, options: CompatibilityOptions): Registration
  default: RuntimeFactory
}

export type ArtplayerPluginVastOption = RuntimeCallback<WorkspaceContext>
export type ArtplayerPluginVastInstance = RuntimeResult
