import type Artplayer from 'artplayer';

export = artplayerPluginAsr;
export as namespace artplayerPluginAsr;

interface AsrPluginOption {
    interval?: number;
    sampleRate?: number;
    onAudioChunk?: (buffer: ArrayBuffer) => void | Promise<void>;
}

interface AsrPluginInstance {
    name: 'artplayerPluginAsr';
    destroy: () => void;
}

declare function artplayerPluginAsr(option?: AsrPluginOption): (art: Artplayer) => AsrPluginInstance;
