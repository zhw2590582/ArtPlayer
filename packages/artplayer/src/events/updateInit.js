import { getScope } from '../lifecycle/instance'
import { animationFrame } from '../lifecycle/resources'

export default function updateInit(art) {
  if (art.constructor.USE_RAF) {
    const scope = getScope(art)
    let cancel = () => {};

    (function update() {
      if (art.playing) {
        art.emit('raf')
      }

      if (!art.isDestroy) {
        cancel = animationFrame(scope, update)
      }
    })()

    art.on('destroy', () => {
      cancel()
    })
  }
}
