import type Artplayer from 'artplayer';

export = artplayerProxyCanvas;
export as namespace artplayerProxyCanvas;

declare const artplayerProxyCanvas: () => (art: Artplayer) => HTMLCanvasElement;
