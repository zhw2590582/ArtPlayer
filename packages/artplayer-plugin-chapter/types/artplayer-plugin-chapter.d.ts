import type Artplayer from 'artplayer';

export = artplayerPluginChapter;
export as namespace artplayerPluginChapter;

type Option = {
    //
};

type Result = {
    name: 'artplayerPluginChapter';
};

declare const artplayerPluginChapter: (option: Option) => (art: Artplayer) => Result;
