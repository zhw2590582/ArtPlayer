// Locally adapted from tiny-emitter; upstream reference 2.1.0. See THIRD_PARTY_NOTICES.
type EventMap<Events> = { [Name in keyof Events]: readonly unknown[] }
type EventArgs<Events extends EventMap<Events>, Name extends PropertyKey, Custom extends unknown[]> = Name extends keyof Events ? [...Events[Name]] : Custom
type Listener<Args extends unknown[]> = ((...args: Args) => unknown) & { _?: (...args: Args) => unknown }
interface Registration<Args extends unknown[]> {
  fn: Listener<Args>
  ctx: unknown
}
type Registry = Partial<Record<PropertyKey, Registration<never[]>[]>>

export default class Emitter<Events extends EventMap<Events> = Record<PropertyKey, unknown[]>> {
  declare e?: Registry

  on<Name extends PropertyKey, Custom extends unknown[], Context>(name: Name, fn: (this: Context, ...args: EventArgs<Events, Name, Custom>) => unknown, ctx?: Context): this {
    const e: Registry = this.e || (this.e = {});
    (e[name] || (e[name] = [] as Registration<never[]>[])).push({ fn, ctx })
    return this
  }

  once<Name extends PropertyKey, Custom extends unknown[], Context>(name: Name, fn: (this: Context, ...args: EventArgs<Events, Name, Custom>) => unknown, ctx?: Context): this {
    // eslint-disable-next-line ts/no-this-alias -- Preserve the owning emitter independently of callback ctx.
    const self = this
    const callback: Listener<EventArgs<Events, Name, Custom>> = fn
    function listener(...args: EventArgs<Events, Name, Custom>) {
      self.off(name, listener)
      callback.apply(ctx, args)
    }
    listener._ = fn
    return this.on(name, listener, ctx)
  }

  emit<Name extends PropertyKey, Custom extends unknown[]>(name: Name, ...data: EventArgs<Events, Name, Custom>): this {
    const e: Registry = this.e || (this.e = {})
    const evtArr = (e[name] || []).slice()
    for (let i = 0; i < evtArr.length; i += 1) {
      // The registry erases heterogeneous listener tuples; emit checks its own payload.
      (evtArr[i]!.fn as Listener<typeof data>).apply(evtArr[i]!.ctx, data)
    }
    return this
  }

  off<Name extends PropertyKey, Custom extends unknown[]>(name: Name, callback?: Listener<EventArgs<Events, Name, Custom>>): this {
    const e: Registry = this.e || (this.e = {})
    const evts = e[name]
    const liveEvents: Registration<never[]>[] = []
    if (evts && callback) {
      for (let i = 0, len = evts.length; i < len; i += 1) {
        if (evts[i]!.fn !== callback && evts[i]!.fn._ !== callback)
          liveEvents.push(evts[i]!)
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
