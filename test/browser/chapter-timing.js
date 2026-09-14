export async function installChapterTiming(page, selector) {
  await page.evaluate((selector) => {
    const video = selector ? document.querySelector(selector) : window.art.video
    const records = []
    let sequence = 0
    const record = (value) => {
      if (records.length < 10000)
        records.push({ at: performance.now(), ...value })
    }
    for (const name of ['currentTime', 'duration', 'readyState', 'seeking', 'playbackRate', 'paused']) {
      const descriptor = Object.getOwnPropertyDescriptor(HTMLMediaElement.prototype, name)
      if (!descriptor?.get)
        throw new Error(`Missing native media descriptor: ${name}`)
      const access = (kind, callback, value) => {
        const id = sequence++
        const start = performance.now()
        record({ id, kind, name, phase: 'before', value })
        try {
          const result = callback()
          record({ id, kind, name, phase: 'after', value: result, elapsed: performance.now() - start })
          return result
        }
        catch (error) {
          record({ id, kind, name, phase: 'error', error: String(error), elapsed: performance.now() - start })
          throw error
        }
      }
      Object.defineProperty(video, name, {
        configurable: true,
        get() { return access('get', () => descriptor.get.call(this)) },
        ...(descriptor.set ? { set(value) { access('set', () => descriptor.set.call(this, value), value) } } : {}),
      })
    }
    const events = []
    for (const name of ['loadstart', 'loadedmetadata', 'loadeddata', 'canplay', 'seeking', 'seeked', 'playing', 'pause', 'error']) {
      video.addEventListener(name, () => events.push({ name, at: performance.now() }))
    }
    const heartbeat = []
    let previous = performance.now()
    const timer = setInterval(() => {
      const at = performance.now()
      heartbeat.push({ at, gap: at - previous })
      previous = at
    }, 100)
    window.chapterTiming = { records, events, heartbeat, started: previous, timeOrigin: performance.timeOrigin }
    window.stopChapterTiming = () => clearInterval(timer)
  }, selector)
}

export async function readChapterTiming(page, testInfo) {
  const observation = await page.evaluate(() => {
    window.stopChapterTiming?.()
    return window.chapterTiming || null
  }).catch(error => ({ error: error.message }))
  await testInfo.attach('chapter-native-access-timing', { contentType: 'application/json', body: JSON.stringify(observation) })
}
