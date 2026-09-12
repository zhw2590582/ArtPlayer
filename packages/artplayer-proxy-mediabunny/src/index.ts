import type Artplayer from 'artplayer'
import type { ProxyOptions } from './engine-types'
import type { EntryHost } from './entry-lifecycle'
import { bridgeCanvas } from './canvas-bridge'
import { entryLifecycle } from './entry-lifecycle'
import VideoShim from './VideoShim'

export default function artplayerProxyMediabunny(option: ProxyOptions = {}) {
  return (player: Artplayer): HTMLCanvasElement => {
    // Runtime constructor utilities and the owned alias exceed the historical consumer facade.
    const art = player as unknown as EntryHost
    const { createElement } = art.constructor.utils
    const canvas = createElement('canvas')
    const shim = new VideoShim({ art, canvas, ctx: canvas.getContext('2d'), option })
    const lifecycle = entryLifecycle(art, canvas, shim, option)
    try {
      art.mediabunny = shim
      bridgeCanvas(canvas, shim)
      lifecycle.install()
    }
    catch (error) {
      try {
        lifecycle.destroy()
      }
      catch (failure) { console.warn('MediaBunny entry setup cleanup:', failure) }
      throw error
    }
    return canvas
  }
}

// Restore the 1.0.0 CommonJS namespace path without changing the callable factory type.
Object.defineProperty(artplayerProxyMediabunny, 'default', { value: artplayerProxyMediabunny, writable: true, configurable: true })
