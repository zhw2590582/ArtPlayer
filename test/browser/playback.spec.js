import { expect, test } from './fixtures.js'

for (const core of ['published', 'candidate']) {
  test(`${core}: real playback, pause, seek, switch and destroy`, async ({ page, request, diagnostics }, testInfo) => {
    const caseId = encodeURIComponent(testInfo.testId)
    await page.goto(`/test/player.html?core=${core}`)
    await page.evaluate(url => window.createPlayer(url, true), `/test/pattern.mp4?case=${caseId}`)
    await expect.poll(() => page.evaluate(() => window.art.isReady)).toBe(true)
    expect(await page.locator('video').evaluate(video => video.duration)).toBeCloseTo(8, 1)
    await expect(page.locator('.art-chapter')).toHaveCount(1)
    await page.locator('#play').click()
    await expect.poll(() => page.locator('video').evaluate(video => video.currentTime)).toBeGreaterThan(0.25)
    // Read decoded frame colors, independent of WebKit Windows' layout-sized videoWidth.
    const pixels = await page.locator('video').evaluate((video) => {
      const canvas = document.createElement('canvas')
      canvas.width = 80
      canvas.height = 45
      const ctx = canvas.getContext('2d')
      ctx.drawImage(video, 0, 0, 80, 45)
      return [30, 45, 75].map(x => [...ctx.getImageData(x, 2, 1, 1).data])
    })
    expect(pixels[0][0]).toBeGreaterThan(180)
    expect(pixels[0][1]).toBeGreaterThan(180)
    expect(pixels[0][2]).toBeLessThan(80)
    expect(pixels[1][0]).toBeLessThan(80)
    expect(pixels[1][2]).toBeGreaterThan(180)
    expect(pixels[2][1]).toBeGreaterThan(180)
    expect(pixels[2][2]).toBeGreaterThan(180)
    const mediaRequests = await (await request.get(`/test/requests.json?case=${caseId}`)).json()
    expect(mediaRequests.some(item => item.path === '/test/pattern.mp4')).toBe(true)
    await testInfo.attach('decoded-frame', { body: JSON.stringify({ pixels, mediaRequests }), contentType: 'application/json' })
    await page.locator('#pause').click()
    await expect.poll(() => page.locator('video').evaluate(video => video.paused)).toBe(true)
    const pausedTime = await page.locator('video').evaluate(video => video.currentTime)
    // A bounded observation interval checks that pause stops the media clock.
    await page.waitForTimeout(200)
    expect(await page.locator('video').evaluate(video => video.currentTime)).toBeCloseTo(pausedTime, 2)
    await page.evaluate(() => {
      window.art.seek = 3
    })
    await expect.poll(() => page.evaluate(() => window.events.includes('video:seeked'))).toBe(true)
    expect(await page.locator('video').evaluate(video => video.currentTime)).toBeCloseTo(3, 1)
    // Reuse a real docs sample, independently of the short synthetic fixture.
    await page.evaluate(url => window.art.switchUrl(url), `/assets/sample/video.mp4?case=${caseId}`)
    await expect.poll(() => page.locator('video').evaluate(video => video.duration)).toBeGreaterThan(90)
    await page.locator('#play').click()
    await expect.poll(() => page.locator('video').evaluate(video => video.currentTime)).toBeGreaterThan(0.25)
    const events = await page.evaluate(() => window.events)
    expect(events).toContain('video:loadedmetadata')
    expect(events).toContain('ready')
    expect(events.indexOf('video:loadedmetadata')).toBeLessThan(events.indexOf('ready'))
    expect(events).toContain('video:playing')
    expect(events).not.toContain('video:error')
    await page.evaluate(() => window.art.destroy())
    await expect(page.locator('.player')).toBeEmpty()
    expect(await page.evaluate(() => window.Artplayer.instances.length)).toBe(0)
    expect(diagnostics.consoleErrors).toEqual([])
    // Chromium cancels media range requests as buffering, seeking and source ownership change.
    // Only exact cancellations of this test's two media URLs are expected; retain all in evidence.
    const unexpectedRequests = diagnostics.failedRequests.filter((item) => {
      const url = new URL(item.url)
      return !(item.resourceType === 'media' && item.failure?.errorText === 'net::ERR_ABORTED'
        && url.origin === new URL(page.url()).origin
        && url.searchParams.get('case') === testInfo.testId
        && ['/test/pattern.mp4', '/assets/sample/video.mp4'].includes(url.pathname))
    })
    expect(unexpectedRequests).toEqual([])
  })
}

test('controlled HTTP media failure emits a real video error', async ({ page, request }, testInfo) => {
  const caseId = encodeURIComponent(testInfo.testId)
  await page.goto('/test/player.html')
  await page.evaluate(url => window.createPlayer(url), `/test/fail.mp4?case=${caseId}`)
  await expect.poll(() => page.evaluate(() => window.events.includes('video:error'))).toBe(true)
  const requests = await (await request.get(`/test/requests.json?case=${caseId}`)).json()
  expect(requests.some(item => item.path === '/test/fail.mp4')).toBe(true)
  expect((await request.get('/test/fail.mp4')).status()).toBe(503)
  expect(await page.locator('video').evaluate(video => video.error.code)).toBeGreaterThan(0)
  await page.evaluate(() => window.art.destroy())
  await expect(page.locator('.player')).toBeEmpty()
})

test('Range, media identity and docs candidate routes', async ({ request }) => {
  const manifest = await (await request.get('/test/manifest.json')).json()
  const candidate = await request.get('/candidate/artplayer.js')
  const alias = await request.get('/uncompiled/artplayer/index.js')
  expect(await alias.body()).toEqual(await candidate.body())
  expect(manifest.resources['/uncompiled/artplayer/index.js'].aliasOf).toBe('/candidate/artplayer.js')
  const full = await (await request.get('/test/pattern.mp4')).body()
  for (const [range, start, end] of [['bytes=0-31', 0, 32], ['bytes=-16', full.length - 16, full.length], ['bytes=32-', 32, full.length]]) {
    const response = await request.get('/test/pattern.mp4', { headers: { Range: range } })
    expect(response.status()).toBe(206)
    expect(await response.body()).toEqual(full.subarray(start, end))
  }
  expect((await request.get('/test/pattern.mp4', { headers: { Range: 'bytes=999999999-' } })).status()).toBe(416)
  expect((await request.get('/compiled/missing.js')).status()).toBe(404)
  expect((await request.get('/mobile.html')).status()).toBe(200)
  expect((await request.get('/?libs=./uncompiled/artplayer-plugin-chapter/index.js&example=chapter')).status()).toBe(200)
})
