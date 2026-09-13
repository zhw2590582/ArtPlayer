let nextRequest = 0

export default class WorkerClient {
  constructor(createWorker, onFailure) {
    this.pending = new Map()
    this.closed = false
    this.failed = false
    this.onFailure = onFailure
    this.worker = createWorker()
    try {
      this.worker.onmessage = (event) => {
        const request = this.pending.get(event.data?.id)
        if (!request)
          return
        this.pending.delete(event.data.id)
        request.resolve(event.data)
      }
      this.worker.onerror = (event) => {
        event.preventDefault?.()
        this.fail(event.error || event)
      }
      this.worker.onmessageerror = event => this.fail(event.error || event)
    }
    catch (error) {
      try {
        this.dispose()
      }
      catch {}
      throw error
    }
  }

  request(message) {
    message.id = ++nextRequest
    const { id } = message
    if (this.closed || this.failed)
      return Promise.resolve({ id, result: undefined })
    return new Promise((resolve, reject) => {
      this.pending.set(id, { resolve, reject })
      try {
        this.worker.postMessage(message)
      }
      catch (error) {
        this.fail(error)
      }
    })
  }

  fail(error) {
    if (this.closed || this.failed)
      return
    this.failed = true
    for (const request of this.pending.values()) request.reject(error)
    this.pending.clear()
    try {
      this.dispose()
    }
    catch {}
    this.onFailure(error)
  }

  cancel() {
    for (const [id, request] of this.pending) request.resolve({ id, result: undefined })
    this.pending.clear()
  }

  dispose() {
    if (this.closed)
      return
    this.closed = true
    this.cancel()
    let failed = false
    let error
    const attempt = (callback) => {
      try {
        callback()
      }
      catch (failure) {
        if (!failed)
          error = failure
        failed = true
      }
    }
    for (const name of ['onmessage', 'onerror', 'onmessageerror']) {
      attempt(() => this.worker[name] = null)
    }
    attempt(() => this.worker.terminate())
    if (failed)
      throw error
  }
}
