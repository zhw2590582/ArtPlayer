import type { PlacementReply, PlacementRequest } from './worker-types'

let nextRequest = 0

export default class WorkerClient {
  declare pending: Map<number, { resolve: (value: PlacementReply) => void, reject: (error: unknown) => void }>
  declare closed: boolean
  declare failed: boolean
  declare onFailure: (error: unknown) => void
  declare worker: Worker

  constructor(createWorker: () => Worker, onFailure: (error: unknown) => void) {
    this.pending = new Map()
    this.closed = false
    this.failed = false
    this.onFailure = onFailure
    this.worker = createWorker()
    try {
      this.worker.onmessage = (event: MessageEvent<PlacementReply>) => {
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
      this.worker.onmessageerror = event => this.fail((event as MessageEvent & { error?: unknown }).error || event)
    }
    catch (error) {
      try {
        this.dispose()
      }
      catch {}
      throw error
    }
  }

  request(message: PlacementRequest): Promise<PlacementReply> {
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

  fail(error: unknown) {
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
    let error: unknown
    const attempt = (callback: () => void) => {
      try {
        callback()
      }
      catch (failure) {
        if (!failed)
          error = failure
        failed = true
      }
    }
    for (const name of ['onmessage', 'onerror', 'onmessageerror'] as const) {
      attempt(() => this.worker[name] = null)
    }
    attempt(() => this.worker.terminate())
    if (failed)
      throw error
  }
}
