import type Artplayer from 'artplayer';

export = artplayerPluginVttThumbnail;
export as namespace artplayerPluginVttThumbnail;

declare const artplayerPluginVttThumbnail: (option: { vtt?: string; style?: Partial<CSSStyleDeclaration> }) => (
    art: Artplayer,
) => {
    name: 'artplayerPluginVttThumbnail';
};
