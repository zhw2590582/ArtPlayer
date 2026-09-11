import type { Placement } from './placement'
import type { WebFullscreenHost } from './types'
import { getScope, isClosing } from '../lifecycle/instance'
import { ResourceCleanupError } from '../lifecycle/scope'
import { capturePlacement, restorePlacement } from './placement'

interface Snapshot {
  placement: Placement
  style: string | null
}

export function webFullscreen(art: WebFullscreenHost): (value: boolean) => void {
  const { $player } = art.template
  let saved: Snapshot | undefined
  let revision = 0

  function restore(snapshot: Snapshot, active: () => boolean): boolean {
    if (snapshot.style === null)
      $player.removeAttribute('style')
    else
      $player.setAttribute('style', snapshot.style)
    if (!active())
      return false
    $player.classList.remove('art-fullscreen-web')
    if (!active())
      return false
    restorePlacement(snapshot.placement)
    return active()
  }

  getScope(art).add(() => {
    revision += 1
    const snapshot = saved
    saved = undefined
    if (snapshot) {
      try {
        restore(snapshot, () => true)
      }
      catch (error) {
        // Destruction cannot retry: detach only if restoration left our node outside its owner.
        try {
          if ($player.parentNode !== snapshot.placement.parent)
            $player.parentNode?.removeChild($player)
        }
        catch (detachError) {
          throw new ResourceCleanupError([error, detachError])
        }
        throw error
      }
    }
  })

  return (value) => {
    if (isClosing(art))
      return
    const current = ++revision
    const active = () => current === revision && !isClosing(art)
    if (value) {
      if (!saved)
        saved = { placement: capturePlacement($player), style: $player.getAttribute('style') }
      const snapshot = saved
      try {
        if (art.constructor.FULLSCREEN_WEB_IN_BODY && $player.parentNode !== document.body)
          document.body.appendChild($player)
        if (!active())
          return
        art.state = 'fullscreenWeb'
        if (!active())
          return
        $player.style.width = '100%'
        $player.style.height = '100%'
        $player.classList.add('art-fullscreen-web')
      }
      catch (error) {
        if (active() && restore(snapshot, active))
          saved = undefined
        throw error
      }
      if (!active())
        return
      art.emit('fullscreenWeb', true)
    }
    else {
      if (saved) {
        if (!restore(saved, active))
          return
        saved = undefined
      }
      else {
        $player.classList.remove('art-fullscreen-web')
      }
      if (!active())
        return
      art.emit('fullscreenWeb', false)
    }
    if (active())
      art.emit('resize')
  }
}
