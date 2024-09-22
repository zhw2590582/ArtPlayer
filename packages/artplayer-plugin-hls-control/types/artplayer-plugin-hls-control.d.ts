import type Artplayer from 'artplayer';

export = artplayerPluginHlsControl;
export as namespace artplayerPluginHlsControl;

type Config = {
    control?: boolean;
    setting?: boolean;
    title?: string;
    auto?: string;
    getName?(level: object): String;
};

declare const artplayerPluginHlsControl: (option: { quality?: Config; audio?: Config }) => (art: Artplayer) => {
    name: 'artplayerPluginHlsControl';
    update: () => void;
};
