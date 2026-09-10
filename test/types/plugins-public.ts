import type { PluginFactory, Plugins } from 'artplayer'
import Artplayer from 'artplayer'

declare module 'artplayer/types' {
  interface Plugins {
    typedExtension?: { update: (count: number) => void }
  }
  interface Events {
    'typed-extension:update': [count: number]
  }
}

const factory: PluginFactory = function (art) {
  const receiver: number = this.id
  return { name: 'typedExtension', update(count: number) {
    art.emit('typed-extension:update', count + receiver)
  } }
}
const art = new Artplayer({ container: '#player', plugins: [factory] }, function (instance) {
  this.plugins.typedExtension?.update(1)
  instance.plugins.typedExtension?.update(2)
})
const plugins: Plugins = art.plugins
plugins.typedExtension?.update(3)
art.on('typed-extension:update', count => count.toFixed())
// @ts-expect-error Installed result methods retain their argument types.
plugins.typedExtension?.update('bad')
// @ts-expect-error Declared event listener payloads remain checked.
art.on('typed-extension:update', (count: string) => count)
