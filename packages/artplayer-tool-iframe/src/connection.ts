import type { Packet, RequestHost } from './requests'
import { createNavigation } from './navigation'
import { cancelRequests } from './requests'

interface ConnectionHost extends RequestHost {
  url: string
  onMessage: (event: MessageEvent<Packet>) => void
}

const connections = new WeakMap<ConnectionHost, () => void>()

export function connect(host: ConnectionHost): void {
  const owner = window
  const receiver = host.onMessage
  const cleanups = [() => owner.removeEventListener('message', receiver)]
  connections.set(host, () => {
    let failed = false
    let failure: unknown
    for (const cleanup of cleanups) {
      try {
        cleanup()
      }
      catch (error) {
        if (!failed) {
          failed = true
          failure = error
        }
      }
    }
    if (failed)
      throw failure
  })
  owner.addEventListener('message', receiver)
  host.$iframe.src = host.url
  const navigation = createNavigation(host)
  cleanups.push(navigation.dispose)
  navigation.start()
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
