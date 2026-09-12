import extract from './extraction'
import { readOptions } from './options'
import createSession, { cleanupAll } from './session'

export default function artplayerPluginAutoThumbnail(option) {
  return async (art) => {
    const report = error => console.warn('ArtPlayer auto-thumbnail failed:', error)
    const session = createSession((config) => {
      art.thumbnails = config
    }, report)
    const subscriptions = []
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
      for (const [name, callback] of [['destroy', onDestroy], ['restart', session.cancel], ['video:loadedmetadata', onMetadata]]) {
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
