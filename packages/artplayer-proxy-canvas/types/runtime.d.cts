import type { RuntimeFactory } from './artplayer-proxy-canvas.js'

declare const artplayerProxyCanvas: RuntimeFactory
// eslint-disable-next-line ts/no-redeclare -- Ambient merge exposes types on the CommonJS factory.
declare namespace artplayerProxyCanvas {
  type Option = import('./artplayer-proxy-canvas.js').Option
  type Result = import('./artplayer-proxy-canvas.js').Result
  type Factory = import('./artplayer-proxy-canvas.js').Factory
  type MediaCanvas = import('./artplayer-proxy-canvas.js').MediaCanvas
  type RuntimeFactory = import('./artplayer-proxy-canvas.js').RuntimeFactory
}
export = artplayerProxyCanvas
