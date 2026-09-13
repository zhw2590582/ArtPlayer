import type { DanmukuArt } from './types'

type Disposer = () => unknown
type PropertyValue = string | number | boolean | undefined
interface PropertyEntry {
  original: PropertyValue
  present: boolean
  priority: string | undefined
  owners: Map<SettingLifecycle, PropertyValue>
  apply: (value: PropertyValue) => unknown
  last?: PropertyValue
  lastPriority?: string
}
interface SettingEvents {
  'resize': []
  'fullscreen': [state: boolean]
  'fullscreenWeb': [state: boolean]
  'artplayerPluginDanmuku:show': []
  'artplayerPluginDanmuku:hide': []
  'document:pointermove': [event: PointerEvent]
  'document:pointerup': [event: PointerEvent]
}
const properties = new WeakMap<object, Map<string, PropertyEntry>>()

export default class SettingLifecycle {
  declare art: DanmukuArt
  declare closed: boolean
  declare disposers: Set<Disposer>
  declare cancelled: Promise<void>
  declare cancel: () => void

  constructor(art: DanmukuArt) {
    this.art = art
    this.closed = false
    this.disposers = new Set()
    this.cancelled = new Promise(resolve => this.cancel = resolve)
  }

  get active() {
    return !this.closed && !this.art.isDestroy
  }

  own(dispose: Disposer) {
    if (this.closed)
      dispose()
    else this.disposers.add(dispose)
  }

  write(host: DOMStringMap | CSSStyleDeclaration, key: string, value: PropertyValue, apply: (value: PropertyValue) => unknown = value => (host as unknown as Record<string, PropertyValue>)[key] = value) {
    // This adapter retains native dataset/style assignment and its WebIDL coercion.
    const target = host as unknown as Record<string, PropertyValue> & Partial<Pick<CSSStyleDeclaration, 'getPropertyPriority' | 'setProperty'>>
    if (!this.active)
      return
    const priority = () => typeof target.getPropertyPriority === 'function' ? target.getPropertyPriority(key) : undefined
    let keys = properties.get(target)
    if (!keys) {
      keys = new Map()
      properties.set(target, keys)
    }
    let entry = keys.get(key)
    if (!entry) {
      entry = {
        original: target[key],
        present: key in target || target[key] !== undefined,
        priority: priority(),
        owners: new Map(),
        apply,
      }
      keys.set(key, entry)
    }
    if (!entry.owners.has(this)) {
      this.own(() => {
        const owners = [...entry.owners.keys()]
        const current = owners[owners.length - 1] === this
        entry.owners.delete(this)
        // A later user write belongs to the host, not this settings instance.
        if (current && target[key] === entry.last && priority() === entry.lastPriority) {
          const values = [...entry.owners.values()]
          if (values.length) {
            entry.apply(values[values.length - 1])
            entry.last = target[key]
            entry.lastPriority = priority()
          }
          else if (entry.priority !== undefined) {
            target.setProperty!(key, entry.original as string, entry.priority)
          }
          else if (entry.present) {
            entry.apply(entry.original)
          }
          else {
            delete target[key]
          }
        }
        if (!entry.owners.size) {
          keys.delete(key)
          if (!keys.size)
            properties.delete(target)
        }
      })
    }
    entry.owners.delete(this)
    entry.owners.set(this, value)
    entry.apply(value)
    entry.last = target[key]
    entry.lastPriority = priority()
  }

  on<Name extends keyof SettingEvents>(name: Name, callback: (this: unknown, ...args: SettingEvents[Name]) => unknown) {
    if (!this.active)
      return
    // Keep the emitter/native callback receiver while consulting this owner.
    // eslint-disable-next-line ts/no-this-alias
    const lifecycle = this
    function listener(this: unknown, ...args: unknown[]) {
      if (lifecycle.active)
        return callback.apply(this, args as SettingEvents[Name])
    }
    const dispose = () => this.art.off(name, listener)
    this.own(dispose)
    try {
      this.art.on(name, listener)
      if (!this.active)
        dispose()
    }
    catch (error) {
      this.release(dispose)
      throw error
    }
  }

  proxy<Name extends keyof HTMLElementEventMap>(target: HTMLElement, name: Name, callback: (this: unknown, event: HTMLElementEventMap[Name]) => unknown) {
    if (!this.active)
      return
    // Keep the emitter/native callback receiver while consulting this owner.
    // eslint-disable-next-line ts/no-this-alias
    const lifecycle = this
    function listener(this: unknown, ...args: unknown[]) {
      if (lifecycle.active)
        return callback.apply(this, args as [HTMLElementEventMap[Name]])
    }
    let remove: (() => void) | undefined
    const dispose = () => {
      if (typeof remove === 'function') {
        const registry = this.art.events as DanmukuArt['events'] & { destroyEvents?: Set<() => void> }
        if (typeof registry?.remove === 'function' && registry.destroyEvents?.has(remove))
          registry.remove(remove)
        else remove()
      }
      else {
        target.removeEventListener?.(name, listener)
      }
    }
    this.own(dispose)
    try {
      remove = this.art.proxy(target, name, listener)
      if (!this.active)
        dispose()
    }
    catch (error) {
      this.release(dispose)
      throw error
    }
  }

  wait<Value>(value: Value | PromiseLike<Value>) {
    return Promise.race([value, this.cancelled])
  }

  release(dispose: Disposer) {
    try {
      dispose()
    }
    catch (error) {
      console.warn('Failed to dispose danmuku setting resource:', error)
    }
  }

  close() {
    if (this.closed)
      return
    this.closed = true
    this.cancel()
    for (const dispose of this.disposers) {
      this.release(dispose)
    }
    this.disposers.clear()
  }
}
