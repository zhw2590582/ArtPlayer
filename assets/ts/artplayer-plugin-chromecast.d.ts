import type Artplayer from 'artplayer';

export = artplayerPluginChromecast;
export as namespace artplayerPluginChromecast;

type Option = {
    url?: string;
    sdk?: string;
    icon?: string;
    mimeType?: string;
};

type Chromecast = {
    name: 'artplayerPluginChromecast';
};

declare const artplayerPluginChromecast: (option: Option) => (art: Artplayer) => Chromecast;
