import type Artplayer from 'artplayer';

export = ArtplayerPluginCanvas;
export as namespace ArtplayerPluginCanvas;

type Option = {
    //
};

type Result = {
    name: 'ArtplayerPluginCanvas';
};

declare const ArtplayerPluginCanvas: (option: Option) => (art: Artplayer) => Result;
