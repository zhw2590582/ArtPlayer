/* eslint-disable ts/no-require-imports, ts/no-this-alias -- Exercise actual CJS syntax and callback receiver types. */
import Artplayer = require('artplayer/runtime')
import LegacyRuntime = require('artplayer/runtime/legacy')

const option: Artplayer.OptionInput = { container: '#player' }
const art: Artplayer = new Artplayer(option)
const legacy: Artplayer = new LegacyRuntime(option)
const factory: Artplayer.PluginFactory<{ name: string }> = function (instance) {
  const receiver: Artplayer.PluginHost = this
  const value: undefined = instance.seek
  void [receiver, value]
  return { name: 'cjs' }
}
const registry: Artplayer.Plugins = art.plugins.add(factory)
// @ts-expect-error CJS must not reintroduce legacy false getter values.
const falseSeek: number = legacy.seek
void [registry, falseSeek]
