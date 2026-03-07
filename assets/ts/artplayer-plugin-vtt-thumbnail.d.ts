declare const artplayerPluginVttThumbnail: (option: { vtt?: string, style?: Partial<CSSStyleDeclaration> }) => (
  art: Artplayer,
) => {
  name: 'artplayerPluginVttThumbnail'
}

export default artplayerPluginVttThumbnail

export = artplayerPluginVttThumbnail
export as namespace artplayerPluginVttThumbnail;
