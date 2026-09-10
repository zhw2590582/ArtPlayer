import type { MediaEventHost } from './types'
import config from '../../config'
import { isClosing } from '../../lifecycle/instance'

export function forwardMediaEvents(art: MediaEventHost): void {
  const { proxy, template: { $video } } = art
  for (let index = 0; index < config.events.length; index++) {
    proxy($video, config.events[index]!, (event: Event) => {
      if (!isClosing(art))
        art.emit(`video:${event.type}`, event)
    })
  }
}
