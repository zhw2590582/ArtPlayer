import type { WrappedCanvas } from 'mediabunny'

export type FrameIterator = Pick<AsyncGenerator<WrappedCanvas, void, unknown>, 'next' | 'return'>
const closing = new WeakMap<FrameIterator, Promise<void>>()
const reading = new WeakMap<FrameIterator, Promise<WrappedCanvas | null>>()

export function releaseIterator(iterator: FrameIterator | null): Promise<void> {
  if (!iterator)
    return Promise.resolve()
  const previous = closing.get(iterator)
  if (previous)
    return previous
  const pending = Promise.resolve().then(() => iterator.return()).then(() => {})
  closing.set(iterator, pending)
  return pending
}

export function readCanvas(iterator: FrameIterator): Promise<WrappedCanvas | null> {
  const previous = reading.get(iterator)
  if (previous)
    return previous
  const pending = Promise.resolve().then(() => iterator.next()).then(result => result.value ?? null)
  reading.set(iterator, pending)
  const clear = () => {
    if (reading.get(iterator) === pending)
      reading.delete(iterator)
  }
  pending.then(clear, clear)
  return pending
}

export function frameAction(timestamp: number, time: number, dropLateFrames: boolean, avSyncTolerance: number, playbackRate: number): 'skip' | 'draw' | 'queue' {
  const tolerance = dropLateFrames ? Math.max(0.06, avSyncTolerance / Math.max(1, playbackRate)) : 0
  if (dropLateFrames && timestamp < time - tolerance)
    return 'skip'
  return timestamp <= time + tolerance ? 'draw' : 'queue'
}
