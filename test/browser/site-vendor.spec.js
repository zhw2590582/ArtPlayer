import { createHash } from 'node:crypto'
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
  const provenance = JSON.parse(fs.readFileSync('refactor/baselines/site-codicons-provenance.json', 'utf8'))
  const font = await request.get(`/${provenance.fontPath.slice('docs/'.length)}`)
  expect(font.status()).toBe(200)
  expect(createHash('sha256').update(await font.body()).digest('hex')).toBe(provenance.comparisons[0].fontSha256)
  const index = await request.get('/THIRD_PARTY_NOTICES.md')
  expect(index.status()).toBe(200)
  expect(await index.text()).toContain('Included component: @vscode/codicons 0.0.26')
  expect(await index.text()).toContain('Included component: console-feed 3.2.2')
  expect(await index.text()).toContain('Included component: chromium-string-utils')
  expect(await index.text()).toContain('Included component: @babel/runtime (react-inspector embedded) 7.13.10')
  expect(await index.text()).toContain('Included component: regenerator-runtime 0.13.7')
  expect(await index.text()).toContain('Included component: simple-html-tokenizer git-04799f4638ec5ed903a4e5aa6e832269fa59be6b')
  expect(await index.text()).toContain('Embedded attribution review is still incomplete')
  await page.evaluate(() => {
    window.vConsole.destroy()
    window.art.destroy()
  })
  await expect(page.locator('#__vconsole')).toHaveCount(0)
})
