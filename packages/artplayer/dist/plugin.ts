import type Artplayer from './artplayer'

export type PluginFactory<Host = Artplayer, Result = unknown> = (this: Host, art: Host) => Result

/** Augment this interface with installed plugin results; augmentation does not register a plugin. */
export interface Plugins {
  /** Legacy signature: synchronous factories return this registry; Promise factories return a Promise of it. */
  add: (plugin: PluginFactory) => Promise<Plugins>
  [name: string]: unknown
}
