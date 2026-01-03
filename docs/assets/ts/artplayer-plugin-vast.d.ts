declare global {
  interface Window {
    artplayerPluginVast?: typeof artplayerPluginVast
  }
}

type PlayUrlFn = (url: string) => void
type PlayResFn = (res: string) => void

interface VastPluginContext {
  art: Artplayer
  ima: any // Replace 'any' with a more specific type if available, or declare google.ima type above
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

export default artplayerPluginVast

export = artplayerPluginVast;
export as namespace artplayerPluginVast;