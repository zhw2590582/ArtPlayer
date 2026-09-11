export type SettingContent = string | HTMLElement | number
export type SettingRange = [value?: number, min?: number, max?: number, step?: number]
export type SettingCallback<Host> = (this: Host, item: SettingItem<Host>, element: HTMLDivElement, event: Event) => unknown

export interface SettingItem<Host> {
  name?: string
  html?: SettingContent
  icon?: SettingContent
  tooltip?: SettingContent
  width?: number
  value?: string | number
  default?: boolean
  switch?: boolean
  range?: SettingRange
  selector?: SettingItem<Host>[]
  mounted?: (this: Host, element: HTMLDivElement, item: SettingItem<Host>) => unknown
  onClick?: SettingCallback<Host>
  onSwitch?: SettingCallback<Host>
  onRange?: SettingCallback<Host>
  onChange?: SettingCallback<Host>
  onSelect?: SettingCallback<Host>
  readonly $parent?: SettingItem<Host>
  readonly $parents?: SettingItem<Host>[]
  readonly $option?: SettingItem<Host>[]
  readonly $events?: (() => void)[]
  readonly $formatted?: boolean
  readonly $item?: HTMLDivElement
  readonly $icon?: HTMLDivElement
  readonly $html?: HTMLDivElement
  readonly $tooltip?: HTMLDivElement
  readonly $switch?: HTMLDivElement
  readonly $range?: HTMLInputElement
}

export interface Setting<Host> {
  id: number
  art: Host
  name: string
  $parent: HTMLElement
  cache: Map<SettingItem<Host>[], HTMLDivElement>
  active: SettingItem<Host>[] | null
  option: SettingItem<Host>[]
  readonly builtin: SettingItem<Host>[]
  show: boolean
  toggle: () => void
  traverse: (callback: (item: SettingItem<Host>) => void, option?: SettingItem<Host>[]) => void
  check: (target?: SettingItem<Host> | null) => void
  format: (option?: SettingItem<Host>[], parent?: SettingItem<Host>, parents?: SettingItem<Host>[], names?: string[]) => void
  find: (name?: string) => SettingItem<Host> | null
  resize: () => void
  inactivate: (item: SettingItem<Host>) => void
  remove: (name: string) => void
  update: (item: SettingItem<Host>) => SettingItem<Host>
  add: <Item extends SettingItem<Host>>(item: Item, option?: SettingItem<Host>[]) => Item
  createHeader: (item: SettingItem<Host>) => void
  createItem: (item: SettingItem<Host>, isUpdate?: boolean) => void
  render: (option?: SettingItem<Host>[]) => void
}
