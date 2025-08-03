import type Artplayer from 'artplayer'

interface Option {
  url?: string
  sdk?: string
  icon?: string
  mimeType?: string
}

interface Chromecast {
  name: 'artplayerPluginChromecast'
}

declare const artplayerPluginChromecast: (option: Option) => (art: Artplayer) => Chromecast

export default artplayerPluginChromecast
