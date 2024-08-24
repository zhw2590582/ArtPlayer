import type Artplayer from 'artplayer';

export = artplayerProxyFlv;
export as namespace artplayerProxyFlv;

type Option = {
    //
};

type Result = HTMLCanvasElement;

declare const artplayerProxyFlv: (option: Option) => (art: Artplayer) => Result;
