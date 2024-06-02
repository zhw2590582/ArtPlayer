import type Artplayer from 'artplayer';

export = artplayerPluginChapter;
export as namespace artplayerPluginChapter;

type Option = {
    chapters?: {
        start: number;
        end: number;
        title: string;
    }[];
};

type Result = {
    name: 'artplayerPluginChapter';
};

declare const artplayerPluginChapter: (option: Option) => (art: Artplayer) => Result;
