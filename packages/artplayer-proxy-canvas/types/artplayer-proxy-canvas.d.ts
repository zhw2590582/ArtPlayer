import type Artplayer from 'artplayer';

export = artplayerProxyCanvas;
export as namespace artplayerProxyCanvas;

type Option = (video: HTMLVideoElement, url: String, art: Artplayer) => void;

type Result = HTMLCanvasElement;

declare const artplayerProxyCanvas: (option: Option) => (art: Artplayer) => Result;
