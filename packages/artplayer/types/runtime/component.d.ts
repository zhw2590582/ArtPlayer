// Generated from public/runtime/component.ts by yarn build:types. Do not edit.
export type EventCleanup = () => void
export interface SelectorItem {
  html: string | HTMLElement | number
  value?: string | number
  default?: boolean
  readonly $control_option?: SelectorItem[]
  readonly $control_item?: HTMLDivElement
  readonly $control_value?: HTMLDivElement
}
export interface ComponentOption<Host> {
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
export type ComponentInput<Host> = ComponentOption<Host> | ((art: Host) => ComponentOption<Host>)
export interface ControlOption<Host> extends Omit<ComponentOption<Host>, 'position'> {
  position: 'top' | 'left' | 'right'
}
export type ControlInput<Host> = ControlOption<Host> | ((art: Host) => ControlOption<Host>)
export interface ComponentEntry<Host> {
  $ref: HTMLDivElement
  events: EventCleanup[]
  option: ComponentOption<Host>
}
export interface Component<Host> {
  id: number
  art: Host
  name?: string
  $parent?: HTMLElement
  cache: Map<string, ComponentEntry<Host>>
  show: boolean
  toggle: () => void
  add: (input: ComponentInput<Host>) => HTMLDivElement | undefined
  remove: (name: string) => void
  update: (option: ComponentOption<Host>) => ReturnType<this['add']>
  selector?: (option: ComponentOption<Host>, element: HTMLDivElement, events: EventCleanup[]) => void
}
export interface Controls<Host> extends Omit<Component<Host>, 'add' | 'update' | 'selector'> {
  isHover: boolean
  timer: number
  setting?: HTMLDivElement
  thumbnails?: HTMLDivElement
  init: () => void
  add: (input: ControlInput<Host>) => undefined
  update: (option: ComponentOption<Host>) => undefined
  check: (target?: SelectorItem) => void
  selector: (option: ComponentOption<Host>, element: HTMLDivElement, events: EventCleanup[]) => void
}
