import type Artplayer from 'artplayer';

interface Option {
    compare?: boolean;
    networkSize?: 'small' | 'medium' | 'large';
    weightsBaseUrl?: string;
    workerUrl?: string;
    videoScale?: number;
}

interface Result {
    name: 'artplayerPluginWebsr';
    upscaler: any;
    update: (option: Option) => void;
}

declare const artplayerPluginWebsr: (option?: Option) => (art: Artplayer) => Result;

export default artplayerPluginWebsr
