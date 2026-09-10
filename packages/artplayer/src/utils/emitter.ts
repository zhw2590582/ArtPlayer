type EventMap<Events> = { [Name in keyof Events]: readonly unknown[] }
type Listener<Args extends unknown[]> = ((...args: Args) => unknown) & { _?: (...args: Args) => unknown }
interface Registration<Args extends unknown[]> {
  fn: Listener<Args>
  ctx: unknown
}
type Registry<Events extends EventMap<Events>> = { [Name in keyof Events]?: Registration<[...Events[Name]]>[] }
const owns = (object: object, key: PropertyKey) => Object.prototype.hasOwnProperty.call(object, key)

export default class Emitter<Events extends EventMap<Events> = Record<PropertyKey, unknown[]>> {
  declare e?: Registry<Events>

  on<Name extends keyof Events, Context>(name: Name, fn: (this: Context, ...args: [...Events[Name]]) => unknown, ctx?: Context): this {
    const e: Registry<Events> = this.e || (this.e = {})
    let listeners = owns(e, name) ? e[name] : undefined
    if (!listeners) {
      listeners = []
      Object.defineProperty(e, name, { value: listeners, enumerable: true, configurable: true, writable: true })
    }
    listeners.push({ fn, ctx })
    return this
  }

  once<Name extends keyof Events, Context>(name: Name, fn: (this: Context, ...args: [...Events[Name]]) => unknown, ctx?: Context): this {
    // eslint-disable-next-line ts/no-this-alias -- The once wrapper unsubscribes its owner, independently of callback ctx.
    const self = this
    const callback: Listener<[...Events[Name]]> = fn
    let fired = false
    function listener(...args: [...Events[Name]]) {
      if (fired)
        return
      fired = true
      self.off(name, listener)
      callback.apply(ctx, args)
    }
    listener._ = fn
    return this.on(name, listener, ctx)
  }

  emit<Name extends keyof Events>(name: Name, ...data: [...Events[Name]]): this {
    const e: Registry<Events> = this.e || (this.e = {})
    const snapshot = (owns(e, name) ? e[name] || [] : []).slice()
    for (const event of snapshot) {
      event.fn.apply(event.ctx, data)
    }
    return this
  }

  off<Name extends keyof Events>(name: Name, callback?: Listener<[...Events[Name]]>): this {
    const e: Registry<Events> = this.e || (this.e = {})
    const evts = owns(e, name) ? e[name] : undefined
    const liveEvents: Registration<[...Events[Name]]>[] = []
    if (evts && callback) {
      for (let i = 0, len = evts.length; i < len; i += 1) {
        // Registrations are inserted densely; retain the captured-length traversal.
        const event = evts[i]!
        if (event.fn !== callback && event.fn._ !== callback)
          liveEvents.push(event)
      }
    }
    if (liveEvents.length) {
      e[name] = liveEvents
    }
    else {
      delete e[name]
    }
    return this
  }
}
