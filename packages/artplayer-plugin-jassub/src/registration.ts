import type { RuntimeOption, RuntimeResult } from '../types/runtime-api.js'
import JASSUB from './jassub.es.js'

export interface JassubHost {
  video: HTMLVideoElement
  on: (name: 'destroy', callback: () => void) => unknown
  off: (name: 'destroy', callback: () => void) => unknown
}

export function registerJassub(art: JassubHost, option?: RuntimeOption): RuntimeResult {
  const instance = new JASSUB({ video: art.video, ...option })
  let disposed = false
  const dispose = () => {
    if (disposed || instance._destroyed)
      return
    disposed = true
    try {
      instance.destroy()
    }
    catch (error) {
      disposed = false
      throw error
    }
  }

  try {
    if (instance._canvasParent)
      instance._canvasParent.style.zIndex = 20
    art.on('destroy', dispose)
  }
  catch (error) {
    // Registration may throw after attaching its listener. Keep the original
    // error while independently attempting listener and instance rollback.
    try {
      art.off('destroy', dispose)
    }
    catch {}
    try {
      dispose()
    }
    catch {}
    throw error
  }

  return { name: 'artplayerPluginJassub', instance }
}
