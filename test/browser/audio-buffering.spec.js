import fs from 'node:fs'
import { hash } from '../../refactor/scripts/releases.mjs'
import { createMediaGate } from '../helpers/media-gate.js'
import { useAudioFixture } from './audio-fixture.js'
import { expect, test } from './fixtures.js'

const { openAudio } = useAudioFixture()

async function beginAudioSwitch(page, url) {
  // switchUrl may await canplay/play; do not return its pending Promise to
  // Playwright before the test can observe or release the real network gate.
  await page.evaluate((url) => {
    window.starvationSwitch = { status: 'pending', startedAt: performance.now() }
    window.art.switchUrl(url).then(() => {
      window.starvationSwitch.status = 'fulfilled'
      window.starvationSwitch.settledAt = performance.now()
    }, (error) => {
      window.starvationSwitch.status = 'rejected'
      window.starvationSwitch.error = String(error)
      window.starvationSwitch.settledAt = performance.now()
    })
  }, url)
}

for (const core of ['published', 'candidate']) {
  for (const plugin of ['published', 'source']) {
    test(`${core} core + ${plugin} audio: held switch can release before its Promise settles`, async ({ page }, testInfo) => {
      const bytes = fs.readFileSync(new URL('./media/pattern.mp4', import.meta.url))
      const metadata = bytes.readUInt32BE(0)
      expect(bytes.toString('ascii', 4, 8)).toBe('ftyp')
      expect(bytes.toString('ascii', metadata + 4, metadata + 8)).toBe('moov')
      // Send complete format/metadata boxes, but withhold all encoded frames.
      const limit = metadata + bytes.readUInt32BE(metadata)
      const gate = await createMediaGate(bytes, 'video/mp4', limit)
      let phase = 'initial-playback'
      try {
        await openAudio(page, core, plugin, testInfo)
        await page.locator('#play').click()
        await expect.poll(() => page.evaluate(() => window.art.currentTime > 0.3 && window.audioPlugin.audio.currentTime > 0.3)).toBe(true)
        phase = 'begin-switch'
        await beginAudioSwitch(page, gate.url)
        phase = 'held-request'
        await expect.poll(() => gate.blocked).toBeGreaterThan(0)
        expect(await page.evaluate(() => window.starvationSwitch.status)).toBe('pending')
        expect(gate.requests.some(request => request.wasHeld && request.sent === limit)).toBe(true)
        phase = 'network-release'
        gate.release()
        await expect.poll(() => page.evaluate(() => window.starvationSwitch)).toMatchObject({ status: 'fulfilled' })
        await expect.poll(() => page.evaluate(() => window.art.currentTime > 0.3 && window.audioPlugin.audio.currentTime > 0.3 && !window.art.video.paused && !window.audioPlugin.audio.paused)).toBe(true)
        expect(await page.evaluate(() => [window.art.video.error, window.audioPlugin.audio.error])).toEqual([null, null])
        phase = 'complete'
      }
      finally {
        try {
          const state = page.isClosed() ? { closed: true } : await page.evaluate(() => ({ switch: window.starvationSwitch, hostEvents: window.audioHostEvents }))
          await testInfo.attach('held-switch', { contentType: 'application/json', body: JSON.stringify({ phase, ...state, sha256: hash(bytes), limit, requests: gate.requests }) })
          if (!page.isClosed())
            await page.evaluate(() => window.art?.destroy())
        }
        finally {
          await gate.close()
        }
      }
    })

    for (const owner of ['video', 'audio']) {
      test(`${core} core + ${plugin} audio: real ${owner} starvation resumes after network release`, async ({ page }, testInfo) => {
        const file = owner === 'video' ? 'pattern.mp4' : 'audio-tone.m4a'
        const bytes = fs.readFileSync(new URL(`./media/${file}`, import.meta.url))
        const limit = owner === 'video' ? 96 * 1024 : 32 * 1024
        const gate = await createMediaGate(bytes, owner === 'video' ? 'video/mp4' : 'audio/mp4', limit)
        let phase = 'initial-playback'
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
          if (owner === 'video') {
            await beginAudioSwitch(page, gate.url)
          }
          phase = 'native-starvation'
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
          phase = 'network-release'
          gate.release()
          if (owner === 'video') {
            await expect.poll(() => page.evaluate(() => window.starvationSwitch)).toMatchObject({ status: 'fulfilled' })
          }
          phase = 'playback-recovery'
          await expect.poll(() => page.evaluate(() => !window.audioPlugin.audio.paused && !window.art.video.paused)).toBe(true)
          await expect.poll(() => page.evaluate(() => window.audioPlugin.audio.currentTime)).toBeGreaterThan(stalled.audio + 0.3)
          await expect.poll(() => page.evaluate(() => window.art.currentTime)).toBeGreaterThan(stalled.video + 0.3)
          await expect.poll(() => page.evaluate(() => Math.abs(window.audioPlugin.audio.currentTime - window.art.currentTime))).toBeLessThan(0.5)
          expect(await page.evaluate(() => [window.art.video.error, window.audioPlugin.audio.error])).toEqual([null, null])
          phase = 'complete'
        }
        finally {
          try {
            await testInfo.attach('media-gate-requests', { contentType: 'application/json', body: JSON.stringify({ file, sha256: hash(bytes), bytes: bytes.length, limit, requests: gate.requests }) })
            const events = page.isClosed() ? { closed: true } : await page.evaluate(() => window.starvation)
            await testInfo.attach('media-gate', { contentType: 'application/json', body: JSON.stringify({ file, sha256: hash(bytes), bytes: bytes.length, limit, requests: gate.requests, events }) })
            const state = page.isClosed()
              ? { closed: true }
              : await page.evaluate(() => {
                  const media = element => element && ({ time: element.currentTime, paused: element.paused, readyState: element.readyState, ended: element.ended, error: element.error?.code ?? null })
                  return { switch: window.starvationSwitch, video: media(window.art?.video), audio: media(window.audioPlugin?.audio), hostEvents: window.audioHostEvents }
                })
            await testInfo.attach('audio-buffering-phase', { contentType: 'application/json', body: JSON.stringify({ phase, ...state }) })
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
