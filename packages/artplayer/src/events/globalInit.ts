import type { GlobalEventHost, GlobalEventRegistry, GlobalEventSource } from './global-types'
import type { Disposer } from './listener-registry'
import { getScope, isClosing } from '../lifecycle/instance'

const documentEvents = [
  'click',
  'mouseup',
  'keydown',
  'touchend',
  'touchcancel',
  'touchmove',
  'mousemove',
  'pointerup',
  'contextmenu',
  'pointermove',
  'visibilitychange',
  'webkitfullscreenchange',
]
const windowEvents = ['resize', 'scroll', 'orientationchange']

interface Binding {
  disposers: Disposer[]
}

export default function globalInit(art: GlobalEventHost, events: GlobalEventRegistry): void {
  let active: Binding | undefined
  let generation = 0
  getScope(art).add(() => {
    active = undefined
    generation++
    return undefined
  })

  const release = (binding: Binding | undefined) => {
    if (binding) {
      for (const dispose of binding.disposers)
        events.remove(dispose)
      binding.disposers.length = 0
    }
  }

  function bindGlobalEvents(source: GlobalEventSource = {}): void {
    if (isClosing(art))
      return
    const current = ++generation
    const binding: Binding = { disposers: [] }
    const cancelled = () => current !== generation || isClosing(art)
    try {
      const { $player } = art.template
      const doc = source.document || $player.ownerDocument || document
      const win = source.window || $player.ownerDocument?.defaultView || window
      const register = (target: EventTarget, names: string[], prefix: string) => {
        for (const name of names) {
          if (cancelled())
            return
          binding.disposers.push(events.proxy(target, name, (event) => {
            if (active === binding && !isClosing(art))
              art.emit(`${prefix}:${name}`, event)
          }))
        }
      }
      register(doc, documentEvents, 'document')
      register(win, windowEvents, 'window')
    }
    catch (error) {
      release(binding)
      throw error
    }
    if (cancelled()) {
      release(binding)
      return
    }
    const previous = active
    active = binding
    release(previous)
  }

  bindGlobalEvents()
  events.bindGlobalEvents = bindGlobalEvents
}
