import type { Packet } from './requests'

export const sessionType = 'artplayer-tool-iframe:session'
export type SessionPhase = 'inject' | 'message' | 'ack' | 'leave' | 'resume' | 'fragment'
export interface SessionMetadata {
  version: 1
  document: string
  phase: SessionPhase
}

interface SessionPacket extends Packet {
  __artplayerIframe: SessionMetadata
}

export function sessionMetadata(packet: Packet): SessionMetadata | undefined {
  const value = (packet as Partial<SessionPacket>).__artplayerIframe
  if (value?.version === 1 && typeof value.document === 'string' && value.document && ['inject', 'message', 'ack', 'leave', 'resume', 'fragment'].includes(value.phase))
    return value
}

export function withSession(packet: Packet, documentId: string, phase: SessionPhase): SessionPacket {
  return { ...packet, __artplayerIframe: { version: 1, document: documentId, phase } }
}

export function acceptsMessage(event: MessageEvent<unknown>, peer: Window | null): event is MessageEvent<Packet> {
  if (event.source !== undefined && event.source !== null && event.source !== peer)
    return false
  const data = event.data
  return typeof data === 'object' && data !== null && 'type' in data && typeof data.type === 'string'
}
