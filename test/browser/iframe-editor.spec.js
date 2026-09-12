import fs from 'node:fs'
import { hash } from '../../refactor/scripts/releases.mjs'
import { iframeCandidate } from '../helpers/iframe.js'
import { expect, test } from './fixtures.js'

const candidate = await iframeCandidate()

test('Iframe docs editor Run releases the previous tool and its pending requests', async ({ page }, testInfo) => {
  await page.route('https://pagead2.googlesyndication.com/**', route => route.fulfill({ contentType: 'text/javascript', body: '' }))
  await page.route('**/uncompiled/artplayer-tool-iframe/index.js', route => route.fulfill({
    contentType: 'text/javascript',
    body: `${candidate.code}\nif (window === window.top) {
      window.demoTools = [];
      window.ArtplayerToolIframe = class extends window.ArtplayerToolIframe {
        constructor(option) { super(option); window.demoTools.push(this); }
      };
    }`,
  }))
  await page.goto('/?libs=./uncompiled/artplayer-tool-iframe/index.js&example=iframe')
  await expect.poll(() => page.evaluate(() => window.demoTools?.length)).toBe(1)
  const firstFrame = page.frames().find(frame => frame.url().endsWith('/iframe.html'))
  await expect.poll(() => firstFrame.evaluate(() => window.Artplayer?.instances[0]?.isReady)).toBe(true)
  await page.evaluate(() => {
    window.demoTools[0].commit(() => {
      const art = window.Artplayer.instances[0]
      art.fullscreenWeb = true
    })
  })
  await expect(page.locator('iframe')).toHaveClass('fullscreenWeb')
  await firstFrame.locator('.art-video-player').hover()
  await firstFrame.locator('.art-control-fullscreenWeb').click()
  await expect(page.locator('iframe')).not.toHaveClass('fullscreenWeb')
  await page.evaluate(() => {
    window.pendingSettlement = 'pending'
    window.demoTools[0].commit((resolve) => {
      window.finishPendingDemo = () => resolve(1)
    }).then(() => window.pendingSettlement = 'resolved', () => window.pendingSettlement = 'rejected')
  })
  await page.locator('.run').click()
  await expect.poll(() => page.evaluate(() => window.demoTools.length)).toBe(2)
  await expect.poll(() => page.evaluate(() => window.demoTools[0].destroyed)).toBe(true)
  await expect.poll(() => page.evaluate(() => window.pendingSettlement)).toBe('rejected')
  await expect(page.locator('iframe')).not.toHaveClass('fullscreenWeb')
  const secondFrame = page.frames().find(frame => frame.url().endsWith('/iframe.html'))
  await expect.poll(() => secondFrame.evaluate(() => window.Artplayer?.instances[0]?.isReady)).toBe(true)
  await page.locator('.run').click()
  await expect.poll(() => page.evaluate(() => window.demoTools.length)).toBe(3)
  expect(await page.evaluate(() => window.demoTools.map(tool => tool.destroyed))).toEqual([true, true, false])
  await page.evaluate(() => {
    const model = window.monaco.editor.getModels().find(model => model.getLanguageId() === 'javascript')
    model.setValue(`
      document.querySelector('.artplayer-app').innerHTML = '<div class="first"></div><div class="second"></div>';
      window.parentPlayers = ['.first', '.second'].map(container => new Artplayer({ container, url: '/test/pattern.mp4' }));
    `)
    const url = new URL(location.href)
    url.searchParams.delete('example')
    history.replaceState(null, '', url)
  })
  await page.locator('.run').click()
  await expect.poll(() => page.evaluate(() => window.Artplayer.instances.length)).toBe(2)
  expect(await page.evaluate(() => window.demoTools.every(tool => tool.destroyed))).toBe(true)
  await page.evaluate(() => {
    window.previousPlayers = window.parentPlayers
    window.monaco.editor.getModels().find(model => model.getLanguageId() === 'javascript').setValue('window.exampleFinished = true')
  })
  await page.locator('.run').click()
  await expect.poll(() => page.evaluate(() => window.exampleFinished)).toBe(true)
  expect(await page.evaluate(() => window.Artplayer.instances.length)).toBe(0)
  expect(await page.evaluate(() => window.previousPlayers.every(art => art.isDestroy))).toBe(true)
  await testInfo.attach('iframe-editor', { contentType: 'application/json', body: JSON.stringify({ candidateSha256: hash(candidate.code), files: Object.fromEntries(['docs/index.html', 'docs/iframe.html', 'docs/assets/example/iframe.js', 'docs/assets/js/common.js'].map(file => [file, hash(fs.readFileSync(file))])), scope: 'Actual docs index, local Monaco and Run button. Only the iframe constructor is observed through a test subclass; external advertising script is stubbed in this test only. No physical-device/BFCache claim.' }) })
  await page.evaluate(() => window.demoTools.forEach(tool => tool.destroy()))
})
