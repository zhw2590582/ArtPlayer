import type Setting from '../../packages/artplayer/src/setting'
import type { SettingItem } from '../../packages/artplayer/src/setting/types'

declare const setting: Setting
const input = { name: 'custom', html: 'Custom', customValue: 42 }
const added = setting.add(input)
const value: number = added.customValue
const updated: SettingItem = setting.update(input)
const found: SettingItem | null = setting.find('absent')
const removed: void = setting.remove('custom')
// @ts-expect-error Runtime find can return null.
const definite: SettingItem = setting.find('absent')
// @ts-expect-error Setting add returns the item rather than its DOM row.
const element: HTMLDivElement = setting.add(input)
// @ts-expect-error Range values must be numeric.
setting.add({ html: 'Range', range: ['invalid'] })
void [value, updated, found, removed, definite, element]
