import type { MediaEventHost } from '../../packages/artplayer/src/media/events/types'
import eventInit from '../../packages/artplayer/src/player/eventInit'

declare const art: MediaEventHost
eventInit(art)
art.emit('ready')
art.emit('resize')
art.emit('video:custom', new Event('custom'))
art.emit('error', new Error('source'), 1)
// @ts-expect-error Media forwarding retains the Event object, not an arbitrary payload.
art.emit('video:canplay', 'canplay')
// @ts-expect-error Retry errors include the attempt count.
art.emit('error', new Error('source'))
// @ts-expect-error UI visibility does not accept a source URL.
art.loading.show = 'video.mp4'
// @ts-expect-error A structural proxy still needs EventTarget listener capabilities.
art.template.$video = { src: 'video.mp4' }
