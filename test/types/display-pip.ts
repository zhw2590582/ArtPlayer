import type { PipHost } from '../../packages/artplayer/src/display/types'
import pipMix from '../../packages/artplayer/src/player/pipMix'

declare const host: PipHost
pipMix(host)
const state: HTMLElement | null | boolean = host.pip
// @ts-expect-error Native PiP historically returns the element or null, not just boolean.
const booleanOnly: boolean = host.pip
host.pip = true
host.pip = false
// @ts-expect-error PiP setters accept a boolean input.
host.pip = 'picture-in-picture'
export { booleanOnly, state }
