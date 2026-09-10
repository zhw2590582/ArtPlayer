/** The event bus exposed by Artplayer.Emitter; no new runtime export. */
export interface Emitter<Events extends { [Name in keyof Events]: readonly unknown[] } = Record<PropertyKey, unknown[]>> {
  e?: { [Name in keyof Events]?: { fn: (...args: [...Events[Name]]) => unknown, ctx: unknown }[] }
  on: <Name extends keyof Events, Context>(name: Name, fn: (this: Context, ...args: [...Events[Name]]) => unknown, ctx?: Context) => this
  once: <Name extends keyof Events, Context>(name: Name, fn: (this: Context, ...args: [...Events[Name]]) => unknown, ctx?: Context) => this
  emit: <Name extends keyof Events>(name: Name, ...args: [...Events[Name]]) => this
  off: <Name extends keyof Events>(name: Name, fn?: (...args: [...Events[Name]]) => unknown) => this
}
