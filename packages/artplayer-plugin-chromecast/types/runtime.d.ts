import type { RuntimeFactory } from './artplayer-plugin-chromecast.js'

declare const artplayerPluginChromecast: RuntimeFactory
// eslint-disable-next-line ts/no-redeclare -- Ambient merge exposes types on the CommonJS factory.
declare namespace artplayerPluginChromecast {
  type Chromecast = import('./artplayer-plugin-chromecast.js').Chromecast
  type ConnectionState = import('./artplayer-plugin-chromecast.js').ConnectionState
  type Factory = import('./artplayer-plugin-chromecast.js').Factory
  type Option = import('./artplayer-plugin-chromecast.js').Option
  type Result = import('./artplayer-plugin-chromecast.js').Result
  type RuntimeFactory = import('./artplayer-plugin-chromecast.js').RuntimeFactory
  type RuntimeOption = import('./artplayer-plugin-chromecast.js').RuntimeOption
  type RuntimeResult = import('./artplayer-plugin-chromecast.js').RuntimeResult
}
export = artplayerPluginChromecast
