import type Artplayer from 'artplayer'

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

export default artplayerPluginAutoThumbnail
