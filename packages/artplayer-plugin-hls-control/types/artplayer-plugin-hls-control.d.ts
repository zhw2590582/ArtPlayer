import type Artplayer from 'artplayer';

export = artplayerPluginHlsControl;
export as namespace artplayerPluginHlsControl;

type Config = {
    control?: boolean;
    setting?: boolean;
    title?: string;
    auto?: string;
    getName?(level: object): String;
    filter?(levels: object[]): object[];
};

declare const artplayerPluginHlsControl: (option: { quality?: Config; audio?: Config }) => (art: Artplayer) => {
    name: 'artplayerPluginHlsControl';
    update: () => void;
};
