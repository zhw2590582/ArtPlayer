import type Artplayer from 'artplayer';

export = artplayerProxyLibmedia;
export as namespace artplayerProxyLibmedia;

type Option = {
    //
};

type Result = HTMLCanvasElement;

declare const artplayerProxyLibmedia: (option: Option) => (art: Artplayer) => Result;
