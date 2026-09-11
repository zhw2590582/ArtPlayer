import assert from 'node:assert/strict'
import fs from 'node:fs'
import process from 'node:process'
import { ensureArchive, hash, readMember } from '../../refactor/scripts/releases.mjs'
import { compilePackage } from '../helpers/load.js'
import { expect, test } from './fixtures.js'

let published
let candidate
let release

test.beforeAll(async () => {
  release = JSON.parse(fs.readFileSync(new URL('../../refactor/baselines/ads-release.json', import.meta.url))).release
  const member = `package/${release.manifest.main}`
  const bytes = readMember(await ensureArchive(release), member)
  assert.equal(hash(bytes), release.files[member])
  published = bytes.toString()
  candidate = process.env.ARTPLAYER_ADS_ARTIFACT
    ? fs.readFileSync(process.env.ARTPLAYER_ADS_ARTIFACT, 'utf8')
    : await compilePackage('artplayer-plugin-ads', 'umd')
})

test.afterEach(async ({ page }, testInfo) => {
  const state = await page.evaluate(() => {
    const ad = document.querySelector('.artplayer-plugin-ads-video')
    return {
      events: window.adsEvents,
      rejected: window.adsRejected,
      ad: ad && { time: ad.currentTime, paused: ad.paused, width: ad.videoWidth, height: ad.videoHeight, error: ad.error?.code },
      content: window.art && { time: window.art.currentTime, paused: window.art.video.paused, destroyed: window.art.isDestroy },
    }
  })
  await testInfo.attach('ads-state', { contentType: 'application/json', body: JSON.stringify(state) })
  await page.evaluate(() => {
    // Historical skip/destroy do not cancel their countdown. Explicit pause prevents
    // fixture teardown from masking the behavior asserted by a different test.
    window.art?.plugins.artplayerPluginAds?.pause()
    if (window.art && !window.art.isDestroy)
      window.art.destroy()
  })
})

async function openAds(page, core, plugin, option, testInfo) {
  await page.goto(`/test/player.html?core=${core}`)
  const code = plugin === 'published' ? published : candidate
  await page.addScriptTag({ content: code })
  await testInfo.attach('ads-inputs', { contentType: 'application/json', body: JSON.stringify({ core, plugin, release: plugin === 'published' ? release : undefined, sha256: hash(code), artifact: plugin === 'candidate' ? process.env.ARTPLAYER_ADS_ARTIFACT || 'workspace source build' : undefined }) })
  await page.evaluate((option) => {
    window.adsEvents = []
    window.art = new window.Artplayer({
      container: '.player',
      url: '/test/pattern.mp4',
      muted: true,
      plugins: [window.artplayerPluginAds(option)],
    })
    window.art.on('artplayerPluginAds:skip', value => window.adsEvents.push({ name: 'skip', option: value }))
    window.art.on('artplayerPluginAds:click', value => window.adsEvents.push({ name: 'click', option: value }))
    document.querySelector('#play').onclick = () => window.art.play()
  }, option)
  await expect.poll(() => page.evaluate(() => window.art.isReady)).toBe(true)
  await expect(page.locator('.artplayer-plugin-ads')).toHaveCount(0)
  await page.locator('#play').click()
}

