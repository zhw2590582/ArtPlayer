import type { Packet } from './requests'
import { sessionMetadata, sessionType, withSession } from './protocol'

interface ChildSession {
  owner: Document
  id: string
  acknowledged: boolean
  lifecycle: boolean
  receivers: Set<(event: MessageEvent<Packet>) => void>
}

let session: ChildSession | undefined

export function prepareChildSession(): void {
  if (session?.owner === window.document && session)
    return
  const random = new Uint32Array(4)
  if (window.crypto?.getRandomValues)
    window.crypto.getRandomValues(random)
  else
    random.forEach((_, index) => random[index] = Math.floor(Math.random() * 0x100000000))
  session = { owner: window.document, id: `${Date.now()}-${Array.from(random).join('-')}`, acknowledged: false, lifecycle: false, receivers: new Set() }
}

export function childEnvelope(packet: Packet): Packet {
  if (session && (packet.type === 'inject' || session.acknowledged))
    return withSession(packet, session.id, packet.type === 'inject' ? 'inject' : 'message')
  return packet
}

export function consumeChildSession(packet: Packet): boolean {
  const metadata = sessionMetadata(packet)
  if (!metadata)
    return false
  if (packet.type === sessionType) {
    if (session && metadata.document === session.id && metadata.phase === 'ack')
      session.acknowledged = true
    return true
  }
  return !session || metadata.document !== session.id
}

export function connectChildSession(receiver: (event: MessageEvent<Packet>) => void): void {
  const current = session!
  const added = !current.receivers.has(receiver)
  const installing = !current.lifecycle
  const notify = (phase: 'leave' | 'resume' | 'fragment', data?: unknown) => {
    if (!current.acknowledged)
      return
    try {
      window.parent.postMessage(withSession({ type: sessionType, data, id: 0 }, current.id, phase), '*')
    }
    catch {
      // The parent may have disappeared; this private lifecycle notification is best effort.
    }
  }
  const leave = () => notify('leave')
  const fragment = () => notify('fragment', window.location.href)
  const resume = (event: PageTransitionEvent) => {
    if (event.persisted)
      notify('resume')
  }
  try {
    window.addEventListener('message', receiver)
    current.receivers.add(receiver)
    if (!installing)
      return
    window.addEventListener('pagehide', leave)
    window.addEventListener('pageshow', resume)
    window.addEventListener('hashchange', fragment)
    current.lifecycle = true
  }
  catch (error) {
    const cleanups: (() => void)[] = []
    if (installing) {
      cleanups.push(() => window.removeEventListener('pagehide', leave))
      cleanups.push(() => window.removeEventListener('pageshow', resume))
      cleanups.push(() => window.removeEventListener('hashchange', fragment))
    }
    if (added)
      cleanups.push(() => window.removeEventListener('message', receiver))
    for (const cleanup of cleanups) {
      try {
        cleanup()
      }
      catch { /* Preserve the acquisition error while releasing the other listeners. */ }
    }
    if (added)
      current.receivers.delete(receiver)
    throw error
  }
}
