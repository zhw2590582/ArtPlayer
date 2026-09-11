import type { Emitter } from 'artplayer'
import type { Controls } from '../../packages/artplayer/types/runtime/component.js'
import type { Events } from '../../packages/artplayer/types/runtime/events.js'
import type { NativeMedia } from '../../packages/artplayer/types/runtime/media.js'
import type { Player } from '../../packages/artplayer/types/runtime/player.js'
import type { Plugins } from '../../packages/artplayer/types/runtime/plugin.js'
import type { Setting, SettingItem } from '../../packages/artplayer/types/runtime/setting.js'
import type { Notice, Subtitle } from '../../packages/artplayer/types/runtime/subtitle.js'
import type { Icons, Template } from '../../packages/artplayer/types/runtime/template.js'
import type { Utils } from '../../packages/artplayer/types/runtime/utils.js'

declare const player: Player<NativeMedia>
declare const registry: Plugins<Player<NativeMedia>>
declare const events: Emitter<Events>
declare const notice: Notice
declare const subtitle: Subtitle
declare const template: Template<Player<NativeMedia>, NativeMedia>
declare const icons: Icons
declare const utils: Utils
declare const controls: Controls<Player<NativeMedia>>
declare const setting: Setting<Player<NativeMedia>>
const read: undefined = player.seek
player.seek = '2'
const play: Promise<void> = player.play()
const pip: Element | null | boolean = player.pip
const immediate: typeof registry = registry.add(art => ({ name: 'plain', value: art.currentTime }))
const pending: Promise<typeof registry> = registry.add(async art => ({ name: 'async', value: art.currentTime }))
events.on('subtitleBeforeUpdate', cues => cues.map(cue => cue.text))
events.on('video:error', event => event.type)
const visible: boolean = notice.show
notice.show = new Error('test')
const changed: Promise<string | null | undefined> = subtitle.switch('/subtitle.vtt')
const native: NativeMedia = template.$video
const wrapper: HTMLElement = icons.play
const custom: HTMLElement | undefined = icons.custom
const target = { id: 1 }
const same: typeof target = utils.def(target, 'name', { value: 'name' })
const delayed: void = utils.debounce(() => 1, 0, {})()
const mounted: undefined = controls.add({ name: 'button', html: 'Button', position: 'left' })
const settingResult: SettingItem<Player<NativeMedia>> | null = setting.find('entry')
const input = { name: 'entry', html: 'Entry', custom: 123 }
const settingIdentity: typeof input = setting.add(input)
const updated: SettingItem<Player<NativeMedia>> = setting.update(input)
// @ts-expect-error Reading a setter-only command is not a numeric result.
const number: number = player.seek
// @ts-expect-error Native error forwarding preserves Event, not an Error object.
events.emit('video:error', new Error('wrong payload'))
// @ts-expect-error Update callbacks receive arrays.
events.on('subtitleBeforeUpdate', (cue: VTTCue) => cue.text)
// @ts-expect-error Deferred callbacks have no immediate numeric result.
const immediateNumber: number = utils.throttle(() => 1, 0)()
// @ts-expect-error A setting update returns the item, not the registry.
const settingRegistry: typeof setting = setting.update(input)
export { changed, custom, delayed, immediate, immediateNumber, mounted, native, number, pending, pip, play, read, same, settingIdentity, settingRegistry, settingResult, updated, visible, wrapper }
