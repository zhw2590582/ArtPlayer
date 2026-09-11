export function subscribeHls(hls, refresh, destroyed) {
  const events = hls.constructor?.Events
  if (!events || typeof hls.on !== 'function' || typeof hls.off !== 'function')
    return () => {}
  const subscriptions = []
  let active = true
  function release() {
    if (!active)
      return
    active = false
    for (const [event, callback] of subscriptions)
      hls.off(event, callback)
    subscriptions.length = 0
  }
  try {
    for (const key of ['MANIFEST_PARSED', 'LEVELS_UPDATED', 'LEVEL_SWITCHED', 'AUDIO_TRACKS_UPDATED', 'AUDIO_TRACK_SWITCHED', 'DESTROYING']) {
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
      hls.on(event, callback)
    }
  }
  catch (error) {
    release()
    throw error
  }
  return release
}
