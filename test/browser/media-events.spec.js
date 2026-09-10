import { expect, test } from './fixtures.js'

for (const core of ['published', 'candidate']) {
  test(`${core}: HTTP failure retries the updated option URL with the original event and one ready`, async ({ page, request }, testInfo) => {
    const caseId = encodeURIComponent(testInfo.testId)
    await page.goto(`/test/player.html?core=${core}&chapter=published`)
    await page.evaluate((id) => {
      window.Artplayer.RECONNECT_SLEEP_TIME = 0
      window.Artplayer.RECONNECT_TIME_MAX = 1
      window.createPlayer(`/test/fail.mp4?case=${id}`)
      const { art } = window
      window.recovery = { attempts: [], ready: 0, identities: [], order: [] }
      let original
      art.on('video:error', (event) => {
        original = event
        window.recovery.order.push('native-error')
        art.option.url = `/test/pattern.mp4?case=${id}`
      })
      art.on('error', (event, attempt) => {
        window.recovery.attempts.push(attempt)
        window.recovery.identities.push(event === original && event.target === art.video)
        window.recovery.order.push('retry')
      })
      art.on('ready', () => {
        window.recovery.ready++
        window.recovery.order.push('ready')
      })
    }, caseId)
    await expect.poll(() => page.evaluate(() => window.art.isReady)).toBe(true)
    const result = await page.evaluate(() => ({ ...window.recovery, path: new URL(window.art.video.currentSrc).pathname, duration: window.art.duration, mediaError: window.art.video.error?.code || 0 }))
    expect(result.attempts).toEqual([1])
    expect(result.identities).toEqual([true])
    expect(result.ready).toBe(1)
    expect(result.order).toEqual(['native-error', 'retry', 'ready'])
    expect(result.path).toBe('/test/pattern.mp4')
    expect(result.duration).toBeGreaterThan(0)
    expect(result.mediaError).toBe(0)
    const requests = await (await request.get(`/test/requests.json?case=${caseId}`)).json()
    expect(requests.some(item => item.path === '/test/fail.mp4')).toBe(true)
    expect(requests.some(item => item.path === '/test/pattern.mp4')).toBe(true)
    await testInfo.attach('reconnect-http', { body: JSON.stringify({ result, requests }), contentType: 'application/json' })
    await page.evaluate(() => window.art.destroy())
  })

  test(`${core}: replacing a failed source cancels candidate retries`, async ({ page }, testInfo) => {
    const caseId = encodeURIComponent(testInfo.testId)
    await page.goto(`/test/player.html?core=${core}&chapter=published`)
    await page.evaluate((id) => {
      window.Artplayer.RECONNECT_SLEEP_TIME = 0
      window.Artplayer.RECONNECT_TIME_MAX = 1
      window.createPlayer(`/test/fail.mp4?case=${id}`)
      window.retries = 0
      window.art.on('error', () => window.retries++)
      window.art.once('video:error', () => {
        window.art.url = `/test/pattern.mp4?case=${id}`
      })
    }, caseId)
    await expect.poll(() => page.evaluate(() => window.art.isReady)).toBe(true)
    // The zero-delay retry's timer queue is observed after the replacement canplay.
    const retries = await page.evaluate(async () => {
      await new Promise(resolve => setTimeout(resolve, 0))
      return window.retries
    })
    expect(retries).toBe(core === 'candidate' ? 0 : 1)
    expect(await page.evaluate(() => window.art.video.error)).toBeNull()
    await page.evaluate(() => window.art.destroy())
  })
}

test('candidate: rejected real-media switch still allows current-source reconnect', async ({ page }, testInfo) => {
  const caseId = encodeURIComponent(testInfo.testId)
  await page.goto('/test/player.html?core=candidate&chapter=published')
  await page.evaluate(id => window.createPlayer(`/test/pattern.mp4?initial=${id}`), caseId)
  await expect.poll(() => page.evaluate(() => window.art.isReady)).toBe(true)
  await page.evaluate((id) => {
    const { art, Artplayer } = window
    Artplayer.RECONNECT_SLEEP_TIME = 0
    Artplayer.RECONNECT_TIME_MAX = 1
    window.switchRecovery = { rejected: false, sameError: false, attempts: [], restart: [] }
    let original
    art.on('video:error', (event) => {
      original = event
      art.option.url = `/test/pattern.mp4?recovered=${id}`
    })
    art.on('error', (event, count) => window.switchRecovery.attempts.push([event === original, count]))
    art.on('restart', url => window.switchRecovery.restart.push(url))
    art.switchUrl(`/test/fail.mp4?case=${id}`).catch((error) => {
      window.switchRecovery.rejected = true
      window.switchRecovery.sameError = error === original
    })
  }, caseId)
  await expect.poll(() => page.evaluate(() => window.switchRecovery.restart.length)).toBe(1)
  expect(await page.evaluate(() => window.switchRecovery)).toEqual({ rejected: true, sameError: true, attempts: [[true, 1]], restart: [`/test/pattern.mp4?recovered=${caseId}`] })
  expect(await page.evaluate(() => window.art.video.error)).toBeNull()
  await page.evaluate(() => window.art.destroy())
})

for (const core of ['published', 'candidate']) {
  test(`${core}: destroying from first-ready controls prevents a candidate ghost ready event`, async ({ page }) => {
    await page.goto(`/test/player.html?core=${core}&chapter=published`)
    const result = await page.evaluate(() => {
      const art = new window.Artplayer({ container: '.player', url: '' })
      let ready = 0
      art.on('ready', () => ready++)
      art.on('control', () => art.destroy(false))
      art.emit('video:canplay')
      return { ready, isReady: art.isReady, isDestroy: art.isDestroy, instances: window.Artplayer.instances.length }
    })
    expect(result).toEqual({ ready: core === 'candidate' ? 0 : 1, isReady: core !== 'candidate', isDestroy: true, instances: 0 })
  })
}

test.describe('mobile UA metadata path (not physical-device validation)', () => {
  test.use({ userAgent: 'Mozilla/5.0 (Linux; Android 13) AppleWebKit/537.36 Chrome/120.0.0.0 Mobile Safari/537.36' })
  for (const core of ['published', 'candidate']) {
    test(`${core}: metadata emits resize before mobile visibility changes`, async ({ page }) => {
      await page.goto(`/test/player.html?core=${core}&chapter=published`)
      const order = await page.evaluate(() => {
        const art = new window.Artplayer({ container: '.player', url: '' })
        const seen = []
        art.on('resize', () => seen.push('resize'))
        art.on('control', value => seen.push(['control', value]))
        art.on('video:loadedmetadata', () => seen.push('metadata'))
        art.emit('video:loadedmetadata')
        art.destroy()
        return seen
      })
      expect(order).toEqual(['resize', ['control', true], 'metadata'])
    })
  }
})
