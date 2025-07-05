import type Artplayer from 'artplayer';

export = artplayerPluginAutoThumbnail;
export as namespace artplayerPluginAutoThumbnail;

type Option = {
    url?: string;
    width?: number;
    number?: number;
    scale?: number;
};

type Result = {
    name: 'artplayerPluginAutoThumbnail';
};

declare const artplayerPluginAutoThumbnail: (option: Option) => (art: Artplayer) => Result;
