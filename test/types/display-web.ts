import type { WebFullscreenHost } from '../../packages/artplayer/src/display/types'
import { capturePlacement, restorePlacement } from '../../packages/artplayer/src/display/placement'
import fullscreenWebMix from '../../packages/artplayer/src/player/fullscreenWebMix'

declare const host: WebFullscreenHost
fullscreenWebMix(host)
host.fullscreenWeb = true
const active: boolean = host.fullscreenWeb
const placement = capturePlacement(host.template.$player)
restorePlacement(placement)
// @ts-expect-error Display setters retain a boolean input.
host.fullscreenWeb = 'true'
// @ts-expect-error DOM placement cannot be constructed from a string.
capturePlacement('player')
export { active }
