import type Artplayer from 'artplayer'
import type { ChromecastOptions } from './types'
import { createController } from './controller'

export default function artplayerPluginChromecast(option: ChromecastOptions) {
  return async (art: Artplayer) => createController(art, option)
}

// The 1.0 CommonJS namespace exposed .default; the current root exports a function.
Object.defineProperty(artplayerPluginChromecast, 'default', { value: artplayerPluginChromecast, writable: true, configurable: true })
