import type { LockHost } from '../../packages/artplayer/src/plugins/lock'
import type { MiniProgressHost } from '../../packages/artplayer/src/plugins/miniProgressBar'
import lock from '../../packages/artplayer/src/plugins/lock'
import miniProgressBar from '../../packages/artplayer/src/plugins/miniProgressBar'

declare const host: LockHost & MiniProgressHost
const plugin = lock(host)
plugin.state = true
const state: boolean = plugin.state
const mini: { name: string } = miniProgressBar(host)
// @ts-expect-error Lock state takes a boolean.
plugin.state = 'locked'
// @ts-expect-error The miniature progress plugin has no public state accessor.
miniProgressBar(host).state = true
export { mini, state }
