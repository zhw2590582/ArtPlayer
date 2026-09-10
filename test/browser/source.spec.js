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

test('candidate: quality switch restores position/rate and preserves real customType identities', async ({ page }) => {
  await page.goto('/test/player.html?core=candidate&chapter=published')
  await page.evaluate(() => window.createPlayer('/test/pattern.mp4?custom=initial'))
  await expect.poll(() => page.evaluate(() => window.art.isReady)).toBe(true)
  await page.evaluate(() => {
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
    await art.switchQuality('/test/pattern.mp4?custom=next')
    const result = { calls, restart, time: art.currentTime, rate: art.playbackRate, ratio: art.aspectRatio, paused: art.video.paused, error: art.video.error?.code || 0 }
    art.destroy()
    return result
  })
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
