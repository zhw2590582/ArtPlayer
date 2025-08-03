import type Artplayer from 'artplayer'

type Option = (ctx: CanvasRenderingContext2D, video: HTMLVideoElement) => void

type Result = HTMLCanvasElement

declare const artplayerProxyCanvas: (option: Option) => (art: Artplayer) => Result

export default artplayerProxyCanvas
