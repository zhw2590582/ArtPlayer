export function cleanupAll(actions) {
  let failure
  let failed = false
  for (const action of actions) {
    try {
      action()
    }
    catch (error) {
      if (!failed) {
        failed = true
        failure = error
      }
    }
  }
  return { failed, failure }
}

export default function createSession(publish, report) {
  let closed = false
  let current
  let lastUrl
  const urls = new Set()

  function release(url) {
    if (urls.delete(url))
      URL.revokeObjectURL(url)
  }

  function cancel() {
    const previous = current
    current = undefined
    previous?.dispose()
  }

  function destroy() {
    if (closed)
      return
    closed = true
    const result = cleanupAll([cancel, ...[...urls].map(url => () => release(url))])
    lastUrl = undefined
    if (result.failed)
      report(result.failure)
  }

  function start() {
    if (closed)
      return
    // Install the replacement before cleanup, which can reenter through host APIs.
    const previous = current
    const actions = []
    let disposed = false
    const job = {
      active: () => !closed && !disposed && current === job,
      own(action) {
        if (disposed) {
          const result = cleanupAll([action])
          if (result.failed)
            report(result.failure)
        }
        else {
          actions.push(action)
        }
      },
      dispose() {
        if (disposed)
          return
        disposed = true
        if (current === job)
          current = undefined
        const result = cleanupAll(actions.splice(0).reverse())
        if (result.failed)
          report(result.failure)
      },
      fail(error) {
        if (!job.active())
          return
        job.dispose()
        report(error)
      },
      guard(callback) {
        return (...args) => {
          if (!job.active())
            return
          try {
            return callback(...args)
          }
          catch (error) {
            job.fail(error)
          }
        }
      },
      publish(blob, config) {
        if (!job.active())
          return
        if (!blob)
          throw new Error('Auto-thumbnail encoding returned no Blob')
        const url = URL.createObjectURL(blob)
        urls.add(url)
        if (!job.active()) {
          release(url)
          return
        }
        const previousUrl = lastUrl
        lastUrl = url
        try {
          publish({ url, ...config })
        }
        catch (error) {
          if (lastUrl === url)
            lastUrl = urls.has(previousUrl) ? previousUrl : undefined
          const result = cleanupAll([() => release(url)])
          if (result.failed)
            report(result.failure)
          throw error
        }
        release(previousUrl)
      },
    }
    current = job
    previous?.dispose()
    return job
  }

  return {
    start,
    cancel,
    destroy,
    get closed() { return closed },
  }
}
