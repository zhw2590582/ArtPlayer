import { test as base, expect } from '@playwright/test'
import { hash } from '../../refactor/scripts/releases.mjs'

export const test = base.extend({
  diagnostics: [async ({ page, browser, request, browserName }, use, testInfo) => {
    const errors = []
    const misses = []
    let stopLoading = () => page.evaluate(() => window.stop())
    const failedRequests = []
    page.on('requestfailed', request => failedRequests.push({ url: request.url(), failure: request.failure() }))
    page.on('pageerror', error => errors.push(error.message))
    if (browserName === 'chromium') {
      const session = await page.context().newCDPSession(page)
      await session.send('Page.enable')
      stopLoading = () => session.send('Page.stopLoading')
      session.on('Page.backForwardCacheNotUsed', event => misses.push(event))
    }
    await use({ misses, stopLoading })
    const manifest = await (await request.get('/manifest.json')).json()
    await testInfo.attach('history-environment', { contentType: 'application/json', body: JSON.stringify({ browser: browser.version(), stopMethod: browserName === 'chromium' ? 'CDP Page.stopLoading' : 'top window.stop()', manifest, errors, misses, failedRequests }) })
    expect(errors).toEqual([])
  }, { auto: true }],
})

export async function initialize(page, core, relation, testInfo) {
  const id = hash(`${testInfo.title}/${testInfo.project.name}/${testInfo.workerIndex}`).slice(0, 16)
  await page.goto(`/parent.html?core=${core}&relation=${relation}&case=${id}&epoch=1`)
  await expect.poll(() => page.evaluate(() => window.tool.injected)).toBe(true)
  await expect.poll(() => page.evaluate(() => window.tool.commit(() => {
    return window.art.video.readyState >= 2
  }))).toBe(true)
  await page.evaluate(() => {
    window.track('old', window.tool.commit((resolve) => {
      window.finishHeld = () => resolve(9)
    }))
  })
  await expect.poll(() => page.evaluate(() => window.tool.commit(() => {
    return typeof window.finishHeld
  }))).toBe('function')
  return id
}

export { expect }
