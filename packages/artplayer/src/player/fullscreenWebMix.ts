import type { WebFullscreenHost, WebFullscreenProperty } from '../display/types'
import { webFullscreen } from '../display/web-fullscreen'
import { def } from '../utils'

export default function fullscreenWebMix(art: WebFullscreenHost): asserts art is WebFullscreenHost & WebFullscreenProperty {
  const setFullscreen = webFullscreen(art)
  def(art, 'fullscreenWeb', {
    get(): boolean {
      return art.template.$player.classList.contains('art-fullscreen-web')
    },
    set: setFullscreen,
  })
}
