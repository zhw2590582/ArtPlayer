interface Option {
  blur?: string
  opacity?: number
  frequency?: number
  zIndex?: number
  duration?: number
}

interface Result {
  name: 'artplayerPluginAmbilight'
  start: () => void
  stop: () => void
}

declare const artplayerPluginAmbilight: (option: Option) => (art: Artplayer) => Result

export default artplayerPluginAmbilight

export = packages\artplayerPluginAmbilight\types\artplayerPluginAmbilight;
export as namespace packages\artplayerPluginAmbilight\types\artplayerPluginAmbilight;