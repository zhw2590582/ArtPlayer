export interface Utils {
  userAgent: string
  isMobile: boolean
  isSafari: boolean
  isIOS: boolean
  isIOS13: boolean

  query: (selector: string, parent?: HTMLElement) => HTMLElement
  queryAll: (selector: string, parent?: HTMLElement) => HTMLElement[]
  addClass: (target: HTMLElement, className: string) => void
  removeClass: (target: HTMLElement, className: string) => void
  hasClass: (target: HTMLElement, className: string) => boolean
  append: (target: HTMLElement, child: HTMLElement) => HTMLElement
  remove: (target: HTMLElement) => void
  replaceElement: (newChild: HTMLElement, oldChild: HTMLElement) => HTMLElement
  siblings: (target: HTMLElement) => HTMLElement[]
  inverseClass: (target: HTMLElement, className: string) => void
  createElement: <K extends keyof HTMLElementTagNameMap>(tag: K) => HTMLElementTagNameMap[K]
  setStyle: <T extends keyof CSSStyleDeclaration>(
    element: HTMLElement,
    key: T,
    value: CSSStyleDeclaration[T],
  ) => HTMLElement
  setStyles: (element: HTMLElement, styles: Partial<CSSStyleDeclaration>) => HTMLElement
  getStyle: <K extends keyof CSSStyleDeclaration>(
    element: HTMLElement,
    key: K,
    numberType?: boolean,
  ) => boolean extends true ? number : string
  setStyleText: (element: HTMLElement, text: string) => void
  getRect: (el: HTMLElement) => { top: number, left: number, width: number, height: number }
  tooltip: (target: HTMLElement, msg: string, pos?: string) => void
  isInViewport: (target: HTMLElement, offset?: number) => boolean
  includeFromEvent: (event: Event, target: HTMLElement) => boolean

  srtToVtt: (srtText: string) => string
  vttToBlob: (vttText: string) => string
  assToVtt: (assText: string) => string

  getExt: (url: string) => string
  download: (url: string, name: string) => void
  loadImg: (url: string, scale?: number) => Promise<HTMLImageElement>

  errorHandle: <T extends boolean>(condition: T, msg: string) => T extends true ? T : never
  def: (obj: object, name: string, value: unknown) => void
  has: (obj: object, name: PropertyKey) => boolean
  get: (obj: object, name: PropertyKey) => PropertyDescriptor | undefined
  mergeDeep: <T extends object[]>(...args: T) => T[number]

  sleep: (ms: number) => Promise<void>
  debounce: <F extends (...args: any[]) => any>(func: F, wait: number, context?: object) => (...args: Parameters<F>) => ReturnType<F>
  throttle: <F extends (...args: any[]) => any>(func: F, wait: number) => (...args: Parameters<F>) => ReturnType<F>

  clamp: (num: number, a: number, b: number) => number
  secondToTime: (second: number) => string
  escape: (str: string) => string
  capitalize: (str: string) => string

  getIcon: (key: string, html: string | HTMLElement) => HTMLElement
  supportsFlex: () => boolean
}
