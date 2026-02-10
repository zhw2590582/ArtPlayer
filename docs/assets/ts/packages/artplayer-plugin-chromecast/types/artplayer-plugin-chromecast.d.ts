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

export = packages\artplayerPluginChromecast\types\artplayerPluginChromecast;
export as namespace packages\artplayerPluginChromecast\types\artplayerPluginChromecast;