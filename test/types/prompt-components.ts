import type { InfoHost } from '../../packages/artplayer/src/info/poll'
import type { LoadingHost } from '../../packages/artplayer/src/loading'
import type { MaskHost } from '../../packages/artplayer/src/mask'
import Info from '../../packages/artplayer/src/info'
import Loading from '../../packages/artplayer/src/loading'
import Mask from '../../packages/artplayer/src/mask'

declare const host: InfoHost & LoadingHost & MaskHost
const info = new Info(host)
const initialized: void = info.init()
const loading = new Loading(host)
const mask = new Mask(host)
loading.show = true
mask.show = false
const visible: boolean = info.show
// @ts-expect-error A polling host needs its media and panel resources.
const invalid = new Info({ constructor: { INFO_LOOP_TIME: 1 } })
// @ts-expect-error Component visibility is boolean.
loading.show = 'visible'
export { initialized, invalid, visible }
