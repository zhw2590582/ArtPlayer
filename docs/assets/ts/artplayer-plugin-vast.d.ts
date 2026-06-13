declare global {
  interface Window {
    artplayerPluginVast?: typeof artplayerPluginVast
  }
}

type PlayUrlFn = (url: string, config?: any) => void
type PlayResFn = (res: string, config?: any) => void

interface VastPluginContext {
  art: Artplayer
  ima: any
  imaPlayer: Player | null
  playUrl: PlayUrlFn
  playRes: PlayResFn
  init: () => Player
  adsRenderingSettings: any
  playerOptions: PlayerOptions
  container: HTMLDivElement | null
}

export type ArtplayerPluginVastOption = (params: VastPluginContext) => void | Promise<void>

export interface ArtplayerPluginVastInstance {
  name: 'artplayerPluginVast'
  destroy?: () => void
}

declare function artplayerPluginVast(
  option: ArtplayerPluginVastOption,
): (art: Artplayer) => ArtplayerPluginVastInstance

export default artplayerPluginVast

export = artplayerPluginVast;
export as namespace artplayerPluginVast;