type Option = (ctx: CanvasRenderingContext2D, video: HTMLVideoElement) => void

type Result = HTMLCanvasElement

declare const artplayerProxyCanvas: (option?: Option) => (art: Artplayer) => Result

export default artplayerProxyCanvas

export = packages\artplayerProxyCanvas\types\artplayerProxyCanvas;
export as namespace packages\artplayerProxyCanvas\types\artplayerProxyCanvas;