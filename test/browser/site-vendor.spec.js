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
  const attributionPath = '/licenses/console/react-pure-render/ATTRIBUTION.md'
  const attribution = await request.get(attributionPath)
  expect(attribution.status()).toBe(200)
  const localLinks = [...(await attribution.text()).matchAll(/\]\((\.\.?\/[^)]+)\)/g)]
  expect(localLinks).toHaveLength(2)
  for (const [, target] of localLinks)
    expect(notices.map(notice => notice.url)).toContain(new URL(target, attribution.url()).href)
  await testInfo.attach('verified-vendor-notices', { contentType: 'application/json', body: JSON.stringify(notices) })
  const provenance = JSON.parse(fs.readFileSync('refactor/baselines/site-codicons-provenance.json', 'utf8'))
  const font = await request.get(`/${provenance.fontPath.slice('docs/'.length)}`)
  expect(font.status()).toBe(200)
  expect(createHash('sha256').update(await font.body()).digest('hex')).toBe(provenance.comparisons[0].fontSha256)
  const index = await request.get('/THIRD_PARTY_NOTICES.md')
  expect(index.status()).toBe(200)
  expect(await index.text()).toContain('Included component: @vscode/codicons 0.0.26')
  expect(await index.text()).toContain('Included component: typescript (Monaco worker) 4.4.4')
  expect(await index.text()).toContain('Included component: console-feed 3.2.2')
  expect(await index.text()).toContain('Included component: react-pure-render (shallowequal origin) source commit 729cdbd')
  expect(await index.text()).toContain('Included component: chromium-string-utils')
  expect(await index.text()).toContain('Included component: @babel/runtime (react-inspector embedded) 7.13.10')
  expect(await index.text()).toContain('Included component: regenerator-runtime 0.13.7')
  expect(await index.text()).toContain('Included component: simple-html-tokenizer git-04799f4638ec5ed903a4e5aa6e832269fa59be6b')
  expect(await index.text()).toContain('Included component: replicator (console-feed fork)')
  expect(await index.text()).toContain('Included component: stylis (Emotion fork)')
  expect(await index.text()).toContain('Included component: murmurhash-js (Gary Court)')
  expect(await index.text()).toContain('Included component: murmurhash2 (Austin Appleby)')
  expect(await index.text()).toContain('stackoverflow-custom-stringify answer 48254637 revision 5 (CC BY-SA 4.0)')
  expect(await index.text()).toContain('The identified embedded-source and attribution review is complete for this frozen vendor boundary.')
  await page.evaluate(() => {
    window.vConsole.destroy()
    window.art.destroy()
  })
  await expect(page.locator('#__vconsole')).toHaveCount(0)
})
