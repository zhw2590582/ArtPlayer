export = artplayerPluginVast
export as namespace artplayerPluginVast;

declare global {
  interface Window {
    artplayerPluginVast?: typeof artplayerPluginVast
  }
}

type PlayUrlFn = (url: string) => void
type PlayResFn = (res: string) => void

interface VastPluginContext {
  art: Artplayer
  ima: typeof google.ima
  imaPlayer: Player
  playUrl: PlayUrlFn
  playRes: PlayResFn
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

export = artplayerPluginVast;
export as namespace artplayerPluginVast;