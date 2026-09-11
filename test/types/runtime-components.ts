import type { Component, Controls } from '../../packages/artplayer/public/runtime/component'
import type { Setting, SettingItem } from '../../packages/artplayer/public/runtime/setting'
import type Artplayer from '../../packages/artplayer/src'
import type { ControlHost } from '../../packages/artplayer/src/control/types'
import type { SettingHost } from '../../packages/artplayer/src/setting/types'

declare const source: Artplayer
const controls: Controls<ControlHost> = source.controls
const component: Component<ControlHost> = source.controls
const setting: Setting<SettingHost> = source.setting
const added: undefined = controls.add({ name: 'sample', html: 1, position: 'left' })
const updated: undefined = controls.update({ name: 'sample', html: 2 })
const nullable: SettingItem<SettingHost> | null = setting.find('absent')
const item = { name: 'setting', html: 'Item', extra: 1 }
const same: typeof item = setting.add(item)
const changed: SettingItem<SettingHost> = setting.update({ name: 'setting', html: 'Updated' })
const removed: void = setting.remove('setting')
setting.add({ name: 'callback', html: 'Callback', onClick(entry) {
  const offset: number = this.subtitleOffset
  return [offset, entry.name]
} })
// @ts-expect-error The updated item is not the whole setting registry.
const registry: Setting<SettingHost> = setting.update({ name: 'setting' })
// @ts-expect-error A missing setting result is null, not undefined.
const absent: undefined = setting.find('absent')
// @ts-expect-error Control add does not return a mounted element.
const element: HTMLElement = controls.add({ html: 'Button', position: 'left' })
export { absent, added, changed, component, element, nullable, registry, removed, same, updated }
