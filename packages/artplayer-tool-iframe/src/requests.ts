export interface Packet {
  type: string
  data?: any
  id?: number
}

export interface Callbacks {
  resove: (value?: any) => void
  reject: (reason?: any) => void
}

export interface RequestHost {
  $iframe: HTMLIFrameElement
  promises: Record<number, Callbacks>
  injected: boolean
  destroyed: boolean
}

interface Pending {
  id?: number
  timer?: ReturnType<typeof setTimeout>
  callbacks: Callbacks
  cancel: (reason: unknown) => void
}

const requests = new WeakMap<RequestHost, Set<Pending>>()
interface RequestBoundary {
  prepare: () => void
  envelope: (packet: Packet) => Packet
}
const boundaries = new WeakMap<RequestHost, RequestBoundary>()
let lastId = 0

export function setRequestBoundary(host: RequestHost, boundary: RequestBoundary | undefined): void {
  if (boundary)
    boundaries.set(host, boundary)
  else
    boundaries.delete(host)
}

export function postRequest(host: RequestHost, { type, data }: Packet): Promise<any> {
  return new Promise((resolve, reject) => {
    if (host.destroyed) {
      reject(new Error('The instance has been destroyed'))
      return
    }
    const pending = requests.get(host) || new Set<Pending>()
    requests.set(host, pending)
    const finish = (request: Pending) => {
      if (!pending.delete(request))
        return false
      if (request.timer !== undefined)
        clearTimeout(request.timer)
      if (request.id !== undefined)
        delete host.promises[request.id]
      if (!pending.size)
        requests.delete(host)
      return true
    }
    const request: Pending = {
      callbacks: {
        resove(value) {
          if (finish(request))
            resolve(value)
        },
        reject(error) {
          if (finish(request))
            reject(error)
        },
      },
      cancel(error) {
        if (finish(request))
          reject(error)
      },
    }
    pending.add(request)
    const loop = () => {
      request.timer = undefined
      if (!pending.has(request))
        return
      if (host.destroyed) {
        request.cancel(new Error('The instance has been destroyed'))
        return
      }
      try {
        boundaries.get(host)?.prepare()
        if (!pending.has(request))
          return
        if (host.injected) {
          const id = Math.max(Date.now(), lastId + 1)
          lastId = id
          request.id = id
          host.promises[id] = request.callbacks
          const packet = { type, data, id }
          host.$iframe.contentWindow!.postMessage(boundaries.get(host)?.envelope(packet) || packet, '*')
        }
        else {
          request.timer = setTimeout(loop, 200)
        }
      }
      catch (error) {
        request.cancel(error)
      }
    }
    loop()
  })
}

export function cancelRequests(host: RequestHost, reason = new Error('The instance has been destroyed')): void {
  const pending = requests.get(host)
  if (!pending)
    return
  for (const request of [...pending])
    request.cancel(reason)
}

export function captureRequests(host: RequestHost): (reason: unknown) => void {
  const captured = [...(requests.get(host) || [])]
  return (reason) => {
    for (const request of captured)
      request.cancel(reason)
  }
}
