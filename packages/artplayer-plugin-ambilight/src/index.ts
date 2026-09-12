import type Artplayer from 'artplayer'
import type PublicPlugin from '../types/artplayer-plugin-ambilight'
import { createColorSampler } from './sampler'
import { createFrameLoop } from './scheduler'
import { createAmbilightView } from './view'

type Option = Parameters<typeof PublicPlugin>[0]
type Subscription = ['ready' | 'destroy', () => void]

function artplayerPluginAmbilight(option: Option = {}) {
  return (art: Artplayer) => {
    let host: Artplayer | null = art
    let closed = art.isDestroy
    let view: ReturnType<typeof createAmbilightView> | null = null
    let sampler: ReturnType<typeof createColorSampler> | null = null
    let loop: ReturnType<typeof createFrameLoop> | null = null
    const subscriptions: Subscription[] = []
    const result = {
      name: 'artplayerPluginAmbilight' as const,
      start() {
        if (!closed)
          loop?.start()
      },
      stop() {
        if (!closed)
          loop?.stop()
      },
    }
    if (closed) {
      host = null
      return result
    }

    function releaseResources() {
      const releases = [loop?.destroy, sampler?.destroy, view?.destroy]
      loop = null
      sampler = null
      view = null
      const failures: unknown[] = []
      for (const release of releases) {
        try {
          release?.()
        }
        catch (error) { failures.push(error) }
      }
      if (failures.length)
        throw failures[0]
    }

    function destroy() {
      if (closed)
        return
      closed = true
      const current = host
      host = null
      const failures: unknown[] = []
      for (const [event, callback] of subscriptions.splice(0)) {
        try {
          current?.off(event, callback)
        }
        catch (error) { failures.push(error) }
      }
      try {
        releaseResources()
      }
      catch (error) { failures.push(error) }
      if (failures.length)
        throw failures[0]
    }

    function listen(event: Subscription[0], callback: Subscription[1]) {
      subscriptions.push([event, callback])
      host?.on(event, callback)
    }

    try {
      listen('destroy', destroy)
      if (closed)
        return result
      const { $video } = art.template
      const utils = (art.constructor as typeof Artplayer).utils
      const { blur = '50px', opacity = 0.5, frequency = 10, duration = 0.3 } = option
      if (closed)
        return result
      view = createAmbilightView(utils)
      if (!closed)
        view.mount($video, { blur, opacity, duration }, () => !closed)
      if (closed) {
        releaseResources()
        return result
      }
      const canvas = utils.createElement('canvas')
      if (closed) {
        canvas.width = 0
        canvas.height = 0
        return result
      }
      sampler = createColorSampler(canvas, $video, () => utils.createElement('canvas'))
      if (closed) {
        releaseResources()
        return result
      }
      loop = createFrameLoop(frequency, () => Boolean(host?.playing), (valid) => {
        const colors = sampler?.read(valid)
        if (colors && valid())
          view?.render(colors, valid)
      })
      listen('ready', result.start)
      if (closed)
        releaseResources()
    }
    catch (error) {
      try {
        destroy()
      }
      catch { /* Preserve the setup failure after attempting every cleanup. */ }
      try {
        releaseResources()
      }
      catch { /* A reentrant constructor may return a resource after destruction. */ }
      throw error
    }
    return result
  }
}

export default Object.assign(artplayerPluginAmbilight, { default: artplayerPluginAmbilight })
