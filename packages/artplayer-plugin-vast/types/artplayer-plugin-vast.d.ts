import type Artplayer from 'artplayer';

export = artplayerPluginVast;
export as namespace artplayerPluginVast;

type Option = {
    //
};

type Vast = {
    name: 'artplayerPluginVast';
};

declare const artplayerPluginVast: (option: Option) => (art: Artplayer) => Vast;
