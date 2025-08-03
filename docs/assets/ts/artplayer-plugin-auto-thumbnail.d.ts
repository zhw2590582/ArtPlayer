import type Artplayer from 'artplayer'

export = artplayerPluginAutoThumbnail
export as namespace artplayerPluginAutoThumbnail;

interface Option {
  url?: string
  width?: number
  number?: number
  scale?: number
}

interface Result {
  name: 'artplayerPluginAutoThumbnail'
}

declare const artplayerPluginAutoThumbnail: (option: Option) => (art: Artplayer) => Result
