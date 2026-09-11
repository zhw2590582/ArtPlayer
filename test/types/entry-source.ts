import type { PlayerHost } from '../../packages/artplayer/src/player'
import type { BuiltinHost } from '../../packages/artplayer/src/plugins/builtins'
import Artplayer from '../../packages/artplayer/src'

const art = new Artplayer({ container: '#player', url: '' }, function (player) {
  const same: Artplayer = player
  this.option.plugins.push((core) => {
    core.currentTime = '1.5'
    return { name: 'source-extension', player: same }
  })
})
const playerHost: PlayerHost<Artplayer> = art
const builtinHost: BuiltinHost = art
const seeking: undefined = art.seek
const quality: undefined = art.quality
const fullscreen: boolean | undefined = art.fullscreen
const noticeVisible: boolean = art.notice.show
art.notice.show = new Error('test')
art.seek = '1.5'
art.quality = [{ html: document.createElement('span'), url: '/video.mp4' }]
art.on('document:keydown', (event) => {
  const key: string = event.key
  return key
})
art.on('extension:event', (...values) => values)
art.emit('video:timeupdate', new Event('timeupdate'))
art.emit('extension:event', { custom: true })
// @ts-expect-error The native media event payload must be an Event.
art.emit('video:timeupdate', 'not an event')
// @ts-expect-error Reconnect errors include the attempt count.
art.emit('error', new Error('test'))
// @ts-expect-error A setter-only seek is not a readable numeric value.
const position: number = art.seek
// @ts-expect-error Notice visibility is not the last notice message.
const message: string = art.notice.show
export { builtinHost, fullscreen, message, noticeVisible, playerHost, position, quality, seeking }
