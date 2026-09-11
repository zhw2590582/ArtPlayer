import type { PipHost } from './types'
import { getScope, isClosing } from '../lifecycle/instance'
import { listen } from '../lifecycle/resources'

type Video = PipHost['template']['$video']
const abandoned = new WeakSet<Video>()
const active = (video: Video) => video.webkitPresentationMode === 'picture-in-picture'

function clearAbandoned(video: Video) {
  abandoned.delete(video)
  video.removeEventListener('webkitpresentationmodechanged', releaseAbandoned)
  video.removeEventListener('enterpictureinpicture', releaseAbandoned)
}

function releaseAbandoned(this: Video) {
  if (!abandoned.has(this) || !active(this))
    return
  clearAbandoned(this)
  try {
    this.webkitSetPresentationMode?.('inline')
  }
  catch {}
}

function abandon(video: Video) {
  abandoned.add(video)
  video.addEventListener('webkitpresentationmodechanged', releaseAbandoned)
  video.addEventListener('enterpictureinpicture', releaseAbandoned)
}

export function webkitPip(art: PipHost): PropertyDescriptor {
  const { $video } = art.template
  const scope = getScope(art).child()
  let last = false
  let pending = false
  let revision = 0
  let emissions = 0

  $video.webkitSetPresentationMode!('inline')

  function changed(force = false) {
    if (isClosing(art) || abandoned.has($video))
      return
    const value = active($video)
    if (value)
      pending = false
    if (value === last && !force)
      return
    const current = revision
    if (value)
      art.state = 'pip'
    if (isClosing(art) || revision !== current || active($video) !== value)
      return
    last = value
    emissions++
    art.emit('pip', value)
  }

  scope.add(() => {
    revision++
    if (pending)
      abandon($video)
    if (active($video))
      $video.webkitSetPresentationMode!('inline')
  })
  for (const name of ['webkitpresentationmodechanged', 'enterpictureinpicture', 'leavepictureinpicture'])
    listen(scope, $video, name, () => changed())

  return {
    get: () => !isClosing(art) && active($video),
    set(value: boolean): void {
      if (isClosing(art))
        return
      const current = ++revision
      const before = emissions
      if (value) {
        if ($video.webkitSupportsPresentationMode?.('picture-in-picture') === false) {
          art.notice.show = art.i18n.get('PIP Not Supported')
          return
        }
        clearAbandoned($video)
        art.state = 'pip'
        if (isClosing(art) || revision !== current)
          return
        pending = true
        try {
          $video.webkitSetPresentationMode!('picture-in-picture')
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
          abandon($video)
        }
        if (active($video))
          $video.webkitSetPresentationMode!('inline')
      }
      if (!isClosing(art) && current === revision && before === emissions && active($video) === Boolean(value))
        changed(true)
    },
  }
}
