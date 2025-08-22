import type Artplayer from './artplayer'

export interface Selector {
  /**
   * Whether the default is selected
   */
  default?: boolean

  /**
   * Html string of selector
   */
  html: string | HTMLElement

  /**
   * Allow custom properties
   */
  [key: string]: any
}

export interface Component {
  /**
   * Component self-increasing id
   */
  readonly id: number

  /**
   * Component parent name
   */
  readonly name: string | undefined

  /**
   * Component parent element
   */
  readonly $parent: HTMLElement | undefined

  /**
   * Whether to show component parent
   */
  get show(): boolean

  /**
   * Whether to show component parent
   */
  set show(state: boolean)

  /**
   * Toggle the component parent
   */
  toggle: () => void

  /**
   * Dynamic add a component
   */
  add: (option: ComponentOption) => HTMLElement

  /**
   * Dynamic remove a component by name
   */
  remove: (name: string) => void

  /**
   * Dynamic update a component
   */
  update: (option: ComponentOption) => HTMLElement
}

export interface ComponentOption {
  /**
   * Html string or html element of component
   */
  html?: string | HTMLElement

  /**
   * Whether to disable component
   */
  disable?: boolean

  /**
   * Unique name for component
   */
  name?: string

  /**
   * Component sort index
   */
  index?: number

  /**
   * Component style object
   */
  style?: Partial<CSSStyleDeclaration>

  /**
   * Component click event
   */
  click?: (this: Artplayer, component: Component, event: Event) => void

  /**
   * When the component was mounted
   */
  mounted?: (this: Artplayer, element: HTMLElement) => void

  /**
   * When the component was before unmount
   */
  beforeUnmount?: (this: Artplayer, element: HTMLElement) => void

  /**
   * Component tooltip, use in controls
   */
  tooltip?: string

  /**
   * Component position, use in controls
   */
  position?: 'top' | 'left' | 'right' | (string & Record<never, never>)

  /**
   * Custom selector list, use in controls
   */
  selector?: Selector[]

  /**
   * When selector item click, use in controls
   */
  onSelect?: (this: Artplayer, selector: Selector, element: HTMLElement, event: Event) => void
}
