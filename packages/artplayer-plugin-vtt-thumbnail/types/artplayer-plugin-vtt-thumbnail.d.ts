import type Artplayer from 'artplayer'

declare const artplayerPluginVttThumbnail: (option: { vtt?: string, style?: Partial<CSSStyleDeclaration> }) => (
  art: Artplayer,
) => {
  name: 'artplayerPluginVttThumbnail'
}

export default artplayerPluginVttThumbnail
