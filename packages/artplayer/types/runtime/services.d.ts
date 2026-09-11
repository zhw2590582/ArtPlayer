// Generated from public/runtime/services.ts by yarn build:types. Do not edit.
export interface Config {
  properties: string[]
  methods: string[]
  events: string[]
  prototypes: string[]
}
export type Disposer = () => void
export type Listener = EventListenerOrEventListenerObject | null
export interface EventRegistry {
  destroyEvents: Set<Disposer>
  proxy: {
    (target: EventTarget, name: string, callback: Listener, option?: boolean | AddEventListenerOptions | null): Disposer
    (target: EventTarget, name: string[], callback: Listener, option?: boolean | AddEventListenerOptions | null): Disposer[]
    (target: EventTarget, name: string | string[], callback: Listener, option?: boolean | AddEventListenerOptions | null): Disposer | Disposer[]
  }
  hover: (target: EventTarget, mouseenter?: (event: Event) => unknown, mouseleave?: (event: Event) => unknown) => void
  remove: (dispose: Disposer) => void
  destroy: () => void
  bindGlobalEvents: (source?: {
    window?: Window
    document?: Document
  }) => void
}
export interface Storage {
  name: string
  settings: Record<PropertyKey, unknown>
  get: (key?: PropertyKey) => unknown
  set: (key: PropertyKey, value: unknown) => void
  del: (key: PropertyKey) => void
  clear: () => void
}
export type Dictionary = Record<string, string | undefined>
export type Languages = Record<string, Dictionary | undefined>
export interface I18n<Host> {
  art: Host
  languages: Languages
  language: Dictionary
  init: () => void
  get: (key: string) => string
  update: (value: Languages) => void
}
export type HotkeyCallback<Host> = (this: Host, event: KeyboardEvent) => unknown
export interface Hotkey<Host> {
  art: Host
  keys: Record<string, HotkeyCallback<Host>[]>
  init: () => void
  add: (key: string, callback: HotkeyCallback<Host>) => this
  remove: (key: string, callback: HotkeyCallback<Host>) => this
}
export type ValidatorPath = (string | number)[]
export type Validator = (value: unknown, type: string, paths: ValidatorPath) => unknown
export type Scheme = string | Validator | Scheme[] | {
  [key: string]: Scheme
}
