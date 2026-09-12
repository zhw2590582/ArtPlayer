import type { HlsState, ProxyOptions } from './engine-types'

export type State = NonNullable<HlsState>
export type Level = State['levels'][number]
export type Audio = State['audios'][number]
export type Label = string | null | undefined
export interface DisplayConfig {
  control?: boolean
  setting?: boolean
}
export interface SelectorItem {
  html: Label
  value: number | 'auto'
  default: boolean
}
export interface MenuModel {
  title: string
  html: Label
  selector: SelectorItem[]
}
export interface MenuOption {
  name: string
  html: Label
  selector: SelectorItem[]
  onSelect: (item: SelectorItem) => Promise<Label>
  position?: 'right'
  style?: { padding: string }
  tooltip?: Label
  icon?: string
  width?: number
}
interface Registry {
  update: (menu: MenuOption) => unknown
  remove: (name: string) => unknown
}
export interface MenuHost {
  controls: Registry & { cache: { has: (name: string) => boolean } }
  setting: Registry & { find: (name: string) => unknown }
  notice: { show: string }
  on: (name: string, callback: () => unknown) => unknown
  off: (name: string, callback: () => unknown) => unknown
}
export interface MenuShim {
  engine: { readonly loadSeq: number, readonly destroyed: boolean }
  getM3u8State: () => Promise<HlsState>
  switchM3u8Quality: (value: unknown) => Promise<void>
  switchM3u8Audio: (value: unknown) => Promise<void>
}
export interface SetupOptions {
  art: MenuHost
  shim: MenuShim
  option: ProxyOptions
}
