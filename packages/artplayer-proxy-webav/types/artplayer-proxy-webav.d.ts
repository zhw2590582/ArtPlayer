import type Artplayer from 'artplayer';

export = artplayerProxyWebAV;
export as namespace artplayerProxyWebAV;

type Option = {
    //
};

type Result = HTMLCanvasElement;

declare const artplayerProxyWebAV: (option: Option) => (art: Artplayer) => Result;
