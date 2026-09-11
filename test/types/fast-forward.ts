import type { FastForwardHost } from '../../packages/artplayer/src/plugins/fastForward'
import fastForward from '../../packages/artplayer/src/plugins/fastForward'

declare const host: FastForwardHost
const plugin = fastForward(host)
const visible: boolean = plugin.state
const name: string = plugin.name
// @ts-expect-error Fast-forward state is read-only.
plugin.state = true
// @ts-expect-error A playing flag does not provide the plugin's media/event host.
fastForward({ playing: true })
export { name, visible }
