import type Artplayer from 'artplayer';

export = artplayerPluginAsr;
export as namespace artplayerPluginAsr;

interface AsrPluginOption {
    interval?: number;
    sampleRate?: number;
    cleanupTimeout?: number;
    onAudioChunk?: (buffer: ArrayBuffer) => void | Promise<void>;
}

interface AsrPluginInstance {
    name: 'artplayerPluginAsr';
    clear: () => void;
    append: () => void;
}

declare function artplayerPluginAsr(option?: AsrPluginOption): (art: Artplayer) => AsrPluginInstance;
