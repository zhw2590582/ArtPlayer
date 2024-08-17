import type Artplayer from 'artplayer';

export = artplayerPluginCanvas;
export as namespace artplayerPluginCanvas;

type Option = {
    //
};

type Result = {
    name: 'artplayerPluginCanvas';
};

declare const artplayerPluginCanvas: (option: Option) => (art: Artplayer) => Result;
