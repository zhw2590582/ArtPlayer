import type Artplayer from 'artplayer'
import type { Callback, Result } from './types'
import { loadImaSdk } from './sdk'
import { createSession } from './session'

export default function artplayerPluginVast(callback?: Callback) {
  return async (art: Artplayer): Promise<Result> => {
    let disposed = false
    let session: ReturnType<typeof createSession> | undefined
    const closed = () => disposed || art.isDestroy
    const result: Result = { name: 'artplayerPluginVast', destroy: () => session?.destroy() }
    function dispose(): void {
      if (disposed)
        return
      disposed = true
      try {
        art.off('destroy', dispose)
      }
      finally { session?.destroy() }
    }
    if (closed())
      return result
    art.on('destroy', dispose)
    try {
      if (closed())
        return result
      const ima = await loadImaSdk()
      if (closed())
        return result
      const utils = (art.constructor as typeof Artplayer).utils
      session = createSession(art, ima, utils, closed)
      if (closed()) {
        dispose()
        return result
      }
      if (typeof callback === 'function')
        await callback(session.context)
      return result
    }
    catch (error) {
      try {
        dispose()
      }
      catch (cleanupError) { console.error('VAST cleanup error:', cleanupError) }
      throw error
    }
  }
}
