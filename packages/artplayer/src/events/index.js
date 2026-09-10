import { getScope } from '../lifecycle/instance'
import clickInit from './clickInit'
import gestureInit from './gestureInit'
import globalInit from './globalInit'
import hoverInit from './hoverInit'
import moveInit from './moveInit'
import resizeInit from './resizeInit'
import updateInit from './updateInit'
import viewInit from './viewInit'

const scopes = new WeakMap()

export default class Events {
  constructor(art) {
    this.destroyEvents = new Set()
    const scope = getScope(art)
    scopes.set(this, scope)
    scope.add(() => this.destroy())
    this.proxy = this.proxy.bind(this)
    this.hover = this.hover.bind(this)

    clickInit(art, this)
    hoverInit(art, this)
    moveInit(art, this)
    resizeInit(art, this)
    gestureInit(art, this)
    viewInit(art, this)
    globalInit(art, this)
    updateInit(art, this)
  }

  proxy(target, name, callback, option = {}) {
    if (Array.isArray(name)) {
      return name.map(item => this.proxy(target, item, callback, option))
    }

    if (scopes.get(this).closed)
      return () => {}

    target.addEventListener(name, callback, option)
    const destroy = () => target.removeEventListener(name, callback, option)
    this.destroyEvents.add(destroy)
    return destroy
  }

  hover(target, mouseenter, mouseleave) {
    if (mouseenter) {
      this.proxy(target, 'mouseenter', mouseenter)
    }
    if (mouseleave) {
      this.proxy(target, 'mouseleave', mouseleave)
    }
  }

  remove(destroyEvent) {
    if (this.destroyEvents.has(destroyEvent)) {
      try {
        destroyEvent()
      }
      catch (error) {
        console.warn('Failed to remove event listener:', error)
      }
      finally {
        this.destroyEvents.delete(destroyEvent)
      }
    }
  }

  destroy() {
    for (const destroyEvent of this.destroyEvents) {
      try {
        destroyEvent()
      }
      catch (error) {
        console.warn('Failed to destroy event listener:', error)
      }
    }
    this.destroyEvents.clear()
  }
}
