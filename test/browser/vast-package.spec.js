import { browserCandidate } from '../helpers/browser-candidate.js'
import { expect, test } from './fixtures.js'

const candidate = await browserCandidate('artplayer-plugin-vast')
const sdkUrl = 'https://imasdk.googleapis.com/js/sdkloader/ima3.js'

async function setup(page, core, compatibility, testInfo) {
  const requests = []
  await page.route(sdkUrl, route => requests.push(route))
  await page.goto(`/test/player.html?core=${core}`)
  await page.addScriptTag({ content: candidate.code })
  await page.evaluate((compatibility) => {
    window.art = new window.Artplayer({ container: '.player', url: '/test/pattern.mp4', muted: true })
    window.vastCallbacks = 0
    window.vastListeners = new Set()
    window.vastSettlements = []
    const on = window.art.on
    const off = window.art.off
    window.art.on = function (name, listener) {
      if (name === 'destroy')
        window.vastListeners.add(listener)
      return on.call(this, name, listener)
    }
    window.art.off = function (name, listener) {
      if (name === 'destroy')
        window.vastListeners.delete(listener)
      return off.call(this, name, listener)
    }
    window.registerVast = () => {
      const plugin = window.artplayerPluginVast(() => window.vastCallbacks++, { compatibility })
      return window.art.plugins.add(plugin).then(
        () => window.vastSettlements.push({ status: 'resolved' }),
        error => window.vastSettlements.push({ status: 'rejected', error }),
      )
    }
    if (window.artplayerPluginVast.default !== window.artplayerPluginVast)
      throw new Error('Default factory alias changed')
  }, compatibility)
  await testInfo.attach('vast-package-inputs', { contentType: 'application/json', body: JSON.stringify({ core, compatibility: compatibility || 'npm-default', provenance: candidate.provenance, sdkUrl, scope: 'Complete normal bundle including glomex. Native script requests are held/failed or fulfilled with an inert readiness sentinel; no real Google IMA/ad playback claim.' }) })
  return requests
}

test.afterEach(async ({ page }, testInfo) => {
  const state = await page.evaluate(() => ({ callbacks: window.vastCallbacks, listeners: window.vastListeners?.size, destroyed: window.art?.isDestroy, settlements: window.vastSettlements?.map(({ status, error }) => ({ status, errorType: error?.type })), scripts: [...document.scripts].map(script => script.src).filter(src => src.includes('imasdk.googleapis.com')) }))
  await testInfo.attach('vast-package-state', { contentType: 'application/json', body: JSON.stringify(state) })
  await page.evaluate(() => {
    if (window.art && !window.art.isDestroy)
      window.art.destroy()
  })
})

for (const core of ['published-5.1.7', 'published', 'candidate']) {
  for (const compatibility of [undefined, 'workspace-1.2']) {
    test(`VAST package ${core}/${compatibility || 'npm-default'}: shared SDK failure rejects both registrations and permits another request`, async ({ page }, testInfo) => {
      const requests = await setup(page, core, compatibility, testInfo)
      await page.evaluate(() => {
        void window.registerVast()
        void window.registerVast()
      })
      await expect.poll(() => requests.length).toBe(1)
      expect(await page.evaluate(() => window.vastListeners.size)).toBe(2)
      await requests[0].abort('failed')
      await expect.poll(() => page.evaluate(() => window.vastSettlements.length)).toBe(2)
      expect(await page.evaluate(() => ({ statuses: window.vastSettlements.map(item => item.status), sameError: window.vastSettlements[0].error === window.vastSettlements[1].error, errorType: window.vastSettlements[0].error.type, callbacks: window.vastCallbacks, listeners: window.vastListeners.size }))).toEqual({ statuses: ['rejected', 'rejected'], sameError: true, errorType: 'error', callbacks: 0, listeners: 0 })
      await page.evaluate(() => {
        void window.registerVast()
      })
      await expect.poll(() => requests.length).toBe(2)
      await requests[1].abort('failed')
      await expect.poll(() => page.evaluate(() => window.vastSettlements.length)).toBe(3)
      expect(await page.evaluate(() => ({ status: window.vastSettlements[2].status, callbacks: window.vastCallbacks, listeners: window.vastListeners.size, registered: Boolean(window.art.plugins.artplayerPluginVast) }))).toEqual({ status: 'rejected', callbacks: 0, listeners: 0, registered: false })
      await expect(page.locator('.player video')).toHaveCount(1)
      await page.locator('video').evaluate(video => video.play())
      await expect.poll(() => page.locator('video').evaluate(video => video.currentTime)).toBeGreaterThan(0.2)
      const pixel = await page.locator('video').evaluate((video) => {
        const canvas = document.createElement('canvas')
        canvas.width = 80
        canvas.height = 45
        const context = canvas.getContext('2d')
        context.drawImage(video, 0, 0, 80, 45)
        return [...context.getImageData(30, 2, 1, 1).data]
      })
      expect(pixel[0]).toBeGreaterThan(180)
      expect(pixel[1]).toBeGreaterThan(180)
      expect(pixel[2]).toBeLessThan(80)
      await testInfo.attach('vast-package-content-frame', { contentType: 'application/json', body: JSON.stringify({ pixel }) })
    })

    test(`VAST package ${core}/${compatibility || 'npm-default'}: destroy before SDK readiness suppresses late callbacks and construction`, async ({ page }, testInfo) => {
      const requests = await setup(page, core, compatibility, testInfo)
      await page.evaluate(() => {
        void window.registerVast()
      })
      await expect.poll(() => requests.length).toBe(1)
      await page.evaluate(() => window.art.destroy())
      await expect(page.locator('.player')).toBeEmpty()
      expect(await page.evaluate(() => window.vastListeners.size)).toBe(0)
      await requests[0].fulfill({ contentType: 'text/javascript', body: 'window.google = { ima: { fixtureReady: true } };' })
      await expect.poll(() => page.evaluate(() => window.vastSettlements.map(item => item.status))).toEqual(['resolved'])
      expect(await page.evaluate(() => ({ callbacks: window.vastCallbacks, listeners: window.vastListeners.size, destroyed: window.art.isDestroy, sentinel: window.google.ima.fixtureReady }))).toEqual({ callbacks: 0, listeners: 0, destroyed: true, sentinel: true })
      await expect(page.locator('.player')).toBeEmpty()
      expect(requests).toHaveLength(1)
    })
  }
}
