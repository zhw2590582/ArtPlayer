import type { Cleanup, Lifetime, LifetimeHost } from './types'

export default function createLifetime(art: LifetimeHost): Lifetime {
  let closed = Boolean(art.isDestroy)
  const cleanups = new Set<Cleanup>()
  let cancel!: Cleanup
  const cancelled = new Promise<void>((resolve) => {
    cancel = resolve
  })
  function run(cleanup: Cleanup): void {
    try {
      cleanup()
    }
    catch (error) {
      console.warn('Failed to clean up multiple subtitles:', error)
    }
  }
  const lifetime: Lifetime = {
    get closed() { return closed },
    own(cleanup) {
      if (closed)
        run(cleanup)
      else
        cleanups.add(cleanup)
      return () => cleanups.delete(cleanup)
    },
    wait(value) { return Promise.race([value, cancelled]) },
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
  if (!closed) {
    lifetime.own(() => art.off('destroy', lifetime.dispose))
    try {
      art.on('destroy', lifetime.dispose)
    }
    catch (error) {
      lifetime.dispose()
      throw error
    }
  }
  return lifetime
}
