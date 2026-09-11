import type { FullscreenHost, NativeFullscreenAdapter } from './types'
import { getScope, isClosing } from '../lifecycle/instance'
import { listen } from '../lifecycle/resources'
import { hasAbandonedFullscreen } from './fullscreen-abandoned'
import { requestFullscreen } from './fullscreen-request'

export function nativeFullscreen(art: FullscreenHost, adapter: NativeFullscreenAdapter): PropertyDescriptor {
  const scope = getScope(art).child()
  const { $player, $video } = art.template
  const ownsFullscreen = () => adapter.element === $player || adapter.element === $video
  let last = ownsFullscreen()
  let revision = 0
  let desired = last
  let pending: ReturnType<typeof requestFullscreen> | undefined
  let pendingEntry = false
  let cancelledEntry = false
  let requesting = false

  function exitOwned() {
    if (!ownsFullscreen())
      return
    try {
      void Promise.resolve(adapter.exit()).catch(() => {})
    }
    catch {}
  }

  scope.add(() => {
    revision += 1
    desired = false
    $player.classList.remove('art-fullscreen')
    exitOwned()
  })
  listen(scope, adapter.document, adapter.changeEvent, () => {
    const value = ownsFullscreen()
    if (value && hasAbandonedFullscreen(adapter))
      return
    if (value && cancelledEntry) {
      exitOwned()
      return
    }
    if (value === last || isClosing(art))
      return
    last = value
    const current = revision
    const stale = () => isClosing(art) || ownsFullscreen() !== value || (current !== revision && desired !== value)
    art.emit('fullscreen', value)
    if (stale())
      return
    if (value)
      art.state = 'fullscreen'
    if (stale())
      return
    $player.classList.toggle('art-fullscreen', value)
    art.emit('resize')
  })
  listen(scope, adapter.document, adapter.errorEvent, (event) => {
    const ownEvent = event.target === $player || event.target === $video
      || (event.target === adapter.document && (requesting || pending !== undefined || ownsFullscreen()))
    if (ownEvent && !isClosing(art))
      art.emit('fullscreenError', event)
  })

  return {
    get: () => !isClosing(art) && ownsFullscreen(),
    set(value: boolean): Promise<void> {
      if (isClosing(art))
        return Promise.resolve()
      const current = ++revision
      desired = Boolean(value)
      if (desired)
        cancelledEntry = false
      else if (pendingEntry)
        cancelledEntry = true
      pending?.cancel()
      pending = undefined
      pendingEntry = false
      if (!desired && !ownsFullscreen())
        return Promise.resolve()
      requesting = true
      pendingEntry = desired
      const operation = requestFullscreen(adapter, scope, desired, () => {
        if (isClosing(art) || !desired)
          exitOwned()
      }, () => !ownsFullscreen())
      requesting = false
      if (revision === current)
        pending = operation
      else
        operation.cancel()
      const result = operation.promise.catch((error) => {
        if (!isClosing(art) && revision === current)
          art.notice.show = error
        throw error
      }).finally(() => {
        if (revision === current) {
          pending = undefined
          pendingEntry = false
        }
      })
      // Assignment cannot consume a setter return, but descriptor callers still can.
      void result.catch(() => {})
      return result
    },
  }
}
