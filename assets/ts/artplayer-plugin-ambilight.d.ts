import type Artplayer from 'artplayer';

export = artplayerPluginAmbilight;
export as namespace artplayerPluginAmbilight;

type Option = {
    blur?: string;
    opacity?: number;
    frequency?: number;
    zIndex?: number;
    duration?: number;
};

type Result = {
    name: 'artplayerPluginAmbilight';
    start: () => void;
    stop: () => void;
};

declare const artplayerPluginAmbilight: (option: Option) => (art: Artplayer) => Result;
