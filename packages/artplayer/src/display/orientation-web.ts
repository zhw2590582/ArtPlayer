import type { OrientationHost } from './orientation-types'
import { getScope, isClosing } from '../lifecycle/instance'
import { timeout } from '../lifecycle/resources'
import { getSafeAreaInsets } from '../utils'

const className = 'art-auto-orientation'
const properties = ['width', 'height', 'transform-origin', 'transform'] as const

export function webOrientation(art: OrientationHost, needRotate: () => boolean): (state: boolean) => void {
  const { $player } = art.template
  const scope = getScope(art)
  let cancel = () => {}
  let saved: { name: string, value: string, priority: string }[] | undefined

  function clear(): undefined {
    cancel()
    cancel = () => {}
    const previous = saved
    saved = undefined
    // fullscreenWeb restores its complete entry style before emitting false.
    if (previous && art.fullscreenWeb) {
      for (const { name, value, priority } of previous)
        $player.style.setProperty(name, value, priority)
    }
    const wasRotated = $player.classList.contains(className)
    $player.classList.remove(className)
    if (wasRotated) {
      art.isRotate = false
      if (!isClosing(art))
        art.emit('resize')
    }
  }

  scope.add(clear)
  function apply(emit: boolean): void {
    if (!art.fullscreenWeb || !needRotate())
      return
    const insets = getSafeAreaInsets()
    if (isClosing(art) || !art.fullscreenWeb)
      return
    const viewport = $player.ownerDocument.documentElement
    saved ??= properties.map(name => ({ name, value: $player.style.getPropertyValue(name), priority: $player.style.getPropertyPriority(name) }))
    $player.style.width = `${viewport.clientHeight - insets.top - insets.bottom}px`
    $player.style.height = `${viewport.clientWidth - insets.left - insets.right}px`
    $player.style.transformOrigin = '0 0'
    $player.style.transform = `rotate(90deg) translate(${insets.top}px, -${viewport.clientWidth - insets.right}px)`
    $player.classList.add(className)
    art.isRotate = true
    if (emit)
      art.emit('resize')
  }

  return (state) => {
    if (isClosing(art))
      return
    if (!state) {
      clear()
      return
    }
    if (saved) {
      apply(false)
      return
    }
    if (!needRotate())
      return
    cancel()
    cancel = timeout(scope, () => {
      if (!saved)
        apply(true)
    }, Number(art.constructor.AUTO_ORIENTATION_TIME ?? 0))
  }
}
