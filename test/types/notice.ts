import type Notice from '../../packages/artplayer/src/notice'
import type Artplayer from '../../packages/artplayer/types/artplayer'

declare const notice: Notice
declare const art: Artplayer
const visible: boolean = notice.show
notice.show = 'message'
notice.show = new Error('message')
notice.show = false
notice.show = ''
const timer: number | null = notice.timer
const destroyed: void = notice.destroy()
// @ts-expect-error The runtime getter returns visibility, not message text.
const text: string = notice.show
// @ts-expect-error True is not a declared message input.
notice.show = true
// @ts-expect-error Arbitrary objects are not declared message inputs.
notice.show = {}
// Preserve old legal consumers until CORE-21 coordinates an explicit precise view.
const legacy: string | Error | false = art.notice.show
art.notice.show = false
export { destroyed, legacy, text, timer, visible }
