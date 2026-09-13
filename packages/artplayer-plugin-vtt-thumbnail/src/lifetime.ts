import type { Events } from 'artplayer'
import type { Cleanup, Lifetime, LifetimeHost, OwnedEvent } from './types'

export default function createLifetime(art: LifetimeHost): Lifetime {
  let closed = Boolean(art.isDestroy)
  const cleanups = new Set<Cleanup>()
  let cancel!: Cleanup
  const cancelled = new Promise<void>((resolve) => {
    cancel = resolve
  })
  const lifetime: Lifetime = {
    get closed() { return closed },
    own(cleanup) {
      if (closed)
        run(cleanup)
      else
        cleanups.add(cleanup)
      return () => cleanups.delete(cleanup)
    },
    listen<Name extends OwnedEvent>(name: Name, callback: (...args: Events[Name]) => unknown) {
      if (closed)
        return
      lifetime.own(() => art.off(name, callback))
      art.on(name, callback)
    },
    wait<Value>(value: Value | PromiseLike<Value>) { return Promise.race([value, cancelled]) },
    dispose() {
      if (closed)
        return
      closed = true
      cancel()
      const pending = [...cleanups].reverse()
      cleanups.clear()
      for (const cleanup of pending)
        run(cleanup)
    },
  }
  function run(cleanup: Cleanup) {
    try {
      cleanup()
    }
    catch (error) {
      console.warn('Failed to clean up VTT thumbnails:', error)
    }
  }
  try {
    lifetime.listen('destroy', lifetime.dispose)
  }
  catch (error) {
    lifetime.dispose()
    throw error
  }
  return lifetime
}
