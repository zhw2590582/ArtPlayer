import type { OrientationHost, OrientationLock } from '../../packages/artplayer/src/display/orientation-types'
import autoOrientation from '../../packages/artplayer/src/plugins/autoOrientation'

declare const host: OrientationHost
declare const lock: OrientationLock
const plugin = autoOrientation(host)
const state: boolean = plugin.state
// @ts-expect-error The builtin exposes a getter, not a writable flag.
plugin.state = true
// @ts-expect-error Internal orientation requests use the opposite portrait/landscape mode.
lock.lock('upside-down')
// @ts-expect-error Fullscreen events carry boolean state.
host.on('fullscreen', (value: string) => value)
export { state }
