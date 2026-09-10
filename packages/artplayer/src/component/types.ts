import type Component from '../utils/component'

export type EventCleanup = () => void

export interface ComponentHost {
  template: { $player: HTMLElement }
  emit: (name: string, ...args: unknown[]) => unknown
  events: {
    proxy: (target: EventTarget, name: string, callback: (event: Event) => unknown) => EventCleanup
    remove: (cleanup: EventCleanup) => void
  }
}

export interface SelectorItem {
  html: string | HTMLElement | number
  value?: string | number
  default?: boolean
  readonly $control_option?: SelectorItem[]
  readonly $control_item?: HTMLDivElement
  readonly $control_value?: HTMLDivElement
}

export interface EntryOption<Host extends ComponentHost> {
  html?: string | HTMLElement | number
  disable?: boolean
  name?: string
  index?: number
  style?: Partial<CSSStyleDeclaration>
  tooltip?: string | number
  position?: string
  selector?: SelectorItem[]
  click?: (this: Host, component: Component<Host>, event: Event) => unknown
  mounted?: (this: Host, element: HTMLDivElement) => unknown
  beforeUnmount?: (this: Host, element: HTMLDivElement) => unknown
  onSelect?: (this: Host, item: SelectorItem, element: HTMLDivElement, event: Event) => unknown
}

export type EntryInput<Host extends ComponentHost> = EntryOption<Host> | ((art: Host) => EntryOption<Host>)

export interface Entry<Host extends ComponentHost> {
  $ref: HTMLDivElement
  events: EventCleanup[]
  option: EntryOption<Host>
}
