import type Artplayer from 'artplayer'
import type { DrawCallback } from './renderer'
import { forwardMedia } from './adapter'
import { hasDimensions, resizeCanvas } from './geometry'
import { ownMedia } from './media'
import { createRenderer } from './renderer'
import { createFrameScheduler } from './scheduler'

function artplayerProxyCanvas(callback?: DrawCallback) {
  return (art: Artplayer): HTMLCanvasElement => {
    const constructor = art.constructor as typeof Artplayer
    const canvas = constructor.utils.createElement('canvas')
    const video = constructor.utils.createElement('video')
    let host: Artplayer | null = art
    let closed = art.isDestroy
    let timer: ReturnType<typeof setTimeout> | null = null
    const releases: Array<() => void> = []
    const active = () => !closed && !host?.isDestroy
    const media = ownMedia(video, () => host?.template?.$player, active)
    const renderer = createRenderer(canvas, video, callback, (context, source) => host?.emit('artplayerProxyCanvas:draw', context, source), error => host?.emit('artplayerProxyCanvas:error', error))
    const scheduler = createFrameScheduler(renderer.draw, active)
    forwardMedia(canvas, video, active, scheduler.stop, media.mount)
    if (closed) {
      host = null
      return canvas
    }

    function destroy(): void {
      if (closed)
        return
      closed = true
      scheduler.destroy()
      if (timer !== null)
        clearTimeout(timer)
      timer = null
      const failures: unknown[] = []
      for (const release of [...releases.splice(0).reverse(), media.destroy]) {
        try {
          release()
        }
        catch (error) { failures.push(error) }
      }
      host = null
      canvas.width = 0
      canvas.height = 0
      if (failures.length)
        throw failures[0]
    }

    function listen(name: string, handler: () => void): void {
      if (!active())
        return
      const listener = () => {
        if (name === 'destroy' || active())
          handler()
      }
      const release = () => art.off(name, listener)
      releases.push(release)
      art.on(name, listener)
      if (closed)
        release()
    }

    function request(): void {
      if (renderer.available())
        scheduler.request()
    }

    try {
      listen('destroy', destroy)
      listen('video:loadedmetadata', () => {
        if (hasDimensions(video)) {
          canvas.width = video.videoWidth
          canvas.height = video.videoHeight
        }
      })
      listen('video:play', () => {
        media.mount()
        if (renderer.available())
          scheduler.start()
      })
      listen('video:pause', scheduler.stop)
      listen('video:emptied', scheduler.stop)
      listen('video:seeked', request)
      listen('resize', () => {
        resizeCanvas(canvas, video, host?.template?.$player, host?.option.autoSize)
        request()
      })
      if (active()) {
        timer = setTimeout(() => {
          timer = null
          if (!active())
            return
          try {
            media.mount()
            for (const name of constructor.config.events) {
              if (!active())
                break
              const forward = (event: Event) => {
                if (active())
                  host?.emit(`video:${event.type}`, event)
              }
              // Own native removal before invoking an extensible proxy registrar.
              const remove = () => video.removeEventListener(name, forward)
              releases.push(remove)
              const release = art.proxy(video, name, forward)
              if (active())
                releases.push(release)
              else
                release()
            }
          }
          catch (error) {
            try {
              destroy()
            }
            catch { /* Finish rollback without replacing the initialization error. */ }
            art.emit('artplayerProxyCanvas:error', error)
          }
        })
      }
    }
    catch (error) {
      try {
        destroy()
      }
      catch { /* Preserve the original setup error. */ }
      throw error
    }
    return canvas
  }
}

export default Object.assign(artplayerProxyCanvas, { default: artplayerProxyCanvas })
