import type ResourceScope from '../lifecycle/scope'
import { isClosing } from '../lifecycle/instance'
import { timeout } from '../lifecycle/resources'
import { getSourceScope } from '../source/operation'
import { addClass, removeClass } from '../utils'

export interface LongPressHost {
  template: { $player: HTMLElement }
  constructor: { FAST_FORWARD_TIME: number, FAST_FORWARD_VALUE: number }
  playing: boolean
  isLock: boolean
  playbackRate: number
}

interface Press {
  scope: ResourceScope
  active: boolean
  previousRate: number
}

export function longPress(art: LongPressHost) {
  let current: Press | undefined
  let generation = 0
  const hasActivePress = () => current?.active
  const stop = () => {
    generation++
    current?.scope.dispose()
  }
  const start = (event: TouchEvent) => {
    const revision = ++generation
    current?.scope.dispose()
    if (revision !== generation || isClosing(art) || event.touches.length !== 1 || !art.playing || art.isLock)
      return
    const press: Press = { scope: getSourceScope(art).child(), active: false, previousRate: 1 }
    current = press
    press.scope.add(() => {
      if (current !== press)
        return
      current = undefined
      if (press.active) {
        try {
          art.playbackRate = press.previousRate
        }
        finally {
          // A callback may have already started and activated a newer press.
          if (!hasActivePress())
            removeClass(art.template.$player, 'art-fast-forward')
        }
      }
    })
    timeout(press.scope, () => {
      if (current !== press || isClosing(art) || !art.playing || art.isLock) {
        press.scope.dispose()
        return
      }
      try {
        press.previousRate = art.playbackRate
        if (current !== press || press.scope.closed)
          return
        press.active = true
        const rate = art.constructor.FAST_FORWARD_VALUE
        if (current !== press || press.scope.closed || isClosing(art))
          return
        art.playbackRate = rate
        if (current === press && !press.scope.closed && !isClosing(art))
          addClass(art.template.$player, 'art-fast-forward')
      }
      catch (error) {
        try {
          press.scope.dispose()
        }
        catch (cleanupError) {
          console.warn('Failed to restore fast-forward playback rate:', cleanupError)
        }
        throw error
      }
    }, art.constructor.FAST_FORWARD_TIME)
  }
  return { start, stop }
}
