import type Artplayer from 'artplayer';

export = artplayerPluginAsr;
export as namespace artplayerPluginAsr;

interface AsrPluginOption {
    length?: number;
    interval?: number;
    sampleRate?: number;
    hideTimeout?: number;
    onAudioChunk?: (buffer: ArrayBuffer) => void | Promise<void>;
}

interface AsrPluginInstance {
    name: 'artplayerPluginAsr';
    hide: () => void;
    append: () => void;
}

declare function artplayerPluginAsr(option?: AsrPluginOption): (art: Artplayer) => AsrPluginInstance;
