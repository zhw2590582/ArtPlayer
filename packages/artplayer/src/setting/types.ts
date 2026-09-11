import type { SubscriptionHost } from '../component/resources'
import type { ComponentHost } from '../component/types'
import type { TreeItem } from './model'

export type SettingContent = string | HTMLElement | number
export type SettingRange = [value?: number, min?: number, max?: number, step?: number]
export type SettingCallback = (this: SettingHost, item: SettingItem, element: HTMLDivElement, event: Event) => unknown

export interface SettingItem extends TreeItem {
  html?: SettingContent
  icon?: SettingContent
  tooltip?: SettingContent
  width?: number
  value?: string | number
  default?: boolean
  switch?: boolean
  range?: SettingRange
  selector?: SettingItem[]
  mounted?: (this: SettingHost, element: HTMLDivElement, item: SettingItem) => unknown
  onClick?: SettingCallback
  onSwitch?: SettingCallback
  onRange?: SettingCallback
  onChange?: SettingCallback
  onSelect?: SettingCallback
  readonly $parent?: SettingItem
  readonly $parents?: SettingItem[]
  readonly $option?: SettingItem[]
  readonly $item?: HTMLDivElement
  readonly $icon?: HTMLDivElement
  readonly $html?: HTMLDivElement
  readonly $tooltip?: HTMLDivElement
  readonly $switch?: HTMLDivElement
  readonly $range?: HTMLInputElement
}

export interface SettingEvents {
  'setting': [boolean]
  'blur': [Event]
  'focus': [event: Event]
  'resize': []
  'video:ratechange': [Event]
  'aspectRatio': [value: string]
  'flip': [value: string]
  'subtitleOffset': [value: number]
}

export interface SettingHost extends ComponentHost, SubscriptionHost<SettingEvents> {
  template: { $player: HTMLElement, $setting: HTMLElement, $bottom: HTMLElement, $controls: HTMLElement }
  controls: { setting?: HTMLElement }
  option: { setting: boolean, settings: SettingItem[], playbackRate: boolean, aspectRatio: boolean, flip: boolean, subtitleOffset: boolean }
  constructor: { SETTING_WIDTH: number, SETTING_ITEM_HEIGHT: number, SETTING_ITEM_WIDTH: number, PLAYBACK_RATE: number[], ASPECT_RATIO: string[], FLIP: string[] }
  icons: Record<'arrowLeft' | 'arrowRight' | 'config' | 'check' | 'switchOn' | 'switchOff' | 'playbackRate' | 'aspectRatio' | 'flip', HTMLElement> & { subtitle?: HTMLElement }
  proxy: ComponentHost['events']['proxy']
  i18n: { get: (key: string) => string }
  setting: SettingManager
  isRotate: boolean
  playbackRate: number
  aspectRatio: string
  flip: string
  subtitleOffset: number
}

export interface SettingManager {
  id: number
  art: SettingHost
  name: string
  $parent: HTMLElement
  cache: Map<SettingItem[], HTMLDivElement>
  active: SettingItem[] | null
  option: SettingItem[]
  show: boolean
  traverse: (callback: (item: SettingItem) => void, option?: SettingItem[]) => void
  check: (target?: SettingItem | null) => void
  render: (option?: SettingItem[]) => void
  resize: () => void
  createItem: (item: SettingItem, isUpdate?: boolean) => void
  createHeader: (item: SettingItem) => void
  find: (name?: string) => SettingItem | null
  format: () => void
  add: <Item extends SettingItem>(item: Item, option?: SettingItem[]) => Item
}
