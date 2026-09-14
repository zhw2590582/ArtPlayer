import assert from 'node:assert/strict'
import process from 'node:process'
import { hash } from '../../refactor/scripts/releases.mjs'
import { canvasCandidate, canvasHistorical } from '../helpers/canvas.js'
import { expect, test } from './fixtures.js'

const baseline = process.env.ARTPLAYER_CANVAS_SUBTITLE_BASELINE
assert(!baseline || baseline === '1.1.0', 'Only the frozen published 1.1.0 subtitle baseline is supported')
assert(!baseline || !process.env.ARTPLAYER_BROWSER_ARTIFACTS, 'Historical subtitles cannot claim installed candidate provenance')
const candidate = baseline ? (await canvasHistorical()).find(item => item.name === 'published-1.1.0') : await canvasCandidate()
assert(candidate)

for (const core of ['published', 'candidate']) {
  test(`${core}: canvas proxy loads and seeks native subtitle cues`, async ({ page }, testInfo) => {
    await page.route('**/canvas-captions.vtt', route => route.fulfill({ contentType: 'text/vtt', body: 'WEBVTT\n\n00:00:00.000 --> 00:00:02.000\nOpening caption\n\n00:00:02.000 --> 00:00:07.000\nLater caption\n' }))
    await page.route('**/canvas-replacement.vtt', route => route.fulfill({ contentType: 'text/vtt', body: 'WEBVTT\n\n00:00:00.000 --> 00:00:07.000\nReplacement caption\n' }))
    await page.goto(`/test/player.html?core=${core}`)
    await page.addScriptTag({ content: `(() => { const module = { exports: {} }; const exports = module.exports; ${candidate.source}; window.canvasFactory = module.exports.default || module.exports; })();` })
    await page.evaluate(() => {
      window.art = new window.Artplayer({ container: '.player', url: '/test/pattern.mp4', muted: true, proxy: window.canvasFactory(), subtitle: { url: '/canvas-captions.vtt' } })
      document.querySelector('#play').onclick = () => window.art.play()
      document.querySelector('#pause').onclick = () => window.art.pause()
    })
    let completed = false
    try {
      await expect.poll(() => page.evaluate(() => window.art.isReady)).toBe(true)
      await page.click('#play')
      await expect.poll(() => page.evaluate(() => window.art.currentTime)).toBeGreaterThan(0.1)
      await page.click('#pause')
      await expect.poll(() => page.evaluate(() => window.art.subtitle.cues.length)).toBe(2)
      await expect(page.locator('.art-subtitle')).toHaveText('Opening caption')
      await page.evaluate(() => window.art.currentTime = 3)
      await expect(page.locator('.art-subtitle')).toHaveText('Later caption')
      await page.evaluate(async () => {
        window.previousCanvasTrack = window.art.template.$track
        await window.art.subtitle.switch('/canvas-replacement.vtt')
      })
      await expect.poll(() => page.evaluate(() => window.art.subtitle.cues.length)).toBe(1)
      await page.evaluate(() => window.art.currentTime = 4)
      await expect(page.locator('.art-subtitle')).toHaveText('Replacement caption')
      expect(await page.evaluate(() => ({ previousConnected: window.previousCanvasTrack.isConnected, count: window.art.video.textTracks.length, parent: window.art.template.$track.parentNode === window.art.template.$player.querySelector('video') }))).toEqual({ previousConnected: false, count: 1, parent: true })
      expect(await page.evaluate(() => {
        const canvas = window.art.video
        const marker = document.createElement('span')
        const append = canvas.appendChild
        const returned = append(marker)
        const same = returned === marker && marker.parentNode === canvas
        canvas.removeChild(marker)
        window.canvasAppend = append
        window.backingCanvasVideo = window.art.template.$player.querySelector('video')
        return same && !marker.parentNode && typeof canvas.toDataURL() === 'string'
      })).toBe(true)
      completed = true
    }
    finally {
      await testInfo.attach('canvas-subtitle-state', { contentType: 'application/json', body: JSON.stringify({ core, implementation: candidate.name, sha256: hash(candidate.source), ...await page.evaluate(() => ({ renderer: window.art.video.nodeName, trackParent: window.art.template.$track.parentNode?.nodeName, trackState: window.art.template.$track.readyState, cues: window.art.subtitle.cues.length, backingTracks: window.art.template.$player.querySelector('video')?.textTracks.length, text: window.art.template.$subtitle.textContent, time: window.art.currentTime })) }) })
      await page.evaluate(() => window.art.destroy())
      if (completed) {
        expect(await page.evaluate(() => {
          const track = document.createElement('track')
          window.canvasAppend?.(track)
          const video = window.backingCanvasVideo
          return video ? { connected: video.isConnected, paused: video.paused, source: video.getAttribute('src'), restarted: track.parentNode === video } : null
        })).toEqual({ connected: false, paused: true, source: null, restarted: false })
      }
    }
  })
}
