import type Artplayer from 'artplayer'
import type { Callback, CompatibilityOptions, Result } from './types'
import { loadImaSdk } from './sdk'
import { createSession } from './session'

function artplayerPluginVast(callback?: Callback, options: CompatibilityOptions = {}) {
  const compatibility = options.compatibility
  if (compatibility !== undefined && compatibility !== 'workspace-1.2')
    throw new TypeError('Unsupported VAST compatibility mode')
  const workspaceMode = compatibility === 'workspace-1.2'
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
      session = createSession(art, ima, utils, closed, workspaceMode)
      if (closed()) {
        dispose()
        return result
      }
      if (!workspaceMode) {
        session.context.init()
        if (closed())
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

artplayerPluginVast.default = artplayerPluginVast

export default artplayerPluginVast
