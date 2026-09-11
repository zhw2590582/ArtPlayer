import type { NoticeSink } from '../notice'
import { isClosing } from '../lifecycle/instance'
import { def } from '../utils'

export interface AirplayHost {
  template: { $video: EventTarget & { webkitShowPlaybackTargetPicker?: () => void } }
  i18n: { get: (key: string) => string }
  notice: NoticeSink
  proxy: (target: EventTarget, name: string, listener: (event: Event & { availability?: string }) => void) => unknown
  emit: (name: 'airplay') => unknown
}

export default function airplayMix(art: AirplayHost): void {
  if (isClosing(art))
    return
  const {
    i18n,
    notice,
    proxy,
    template: { $video },
  } = art

  let available = true

  const supported = (window as Window & { WebKitPlaybackTargetAvailabilityEvent?: unknown }).WebKitPlaybackTargetAvailabilityEvent
  if (isClosing(art))
    return
  const picker = supported && $video.webkitShowPlaybackTargetPicker
  if (isClosing(art))
    return
  if (picker) {
    proxy($video, 'webkitplaybacktargetavailabilitychanged', (event) => {
      if (isClosing(art))
        return
      switch (event.availability) {
        case 'available':
          available = true
          break
        case 'not-available':
          available = false
          break
      }
    })
  }
  else {
    available = false
  }

  if (isClosing(art))
    return
  def(art, 'airplay', {
    value() {
      if (isClosing(art))
        return
      if (available) {
        const picker = $video.webkitShowPlaybackTargetPicker
        if (isClosing(art))
          return
        Reflect.apply(picker!, $video, [])
        if (!isClosing(art))
          art.emit('airplay')
      }
      else {
        const message = i18n.get('AirPlay Not Available')
        if (!isClosing(art))
          notice.show = message
      }
    },
  })
}
