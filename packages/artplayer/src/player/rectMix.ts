import type { LayoutHost, RectState } from '../media/hosts'
import { def, getRect } from '../utils'

export default function rectMix(art: LayoutHost): asserts art is LayoutHost & RectState {
  // These properties are installed below; no native media element is asserted.
  const host = art as LayoutHost & RectState
  def(art, 'rect', {
    get: () => {
      return getRect(art.template.$player)
    },
  })

  const keys = ['bottom', 'height', 'left', 'right', 'top', 'width'] as const
  for (let index = 0; index < keys.length; index++) {
    const key = keys[index]!
    def(art, key, {
      get: () => {
        return host.rect[key]
      },
    })
  }

  def(art, 'x', {
    get: () => {
      return host.left + window.pageXOffset
    },
  })

  def(art, 'y', {
    get: () => {
      return host.top + window.pageYOffset
    },
  })
}
