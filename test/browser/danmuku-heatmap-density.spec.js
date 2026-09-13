import fs from 'node:fs'
import process from 'node:process'
import { hash } from '../../refactor/scripts/releases.mjs'
import { compilePackage } from '../helpers/load.js'
import { expect, test } from './fixtures.js'

let candidate
test.beforeAll(async () => {
  candidate = process.env.ARTPLAYER_DANMUKU_ARTIFACT
    ? fs.readFileSync(process.env.ARTPLAYER_DANMUKU_ARTIFACT, 'utf8')
    : await compilePackage('artplayer-plugin-danmuku', 'umd')
})

for (const core of ['published', 'candidate']) {
  for (const distribution of ['uniform', 'clustered', 'mixed']) {
    test(`${core}: #958 ${distribution} 16000-row heatmap remains below 25px during playback and resize`, async ({ page }, testInfo) => {
      await page.goto(`/test/player.html?core=${core}`)
      await page.addScriptTag({ content: candidate })
      await page.evaluate(() => window.createPlayer('/test/pattern.mp4'))
      await page.click('#play')
      await expect.poll(() => page.evaluate(() => window.art.video.currentTime)).toBeGreaterThan(0.1)
      await page.click('#pause')
      await page.evaluate(async (distribution) => {
        const art = window.art
        const rows = Array.from({ length: 16000 }, (_, index) => ({
          text: `density-${index}`,
          time: distribution === 'clustered' ? art.duration / 2 : distribution === 'mixed' && index < 8000 ? art.duration / 2 : (index + 0.5) * art.duration / 16000,
        }))
        art.plugins.add(window.artplayerPluginDanmuku({ danmuku: [], heatmap: true, visible: false, emitter: false }))
        window.densityPlugin = art.plugins.artplayerPluginDanmuku
        window.densityOwner = await window.densityPlugin.load(rows)
        art.controls.show = true
      }, distribution)
      const before = await page.evaluate(() => ({
        time: window.art.video.currentTime,
        offset: window.art.controls.heatmap.querySelector('#heatmap-start').getAttribute('offset'),
      }))
      await page.click('#play')
      await expect.poll(() => page.evaluate(() => window.art.video.currentTime)).toBeGreaterThan(before.time + 0.1)
      await expect.poll(() => page.evaluate(() => window.art.controls.heatmap.querySelector('#heatmap-start').getAttribute('offset'))).not.toBe(before.offset)
      await page.click('#pause')
      const observations = []
      for (const width of [640, 400]) {
        const observation = await page.evaluate((width) => {
          const art = window.art
          art.template.$container.style.width = `${width}px`
          art.emit('resize')
          art.emit('setBar', 'played', 0.4)
          const control = art.controls.heatmap
          const path = control.querySelector('path')
          const box = path.getBBox()
          const pixels = path.getBoundingClientRect()
          return {
            width: control.offsetWidth,
            height: control.offsetHeight,
            box: { x: box.x, y: box.y, width: box.width, height: box.height },
            pixels: { x: pixels.x, y: pixels.y, width: pixels.width, height: pixels.height },
            path: path.getAttribute('d'),
            progress: control.querySelector('#heatmap-start').getAttribute('offset'),
            rows: window.densityOwner.queue.length,
            decoded: { width: art.video.videoWidth, time: art.video.currentTime },
          }
        }, width)
        observations.push(observation)
        expect(observation.rows).toBe(16000)
        expect(observation.height).toBe(100)
        expect(observation.box.y).toBeGreaterThanOrEqual(75 - 0.001)
        expect(observation.box.height).toBeLessThanOrEqual(25 + 0.001)
        expect(observation.pixels.height).toBeGreaterThan(0)
        expect(observation.pixels.width).toBeGreaterThan(0)
        expect(observation.pixels.height).toBeLessThanOrEqual(25 + 0.01)
        expect(observation.box.y + observation.box.height).toBeLessThanOrEqual(100 + 0.001)
        expect(observation.progress).toBe('40%')
        expect(observation.decoded.width).toBeGreaterThan(0)
      }
      await testInfo.attach('heatmap-density-evidence', { contentType: 'application/json', body: JSON.stringify({ core, distribution, candidateSha256: hash(candidate), observations }) })
      await testInfo.attach('heatmap-density-page', { contentType: 'image/png', body: await page.screenshot() })
      await page.evaluate(() => window.art.destroy(false))
      await expect(page.locator('.art-control-heatmap')).toHaveCount(0)
    })
  }
}
