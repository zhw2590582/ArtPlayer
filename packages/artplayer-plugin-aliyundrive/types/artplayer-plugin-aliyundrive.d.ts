import type Artplayer from 'artplayer';

export = artplayerPluginAliyundrive;
export as namespace artplayerPluginAliyundrive;

type Option = {
    //
};

type Aliyundrive = {
    name: 'artplayerPluginAliyundrive';
};

declare const artplayerPluginAliyundrive: (option: Option) => (art: Artplayer) => Aliyundrive;
