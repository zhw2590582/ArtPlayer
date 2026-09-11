import type { Cleanup, Hls, SdkEvent } from './types'

export function subscribeHls(hls: Hls, refresh: Cleanup, destroyed: Cleanup): Cleanup {
  const events = hls.constructor?.Events
  if (!events || typeof hls.on !== 'function' || typeof hls.off !== 'function')
    return () => {}
  // Keep the checked SDK object so method calls retain their original receiver.
  const source = hls as Hls & Required<Pick<Hls, 'on' | 'off'>>
  const subscriptions: [string, Cleanup][] = []
  let active = true
  function release(): void {
    if (!active)
      return
    active = false
    for (const [event, callback] of subscriptions)
      source.off(event, callback)
    subscriptions.length = 0
  }
  try {
    for (const key of ['MANIFEST_PARSED', 'LEVELS_UPDATED', 'LEVEL_SWITCHED', 'AUDIO_TRACKS_UPDATED', 'AUDIO_TRACK_SWITCHED', 'DESTROYING'] satisfies SdkEvent[]) {
      const event = events[key]
      if (typeof event !== 'string' || subscriptions.some(([name]) => name === event))
        continue
      const callback = () => {
        if (!active)
          return
        if (key === 'DESTROYING')
          destroyed()
        else
          refresh()
      }
      subscriptions.push([event, callback])
      source.on(event, callback)
    }
  }
  catch (error) {
    release()
    throw error
  }
  return release
}
