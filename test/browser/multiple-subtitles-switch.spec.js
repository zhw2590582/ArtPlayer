import { hash } from '../../refactor/scripts/releases.mjs'
import { multipleSubtitlesCandidate, multipleSubtitlesHistorical } from '../helpers/multiple-subtitles.js'
import { expect, test } from './fixtures.js'

const candidate = await multipleSubtitlesCandidate()
const published = (await multipleSubtitlesHistorical()).find(item => item.name === 'published-1.2.0-main')
const variants = [null, candidate, published]

for (const core of ['published-5.3.0', 'published', 'candidate']) {
  for (const implementation of variants) {
    test(`Source seek ordering / ${core} / ${implementation?.name || 'no-plugin'}`, async ({ page, browser }, testInfo) => {
      await page.route('**/test/switch-caption.vtt', route => route.fulfill({ contentType: 'text/vtt', body: 'WEBVTT\n\n00:01.000 --> 00:03.000\nCaption\n' }))
      await page.goto(`/test/player.html?core=${core}`)
      if (implementation)
        await page.addScriptTag({ content: `(() => { const module = { exports: {} }; const exports = module.exports; ${implementation.code}; window.multipleFactory = module.exports.default || module.exports; })();` })
      await page.evaluate(() => {
        window.createPlayer('/test/pattern.mp4')
        const video = window.art.video
        window.switchTrace = []
        window.switchState = () => ({ time: video.currentTime, seeking: video.seeking, duration: video.duration, readyState: video.readyState, paused: video.paused, source: video.currentSrc, active: Array.from(window.art.template.$track.track.activeCues || [], cue => cue.text), displayed: window.art.template.$subtitle.textContent })
        const record = (event, value) => window.switchTrace.push({ event, value, ...window.switchState() })
        const descriptor = Object.getOwnPropertyDescriptor(HTMLMediaElement.prototype, 'currentTime')
        Object.defineProperty(video, 'currentTime', {
          configurable: true,
          get() { return descriptor.get.call(this) },
          set(value) {
            record('write-currentTime', value)
            descriptor.set.call(this, value)
          },
        })
        for (const event of ['loadedmetadata', 'loadeddata', 'canplay', 'seeking', 'seeked', 'emptied', 'pause'])
          video.addEventListener(event, () => record(event))
      })
      await expect.poll(() => page.evaluate(() => window.art.isReady)).toBe(true)
      if (implementation) {
        await page.evaluate(async () => {
          await window.art.plugins.add(window.multipleFactory({ subtitles: [{ name: 'caption', url: '/test/switch-caption.vtt' }] }))
        })
        await expect.poll(() => page.evaluate(() => window.art.template.$track.track.cues?.length)).toBe(1)
      }
      await page.locator('#play').click()
      await expect.poll(() => page.evaluate(() => window.art.currentTime)).toBeGreaterThan(0.1)
      await page.locator('#pause').click()
      await page.evaluate(() => {
        document.querySelector('#play').onclick = () => {
          window.art.fullscreen = true
        }
      })
      await page.locator('#play').click()
      await expect.poll(() => page.evaluate(() => Boolean(document.fullscreenElement || document.webkitFullscreenElement))).toBe(true)
      await page.evaluate(() => {
        window.art.fullscreen = false
      })
      await expect.poll(() => page.evaluate(() => Boolean(document.fullscreenElement || document.webkitFullscreenElement))).toBe(false)
      const outcomes = []
      for (let round = 0; round < 3; round++) {
        await page.evaluate(round => window.art.switchUrl(`/test/pattern.mp4?seek-order=${round}`), round)
        const settled = await page.evaluate(() => window.switchState())
        await page.evaluate(() => new Promise((resolve) => {
          window.art.once('video:seeked', resolve)
          window.art.seek = 1.5
        }))
        await expect.poll(() => page.evaluate(() => window.art.video.seeking)).toBe(false)
        const firstSeek = await page.evaluate(() => window.switchState())
        const landed = Math.abs(firstSeek.time - 1.5) < 0.05
        if (!landed) {
          await page.evaluate(() => new Promise((resolve) => {
            window.art.once('video:seeked', resolve)
            window.art.seek = 1.5
          }))
          await expect.poll(() => page.evaluate(() => window.art.video.seeking)).toBe(false)
        }
        await expect.poll(() => page.evaluate(() => Math.abs(window.art.currentTime - 1.5))).toBeLessThan(0.05)
        if (implementation)
          await expect(page.locator('.art-subtitle-caption')).toHaveText('Caption')
        outcomes.push({ round, settled, firstSeek, landed, afterSettledSeek: await page.evaluate(() => window.switchState()) })
      }
      await testInfo.attach('source-seek-order', { contentType: 'application/json', body: JSON.stringify({ core, plugin: implementation?.name || 'none', pluginSha256: implementation ? hash(implementation.code) : null, provenance: implementation?.provenance, browser: browser.version(), outcomes, trace: await page.evaluate(() => window.switchTrace), scope: 'Three real source changes with immediate versus settled seek; old misses are recorded, candidate must honor every first seek' }) })
      if (core === 'candidate')
        expect(outcomes.every(item => item.landed)).toBe(true)
      await page.evaluate(() => window.art.destroy())
    })
  }
}
