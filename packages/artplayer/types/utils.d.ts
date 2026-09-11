// Generated from public/utils.ts by yarn build:types. Do not edit.
export interface Utils {
  isBrowser: boolean
  userAgent: string
  isMobile: boolean
  isSafari: boolean
  isIOS: boolean
  isIOS13: boolean
  query: <T extends Element = Element>(selector: string, parent?: Document | HTMLElement) => T | null
  queryAll: <T extends Element = Element>(selector: string, parent?: Document | HTMLElement) => T[]
  addClass: (target: HTMLElement, className: string) => void
  removeClass: (target: HTMLElement, className: string) => void
  hasClass: (target: HTMLElement, className: string) => boolean
  append: (target: HTMLElement, child: HTMLElement | string) => Element | ChildNode
  remove: (target: HTMLElement) => HTMLElement
  replaceElement: (newChild: HTMLElement, oldChild: HTMLElement) => HTMLElement
  siblings: (target: HTMLElement) => HTMLElement[]
  inverseClass: (target: HTMLElement, className: string) => void
  createElement: <K extends keyof HTMLElementTagNameMap>(tag: K) => HTMLElementTagNameMap[K]
  setStyle: <T extends keyof CSSStyleDeclaration>(element: HTMLElement, key: T, value: string | CSSStyleDeclaration[T]) => HTMLElement
  setStyles: (element: HTMLElement, styles: Partial<CSSStyleDeclaration>) => HTMLElement
  getStyle: {
    (element: HTMLElement, key: keyof CSSStyleDeclaration, numberType?: true): number
    (element: HTMLElement, key: keyof CSSStyleDeclaration, numberType: false): string
  }
  setStyleText: (id: string, cssText: string) => void
  getRect: (el: HTMLElement) => {
    top: number
    left: number
    width: number
    height: number
  }
  tooltip: (target: HTMLElement, msg: string, pos?: string) => void
  isInViewport: (target: HTMLElement, offset?: number) => boolean
  includeFromEvent: (event: Event, target: HTMLElement) => boolean
  getSafeAreaInsets: () => {
    top: number
    right: number
    bottom: number
    left: number
  }
  srtToVtt: (srtText: string) => string
  vttToBlob: (vttText: string) => string
  assToVtt: (assText: string) => string
  getExt: (url: string) => string
  download: (url: string, name: string) => void
  loadImg: (url: string, scale?: number) => Promise<HTMLImageElement>
  errorHandle: <T extends boolean>(condition: T, msg: string) => T extends true ? T : never
  silencePromise: <T>(value: T) => T extends Promise<infer R> ? Promise<R | undefined> : T
  def: {
    /** Historical string-key signature; runtime returns obj. */
    (obj: object, name: string, value: unknown): void
    <T>(obj: T, name: PropertyKey, value: PropertyDescriptor & ThisType<T>): T
  }
  has: (obj: object, name: PropertyKey) => boolean
  get: (obj: object, name: PropertyKey) => PropertyDescriptor | undefined
  mergeDeep: <T extends object[]>(...args: T) => T[number]
  sleep: (ms?: number) => Promise<void>
  /** Historical return type; runtime discards the callback result and ignores context. */
  debounce: <F extends (...args: any[]) => any>(func: F, wait: number, context?: object) => (...args: Parameters<F>) => ReturnType<F>
  /** Historical return type; runtime discards the callback result. */
  throttle: <F extends (...args: any[]) => any>(func: F, wait: number) => (...args: Parameters<F>) => ReturnType<F>
  clamp: (num: number, a: number, b: number) => number
  secondToTime: (second: number) => string
  escape: (str: string) => string
  unescape: (str: string) => string
  capitalize: (str: string) => string
  ArtPlayerError: new (message?: string, context?: ((...args: never[]) => unknown) | (abstract new (...args: never[]) => object)) => Error
  getIcon: (key?: string, html?: string | HTMLElement) => HTMLElement
  getComposedPath: (event: Event) => EventTarget[]
  supportsFlex: () => boolean
}
