import { expect, test } from './fixtures.js'

for (const core of ['published', 'candidate']) {
  test(`${core}: rapid real-media switches identify the last restart and settle superseded work`, async ({ page }) => {
    await page.goto(`/test/player.html?core=${core}&chapter=published`)
    await page.evaluate(() => window.createPlayer('/test/pattern.mp4?source=initial'))
    await expect.poll(() => page.evaluate(() => window.art.isReady)).toBe(true)
    const result = await page.evaluate(async () => {
      const { art } = window
      const restarts = []
      const order = []
      art.on('restart', url => restarts.push(url))
      art.on('video:canplay', () => order.push('canplay'))
      art.on('restart', () => order.push('restart'))
      let firstSettled = false
      const first = art.switchUrl('/test/pattern.mp4?source=first').then(() => {
        firstSettled = true
      })
      const second = art.switchUrl('/test/pattern.mp4?source=second')
      await Promise.resolve()
      const early = firstSettled
      await Promise.all([first, second])
      const result = { early, restarts, order, current: new URL(art.video.currentSrc).search, error: art.video.error?.code || 0, time: art.currentTime }
      art.destroy()
      return result
    })
    expect(result.early).toBe(core === 'candidate')
    expect(result.restarts).toEqual(core === 'candidate'
      ? ['/test/pattern.mp4?source=second']
      : ['/test/pattern.mp4?source=first', '/test/pattern.mp4?source=second'])
    expect(result.order[0]).toBe('canplay')
    expect(result.current).toBe('?source=second')
    expect(result.error).toBe(0)
    expect(result.time).toBeCloseTo(0, 1)
  })

  test(`${core}: destroy settles the candidate switch without waiting for detached media`, async ({ page }) => {
    await page.goto(`/test/player.html?core=${core}&chapter=published`)
    await page.evaluate(() => window.createPlayer('/test/pattern.mp4?destroy=initial'))
    await expect.poll(() => page.evaluate(() => window.art.isReady)).toBe(true)
    const result = await page.evaluate(async () => {
      const { art } = window
      let settled = false
      let rejected = false
      art.switchUrl('/test/pattern.mp4?destroy=pending').then(() => {
        settled = true
      }, () => {
        rejected = true
      })
      art.destroy()
      // Retain the published baseline's bounded pending observation, not an infinite-pending claim.
      await new Promise(resolve => setTimeout(resolve, 250))
      return { settled, rejected, destroyed: art.isDestroy, instances: window.Artplayer.instances.length }
    })
    expect(result).toEqual({ settled: core === 'candidate', rejected: false, destroyed: true, instances: 0 })
  })
}

