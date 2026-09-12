import type { Disposer } from './resources'
import { createDelay, releaseAll } from './resources'

export interface WindowApi {
  requestWindow: (option: { width?: number, height?: number }) => Promise<Window>
}

interface Hooks {
  alive: () => boolean
  request: () => Promise<Window>
  project: (document: Document) => { mount: () => void, destroy: Disposer }
  activate: (active: boolean) => void
  resize: Disposer
  nativeResize: Disposer
  report: (action: 'open' | 'close', error: unknown) => void
}

interface Session {
  window: Window
  releases: Disposer[]
  announced: boolean
}

export function createWindowSession(hooks: Hooks) {
  let destroyed = false
  let revision = 0
  let session: Session | null = null
  let pending: { promise: Promise<void>, finish: Disposer } | null = null
  let delay: ReturnType<typeof createDelay> | null = null
  const alive = () => !destroyed && hooks.alive()
  const valid = (value: number) => value === revision && alive()
  function invalidate() {
    revision++
    pending?.finish()
    pending = null
    delay?.cancel()
    delay = null
  }
  function dispose(current: Session): unknown[] {
    const errors = releaseAll(current.releases.splice(0))
    errors.push(...releaseAll([() => current.window.close()]))
    return errors
  }
  async function resizeLater(value: number) {
    if (!valid(value))
      return
    const current = createDelay()
    delay = current
    await current.promise
    if (delay === current)
      delay = null
    if (valid(value))
      hooks.resize()
  }
  async function close() {
    invalidate()
    const value = revision
    const current = session
    session = null
    if (!current)
      return
    const errors = dispose(current)
    if (current.announced) {
      try {
        hooks.activate(false)
      }
      catch (error) { errors.push(error) }
    }
    if (errors.length && alive())
      hooks.report('close', errors[0])
    if (valid(value))
      await resizeLater(value)
  }
  async function open() {
    if (!alive() || session)
      return
    if (pending)
      return pending.promise
    invalidate()
    const value = revision
    let finish!: Disposer
    let reject!: (error: unknown) => void
    const promise = new Promise<void>((resolve, fail) => {
      finish = resolve
      reject = fail
    })
    const ticket = { promise, finish }
    pending = ticket
    const settle = () => {
      if (pending === ticket)
        pending = null
      finish()
    }
    const failed = (error: unknown) => {
      if (valid(value)) {
        const current = session
        session = null
        if (current) {
          dispose(current)
          if (current.announced)
            releaseAll([() => hooks.activate(false)])
        }
        try {
          hooks.report('open', error)
        }
        catch (noticeError) { reject(noticeError) }
      }
    }
    const receive = async (window: Window) => {
      if (!valid(value)) {
        // Only the window is retained by a stale request, never a live projection.
        if (session?.window !== window)
          releaseAll([() => window.close()])
        return
      }
      const current: Session = { window, releases: [], announced: false }
      session = current
      try {
        const projection = hooks.project(window.document)
        current.releases.push(projection.destroy)
        projection.mount()
        if (!valid(value)) {
          dispose(current)
          return
        }
        for (const [event, callback] of [['resize', () => {
          if (valid(value))
            hooks.nativeResize()
        }], ['pagehide', () => {
          void close()
        }], ['unload', () => {
          void close()
        }]] as const) {
          current.releases.unshift(() => window.removeEventListener(event, callback))
          window.addEventListener(event, callback)
          if (!valid(value)) {
            dispose(current)
            return
          }
        }
        current.announced = true
        hooks.activate(true)
        await resizeLater(value)
      }
      catch (error) { failed(error) }
    }
    try {
      // Called directly while the caller's user activation is still available.
      const request = hooks.request()
      void Promise.resolve(request).then(receive, failed).then(settle, (error) => {
        if (valid(value))
          reject(error)
        settle()
      })
    }
    catch (error) {
      try {
        failed(error)
      }
      finally {
        settle()
      }
    }
    return promise
  }
  return {
    get active() { return session !== null },
    get opening() { return pending !== null },
    open,
    close,
    destroy() {
      if (destroyed)
        return
      destroyed = true
      // close performs synchronous restoration; its delayed effects are now disabled.
      void close().catch(() => {})
    },
  }
}
