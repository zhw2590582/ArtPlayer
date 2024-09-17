import type Artplayer from 'artplayer';

export = artplayerProxyCanvas;
export as namespace artplayerProxyCanvas;

type Option = (ctx: CanvasRenderingContext2D, video: HTMLVideoElement) => void;

type Result = HTMLCanvasElement;

declare const artplayerProxyCanvas: (option: Option) => (art: Artplayer) => Result;
