import fs from 'node:fs'
import { hash } from '../../refactor/scripts/releases.mjs'
import { createMediaGate } from '../helpers/media-gate.js'
import { useAudioFixture } from './audio-fixture.js'
import { expect, test } from './fixtures.js'

const { openAudio } = useAudioFixture()

for (const core of ['published', 'candidate']) {
  for (const plugin of ['published', 'source']) {
    for (const owner of ['video', 'audio']) {
      test(`${core} core + ${plugin} audio: real ${owner} starvation resumes after network release`, async ({ page }, testInfo) => {
        const file = owner === 'video' ? 'pattern.mp4' : 'audio-tone.m4a'
        const bytes = fs.readFileSync(new URL(`./media/${file}`, import.meta.url))
        const limit = owner === 'video' ? 96 * 1024 : 32 * 1024
        const gate = await createMediaGate(bytes, owner === 'video' ? 'video/mp4' : 'audio/mp4', limit)
        try {
          await openAudio(page, core, plugin, testInfo, owner === 'audio' ? gate.url : '/test/audio-tone.m4a')
          await page.evaluate((owner) => {
            window.starvation = []
            const media = owner === 'video' ? window.art.video : window.audioPlugin.audio
            media.addEventListener('waiting', (event) => {
              window.starvation.push({ trusted: event.isTrusted, time: media.currentTime, readyState: media.readyState, audioPaused: window.audioPlugin.audio.paused, videoTime: window.art.currentTime })
            })
          }, owner)
          await page.locator('#play').click()
          await expect.poll(() => page.evaluate(() => window.audioPlugin.audio.currentTime > 0.3 && window.art.currentTime > 0.3)).toBe(true)
          if (owner === 'video')
            await page.evaluate(url => window.art.switchUrl(url), gate.url)
          await expect.poll(() => page.evaluate(() => window.starvation.some(event => event.trusted && event.time > 0.3 && event.readyState < 3))).toBe(true)
          expect(gate.blocked).toBeGreaterThan(0)
          const stalled = await page.evaluate(() => ({ audio: window.audioPlugin.audio.currentTime, video: window.art.currentTime }))
          if (owner === 'video') {
            expect(await page.evaluate(() => window.audioPlugin.audio.paused)).toBe(true)
          }
          else {
            await expect.poll(() => page.evaluate(() => window.art.currentTime)).toBeGreaterThan(stalled.video + 0.3)
            expect(await page.evaluate(() => window.art.video.paused)).toBe(false)
          }
          gate.release()
          await expect.poll(() => page.evaluate(() => !window.audioPlugin.audio.paused && !window.art.video.paused)).toBe(true)
          await expect.poll(() => page.evaluate(() => window.audioPlugin.audio.currentTime)).toBeGreaterThan(stalled.audio + 0.3)
          await expect.poll(() => page.evaluate(() => window.art.currentTime)).toBeGreaterThan(stalled.video + 0.3)
          await expect.poll(() => page.evaluate(() => Math.abs(window.audioPlugin.audio.currentTime - window.art.currentTime))).toBeLessThan(0.5)
          expect(await page.evaluate(() => [window.art.video.error, window.audioPlugin.audio.error])).toEqual([null, null])
        }
        finally {
          try {
            await testInfo.attach('media-gate-requests', { contentType: 'application/json', body: JSON.stringify({ file, sha256: hash(bytes), bytes: bytes.length, limit, requests: gate.requests }) })
            const events = page.isClosed() ? { closed: true } : await page.evaluate(() => window.starvation)
            await testInfo.attach('media-gate', { contentType: 'application/json', body: JSON.stringify({ file, sha256: hash(bytes), bytes: bytes.length, limit, requests: gate.requests, events }) })
            if (!page.isClosed())
              await page.evaluate(() => window.art?.destroy())
          }
          finally {
            await gate.close()
          }
        }
      })
    }
  }
}
