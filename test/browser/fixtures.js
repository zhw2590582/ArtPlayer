import process from 'node:process'
import { test as base, expect } from '@playwright/test'

export const test = base.extend({
  diagnostics: [async ({ page, browser, request }, use, testInfo) => {
    const errors = []
    const consoleErrors = []
    const failedRequests = []
    page.on('pageerror', error => errors.push(error.message))
    page.on('console', (message) => {
      if (message.type() === 'error')
        consoleErrors.push(message.text())
    })
    page.on('requestfailed', request => failedRequests.push({ url: request.url(), resourceType: request.resourceType(), failure: request.failure() }))
    await use({ errors, consoleErrors, failedRequests })
    const manifest = await (await request.get('/test/manifest.json')).json()
    const state = page.isClosed()
      ? null
      : await page.evaluate(() => {
          const video = document.querySelector('video')
          return {
            url: location.href,
            userAgent: navigator.userAgent,
            events: window.events,
            media: video ? { source: video.currentSrc, width: video.videoWidth, height: video.videoHeight, duration: video.duration, currentTime: video.currentTime, error: video.error?.code } : null,
          }
        }).catch(() => null)
    await testInfo.attach('browser-evidence', { contentType: 'application/json', body: JSON.stringify({ browser: browser.version(), platform: process.platform, manifest, state, errors, consoleErrors, failedRequests }, null, 2) })
    expect(errors, 'Unhandled browser errors').toEqual([])
  }, { auto: true }],
})

export { expect }
