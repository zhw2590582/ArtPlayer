import { isHlsSource } from './input'

interface RangeEvents {
  emit: (type: string, detail?: Event) => void
}

export async function preflightRange(url: unknown, enabled: boolean, events: RangeEvents, signal?: AbortSignal, isCurrent = (): boolean => true): Promise<boolean> {
  if (signal?.aborted || !isCurrent())
    return false
  if (!enabled || typeof url !== 'string' || isHlsSource(url))
    return true

  try {
    const res = await fetch(url, signal ? { method: 'HEAD', signal } : { method: 'HEAD' })
    if (signal?.aborted || !isCurrent())
      return false
    const acceptRanges = res.headers.get('accept-ranges')
    if (!acceptRanges || acceptRanges === 'none') {
      events.emit('error', new Event('RangeNotSupported'))
      return false
    }
    return true
  }
  catch (error) {
    if (signal?.aborted || !isCurrent())
      return false
    console.warn('Preflight check failed:', error)
    return true
  }
}
