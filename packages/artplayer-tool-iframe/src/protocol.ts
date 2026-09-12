import type { Packet } from './requests'

export function acceptsMessage(event: MessageEvent<unknown>, peer: Window | null): event is MessageEvent<Packet> {
  if (event.source !== undefined && event.source !== null && event.source !== peer)
    return false
  const data = event.data
  return typeof data === 'object' && data !== null && 'type' in data && typeof data.type === 'string'
}
