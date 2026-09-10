import type { MediaEventHost } from '../media/events/types'
import { forwardMediaEvents } from '../media/events/forward'
import { listenMedia } from '../media/events/listen'
import { installEnded, installPlaybackUI } from '../media/events/playback'
import { installReadiness } from '../media/events/readiness'
import { createReconnect } from '../media/events/reconnect'

export default function eventInit(art: MediaEventHost): void {
  forwardMediaEvents(art)
  const reconnect = createReconnect(art)
  installReadiness(art, reconnect)
  installEnded(art)
  listenMedia(art, 'video:error', reconnect.schedule)
  installPlaybackUI(art, reconnect)
}
