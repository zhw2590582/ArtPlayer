import type Artplayer from 'artplayer';

export = artplayerPluginVast;
export as namespace artplayerPluginVast;

type Option = {
    //
};

type Result = {
    name: 'artplayerPluginVast';
};

declare const artplayerPluginVast: (option: Option) => (art: Artplayer) => Result;
