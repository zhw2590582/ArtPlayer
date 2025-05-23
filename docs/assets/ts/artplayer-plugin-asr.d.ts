import type Artplayer from 'artplayer';

export = artplayerPluginAsr;
export as namespace artplayerPluginAsr;

interface AsrPluginOption {
    length?: number;
    interval?: number;
    sampleRate?: number;
    autoHideTimeout?: number;
    onAudioChunk?: (buffer: ArrayBuffer) => void | Promise<void>;
}

interface AsrPluginInstance {
    name: 'artplayerPluginAsr';
    stop: () => void;
    hide: () => void;
    append: () => void;
}

declare function artplayerPluginAsr(option?: AsrPluginOption): (art: Artplayer) => AsrPluginInstance;
