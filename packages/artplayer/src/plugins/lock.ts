import type { SubscriptionHost } from '../component/resources'
import { appendElement } from '../component/dom'
import { entryScope, subscribeEntry } from '../component/resources'
import { isClosing } from '../lifecycle/instance'
import { addClass, hasClass, removeClass, setStyle } from '../utils'
import { lockKeyboard } from './lock-keyboard'

export interface LockHost extends SubscriptionHost<{ lock: [boolean] }> {
  template: { $player: HTMLElement, $bottom: HTMLElement }
  i18n: { get: (key: string) => string }
  icons: { lock: string | Element, unlock: string | Element }
  isLock: boolean
  emit: (name: 'lock', state: boolean) => unknown
  layers: { add: (option: { name: string, mounted: (element: HTMLDivElement) => void, click: () => void }) => unknown }
}

export default function lock(art: LockHost): { name: string, state: boolean } {
  const {
    layers,
    icons,
    template: { $player },
  } = art

  function getState() {
    return hasClass($player, 'art-lock')
  }

  function setLock() {
    if (isClosing(art))
      return
    addClass($player, 'art-lock')
    if (isClosing(art))
      return
    art.isLock = true
    if (!isClosing(art))
      art.emit('lock', true)
  }

  function setUnlock() {
    if (isClosing(art))
      return
    removeClass($player, 'art-lock')
    if (isClosing(art))
      return
    art.isLock = false
    if (!isClosing(art))
      art.emit('lock', false)
  }

  layers.add({
    name: 'lock',
    mounted($el) {
      const scope = entryScope($el)
      if (scope.closed || isClosing(art))
        return
      const $lock = appendElement($el, icons.lock)
      if (scope.closed || isClosing(art))
        return
      const $unlock = appendElement($el, icons.unlock)
      if (scope.closed || isClosing(art))
        return
      const updateKeyboard = lockKeyboard(art, $el, scope, getState)
      if (scope.closed || isClosing(art))
        return
      if (getState()) {
        setStyle($lock, 'display', 'inline-flex')
        if (!scope.closed && !isClosing(art))
          setStyle($unlock, 'display', 'none')
      }
      else {
        setStyle($lock, 'display', 'none')
      }

      subscribeEntry<{ lock: [boolean] }, 'lock'>(art, $el, 'lock', (state) => {
        if (isClosing(art))
          return
        setStyle($lock, 'display', state ? 'inline-flex' : 'none')
        if (!scope.closed && !isClosing(art))
          setStyle($unlock, 'display', state ? 'none' : 'inline-flex')
        if (!scope.closed && !isClosing(art))
          updateKeyboard(state)
      })
    },
    click() {
      if (getState()) {
        setUnlock()
      }
      else {
        setLock()
      }
    },
  })

  return {
    name: 'lock',
    get state() {
      return getState()
    },
    set state(value: boolean) {
      if (value) {
        setLock()
      }
      else {
        setUnlock()
      }
    },
  }
}
