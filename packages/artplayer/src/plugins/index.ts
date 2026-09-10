import type { PluginFactory, PluginHost, PluginRegistration } from './types'
import { isClosing } from '../lifecycle/instance'
import { errorHandle } from '../utils/error'
import installBuiltins from './builtins'
import registerPlugin from './registration'

export default class Plugins<Host extends PluginHost<Host>> {
  declare art: Host
  declare id: number

  constructor(art: Host) {
    this.art = art
    this.id = 0
    const { option } = art
    installBuiltins(this, option)
    for (let index = 0; index < option.plugins.length; index++) {
      if (isClosing(art))
        return
      const registration = this.add(option.plugins[index]!)
      if (registration instanceof Promise) {
        // Constructor registrations have no caller-owned Promise to observe.
        registration.catch(error => console.warn('Failed to initialize ArtPlayer plugin:', error))
      }
    }
  }

  add<Result>(plugin: PluginFactory<Host, Result>): PluginRegistration<Result, this>
  add(plugin: PluginFactory<Host>): this | Promise<this> {
    errorHandle(!isClosing(this.art), 'Cannot add a plugin after ArtPlayer is destroyed')
    this.id += 1
    const result = plugin.call(this.art, this.art)
    if (result instanceof Promise)
      return result.then(res => this.next(plugin, res))
    return this.next(plugin, result)
  }

  next(plugin: PluginFactory<Host>, result: unknown): this {
    return registerPlugin(this, plugin, result)
  }
}
