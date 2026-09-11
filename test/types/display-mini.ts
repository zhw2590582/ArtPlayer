import type { MiniHost } from '../../packages/artplayer/src/display/types'
import miniMix from '../../packages/artplayer/src/player/miniMix'

declare const host: MiniHost
miniMix(host)
const active: boolean = host.mini
host.mini = true
host.mini = false
// @ts-expect-error Mini retains boolean setters.
host.mini = 'true'
// @ts-expect-error Mini storage persists numeric coordinates.
host.storage.set('left', '25px')
export { active }
