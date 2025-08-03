import type Artplayer from 'artplayer'

export = artplayerPluginAmbilight
export as namespace artplayerPluginAmbilight;

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
