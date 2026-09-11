import type { HotkeyCallback, HotkeyHost } from './input/hotkey-types'
import { defaultHotkeys } from './input/hotkey-defaults'
import { acceptsHotkey } from './input/keyboard-focus'
import { getScope, isClosing } from './lifecycle/instance'
import { isMobile } from './utils/compatibility'

interface State {
  defaults?: () => void
  subscribed: boolean
}
const states = new WeakMap<object, State>()

export default class Hotkey<Host extends HotkeyHost> {
  declare art: Host
  declare keys: Record<string, HotkeyCallback<Host>[]>

  constructor(art: Host) {
    this.art = art
    this.keys = {}
    states.set(this, { subscribed: false })
    if (!isMobile)
      this.init()
  }

  init(): void {
    const art = this.art
    if (isClosing(art))
      return
    const state = states.get(this)!
    if (art.option.hotkey) {
      if (!state.defaults) {
        const callbacks = defaultHotkeys(art)
        state.defaults = () => {
          for (const key of Object.keys(callbacks))
            this.add(key, callbacks[key]!)
        }
      }
      state.defaults()
    }
    if (state.subscribed)
      return
    state.subscribed = true
    const onKeydown = (event: KeyboardEvent) => {
      if (isClosing(art))
        return
      if (art.isFocus && acceptsHotkey(event, art.template.$player.ownerDocument)) {
        const callbacks = Object.prototype.hasOwnProperty.call(this.keys, event.code) ? this.keys[event.code] : undefined
        if (callbacks) {
          event.preventDefault()
          // Keep the historical live-array mutation and callback receiver contracts.
          for (let index = 0; index < callbacks.length; index++) {
            if (isClosing(art))
              return
            callbacks[index]!.call(art, event)
          }
          if (isClosing(art))
            return
          art.emit('hotkey', event)
        }
      }
      if (!isClosing(art))
        art.emit('keydown', event)
    }
    art.on('document:keydown', onKeydown)
    getScope(art).add(() => {
      state.subscribed = false
      art.off('document:keydown', onKeydown)
    })
  }

  add(key: string, callback: HotkeyCallback<Host>): this {
    const existing = Object.prototype.hasOwnProperty.call(this.keys, key) ? this.keys[key] : undefined
    if (existing) {
      if (!existing.includes(callback))
        existing.push(callback)
    }
    else {
      Object.defineProperty(this.keys, key, { value: [callback], enumerable: true, configurable: true, writable: true })
    }
    return this
  }

  remove(key: string, callback: HotkeyCallback<Host>): this {
    const existing = Object.prototype.hasOwnProperty.call(this.keys, key) ? this.keys[key] : undefined
    if (existing) {
      const index = existing.indexOf(callback)
      if (index !== -1)
        existing.splice(index, 1)
      if (existing.length === 0)
        delete this.keys[key]
    }
    return this
  }
}
