// Browser-only diagnostic observer; messages and termination still use native workers.
export function observeWorkers() {
  const NativeWorker = window.Worker
  window.workerEvidence = []
  window.Worker = class extends NativeWorker {
    constructor(url, options) {
      super(url, options)
      const record = { url: String(url), messages: [], errors: [], terminated: 0 }
      window.workerEvidence.push(record)
      this.addEventListener('message', event => record.messages.push(event.data?.event))
      this.addEventListener('error', event => record.errors.push(event.message))
      const terminate = this.terminate.bind(this)
      this.terminate = () => {
        record.terminated++
        return terminate()
      }
    }
  }
}
