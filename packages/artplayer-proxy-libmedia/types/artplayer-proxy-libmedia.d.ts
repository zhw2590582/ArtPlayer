import type Artplayer from 'artplayer';

export = artplayerProxyLibmedia;
export as namespace artplayerProxyLibmedia;

type Option = {
    //
};

type Result = {
    name: 'artplayerProxyLibmedia';
};

declare const artplayerProxyLibmedia: (option: Option) => (art: Artplayer) => Result;
