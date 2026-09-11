import type { PipProperty } from '../../packages/artplayer/src/display/types'
import type { DisplayStates } from '../../packages/artplayer/src/media/playback'
import type { AirplayHost } from '../../packages/artplayer/src/player/airplayMix'
import type { AttributeMethods } from '../../packages/artplayer/src/player/attrMix'
import type { CssVariableMethods } from '../../packages/artplayer/src/player/cssVarMix'
import type { InitialOptionHost } from '../../packages/artplayer/src/player/optionInit'
import type { PlaybackStorage } from '../../packages/artplayer/src/plugins/auto-playback/records'
import config from '../../packages/artplayer/src/config'
import airplayMix from '../../packages/artplayer/src/player/airplayMix'
import optionInit from '../../packages/artplayer/src/player/optionInit'
import stateMix from '../../packages/artplayer/src/player/stateMix'
import Storage from '../../packages/artplayer/src/storage'
import { append, getStyle } from '../../packages/artplayer/src/utils/dom'

declare const element: HTMLElement
declare const attrs: AttributeMethods
declare const css: CssVariableMethods
declare const initial: InitialOptionHost
declare const airplay: AirplayHost
const raw: unknown = attrs.attr(Symbol('extension'))
const text: string = css.cssVar('--custom')
const numeric: number = getStyle(element, 'width')
const authored: string = getStyle(element, 'width', false)
const node: Element | ChildNode | null = append(element, '')
const storage = new Storage()
const records: PlaybackStorage = storage
declare const pip: PipProperty
const display: DisplayStates = {
  mini: false,
  fullscreen: false,
  fullscreenWeb: false,
  get pip(): HTMLElement | null | boolean { return pip.pip },
  set pip(value: boolean) { pip.pip = value },
}
stateMix(display)
const stored: unknown = storage.get('extension')
config.events.push('custom-event')
config.methods = ['customMethod']
optionInit(initial)
airplayMix(airplay)
// @ts-expect-error DOM append can return a text node or null.
const guaranteedElement: HTMLElement = append(element, '')
// @ts-expect-error Raw storage reads are not validated records.
const validated: Record<string, unknown> = storage.get()
// @ts-expect-error String style reads are distinct from numeric reads.
const wrong: number = getStyle(element, 'width', false)
export { authored, display, guaranteedElement, node, numeric, raw, records, stored, text, validated, wrong }
