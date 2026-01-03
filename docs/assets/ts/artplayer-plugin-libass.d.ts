declare const artplayerPluginAss: (options: Options) => (art: Artplayer) => {
  name: 'artplayerPluginLibass'
  libass: SubtitlesOctopus
  visible: boolean
  init: () => void
  switch: (url: string) => void
  show: () => void
  hide: () => void
  destroy: () => void
}

export default artplayerPluginAss

export = artplayerPluginLibass
export as namespace artplayerPluginLibass;
