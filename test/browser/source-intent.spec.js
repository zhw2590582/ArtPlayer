import { expect, test } from './fixtures.js'

async function start(page, core) {
  await page.goto(`/test/player.html?core=${core}`)
  await page.evaluate(() => window.createPlayer('/test/pattern.mp4?intent=initial'))
  await expect.poll(() => page.evaluate(() => window.art.isReady)).toBe(true)
  await page.locator('#play').click()
  await expect.poll(() => page.evaluate(() => window.art.currentTime)).toBeGreaterThan(0.3)
}

for (const core of ['published', 'candidate']) {
  test(`${core}: rapid source switches preserve playing on the latest real video without plugins`, async ({ page }, testInfo) => {
    await start(page, core)
    await page.evaluate(async () => {
      window.restarted = []
      window.art.on('restart', url => window.restarted.push(url))
      await Promise.all(['one', 'two', 'last'].map(name => window.art.switchUrl(`/test/pattern.mp4?intent=${name}`)))
    })
    await expect.poll(() => page.evaluate(() => window.art.currentTime)).toBeGreaterThan(0.3)
    expect(await page.evaluate(() => window.art.video.paused)).toBe(false)
    expect(await page.evaluate(() => window.art.video.currentSrc)).toContain('intent=last')
    expect(await page.evaluate(() => window.restarted)).toEqual(core === 'candidate' ? ['/test/pattern.mp4?intent=last'] : ['one', 'two', 'last'].map(name => `/test/pattern.mp4?intent=${name}`))
    await testInfo.attach('source-intent', { contentType: 'application/json', body: JSON.stringify(await page.evaluate(() => ({ time: window.art.currentTime, paused: window.art.video.paused, restarts: window.restarted }))) })
    await page.evaluate(() => window.art.destroy())
  })
}

for (const command of ['pause-before-next', 'pause-after-next', 'reentrant-pause', 'pause-listener-switch']) {
  test(`candidate: ${command} cancels automatic resume until the next user play`, async ({ page }, testInfo) => {
    await start(page, 'candidate')
    await page.evaluate(async (command) => {
      const { art } = window
      if (command === 'reentrant-pause')
        art.once('pause', () => art.pause())
      const first = art.switchUrl('/test/pattern.mp4?intent=first')
      if (command === 'pause-before-next')
        art.pause()
      let last
      if (command === 'pause-listener-switch') {
        art.once('pause', () => {
          last = art.switchUrl('/test/pattern.mp4?intent=last')
        })
        art.pause()
      }
      else {
        last = art.switchUrl('/test/pattern.mp4?intent=last')
      }
      if (command === 'pause-after-next')
        art.pause()
      await Promise.all([first, last])
    }, command)
    expect(await page.evaluate(() => window.art.video.paused)).toBe(true)
    expect(await page.evaluate(() => window.art.video.currentSrc)).toContain('intent=last')
    await testInfo.attach('source-paused', { contentType: 'application/json', body: JSON.stringify(await page.evaluate(() => ({ paused: window.art.video.paused, readyState: window.art.video.readyState }))) })
    await page.locator('#play').click()
    await expect.poll(() => page.evaluate(() => window.art.currentTime)).toBeGreaterThan(0.3)
    expect(await page.evaluate(() => window.art.video.paused)).toBe(false)
    await page.evaluate(() => window.art.destroy())
  })
}
