import type { SourceEvent, SourceListener, SwitchHost } from './types'
import { isClosing } from '../lifecycle/instance'
import { listenSource } from './listen'
import { assignUrl, beginSource } from './operation'
import { positionRestoration } from './restore-position'

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
      let canPlay = false
      let resuming = false
      let rateRestored = false
      const position = positionRestoration(art, currentTime, active)
      const resume = async () => {
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
      const resumeWhenReady = () => {
        if (!active() || resuming || !canPlay)
          return
        try {
          // canplay can arrive before the metadata restoration seek has settled.
          if (art.template?.$video?.seeking)
            return
          if (!active())
            return
          if (!rateRestored) {
            rateRestored = true
            art.playbackRate = playbackRate
          }
          if (!position.ready() || !active() || resuming)
            return
          resuming = true
          readiness.dispose()
          void resume().catch(fail)
        }
        catch (error) {
          fail(error)
        }
      }
      const handlers = {
        'video:error': fail,
        'video:loadedmetadata': () => {
          if (!active())
            return
          try {
            position.restore()
          }
          catch (error) {
            fail(error)
          }
        },
        'video:canplay': () => {
          canPlay = true
          resumeWhenReady()
        },
        'video:seeked': resumeWhenReady,
        'seek': position.manual,
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
          dispatch[name] = listenSource(readiness, art, name, handlers[name], name !== 'video:seeked')
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
