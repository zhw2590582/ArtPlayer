import type Artplayer from 'artplayer';

export = artplayerPluginAliyundrive;
export as namespace artplayerPluginAliyundrive;

type Option = {
    onlyOnFullscreen?: Boolean;
    playlist?: {
        poster?: String;
        name?: String;
        time?: String;
        quality?: { html: String; url: String }[];
    }[];
};

type Aliyundrive = {
    name: 'artplayerPluginAliyundrive';
    next: Function;
    prev: Function;
};

declare const artplayerPluginAliyundrive: (option: Option) => (art: Artplayer) => Aliyundrive;
