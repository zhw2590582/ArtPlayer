import fs from 'node:fs'
import process from 'node:process'
import { hash } from '../../refactor/scripts/releases.mjs'
import { compilePackage } from '../helpers/load.js'
import { expect, test } from './fixtures.js'

let candidate
test.beforeAll(async () => {
  candidate = process.env.ARTPLAYER_ADS_ARTIFACT
    ? fs.readFileSync(process.env.ARTPLAYER_ADS_ARTIFACT, 'utf8')
    : await compilePackage('artplayer-plugin-ads', 'umd')
})

async function setup(page, core, testInfo, option = {}) {
  await page.goto(`/test/player.html?core=${core}`)
  await page.addScriptTag({ content: candidate })
  await testInfo.attach('ads-ui-inputs', { contentType: 'application/json', body: JSON.stringify({ core, artifact: process.env.ARTPLAYER_ADS_ARTIFACT || 'workspace source build', sha256: hash(candidate) }) })
  await page.evaluate((option) => {
    window.adsEvents = []
    window.art = new window.Artplayer({ container: '.player', url: '/test/pattern.mp4', muted: true, mutex: false, plugins: [window.artplayerPluginAds({ html: 'ad', totalDuration: 60, playDuration: 0, ...option })] })
    window.art.on('artplayerPluginAds:skip', () => window.adsEvents.push('skip'))
    document.querySelector('#play').onclick = () => window.art.play()
  }, option)
  await expect.poll(() => page.evaluate(() => window.art.isReady)).toBe(true)
}

test.afterEach(async ({ page }) => {
  await page.evaluate(() => {
    for (const art of [window.art, window.otherArt]) {
      if (art && !art.isDestroy)
        art.destroy()
    }
  })
})

async function fullscreenState(page, active) {
  await expect.poll(() => page.evaluate(() => Boolean(document.fullscreenElement || document.webkitFullscreenElement))).toBe(active)
  await expect.poll(() => page.evaluate(() => window.art.fullscreen)).toBe(active)
  const icons = page.locator('.artplayer-plugin-ads-fullscreen > *')
  await expect(icons).toHaveCount(2)
  await expect(icons.nth(active ? 1 : 0)).toBeVisible()
  await expect(icons.nth(active ? 0 : 1)).toBeHidden()
}

