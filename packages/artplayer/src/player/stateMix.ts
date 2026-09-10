import type { DisplayStates, StateProperty } from '../media/playback'
import { def } from '../utils'

export default function stateMix(art: DisplayStates): asserts art is DisplayStates & StateProperty {
  const states = ['mini', 'pip', 'fullscreen', 'fullscreenWeb'] as const
  def(art, 'state', {
    get: () => states.find(name => art[name]) || 'standard',
    set(name: string) {
      for (let index = 0; index < states.length; index++) {
        const prop = states[index]!
        if (prop !== name && art[prop])
          art[prop] = false
      }
    },
  })
}
