import type { SyntheticFrameCallback } from '../types/artplayer-proxy-mediabunny'
import type { EnginePort } from './engine-types'

interface FrameOwner {
  engine: Pick<EnginePort, 'currentTime' | 'videoWidth' | 'videoHeight'>
}

interface FrameState {
  closed: boolean
  frames: Set<number>
}

// Keep resource bookkeeping off the observable shim own-property/canvas surface.
const states = new WeakMap<FrameOwner, FrameState>()
function state(owner: FrameOwner): FrameState {
  let value = states.get(owner)
  if (!value) {
    value = { closed: false, frames: new Set() }
    states.set(owner, value)
  }
  return value
}

export function requestFrame(owner: FrameOwner, callback: SyntheticFrameCallback): number {
  const resource = state(owner)
  if (resource.closed)
    return 0
  const id = requestAnimationFrame((time) => {
    resource.frames.delete(id)
    if (resource.closed)
      return
    callback(time, {
      presentationTime: owner.engine.currentTime,
      expectedDisplayTime: time + 16.6,
      width: owner.engine.videoWidth,
      height: owner.engine.videoHeight,
      mediaTime: owner.engine.currentTime,
      presentedFrames: 0,
      processingDuration: 0,
      captureTime: time,
      receiveTime: time,
      rtpTimestamp: 0,
    })
  })
  resource.frames.add(id)
  return id
}

export function cancelFrame(owner: FrameOwner, id: number): void {
  state(owner).frames.delete(id)
  cancelAnimationFrame(id)
}

export function closeFrames(owner: FrameOwner): boolean {
  const resource = state(owner)
  if (resource.closed)
    return false
  resource.closed = true
  for (const id of resource.frames) cancelAnimationFrame(id)
  resource.frames.clear()
  return true
}
