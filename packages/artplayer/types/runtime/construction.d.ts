// Generated from public/runtime/construction.ts by yarn build:types. Do not edit.
import type { Emitter } from '../emitter'
import type Artplayer from '../runtime'
import type { Events } from './events'
import type { Player } from './player'
/** Safe fields before Template returns; video/query/proxy getters are not usable yet. */
export interface ProxyHost extends Emitter<Events>, Pick<Artplayer, 'constructor' | 'id' | 'option' | 'isLock' | 'isReady' | 'isFocus' | 'isInput' | 'isRotate' | 'isDestroy' | 'destroy'> {
}
type Pending<Names extends keyof Artplayer> = Player & Omit<Artplayer, Names | keyof Player> & Partial<Pick<Artplayer, Names>>
type AfterPlayer = 'layers' | 'controls' | 'contextmenu' | 'subtitle' | 'info' | 'loading' | 'hotkey' | 'mask' | 'setting' | 'plugins'
/** URL assignment awaits its owned delay before invoking customType. */
export type CustomTypeHost = Artplayer
export type LayerHost = Pending<AfterPlayer>
export type ControlHost = Pending<Exclude<AfterPlayer, 'layers'>>
export type ContextmenuHost = Pending<Exclude<AfterPlayer, 'layers' | 'controls'>>
/** Constructor factories run before the Plugins registry is assigned to the player. */
export type PluginHost = Pending<'plugins'>
export {}
