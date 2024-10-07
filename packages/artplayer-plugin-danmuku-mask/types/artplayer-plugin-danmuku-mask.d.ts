import type Artplayer from 'artplayer';

export = artplayerPluginDanmukuMask;
export as namespace artplayerPluginDanmukuMask;

type Option = {
    //
};

type Result = {
    name: 'artplayerPluginDanmukuMask';
};

declare const artplayerPluginDanmukuMask: (option: Option) => (art: Artplayer) => Result;
