import type Artplayer from 'artplayer'
import type { Input, Result } from './types'
import { normalizeOptions } from './options'
import { createSession } from './session'
import style from './style.less?inline'

function artplayerPluginAds(input?: Input) {
  return (art: Artplayer): Result => {
    // Legacy core declarations type instance.constructor as Function. Check the
    // actual capabilities before using its existing static validator/utilities.
    const constructor = art.constructor as typeof Artplayer
    if (typeof constructor.validator !== 'function'
      || !['append', 'query', 'setStyle'].every(name => typeof Reflect.get(constructor.utils || {}, name) === 'function')) { throw new Error('Artplayer Ads requires the core validator and DOM utilities') }
    const option = normalizeOptions(input, constructor.validator)
    const { volume, volumeClose, fullscreenOn, fullscreenOff, loading } = art.icons
    return createSession(art, option, { volume, volumeClose, fullscreenOn, fullscreenOff, loading }, constructor.utils)
  }
}

export default Object.assign(artplayerPluginAds, { default: artplayerPluginAds })

if (typeof document !== 'undefined' && !document.getElementById('artplayer-plugin-ads')) {
  const element = document.createElement('style')
  element.id = 'artplayer-plugin-ads'
  element.textContent = style
  document.head.appendChild(element)
}
