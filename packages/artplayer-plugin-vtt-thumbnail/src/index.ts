import type Artplayer from 'artplayer'
import type { Option, Result } from './types'
import createLifetime from './lifetime'
import parseVtt from './parseVtt'
import createPreview from './preview'
import requestVtt from './request'

export default function artplayerPluginVttThumbnail(option: Option) {
  return async (art: Artplayer): Promise<Result> => {
    const { setStyle, isMobile, addClass } = (art.constructor as typeof Artplayer).utils
    const { $progress } = art.template
    const lifetime = createLifetime(art)
    const result: Result = { name: 'artplayerPluginVttThumbnail' }
    try {
      if (lifetime.closed)
        return result
      const url = option.vtt
      const text = await requestVtt(url, lifetime)
      if (lifetime.closed)
        return result
      const thumbnails = parseVtt(text, url)
      const preview = createPreview({ lifetime, thumbnails, progress: $progress, duration: () => art.duration, setStyle, isMobile })
      const style = option.style || {}
      if (lifetime.closed)
        return result
      art.controls.add({
        name: 'vtt-thumbnail',
        position: 'top',
        index: 20,
        style,
        mounted(control) {
          lifetime.own(() => {
            if (art.controls['vtt-thumbnail'] === control)
              art.controls.remove('vtt-thumbnail')
          })
          if (lifetime.closed)
            return
          addClass(control, 'art-control-thumbnails')
          lifetime.listen('setBar', preview(control))
        },
      })
      return result
    }
    catch (error) {
      lifetime.dispose()
      throw error
    }
  }
}
