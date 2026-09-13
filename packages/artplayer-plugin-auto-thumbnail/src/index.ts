import type { Cleanup, ThumbnailHost, ThumbnailOptions } from './types'
import extract from './extraction'
import { readOptions } from './options'
import createSession, { cleanupAll } from './session'

export default function artplayerPluginAutoThumbnail(option: ThumbnailOptions) {
  return async (art: ThumbnailHost) => {
    const report = (error: unknown) => console.warn('ArtPlayer auto-thumbnail failed:', error)
    const session = createSession((config) => {
      art.thumbnails = config
    }, report)
    const subscriptions: Cleanup[] = []
    const onMetadata = () => {
      const job = session.start()
      if (job) {
        job.guard(() => {
          const config = readOptions(option, () => art.option.url)
          if (job.active())
            extract(job, config)
        })()
      }
    }
    const onDestroy = () => {
      const actions = subscriptions.splice(0)
      const result = cleanupAll([session.destroy, ...actions])
      if (result.failed)
        report(result.failure)
    }
    try {
      const events: [string, Cleanup][] = [['destroy', onDestroy], ['restart', session.cancel], ['video:loadedmetadata', onMetadata]]
      for (const [name, callback] of events) {
        if (session.closed)
          break
        subscriptions.push(() => art.off(name, callback))
        art.on(name, callback)
        if (session.closed)
          art.off(name, callback)
      }
    }
    catch (error) {
      onDestroy()
      throw error
    }
    return { name: 'artplayerPluginAutoThumbnail' }
  }
}
