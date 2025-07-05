import type Artplayer from 'artplayer';
import type SubtitlesOctopus from '@hrgui/libass-wasm-ts';
import { type Options } from 'libass-wasm';

export = artplayerPluginAss;
export as namespace artplayerPluginAss;

declare const artplayerPluginAss: (options: Options) => (art: Artplayer) => {
    name: 'artplayerPluginLibass';
    libass: SubtitlesOctopus;
    visible: boolean;
    init: () => void;
    switch: (url: string) => void;
    show: () => void;
    hide: () => void;
    destroy: () => void;
};
