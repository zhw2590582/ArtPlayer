import type { Option } from 'artplayer'
import artplayerPluginDanmuku from 'artplayer-plugin-danmuku'
import artplayerPluginDocumentPip from 'artplayer-plugin-document-pip'
import fr from 'artplayer/i18n/fr'
import id from 'artplayer/i18n/id'

// Preserve this example's existing overrides and create plugins per instance.
export function playerOptions(option: Partial<Option>, container: HTMLDivElement): Option {
  return {
    ...option,
    container,
    // Partial<Option> is the historical wrapper API; Artplayer validates missing URLs.
    url: option.url as string,
    i18n: { id, fr },
    lang: 'fr',
    plugins: [
      artplayerPluginDocumentPip({}),
      artplayerPluginDanmuku({
        danmuku: 'https://artplayer.org/assets/sample/danmuku.xml',
      }),
    ],
  }
}
