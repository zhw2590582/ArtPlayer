import type { SourceEvent, SourceListener, SwitchHost } from './types'
import { isClosing } from '../lifecycle/instance'
import { listenSource } from './listen'
import { assignUrl, beginSource } from './operation'

export function switchSource(art: SwitchHost, url: string, currentTime: number): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    if (isClosing(art) || url === art.url) {
      resolve()
      return
    }
    const operation = beginSource(art)
    const scope = operation.scope.child()
    let settled = false
    const settle = (failed = false, error?: unknown) => {
      if (settled)
        return
      settled = true
      operation.onError = undefined
      operation.onAssigned = undefined
      scope.dispose()
      if (failed)
        reject(error)
      else
        resolve()
      if (failed)
        operation.scope.dispose()
    }
    scope.add(() => {
      settle()
    })
    const active = () => !settled && operation.active()
    const fail = (error: unknown) => settle(true, error)
    operation.onError = fail
    try {
      const { playing, aspectRatio, playbackRate } = art
      art.pause()
      if (!active())
        return

      const readiness = scope.child()
      const handlers = {
        'video:error': fail,
        'video:loadedmetadata': () => {
          if (!active())
            return
          try {
            art.currentTime = currentTime
          }
          catch (error) {
            fail(error)
          }
        },
        'video:canplay': () => {
          if (!active())
            return
          // Detach readiness handlers before awaiting a possibly pending play.
          readiness.dispose()
          const resume = async () => {
            art.playbackRate = playbackRate
            if (!active())
              return
            art.aspectRatio = aspectRatio
            if (!active())
              return
            if (playing) {
              // The public play promise still rejects; this internal resume is best effort.
              try {
                await art.play()
              }
              catch {}
            }
            if (!active())
              return
            art.notice.show = ''
            settle()
          }
          void resume().catch(fail)
        },
      }
      const capture = scope.child()
      const queued: [SourceEvent, unknown][] = []
      const names = Object.keys(handlers) as SourceEvent[]
      for (const name of names) {
        listenSource(capture, art, name, (event) => {
          if (operation.acceptingEvents)
            queued.push([name, event])
        }, false)
      }
      assignUrl(art, operation, url)
      if (!active())
        return
      art.notice.show = ''
      if (!active())
        return
      const activate = () => {
        capture.dispose()
        if (!url) {
          settle()
          return
        }
        const dispatch = {} as Record<SourceEvent, SourceListener>
        for (const name of names)
          dispatch[name] = listenSource(readiness, art, name, handlers[name])
        for (const [name, event] of queued) {
          if (!active() || readiness.closed)
            break
          dispatch[name](event)
        }
        queued.length = 0
      }
      if (operation.assigned)
        activate()
      else
        operation.onAssigned = activate
    }
    catch (error) {
      fail(error)
    }
  })
}
