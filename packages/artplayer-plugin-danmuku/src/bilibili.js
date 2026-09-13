import { bilibiliDanmuParseFromXml, getMode, onmessage } from './bilibili-parser'

let nextRequest = 0

function abortError(signal) {
  if (signal?.reason !== undefined)
    return signal.reason
  const error = new Error('Bilibili Danmu loading cancelled')
  error.name = 'AbortError'
  return error
}

export function bilibiliDanmuParseFromUrl(url, { signal, onCancel } = {}) {
  return new Promise((resolve, reject) => {
    let settled = false
    let worker
    let workerUrl
    let releaseCancel
    const id = ++nextRequest
    const cancel = () => finish(undefined, abortError(signal))

    function releaseWorker() {
      let error
      let failed = false
      try {
        if (worker) {
          const current = worker
          worker = undefined
          current.onmessage = null
          current.onerror = null
          current.onmessageerror = null
          current.terminate()
        }
      }
      catch (failure) {
        error = failure
        failed = true
      }
      if (workerUrl !== undefined) {
        const current = workerUrl
        workerUrl = undefined
        try {
          URL.revokeObjectURL(current)
        }
        catch (failure) {
          if (!failed)
            error = failure
          failed = true
        }
      }
      if (failed)
        throw error
    }

    function finish(value, error) {
      if (settled)
        return
      settled = true
      let failed = arguments.length > 1
      signal?.removeEventListener('abort', cancel)
      releaseCancel?.()
      try {
        releaseWorker()
      }
      catch (cleanupError) {
        if (!failed)
          error = cleanupError
        failed = true
      }
      if (failed)
        reject(error)
      else resolve(value)
    }

    function fallback(xml, error) {
      if (settled)
        return
      console.error('Error parsing Bilibili Danmu:', error)
      try {
        finish(bilibiliDanmuParseFromXml(xml))
      }
      catch (failure) {
        finish(undefined, failure)
      }
    }

    async function read() {
      const response = signal ? await fetch(url, { signal }) : await fetch(url)
      if (settled)
        return
      const xml = await response.text()
      if (settled)
        return
      try {
        const workerText = `
          ${getMode.toString()}
          ${bilibiliDanmuParseFromXml.toString()}
          onmessage = ${onmessage.toString()}
        `
        workerUrl = URL.createObjectURL(new Blob([workerText], { type: 'application/javascript' }))
        if (settled) {
          releaseWorker()
          return
        }
        worker = new Worker(workerUrl)
        if (settled) {
          releaseWorker()
          return
        }
        worker.onmessage = (event) => {
          if (settled || event.data?.id !== id)
            return
          const { danmus } = event.data
          if (!Array.isArray(danmus)) {
            finish(undefined, new Error('Invalid Bilibili Danmu worker response'))
            return
          }
          finish(danmus)
        }
        worker.onerror = (event) => {
          event.preventDefault?.()
          fallback(xml, event.error || event)
        }
        worker.onmessageerror = event => fallback(xml, event.error || event)
        worker.postMessage({ xml, id })
      }
      catch (error) {
        fallback(xml, error)
      }
    }

    if (signal?.aborted) {
      cancel()
      return
    }
    signal?.addEventListener('abort', cancel)
    releaseCancel = onCancel?.(cancel)
    if (settled) {
      releaseCancel?.()
      return
    }
    read().catch(error => finish(undefined, error))
  })
}