test('candidate: quality switch restores position/rate and preserves real customType identities', async ({ page }, testInfo) => {
  await page.goto('/test/player.html?core=candidate&chapter=published')
  await page.evaluate(() => window.createPlayer('/test/pattern.mp4?custom=initial'))
  await expect.poll(() => page.evaluate(() => window.art.isReady)).toBe(true)
  // A real gesture starts WebKit's media pipeline before the paused seek setup.
  await page.locator('#play').click()
  await expect.poll(() => page.evaluate(() => window.art.currentTime)).toBeGreaterThan(0.1)
  await page.locator('#pause').click()
  await expect.poll(() => page.evaluate(() => window.art.video.paused)).toBe(true)
  await testInfo.attach('initial-media-ranges', {
    body: JSON.stringify(await page.evaluate(() => {
      const { video } = window.art
      const ranges = value => Array.from({ length: value.length }, (_, index) => [value.start(index), value.end(index)])
      return { buffered: ranges(video.buffered), seekable: ranges(video.seekable), readyState: video.readyState, duration: video.duration, currentTime: video.currentTime }
    })),
    contentType: 'application/json',
  })
  await expect.poll(() => page.evaluate(() => {
    const ranges = window.art.video.seekable
    return Array.from({ length: ranges.length }, (_, index) => index).some(index => ranges.start(index) <= 3 && ranges.end(index) >= 3)
  })).toBe(true)
  await page.evaluate(() => {
    window.switchMediaEvents = []
    for (const name of ['loadedmetadata', 'seeking', 'seeked', 'canplay', 'pause', 'playing']) {
      window.art.video.addEventListener(name, () => window.switchMediaEvents.push({ name, time: window.art.currentTime, seeking: window.art.video.seeking, source: window.art.video.currentSrc }))
    }
    window.art.currentTime = 3
  })
  await expect.poll(() => page.evaluate(() => window.art.video.seeking)).toBe(false)
  const result = await page.evaluate(async () => {
    const { art } = window
    const calls = []
    art.option.type = 'controlled'
    art.option.customType.controlled = function (video, url, owner) {
      calls.push({ thisIdentity: this === art, ownerIdentity: owner === art, videoIdentity: video === art.video, count: arguments.length, url })
      video.src = url
    }
    art.playbackRate = 1.5
    art.aspectRatio = '16:9'
    const restart = []
    art.on('restart', url => restart.push(url))
    const beforeSwitch = { time: art.currentTime, seeking: art.video.seeking, paused: art.video.paused }
    await art.switchQuality('/test/pattern.mp4?custom=next')
    const result = { beforeSwitch, mediaEvents: window.switchMediaEvents, calls, restart, time: art.currentTime, rate: art.playbackRate, ratio: art.aspectRatio, paused: art.video.paused, error: art.video.error?.code || 0 }
    art.destroy()
    return result
  })
  await testInfo.attach('quality-switch-media-state', { body: JSON.stringify(result), contentType: 'application/json' })
  expect(result.beforeSwitch.time).toBeCloseTo(3, 1)
  expect(result.beforeSwitch.seeking).toBe(false)
  expect(result.beforeSwitch.paused).toBe(true)
  expect(result.calls).toEqual([{ thisIdentity: true, ownerIdentity: true, videoIdentity: true, count: 3, url: '/test/pattern.mp4?custom=next' }])
  expect(result.restart).toEqual(['/test/pattern.mp4?custom=next'])
  expect(result.time).toBeCloseTo(3, 1)
  expect(result.rate).toBe(1.5)
  expect(result.ratio).toBe('16:9')
  expect(result.paused).toBe(true)
  expect(result.error).toBe(0)
})

test('candidate: real switch settles when the controlled native resume rejects', async ({ page }) => {
  await page.goto('/test/player.html?core=candidate&chapter=published')
  await page.evaluate(() => window.createPlayer('/test/pattern.mp4?resume=initial'))
  await expect.poll(() => page.evaluate(() => window.art.isReady)).toBe(true)
  await page.locator('#play').click()
  await expect.poll(() => page.evaluate(() => window.art.playing)).toBe(true)
  const result = await page.evaluate(async () => {
    const { art } = window
    const error = new DOMException('controlled resume rejection', 'NotAllowedError')
    let calls = 0
    Object.defineProperty(art.video, 'play', { configurable: true, value() {
      calls++
      return Promise.reject(error)
    } })
    const value = await art.switchUrl('/test/pattern.mp4?resume=next')
    const result = { settledUndefined: value === undefined, calls, source: new URL(art.video.currentSrc).search, paused: art.video.paused }
    delete art.video.play
    art.destroy()
    return result
  })
  expect(result).toEqual({ settledUndefined: true, calls: 1, source: '?resume=next', paused: true })
})

test('candidate: late native play completion cannot publish stale player effects', async ({ page }) => {
  await page.goto('/test/player.html?core=candidate&chapter=published')
  await page.evaluate(() => window.createPlayer('/test/pattern.mp4?late=initial'))
  await expect.poll(() => page.evaluate(() => window.art.isReady)).toBe(true)
  await page.locator('#play').click()
  await expect.poll(() => page.evaluate(() => window.art.playing)).toBe(true)
  const result = await page.evaluate(async () => {
    const { art } = window
    const plays = []
    art.on('play', () => plays.push('play'))
    let resolveNative
    let started
    const invoked = new Promise(resolve => started = resolve)
    Object.defineProperty(art.video, 'play', { configurable: true, value() {
      started()
      return new Promise(resolve => resolveNative = resolve)
    } })
    const switching = art.switchUrl('/test/pattern.mp4?late=resume')
    await invoked
    art.url = '/test/pattern.mp4?late=latest'
    await switching
    art.notice.show = 'Latest source notice'
    resolveNative(42)
    await new Promise(resolve => setTimeout(resolve, 0))
    const result = { plays, notice: art.template.$noticeInner.textContent }
    delete art.video.play
    art.destroy()
    return result
  })
  expect(result).toEqual({ plays: [], notice: 'Latest source notice' })
})
