import type { PipHost } from './types'
import { getScope, isClosing } from '../lifecycle/instance'
import { listen } from '../lifecycle/resources'

export function nativePip(art: PipHost): PropertyDescriptor {
  const { $video } = art.template
  const document = $video.ownerDocument
  const scope = getScope(art).child()
  const owns = () => document.pictureInPictureElement === $video
  let last = owns()
  let desired = last
  let pending = false
  let cancelled = false
  let revision = 0
  $video.disablePictureInPicture = false

  function exitOwned() {
    if (!owns())
      return
    try {
      void document.exitPictureInPicture().catch(() => {})
    }
    catch {}
  }

  function observe(result: Promise<unknown>, entering: boolean, current: number) {
    void result.then(() => {
      if (entering && (isClosing(art) || !desired))
        exitOwned()
    }, (error) => {
      if (!isClosing(art) && revision === current)
        art.notice.show = error
    }).finally(() => {
      if (revision === current)
        pending = false
    }).catch(() => {})
  }

  scope.add(() => {
    revision++
    desired = false
    exitOwned()
  })
  listen(scope, $video, 'enterpictureinpicture', () => {
    if (cancelled) {
      exitOwned()
      return
    }
    if (!owns() || last)
      return
    const current = revision
    art.state = 'pip'
    if (!isClosing(art) && current === revision && owns()) {
      last = true
      art.emit('pip', true)
    }
  })
  listen(scope, $video, 'leavepictureinpicture', () => {
    if (!last || owns())
      return
    last = false
    art.emit('pip', false)
  })

  return {
    // Native callers historically receive the media element, not a boolean.
    get: () => !isClosing(art) && owns() ? $video : null,
    set(value: boolean): void {
      if (isClosing(art))
        return
      const current = ++revision
      desired = Boolean(value)
      if (desired)
        cancelled = false
      else if (pending)
        cancelled = true
      pending = false
      if (desired) {
        art.state = 'pip'
        if (isClosing(art) || revision !== current)
          return
        pending = true
        try {
          // Native invocation stays on the user gesture stack; the setter stays void.
          observe($video.requestPictureInPicture!(), true, current)
        }
        catch (error) {
          if (revision === current)
            pending = false
          throw error
        }
      }
      else if (owns()) {
        observe(document.exitPictureInPicture(), false, current)
      }
    },
  }
}
