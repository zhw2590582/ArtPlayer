export default function createLifetime(art) {
  let closed = Boolean(art.isDestroy)
  const cleanups = new Set()
  let cancel
  const cancelled = new Promise((resolve) => {
    cancel = resolve
  })
  const lifetime = {
    get closed() { return closed },
    own(cleanup) {
      if (closed)
        run(cleanup)
      else
        cleanups.add(cleanup)
      return () => cleanups.delete(cleanup)
    },
    listen(name, callback) {
      if (closed)
        return
      lifetime.own(() => art.off(name, callback))
      art.on(name, callback)
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
  function run(cleanup) {
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
