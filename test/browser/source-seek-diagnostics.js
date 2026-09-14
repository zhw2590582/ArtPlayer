export async function installSeekDiagnostics(page, properties = true) {
  await page.evaluate((properties) => {
    const art = window.art
    const video = art.video
    window.sourceSeekTrace = []
    const state = () => ({ clock: performance.now(), time: video.currentTime, duration: video.duration, seeking: video.seeking, paused: video.paused, rate: video.playbackRate, readyState: video.readyState, source: video.currentSrc, active: Array.from(art.template.$track.track.activeCues || [], cue => cue.text) })
    const record = (event, detail) => window.sourceSeekTrace.push({ event, detail, ...state() })
    for (const property of properties ? ['currentTime', 'playbackRate'] : []) {
      const descriptor = Object.getOwnPropertyDescriptor(HTMLMediaElement.prototype, property)
      Object.defineProperty(video, property, {
        configurable: true,
        get() { return descriptor.get.call(this) },
        set(value) {
          record(`before:${property}`, { value, stack: new Error('Native media property write').stack })
          descriptor.set.call(this, value)
          record(`after:${property}`, { value })
        },
      })
    }
    for (const event of ['loadstart', 'loadedmetadata', 'loadeddata', 'canplay', 'seeking', 'seeked', 'emptied', 'pause', 'ratechange', 'timeupdate'])
      video.addEventListener(event, () => record(`native:${event}`))
    for (const event of ['restart', 'seek', 'fullscreen'])
      art.on(event, (...values) => record(`art:${event}`, values))
    window.recordSourceSeek = record
    record('installed')
  }, properties)
}
