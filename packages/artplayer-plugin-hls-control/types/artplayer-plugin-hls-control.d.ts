import type Artplayer from 'artplayer';

export = artplayerPluginHlsControl;
export as namespace artplayerPluginHlsControl;

declare const artplayerPluginHlsControl: (option: {
    quality?: {
        control?: boolean;
        setting?: boolean;
        title?: string;
        auto?: string;
        getName?(level: object): String;
    };
    audio?: {
        control?: boolean;
        setting?: boolean;
        title?: string;
        auto?: string;
        getName?(level: object): String;
    };
}) => (art: Artplayer) => {
    name: 'artplayerPluginHlsControl';
    update: () => void;
};
