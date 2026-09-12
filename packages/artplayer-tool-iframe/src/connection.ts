import type { Packet, RequestHost } from './requests'
import { cancelRequests } from './requests'

interface ConnectionHost extends RequestHost {
  url: string
  onMessage: (event: MessageEvent<Packet>) => void
}

const connections = new WeakMap<ConnectionHost, () => void>()

export function connect(host: ConnectionHost): void {
  const owner = window
  const receiver = host.onMessage
  connections.set(host, () => owner.removeEventListener('message', receiver))
  owner.addEventListener('message', receiver)
  host.$iframe.src = host.url
}

export function releaseConnection(host: ConnectionHost): void {
  const disconnect = connections.get(host)
  connections.delete(host)
  try {
    disconnect?.()
  }
  finally {
    cancelRequests(host)
  }
}
