import type { AutoPlaybackHost } from '../../packages/artplayer/src/plugins/autoPlayback'
import autoPlayback from '../../packages/artplayer/src/plugins/autoPlayback'

declare const host: AutoPlaybackHost
const plugin = autoPlayback(host)
const times: Record<string, number> = plugin.times
const remaining: Record<string, number> = plugin.delete('example')
const cleared: void = plugin.clear()
// @ts-expect-error Record deletion takes the persisted string key.
plugin.delete({ id: 'example' })
// @ts-expect-error Playback times contain numbers, not text.
const invalid: Record<string, string> = plugin.times
// @ts-expect-error The plugin needs both recording and prompt resources.
autoPlayback({ storage: host.storage })
export { cleared, invalid, remaining, times }
