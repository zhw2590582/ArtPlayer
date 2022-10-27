import type Artplayer from 'artplayer';

export = artplayerPluginHlsQuality;
export as namespace artplayerPluginHlsQuality;

declare const artplayerPluginHlsQuality: (option: { control?: boolean; setting?: boolean; name?: string }) => (
    art: Artplayer,
) => {
    name: 'artplayerPluginHlsQuality';
};
