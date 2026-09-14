import type Artplayer from 'artplayer';

export = artplayerPluginVast;
export as namespace artplayerPluginVast;

type Option = (params: {
    art: Artplayer;
    id: string;
    ima: any;
    imaPlayer: any;
    $container: HTMLDivElement;
    playUrl: (url: string) => void;
    playRes: (res: string) => void;
}) => void;

type Result = {
    name: 'artplayerPluginVast';
};

declare const artplayerPluginVast: (option: Option) => (art: Artplayer) => Result;
