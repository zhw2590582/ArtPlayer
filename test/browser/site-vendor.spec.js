import fs from 'node:fs'
import { expect, test } from './fixtures.js'

test('mobile vConsole shows logs and upstream site notice texts are served unchanged', async ({ page, request }, testInfo) => {
  await page.route('https://**/*', route => route.fulfill({ status: 200, body: '' }))
  const code = 'window.art = new Artplayer({container:".artplayer-app",url:"/test/pattern.mp4",muted:true}); console.log("site-vendor-verified-message");'
  await page.goto(`/mobile.html?code=${encodeURIComponent(code)}`)
  await page.waitForFunction(() => window.art?.isReady && window.vConsole)
  await page.locator('.art-control-playAndPause').click()
  await expect.poll(() => page.evaluate(() => window.art.currentTime)).toBeGreaterThan(0.2)
  await page.locator('#__vconsole .vc-switch').click()
  await expect(page.locator('#__vconsole').getByText('site-vendor-verified-message', { exact: true })).toBeVisible()
  const manifest = JSON.parse(fs.readFileSync('scripts/site-vendor/manifest.json', 'utf8'))
  const notices = []
  for (const group of manifest.groups) {
    for (const notice of group.notices) {
      const response = await request.get(`/${notice.target.slice('docs/'.length)}`)
      expect(response.status()).toBe(200)
      expect(await response.body()).toEqual(fs.readFileSync(notice.source))
      notices.push({ component: group.name, version: group.version, url: response.url(), sha256: notice.sha256 })
    }
  }
  await testInfo.attach('verified-vendor-notices', { contentType: 'application/json', body: JSON.stringify(notices) })
  await page.evaluate(() => {
    window.vConsole.destroy()
    window.art.destroy()
  })
  await expect(page.locator('#__vconsole')).toHaveCount(0)
})
