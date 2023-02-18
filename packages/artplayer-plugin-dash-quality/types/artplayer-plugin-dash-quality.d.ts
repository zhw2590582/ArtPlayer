import type Artplayer from 'artplayer';

export = artplayerPluginDashQuality;
export as namespace artplayerPluginDashQuality;

declare const artplayerPluginDashQuality: (option: {
    control?: boolean;
    setting?: boolean;
    title?: string;
    auto?: string;
    getResolution?(level: any): String;
}) => (art: Artplayer) => {
    name: 'artplayerPluginDashQuality';
};
