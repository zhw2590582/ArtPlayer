import type { SourceMedia, UrlHost } from '../source/types'
import { isClosing } from '../lifecycle/instance'
import { wait } from '../lifecycle/resources'
import { listenSource } from '../source/listen'
import { failSource, finishAssignment, takeAssignment } from '../source/operation'
import { def, getExt } from '../utils'

export default function urlMix<Media extends SourceMedia, Host extends UrlHost<Media, Host>>(art: Host): void {
  const { option, template: { $video } } = art
  def(art, 'url', {
    get() {
      return $video.src
    },
    async set(newUrl: string) {
      if (isClosing(art))
        return
      const operation = takeAssignment(art)
      operation.acceptingEvents = false
      try {
        if (!newUrl) {
          if (await wait(operation.scope) && operation.active())
            art.loading.show = true
          return
        }
        const oldUrl = art.url
        const typeName = option.type || getExt(newUrl)
        const typeCallback = option.customType[typeName]
        if (typeName && typeCallback) {
          if (!await wait(operation.scope) || !operation.active())
            return
          art.loading.show = true
        }
        if (!operation.active())
          return
        // Proxies can synchronously dispatch readiness from their src setter.
        const capture = operation.scope.child()
        let ready = false
        let failed = false
        listenSource(capture, art, 'video:canplay', () => {
          ready = !failed
        })
        listenSource(capture, art, 'video:error', () => {
          failed = true
        })
        try {
          operation.acceptingEvents = true
          if (typeName && typeCallback) {
            const result = typeCallback.call(art, $video, newUrl, art)
            // Preserve immediate customType invocation semantics while owning rejections.
            void Promise.resolve(result).catch(error => failSource(operation, error))
          }
          else {
            // Media URLs are supplied by callers or adapters, which own revocation.
            if (!operation.active())
              return
            $video.src = newUrl
          }
        }
        finally {
          capture.dispose()
        }
        if (!operation.active())
          return
        if (oldUrl !== art.url) {
          art.option.url = newUrl
          if (operation.active() && art.isReady && oldUrl) {
            const restart = () => {
              if (operation.active())
                art.emit('restart', newUrl)
            }
            if (ready)
              restart()
            else if (!failed)
              listenSource(operation.scope, art, 'video:canplay', restart)
          }
        }
      }
      catch (error) {
        failSource(operation, error)
      }
      finally {
        finishAssignment(operation)
      }
    },
  })
}
