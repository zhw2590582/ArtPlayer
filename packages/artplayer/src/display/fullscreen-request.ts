import type ResourceScope from '../lifecycle/scope'
import type { NativeFullscreenAdapter } from './types'
import { listen } from '../lifecycle/resources'
import { abandonFullscreen, clearAbandonedFullscreen } from './fullscreen-abandoned'

export function requestFullscreen(adapter: NativeFullscreenAdapter, parent: ResourceScope, entering: boolean, lateCompletion: () => void, hasExited = () => adapter.element !== adapter.target): { promise: Promise<void>, cancel: () => void } {
  const scope = parent.child()
  let done = false
  let cancelled = false
  let returned = false
  let promiseResult = false
  let eventFailed = false
  let resolve!: () => void
  let reject!: (error: unknown) => void
  const promise = new Promise<void>((accept, fail) => {
    resolve = accept
    reject = fail
  })
  scope.add(() => {
    if (!done) {
      done = true
      cancelled = true
      resolve()
      if (returned && !promiseResult && entering)
        abandonFullscreen(adapter)
    }
  })
  function finish(failed = false, error?: unknown) {
    if (done)
      return
    done = true
    try {
      scope.dispose()
    }
    catch (cleanupError) {
      if (!failed) {
        failed = true
        error = cleanupError
      }
    }
    if (failed)
      reject(error)
    else
      resolve()
  }
  const changed = () => {
    if (returned && !promiseResult && (entering ? adapter.element === adapter.target : hasExited()))
      finish()
  }
  listen(scope, adapter.document, adapter.changeEvent, changed)
  listen(scope, adapter.document, adapter.errorEvent, (event) => {
    if (event.target === adapter.target || event.target === adapter.document) {
      eventFailed = true
      if (returned && !promiseResult)
        finish(true, new Error('Fullscreen request failed'))
    }
  })
  if (!scope.closed) {
    try {
      // Invoke before yielding so the browser sees the caller's transient activation.
      if (entering)
        clearAbandonedFullscreen(adapter)
      const result = entering ? adapter.request() : adapter.exit()
      promiseResult = Boolean(result && typeof (result as PromiseLike<unknown>).then === 'function')
      returned = true
      if (cancelled && !promiseResult && entering)
        abandonFullscreen(adapter)
      if (promiseResult) {
        void Promise.resolve(result).then(() => {
          if (cancelled)
            lateCompletion()
          else
            finish()
        }, error => finish(true, error)).catch(() => {})
      }
      else if (eventFailed) {
        finish(true, new Error('Fullscreen request failed'))
      }
      else {
        changed()
      }
    }
    catch (error) {
      finish(true, error)
    }
  }
  return { promise, cancel: () => scope.dispose() }
}
