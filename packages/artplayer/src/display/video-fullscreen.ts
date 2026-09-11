import type { FullscreenHost } from './types'
import { getScope, isClosing } from '../lifecycle/instance'
import { listen } from '../lifecycle/resources'
import { abandonVideo, clearAbandonedVideo, isAbandonedVideo, videoIsFullscreen } from './video-fullscreen-state'

export function videoFullscreen(art: FullscreenHost): PropertyDescriptor {
  const { $video } = art.template
  const scope = getScope(art).child()
  let observed = false
  let last = videoIsFullscreen($video)
  let desired = last
  let pending = false
  let revision = 0

  const active = () => videoIsFullscreen($video, observed)
  function changed(hint?: boolean) {
    if (isClosing(art) || isAbandonedVideo($video))
      return
    if (typeof hint === 'boolean')
      observed = hint
    const value = active()
    if (value)
      pending = false
    if (value === last)
      return
    last = value
    const current = revision
    const stale = () => isClosing(art) || active() !== value || (current !== revision && desired !== value)
    art.emit('fullscreen', value)
    if (stale())
      return
    if (value)
      art.state = 'fullscreen'
    if (!stale())
      art.emit('resize')
  }

  scope.add(() => {
    revision++
    desired = false
    if (pending)
      abandonVideo($video)
    if (active())
      $video.webkitExitFullscreen?.()
  })
  listen(scope, $video, 'webkitbeginfullscreen', () => changed(true))
  listen(scope, $video, 'webkitendfullscreen', () => changed(false))
  listen(scope, $video, 'webkitpresentationmodechanged', () => changed())
  const documentChanged = () => changed()
  art.on('document:webkitfullscreenchange', documentChanged)
  scope.add(() => {
    art.off('document:webkitfullscreenchange', documentChanged)
  })

  return {
    get: () => !isClosing(art) && active(),
    set(value: boolean): void {
      if (isClosing(art))
        return
      const current = ++revision
      desired = Boolean(value)
      if (value) {
        clearAbandonedVideo($video)
        art.state = 'fullscreen'
        if (isClosing(art) || current !== revision)
          return
        pending = true
        try {
          $video.webkitEnterFullscreen!()
        }
        catch (error) {
          if (current === revision)
            pending = false
          throw error
        }
      }
      else {
        if (pending) {
          pending = false
          abandonVideo($video)
        }
        if (active())
          $video.webkitExitFullscreen!()
      }
    },
  }
}
