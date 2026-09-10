import type { PluginFactory, PluginHost } from '../../packages/artplayer/src/plugins/types'
import Plugins from '../../packages/artplayer/src/plugins'

interface Host extends PluginHost<Host> {
  id: number
}
declare const host: Host
const registry = new Plugins(host)
const sync: typeof registry = registry.add(function (art) {
  const id: number = this.id + art.id
  return { name: 'sync', id }
})
const asyncResult: Promise<typeof registry> = registry.add(async () => ({ name: 'async' }))
const mixed: typeof registry | Promise<typeof registry> = registry.add(() => Math.random() ? Promise.resolve(1) : 1)
const untyped: PluginFactory<Host> = () => null
const unknown: typeof registry | Promise<typeof registry> = registry.add(untyped)
// @ts-expect-error Synchronous plugins do not always return a Promise.
const bad: Promise<typeof registry> = registry.add(() => ({ name: 'sync' }))
// @ts-expect-error The factory receiver and argument must match the actual host.
registry.add((art: { incompatible: string }) => art)
void [sync, asyncResult, mixed, unknown, bad]
