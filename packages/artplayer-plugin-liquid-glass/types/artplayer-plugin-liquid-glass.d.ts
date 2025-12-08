import type Artplayer from 'artplayer'

interface Option {
  //
}

interface Result {
  name: 'artplayerPluginLiquidGlass'
}

declare const artplayerPluginLiquidGlass: (option: Option) => (art: Artplayer) => Result

export default artplayerPluginLiquidGlass
