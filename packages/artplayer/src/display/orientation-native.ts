import type { OrientationHost, OrientationLock } from './orientation-types'
import { getScope, isClosing } from '../lifecycle/instance'

interface Request {
  orientation: OrientationLock
  cancelled: boolean
  settled: boolean
}

// Per-screen ownership prevents an old instance from unlocking a newer request.
const owners = new WeakMap<OrientationLock, Request>()
const className = 'art-auto-orientation-fullscreen'

function unlock(request: Request): void {
  if (owners.get(request.orientation) !== request)
    return
  try {
    request.orientation.unlock()
  }
  catch {}
}

export function nativeOrientation(art: OrientationHost, needRotate: () => boolean): (state: boolean) => void {
  const { $player } = art.template
  let current: Request | undefined

  function cancel(): undefined {
    const request = current
    current = undefined
    $player.classList.remove(className)
    if (request) {
      request.cancelled = true
      unlock(request)
      if (request.settled && owners.get(request.orientation) === request)
        owners.delete(request.orientation)
    }
  }

  getScope(art).add(cancel)
  return (state) => {
    if (isClosing(art))
      return
    if (!state) {
      cancel()
      return
    }
    if (current && !current.cancelled && owners.get(current.orientation) === current)
      return
    const orientation = $player.ownerDocument.defaultView?.screen?.orientation as OrientationLock | undefined
    if (typeof orientation?.lock !== 'function' || typeof orientation.unlock !== 'function' || !needRotate())
      return
    const request: Request = { orientation, cancelled: false, settled: false }
    current = request
    owners.set(orientation, request)
    const active = () => !isClosing(art) && !request.cancelled && current === request && owners.get(orientation) === request
    const failed = (error: unknown) => {
      request.settled = true
      const show = active()
      if (owners.get(orientation) === request)
        owners.delete(orientation)
      if (current === request)
        current = undefined
      if (show) {
        $player.classList.remove(className)
        art.notice.show = error
      }
    }
    try {
      // Invoke before yielding; fullscreen entry already supplied the gesture.
      const result = orientation.lock(orientation.type.startsWith('portrait') ? 'landscape' : 'portrait')
      Promise.resolve(result).then(() => {
        request.settled = true
        if (active()) {
          $player.classList.add(className)
        }
        else {
          unlock(request)
          if (owners.get(orientation) === request)
            owners.delete(orientation)
        }
      }).catch(failed)
    }
    catch (error) {
      failed(error)
    }
  }
}