for (const core of ['published-4.5.5', 'published', 'candidate']) {
  test(`${core}: Ads initializes inside native fullscreen and follows external exit and its own button`, async ({ page }, testInfo) => {
    await setup(page, core, testInfo)
    const native = await page.evaluate(() => Boolean(document.fullscreenEnabled || document.webkitFullscreenEnabled))
    await testInfo.attach('ads-native-capability', { contentType: 'application/json', body: JSON.stringify({ native }) })
    expect(native, 'Native desktop fullscreen must be exercised, not simulated').toBe(true)
    await page.evaluate(() => {
      document.querySelector('#play').onclick = () => {
        window.art.fullscreen = true
      }
    })
    await page.locator('#play').click()
    await expect.poll(() => page.evaluate(() => (document.fullscreenElement || document.webkitFullscreenElement) === window.art.template.$player)).toBe(true)
    await page.evaluate(() => window.art.play())
    await fullscreenState(page, true)
    await expect(page.locator('.artplayer-plugin-ads')).toBeVisible()
    expect(await page.evaluate(() => (document.fullscreenElement || document.webkitFullscreenElement).contains(window.art.template.$ads))).toBe(true)
    await page.evaluate(() => {
      window.art.fullscreen = false
    })
    await fullscreenState(page, false)
    await page.locator('.artplayer-plugin-ads-fullscreen').click()
    await fullscreenState(page, true)
    await page.locator('.artplayer-plugin-ads-fullscreen').click()
    await fullscreenState(page, false)
    await testInfo.attach('ads-fullscreen-return', { contentType: 'image/png', body: await page.screenshot() })
    await page.locator('.artplayer-plugin-ads-close').click()
    await expect(page.locator('.artplayer-plugin-ads')).toBeHidden()
    await expect.poll(() => page.evaluate(() => window.art.currentTime)).toBeGreaterThan(0.2)
    expect(await page.evaluate(() => window.adsEvents)).toEqual(['skip'])
  })

  test(`${core}: two Ads players own independent decoded videos, mute state and destruction`, async ({ page }, testInfo) => {
    await setup(page, core, testInfo, { video: '/test/pattern.mp4', muted: true })
    await page.evaluate(() => {
      const container = document.createElement('div')
      container.className = 'other-player'
      container.style.cssText = 'width:320px;height:180px'
      document.body.append(container)
      window.otherArt = new window.Artplayer({ container, url: '/test/pattern.mp4', muted: true, mutex: false, plugins: [window.artplayerPluginAds({ video: '/test/pattern.mp4', muted: true, totalDuration: 60, playDuration: 0 })] })
      document.querySelector('#play').onclick = () => Promise.all([window.art.play(), window.otherArt.play()])
    })
    await expect.poll(() => page.evaluate(() => window.otherArt.isReady)).toBe(true)
    await page.locator('#play').click()
    for (const selector of ['.player', '.other-player']) {
      await expect.poll(() => page.locator(`${selector} .artplayer-plugin-ads-video`).evaluate(video => video.currentTime)).toBeGreaterThan(0.2)
      expect(await page.locator(`${selector} .artplayer-plugin-ads-video`).evaluate(video => video.readyState >= 2 && video.videoHeight > 0)).toBe(true)
    }
    await page.locator('.player .artplayer-plugin-ads-muted').click()
    expect(await page.locator('.player .artplayer-plugin-ads-video').evaluate(video => video.muted)).toBe(false)
    expect(await page.locator('.other-player .artplayer-plugin-ads-video').evaluate(video => video.muted)).toBe(true)
    const otherTime = await page.locator('.other-player .artplayer-plugin-ads-video').evaluate(video => video.currentTime)
    await page.evaluate(() => {
      window.retainedAd = window.art.template.$ads.querySelector('video')
      window.art.destroy(false)
    })
    await expect(page.locator('.player .artplayer-plugin-ads')).toHaveCount(0)
    expect(await page.evaluate(() => ({ src: window.retainedAd.getAttribute('src'), paused: window.retainedAd.paused }))).toEqual({ src: null, paused: true })
    await expect.poll(() => page.locator('.other-player .artplayer-plugin-ads-video').evaluate(video => video.currentTime)).toBeGreaterThan(otherTime + 0.2)
    await page.locator('.other-player .artplayer-plugin-ads-close').click()
    await expect.poll(() => page.evaluate(() => window.otherArt.currentTime)).toBeGreaterThan(0.2)
    expect(await page.evaluate(() => window.adsEvents)).toEqual([])
  })

  test(`${core}: Ads details use real popup navigation and translated controls stay within a narrow player`, async ({ page }, testInfo) => {
    await page.setViewportSize({ width: 390, height: 844 })
    await setup(page, core, testInfo, { url: '/test/player.html?ad-details=true', i18n: { close: 'Close ad', countdown: '%s seconds', detail: 'Details', canBeClosed: 'Wait %s seconds' } })
    await page.locator('.player').evaluate((element) => {
      element.style.width = '360px'
    })
    await page.evaluate(() => window.art.on('artplayerPluginAds:click', value => window.adsEvents.push(value.url)))
    await page.locator('#play').click()
    await expect(page.locator('.artplayer-plugin-ads-close')).toHaveText('Close ad')
    await expect(page.locator('.artplayer-plugin-ads-detail')).toHaveText('Details')
    const popupPromise = page.waitForEvent('popup')
    await page.locator('.artplayer-plugin-ads-detail').click()
    const popup = await popupPromise
    await popup.waitForLoadState('domcontentloaded')
    expect(new URL(popup.url()).searchParams.get('ad-details')).toBe('true')
    await popup.close()
    expect(await page.evaluate(() => window.adsEvents)).toEqual(['/test/player.html?ad-details=true'])
    const bounds = await page.locator('.artplayer-plugin-ads').evaluate((root) => {
      const parent = root.getBoundingClientRect()
      return [...root.querySelectorAll('.artplayer-plugin-ads-timer, .artplayer-plugin-ads-control')].every((element) => {
        const box = element.getBoundingClientRect()
        return box.left >= parent.left && box.right <= parent.right && box.top >= parent.top && box.bottom <= parent.bottom
      })
    })
    expect(bounds).toBe(true)
    await testInfo.attach('ads-narrow-layout', { contentType: 'image/png', body: await page.screenshot() })
  })
}
