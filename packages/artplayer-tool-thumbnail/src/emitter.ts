// Locally adapted from tiny-emitter; upstream reference 2.1.0. See THIRD_PARTY_NOTICES.
type EventMap<Events> = { [Name in keyof Events]: readonly unknown[] }
type Listener<Args extends unknown[]> = ((...args: Args) => unknown) & { _?: (...args: Args) => unknown }
interface Registration<Args extends unknown[]> {
  fn: Listener<Args>
  ctx: unknown
}
type Registry<Events extends EventMap<Events>> = { [Name in keyof Events]?: Registration<[...Events[Name]]>[] }

export default class Emitter<Events extends EventMap<Events> = Record<PropertyKey, unknown[]>> {
  declare e?: Registry<Events>

  on<Name extends keyof Events, Context>(name: Name, fn: (this: Context, ...args: [...Events[Name]]) => unknown, ctx?: Context): this {
    const e: Registry<Events> = this.e || (this.e = {});
    (e[name] || (e[name] = [])).push({ fn, ctx })
    return this
  }

  once<Name extends keyof Events, Context>(name: Name, fn: (this: Context, ...args: [...Events[Name]]) => unknown, ctx?: Context): this {
    // eslint-disable-next-line ts/no-this-alias -- Preserve the owning emitter independently of callback ctx.
    const self = this
    const callback: Listener<[...Events[Name]]> = fn
    function listener(...args: [...Events[Name]]) {
      self.off(name, listener)
      callback.apply(ctx, args)
    }
    listener._ = fn
    return this.on(name, listener, ctx)
  }

  emit<Name extends keyof Events>(name: Name, ...data: [...Events[Name]]): this {
    const e: Registry<Events> = this.e || (this.e = {})
    const evtArr = (e[name] || []).slice()
    for (let i = 0; i < evtArr.length; i += 1) {
      evtArr[i]!.fn.apply(evtArr[i]!.ctx, data)
    }
    return this
  }

  off<Name extends keyof Events>(name: Name, callback?: Listener<[...Events[Name]]>): this {
    const e: Registry<Events> = this.e || (this.e = {})
    const evts = e[name]
    const liveEvents: Registration<[...Events[Name]]>[] = []
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
