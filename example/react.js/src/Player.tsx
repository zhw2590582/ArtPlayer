import { useEffect, useRef } from 'react'
import Artplayer, { type Option } from 'artplayer'

// Test i18n
import fr from 'artplayer/i18n/fr'
import id from 'artplayer/i18n/id'

// Test plugins
import artplayerPluginDanmuku from 'artplayer-plugin-danmuku'
import artplayerPluginDocumentPip from 'artplayer-plugin-document-pip'

interface PlayerProps extends React.HTMLAttributes<HTMLDivElement> {
  option: Partial<Option>,
  getInstance?: (art: Artplayer) => void
}

export default function Player({ option, getInstance, ...rest }: PlayerProps) {
  const containerRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!containerRef.current) return

    const art = new Artplayer({
      ...option,
      container: containerRef.current,
      url: option.url as string,
      i18n: { id, fr },
      lang: 'fr',
      plugins: [
        artplayerPluginDocumentPip({}),
        artplayerPluginDanmuku({
          danmuku: 'https://artplayer.org/assets/sample/danmuku.xml',
        }),
      ],
    })

    if (typeof getInstance === 'function') {
      getInstance(art)
    }

    return () => {
      art.destroy(false)
    }
  }, [option, getInstance])

  return <div ref={containerRef} {...rest}></div>
}
