interface Option {
  'width': string
  'max-width': string
  'min-width': string
}

interface Result {
  name: 'artplayerPluginLiquidGlass'
}

declare const artplayerPluginLiquidGlass: (option?: Option) => (art: Artplayer) => Result

export default artplayerPluginLiquidGlass

export = artplayerPluginLiquidGlass
export as namespace artplayerPluginLiquidGlass;
