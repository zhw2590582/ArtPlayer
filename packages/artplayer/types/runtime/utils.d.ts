// Generated from public/runtime/utils.ts by yarn build:types. Do not edit.
interface StyledElement {
  style: CSSStyleDeclaration
}
interface EventPathSource {
  target: EventTarget | null
  composedPath?: () => EventTarget[]
}
type StackFrame = ((...args: never[]) => unknown) | (abstract new (...args: never[]) => object)
export interface Utils {
  isBrowser: boolean
  userAgent: string
  isMobile: boolean
  isSafari: boolean
  isIOS: boolean
  isIOS13: boolean
  query: <T extends Element = Element>(selector: string, parent?: ParentNode) => T | null
  queryAll: <T extends Element = Element>(selector: string, parent?: ParentNode) => T[]
  addClass: (target: Pick<Element, 'classList'>, className: string) => void
  removeClass: (target: Pick<Element, 'classList'>, className: string) => void
  hasClass: (target: Pick<Element, 'classList'>, className: string) => boolean
  append: (parent: Element, child: unknown) => Element | ChildNode | null
  remove: <T extends Node>(child: T) => T
  replaceElement: <T extends Node>(newChild: T, oldChild: Node) => T
  siblings: (target: Element) => Element[]
  inverseClass: (target: Element, className: string) => void
  createElement: {
    <K extends keyof HTMLElementTagNameMap>(tag: K): HTMLElementTagNameMap[K]
    (tag: string): HTMLElement
  }
  setStyle: <T extends StyledElement>(element: T, key: PropertyKey, value: unknown) => T
  setStyles: <T extends StyledElement>(element: T, styles: object) => T
  getStyle: {
    (element: Element, key: string, numberType?: true): number
    (element: Element, key: string, numberType: false): string
    (element: Element, key: string, numberType: boolean): number | string
  }
  setStyleText: (id: string, cssText: string) => void
  getRect: (element: Pick<Element, 'getBoundingClientRect'>) => DOMRect
  tooltip: (target: Element, message: string | number, position?: string) => void
  isInViewport: (target: Pick<Element, 'getBoundingClientRect'>, offset?: number) => boolean
  includeFromEvent: (event: EventPathSource, target: EventTarget | null | undefined) => boolean
  getSafeAreaInsets: () => {
    top: number
    right: number
    bottom: number
    left: number
  }
  srtToVtt: (text: string) => string
  vttToBlob: (text: string) => string
  assToVtt: (text: string) => string
  getExt: (url: string) => string
  download: (url: string, name: string) => void
  loadImg: (url: string, scale?: number) => Promise<HTMLImageElement>
  errorHandle: <T>(condition: T, message?: string) => T
  silencePromise: <T>(value: T) => T extends Promise<infer Result> ? Promise<Result | undefined> : T
  def: <T extends object>(object: T, name: PropertyKey, descriptor: PropertyDescriptor & object & ThisType<T>) => T
  has: (object: object, name: PropertyKey) => boolean
  get: (object: object, name: PropertyKey) => PropertyDescriptor | undefined
  mergeDeep: <T extends object[]>(...objects: T) => T[number]
  sleep: (milliseconds?: number) => Promise<void>
  /** The wrapper preserves its call receiver; the old context argument is ignored. */
  debounce: <Receiver, Args extends unknown[]>(callback: (this: Receiver, ...args: Args) => unknown, duration: number, context?: object) => (this: Receiver, ...args: Args) => void
  throttle: <Receiver, Args extends unknown[]>(callback: (this: Receiver, ...args: Args) => unknown, duration: number) => (this: Receiver, ...args: Args) => void
  clamp: (number: number, a: number, b: number) => number
  secondToTime: (second: number) => string
  escape: (text: string) => string
  unescape: (text: string) => string
  capitalize: (text: string) => string
  ArtPlayerError: new (message?: string, context?: StackFrame) => Error
  getIcon: (key?: string, html?: string | HTMLElement) => HTMLElement
  getComposedPath: (event: EventPathSource) => EventTarget[]
  supportsFlex: () => boolean
}
export {}
