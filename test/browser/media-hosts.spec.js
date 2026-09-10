import { createHash } from 'node:crypto'
import fs from 'node:fs'
import { expect, test } from './fixtures.js'

const proxyFile = new URL('../../docs/compiled/artplayer-proxy-canvas.js', import.meta.url)
const proxyCode = fs.readFileSync(proxyFile, 'utf8')

for (const core of ['published', 'candidate']) {
  test(`${core}: existing canvas proxy keeps media identity, playback and layout`, async ({ page }, testInfo) => {
    await page.goto(`/test/player.html?core=${core}&chapter=published`)
    await page.addScriptTag({ content: proxyCode })
    await testInfo.attach('canvas-proxy-artifact', { contentType: 'application/json', body: JSON.stringify({
      kind: 'existing-workspace-artifact',
      file: 'docs/compiled/artplayer-proxy-canvas.js',
      sha256: createHash('sha256').update(proxyCode).digest('hex'),
    }) })
    await page.evaluate(() => {
      const container = document.createElement('div')
      Object.assign(container.style, { width: '640px', height: '360px' })
      document.body.append(container)
      window.draws = 0
      window.art = new window.Artplayer({
        container,
        url: '/test/pattern.mp4',
        muted: true,
        proxy: window.artplayerProxyCanvas(() => window.draws++),
      })
    })
    await expect.poll(() => page.evaluate(() => window.art.isReady)).toBe(true)
    const initial = await page.evaluate(() => {
      const art = window.art
      return { canvas: art.video instanceof HTMLCanvasElement, native: art.video instanceof HTMLVideoElement, same: art.video === art.template.$video, duration: art.duration, width: art.width, rectWidth: art.rect.width }
    })
    expect(initial).toEqual({ canvas: true, native: false, same: true, duration: 8, width: 640, rectWidth: 640 })
    await page.evaluate(() => window.art.play())
    await expect.poll(() => page.evaluate(() => window.art.currentTime)).toBeGreaterThan(0.1)
    await expect.poll(() => page.evaluate(() => window.draws)).toBeGreaterThan(0)
    expect(await page.evaluate(() => window.art.playing)).toBe(true)
    await page.evaluate(() => window.art.pause())
    expect(await page.evaluate(() => window.art.playing)).toBe(false)
    await page.evaluate(() => {
      window.art.seek = 2
    })
    await expect.poll(() => page.evaluate(() => window.art.currentTime)).toBeCloseTo(2, 1)
    const layout = await page.evaluate(() => {
      const art = window.art
      art.template.$container.style.width = '480px'
      return { width: art.width, x: art.x, expectedX: art.rect.left + window.pageXOffset }
    })
    expect(layout.width).toBe(480)
    expect(layout.x).toBe(layout.expectedX)
    await page.evaluate(() => window.art.destroy())
  })
}
