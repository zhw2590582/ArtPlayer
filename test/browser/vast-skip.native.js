import fs from 'node:fs'
import { hash } from '../../refactor/scripts/releases.mjs'
import { compilePackage } from '../helpers/load.js'
import { expect, test } from './fixtures.js'
import { skippableVast } from './vast-fixture.mjs'

// eslint-disable-next-line antfu/no-top-level-await -- Native SDK bundle is shared by test discovery.
const code = await compilePackage('artplayer-plugin-vast', 'umd')

for (const compatibility of [undefined, 'workspace-1.2']) {
  test(`real IMA ${compatibility || 'npm-default'} requests playUrl and skips through the SDK button`, async ({ page }, testInfo) => {
    await page.goto('/test/player.html?core=candidate')
    await page.addScriptTag({ content: code })
    await page.evaluate(async (compatibility) => {
      window.createPlayer('/assets/sample/video.mp4')
      window.skipEvents = []
      await window.art.plugins.add(window.artplayerPluginVast((context) => {
        window.skipContext = context
        const player = context.init()
        for (const type of ['AdStarted', 'AdComplete', 'AdSkipped', 'AdSkippableStateChanged', 'AdContentPauseRequested', 'AdContentResumeRequested', 'AdError']) {
          player.addEventListener(type, event => window.skipEvents.push({ type, at: performance.now(), time: window.art.currentTime, paused: window.art.template.$video.paused, skipOffset: event.detail?.ad?.getSkipTimeOffset(), error: event.detail?.error?.message }))
        }
      }, compatibility ? { compatibility } : undefined))
    }, compatibility)
    await page.locator('#play').click()
    await expect.poll(() => page.evaluate(() => window.art.currentTime)).toBeGreaterThan(0.5)
    await page.evaluate(() => {
      document.querySelector('#play').onclick = () => window.skipContext.playUrl(`${location.origin}/test/vast-skippable.xml`)
    })
    const beforeAd = await page.evaluate(() => window.art.currentTime)
    const responsePromise = page.waitForResponse(response => response.url().endsWith('/test/vast-skippable.xml'), { timeout: 7000 })
    await page.locator('#play').click()
    const response = await responsePromise
    expect(response.status()).toBe(200)
    expect(response.headers()['content-type']).toBe('application/xml')
    expect(['http://imasdk.googleapis.com', 'https://imasdk.googleapis.com']).toContain(response.headers()['access-control-allow-origin'])
    const xml = await response.text()
    expect(xml).toBe(skippableVast(new URL(page.url()).origin))
    await testInfo.attach('native-vast-skip.xml', { contentType: 'application/xml', body: xml })
    await expect.poll(() => page.evaluate(() => window.skipEvents.some(event => event.type === 'AdStarted'))).toBe(true)
    await expect.poll(() => page.evaluate(() => [...document.querySelectorAll('video')].some(video => video.currentSrc.includes('/test/pattern.mp4?skippable=1') && video.videoWidth > 0 && video.currentTime > 0))).toBe(true)
    expect(await page.evaluate(() => window.art.template.$video.paused)).toBe(true)
    await testInfo.attach('native-vast-before-skip.png', { contentType: 'image/png', body: await page.screenshot() })
    await expect.poll(() => page.evaluate(() => window.skipEvents.some(event => event.type === 'AdSkippableStateChanged'))).toBe(true)
    let skipButton
    await expect.poll(async () => {
      for (const frame of page.frames()) {
        const button = frame.getByRole('button', { name: /skip ad/i })
        if (await button.count() === 1 && await button.isVisible() && await button.isEnabled()) {
          skipButton = button
          return true
        }
      }
      return false
    }).toBe(true)
    await testInfo.attach('native-vast-skip-button.png', { contentType: 'image/png', body: await page.screenshot() })
    await skipButton.click()
    await expect.poll(() => page.evaluate(() => window.skipEvents.filter(event => event.type === 'AdSkipped').length)).toBe(1)
    await expect.poll(() => page.evaluate(() => window.skipEvents.some(event => event.type === 'AdContentResumeRequested'))).toBe(true)
    await expect(page.locator('[id^="art-"]')).toBeHidden()
    await expect.poll(() => page.evaluate(() => window.art.currentTime)).toBeGreaterThan(beforeAd + 0.2)
    const state = await page.evaluate(() => ({ events: window.skipEvents, time: window.art.currentTime, paused: window.art.template.$video.paused, imaVersion: window.google.ima.VERSION }))
    expect(state.paused).toBe(false)
    expect(state.events.filter(event => event.type === 'AdError' || event.type === 'AdComplete')).toEqual([])
    await testInfo.attach('native-vast-skip', { contentType: 'application/json', body: JSON.stringify({ sourceSha256: hash(code), xmlSha256: hash(xml), mediaSha256: hash(fs.readFileSync('test/browser/media/pattern.mp4')), compatibility: compatibility || 'npm-default', beforeAd, ...state }) })
    await page.evaluate(() => window.art.destroy())
    await expect(page.locator('[id^="art-"]')).toHaveCount(0)
  })
}

test.afterEach(async ({ page }, testInfo) => {
  await testInfo.attach('native-vast-skip-final', { contentType: 'application/json', body: JSON.stringify(await page.evaluate(() => ({ events: window.skipEvents, imaVersion: window.google?.ima?.VERSION, videos: [...document.querySelectorAll('video')].map(video => ({ src: video.currentSrc, time: video.currentTime, width: video.videoWidth, paused: video.paused })) }))) })
  for (const [index, frame] of page.frames().entries()) {
    if (frame !== page.mainFrame())
      await testInfo.attach(`native-vast-frame-${index}`, { contentType: 'text/plain', body: await frame.locator('body').ariaSnapshot().catch(error => String(error)) })
  }
  await page.evaluate(() => window.art?.destroy())
})