for (const core of ['published', 'candidate']) {
  for (const plugin of ['published', 'candidate']) {
    const label = `${core} core / ${plugin} Ads`

    test(`${label}: real image HTML, skip threshold and resumed content`, async ({ page }, testInfo) => {
      await openAds(page, core, plugin, { html: '<img alt="Ad artwork" src="/test/thumbnail-grid.svg">', playDuration: 2, totalDuration: 8 }, testInfo)
      const root = page.locator('.artplayer-plugin-ads')
      await expect(root).toBeVisible()
      await expect.poll(() => page.locator('img[alt="Ad artwork"]').evaluate(image => image.complete && image.naturalWidth > 0)).toBe(true)
      expect(await page.evaluate(() => window.art.video.paused)).toBe(true)
      await page.locator('.artplayer-plugin-ads-close').click()
      expect(await page.evaluate(() => window.adsEvents.filter(event => event.name === 'skip').length)).toBe(0)
      await expect(page.locator('.artplayer-plugin-ads-close')).toHaveText('关闭广告')
      await page.locator('.artplayer-plugin-ads-close').click()
      await expect(root).toBeHidden()
      await expect.poll(() => page.evaluate(() => window.art.currentTime)).toBeGreaterThan(0.3)
      expect(await page.evaluate(() => window.adsEvents.filter(event => event.name === 'skip').length)).toBe(1)
      await testInfo.attach('ads-image-completed', { contentType: 'image/png', body: await page.screenshot() })
    })

    test(`${label}: real video decodes, mute toggles and countdown completion restores content`, async ({ page }, testInfo) => {
      await openAds(page, core, plugin, { video: '/test/pattern.mp4', html: 'unused', muted: true, playDuration: 5, totalDuration: 3 }, testInfo)
      const ad = page.locator('.artplayer-plugin-ads-video')
      await expect.poll(() => ad.evaluate(video => video.currentTime)).toBeGreaterThan(0.2)
      expect(await ad.evaluate(video => ({ paused: video.paused, muted: video.muted }))).toEqual({ paused: false, muted: true })
      // Windows WebKit reports layout-sized videoWidth; sample actual decoded colors.
      const pixels = await ad.evaluate((video) => {
        const canvas = document.createElement('canvas')
        canvas.width = 80
        canvas.height = 45
        const context = canvas.getContext('2d')
        context.drawImage(video, 0, 0, 80, 45)
        return [30, 45, 75].map(x => [...context.getImageData(x, 2, 1, 1).data])
      })
      expect(pixels[0][0]).toBeGreaterThan(180)
      expect(pixels[0][1]).toBeGreaterThan(180)
      expect(pixels[0][2]).toBeLessThan(80)
      expect(pixels[1][0]).toBeLessThan(80)
      expect(pixels[1][2]).toBeGreaterThan(180)
      expect(pixels[2][1]).toBeGreaterThan(180)
      expect(pixels[2][2]).toBeGreaterThan(180)
      await testInfo.attach('ads-decoded-pixels', { contentType: 'application/json', body: JSON.stringify(pixels) })
      await expect(page.locator('.artplayer-plugin-ads-html')).toHaveCount(0)
      await expect(page.locator('.artplayer-plugin-ads-close')).toBeHidden()
      await page.locator('.artplayer-plugin-ads-muted').click()
      expect(await ad.evaluate(video => video.muted)).toBe(false)
      await page.locator('.artplayer-plugin-ads-muted').click()
      await testInfo.attach('ads-video-playing', { contentType: 'image/png', body: await page.screenshot() })
      await expect(page.locator('.artplayer-plugin-ads')).toBeHidden()
      expect(await ad.evaluate(video => video.paused)).toBe(true)
      await expect.poll(() => page.evaluate(() => window.art.currentTime)).toBeGreaterThan(0.3)
      expect(await page.evaluate(() => window.adsEvents.filter(event => event.name === 'skip').length)).toBe(1)
    })

    test(`${label}: actual missing ad media fails open to playable content`, async ({ page }, testInfo) => {
      await page.route('**/missing-ad.mp4', route => route.fulfill({ status: 404, body: '' }))
      await openAds(page, core, plugin, { video: '/missing-ad.mp4', muted: true }, testInfo)
      await expect.poll(() => page.evaluate(() => window.adsEvents.filter(event => event.name === 'skip').length)).toBe(1)
      expect(await page.locator('.artplayer-plugin-ads-video').evaluate(video => video.error?.code)).toBe(4)
      await expect(page.locator('.artplayer-plugin-ads')).toBeHidden()
      await expect.poll(() => page.evaluate(() => window.art.currentTime)).toBeGreaterThan(0.3)
    })

    test(`${label}: countdown pause resumes once and source replacement does not replay ads`, async ({ page }, testInfo) => {
      await openAds(page, core, plugin, { html: 'one preroll', playDuration: 1, totalDuration: 8 }, testInfo)
      await expect(page.locator('.artplayer-plugin-ads')).toBeVisible()
      await page.evaluate(() => window.art.plugins.artplayerPluginAds.pause())
      const count = await page.locator('.artplayer-plugin-ads-countdown').textContent()
      // A real clock observation specifically checks that pause stops countdown.
      await page.waitForTimeout(1200)
      await expect(page.locator('.artplayer-plugin-ads-countdown')).toHaveText(count)
      await page.evaluate(() => window.art.plugins.artplayerPluginAds.play())
      await expect(page.locator('.artplayer-plugin-ads-countdown')).not.toHaveText(count)
      await page.evaluate(() => {
        window.art.plugins.artplayerPluginAds.pause()
        window.art.plugins.artplayerPluginAds.skip()
      })
      await expect.poll(() => page.evaluate(() => window.art.currentTime)).toBeGreaterThan(0.3)
      await page.evaluate(() => window.art.switchUrl('/test/pattern.mp4?replacement=1'))
      await page.locator('#play').click()
      await expect.poll(() => page.evaluate(() => window.art.currentTime)).toBeGreaterThan(0.3)
      await expect(page.locator('.artplayer-plugin-ads')).toHaveCount(1)
      await expect(page.locator('.artplayer-plugin-ads')).toBeHidden()
      expect(await page.evaluate(() => window.adsEvents.filter(event => event.name === 'skip').length)).toBe(1)
    })
  }

  test(`${core} core / published Ads historical: rejected ad play leaks a rejection while timer continues`, async ({ page }, testInfo) => {
    await page.addInitScript(() => {
      window.adsRejected = []
      window.addEventListener('unhandledrejection', (event) => {
        if (event.reason?.message === 'Ads test controlled NotAllowedError') {
          window.adsRejected.push({ name: event.reason.name, message: event.reason.message })
          event.preventDefault()
        }
      })
      const play = HTMLMediaElement.prototype.play
      HTMLMediaElement.prototype.play = function () {
        if (this.classList.contains('artplayer-plugin-ads-video'))
          return Promise.reject(new DOMException('Ads test controlled NotAllowedError', 'NotAllowedError'))
        return play.call(this)
      }
    })
    await openAds(page, core, 'published', { video: '/test/pattern.mp4', muted: true, totalDuration: 2 }, testInfo)
    await expect.poll(() => page.evaluate(() => window.adsRejected)).toEqual([{ name: 'NotAllowedError', message: 'Ads test controlled NotAllowedError' }])
    expect(await page.locator('.artplayer-plugin-ads-video').evaluate(video => video.paused)).toBe(true)
    await expect(page.locator('.artplayer-plugin-ads')).toBeHidden()
    await expect.poll(() => page.evaluate(() => window.art.currentTime)).toBeGreaterThan(0.3)
  })

  test(`${core} core / published Ads historical: rejected content restoration hides ad and leaks rejection`, async ({ page }, testInfo) => {
    await page.addInitScript(() => {
      window.adsRejected = []
      window.addEventListener('unhandledrejection', (event) => {
        if (event.reason?.message === 'Ads test controlled content rejection') {
          window.adsRejected.push({ name: event.reason.name, message: event.reason.message })
          event.preventDefault()
        }
      })
      const play = HTMLMediaElement.prototype.play
      HTMLMediaElement.prototype.play = function () {
        if (this === window.art?.video && document.querySelector('.artplayer-plugin-ads'))
          return Promise.reject(new DOMException('Ads test controlled content rejection', 'NotAllowedError'))
        return play.call(this)
      }
    })
    await openAds(page, core, 'published', { html: 'ad', totalDuration: 1 }, testInfo)
    await expect.poll(() => page.evaluate(() => window.adsRejected)).toEqual([{ name: 'NotAllowedError', message: 'Ads test controlled content rejection' }])
    await expect(page.locator('.artplayer-plugin-ads')).toBeHidden()
    expect(await page.evaluate(() => window.art.video.paused)).toBe(true)
    expect(await page.evaluate(() => window.adsEvents.filter(event => event.name === 'skip').length)).toBe(1)
  })

  test(`${core} core / published Ads historical: zero threshold advertises skip before accepting click`, async ({ page }, testInfo) => {
    await openAds(page, core, 'published', { html: 'ad', playDuration: 0, totalDuration: 5 }, testInfo)
    const close = page.locator('.artplayer-plugin-ads-close')
    await expect(close).toBeVisible()
    // Freeze only the countdown after real initialization; this is a button contract.
    await page.evaluate(() => window.art.plugins.artplayerPluginAds.pause())
    await expect(close).toHaveText('关闭广告')
    await close.click()
    await expect(page.locator('.artplayer-plugin-ads')).toBeVisible()
    expect(await page.evaluate(() => window.adsEvents.filter(event => event.name === 'skip').length)).toBe(0)
    await page.evaluate(() => window.art.plugins.artplayerPluginAds.play())
    await expect(page.locator('.artplayer-plugin-ads-countdown')).not.toHaveText('5秒')
    await close.click()
    await expect(page.locator('.artplayer-plugin-ads')).toBeHidden()
    expect(await page.evaluate(() => window.adsEvents.filter(event => event.name === 'skip').length)).toBe(1)
  })
}
