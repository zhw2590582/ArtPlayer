import type Artplayer from './artplayer'

type Props<T> = {
  html: string
  icon: string
  tooltip: string
  $item: HTMLDivElement
  $icon: HTMLDivElement
  $html: HTMLDivElement
  $tooltip: HTMLDivElement
  $switch: HTMLDivElement
  $range: HTMLInputElement
  $parent: Setting
  $parents: Setting[]
  $option: Setting[]
  $events: Array<(...args: unknown[]) => unknown>
  $formatted: boolean
} & Omit<T, 'html' | 'icon' | 'tooltip'>

export type SettingOption = Props<Setting>

export interface Setting {
  /**
   * Html string or html element of setting name
   */
  html: string | HTMLElement

  /**
   * Html string or html element of setting icon
   */
  icon?: string | HTMLElement

  /**
   * The width of setting
   */
  width?: number

  /**
   * The tooltip of setting
   */
  tooltip?: string | HTMLElement

  /**
   * Whether the default is selected
   */
  default?: boolean

  /**
   * Custom selector list
   */
  selector?: Setting[]

  /**
   * When the setting was mounted
   */
  mounted?: (this: Artplayer, panel: HTMLDivElement, item: Setting) => void

  /**
   * When selector item click
   */
  onSelect?: (this: Artplayer, item: SettingOption, element: HTMLDivElement, event: Event) => void

  /**
   * Custom switch item
   */
  switch?: boolean

  /**
   * When switch item click
   */
  onSwitch?: (this: Artplayer, item: SettingOption, element: HTMLDivElement, event: Event) => void

  /**
   * Custom range item
   */
  range?: [value?: number, min?: number, max?: number, step?: number]

  /**
   * When range item change
   */
  onRange?: (this: Artplayer, item: SettingOption, element: HTMLDivElement, event: Event) => void

  /**
   * When range item change in real time
   */
  onChange?: (this: Artplayer, item: SettingOption, element: HTMLDivElement, event: Event) => void

  /**
   * When range item change in real time
   */
  onClick?: (this: Artplayer, item: SettingOption, element: HTMLDivElement, event: Event) => void

  /**
   * Allow custom properties
   */
  [key: string]: any
}
