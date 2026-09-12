import type Artplayer from 'artplayer'
import type { Disposer } from './resources'
import { releaseAll } from './resources'

export function createControl(art: Artplayer, toggle: Disposer, alive: () => boolean) {
  const utils = (art.constructor as typeof Artplayer).utils
  const releases: Disposer[] = []
  let closed = false
  return {
    mount() {
      if (closed || !alive())
        return
      releases.push(() => art.controls.remove('document-pip'))
      art.controls.add({
        name: 'document-pip',
        position: 'right',
        index: 40,
        tooltip: art.i18n.get('PIP Mode'),
        mounted: (control) => {
          if (closed || !alive())
            return
          utils.append(control, art.icons.pip)
          const click = () => {
            if (alive())
              toggle()
          }
          // Explicit removal also covers legacy proxy registration that throws after binding.
          releases.push(() => control.removeEventListener('click', click))
          const unbind = art.proxy(control, 'click', click)
          if (closed)
            unbind()
          else
            releases.push(unbind)
          if (closed || !alive())
            return
          const update = (active: unknown) => {
            if (alive())
              utils.tooltip(control, art.i18n.get(active ? 'Exit PIP Mode' : 'PIP Mode'))
          }
          releases.push(() => art.off('document-pip', update))
          art.on('document-pip', update)
        },
      })
      if (closed)
        art.controls.remove('document-pip')
    },
    destroy() {
      if (closed)
        return
      closed = true
      const errors = releaseAll(releases.splice(0).reverse())
      if (errors.length)
        throw errors[0]
    },
  }
}
