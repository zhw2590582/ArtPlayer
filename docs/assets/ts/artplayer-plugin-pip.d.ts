interface Option {
  width?: number
  height?: number
  placeholder?: string
}

interface Result {
  name: 'artplayerPluginPip'
}

declare const artplayerPluginPip: (option: Option) => (art: Artplayer) => Result

export default artplayerPluginPip

export = artplayerPluginPip;
export as namespace artplayerPluginPip;