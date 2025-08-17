import Artplayer from 'artplayer'
import { useEffect, useRef } from 'react'

// test i18n
import fr from 'artplayer/i18n/fr'
import id from 'artplayer/i18n/id'

// test plugins
import artplayerPluginDanmuku from '../../../artplayer-plugin-danmuku'
import artplayerPluginDocumentPip from '../../../artplayer-plugin-document-pip'

export default function Player({ option, getInstance, ...rest }) {
  const $container = useRef()

  useEffect(() => {
    const art = new Artplayer({
      ...option,
      container: $container.current,
      i18n: { id, fr },
      lang: 'fr',
      plugins: [
        artplayerPluginDocumentPip(),
        artplayerPluginDanmuku({
          danmuku: 'https://artplayer.org/assets/sample/danmuku.xml',
        }),
      ],
    })

    if (typeof getInstance === 'function') {
      getInstance(art)
    }

    return () => art.destroy(false)
  }, [])

  return <div ref={$container} {...rest}></div>
}