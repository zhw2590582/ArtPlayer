import fs from 'node:fs'
import { hash } from '../../refactor/scripts/releases.mjs'
import { createMediaGate } from '../helpers/media-gate.js'
import { expect, test } from './fixtures.js'

for (const owner of ['video', 'audio']) {
  for (const completeRanges of [false, true]) {
    test(`native ${owner} ${completeRanges ? 'complete ranges' : 'streamed response'} capability without ArtPlayer instances`, async ({ page }, testInfo) => {
      const file = owner === 'video' ? 'pattern.mp4' : 'audio-tone.m4a'
      const bytes = fs.readFileSync(new URL(`./media/${file}`, import.meta.url))
      const limit = owner === 'video' ? 96 * 1024 : 32 * 1024
      const gate = await createMediaGate(bytes, owner === 'video' ? 'video/mp4' : 'audio/mp4', limit, completeRanges)
      try {
        await page.goto('/test/player.html')
        await page.evaluate(({ owner, url }) => {
          window.nativeMedia = document.createElement(owner)
          window.nativeMedia.preload = 'auto'
          window.nativeMedia.muted = true
          window.nativeEvents = []
          for (const event of ['loadedmetadata', 'loadeddata', 'canplay', 'playing', 'waiting', 'stalled', 'pause', 'error'])
            window.nativeMedia.addEventListener(event, e => window.nativeEvents.push({ event, trusted: e.isTrusted, time: window.nativeMedia.currentTime, readyState: window.nativeMedia.readyState }))
          window.nativeMedia.src = url
          document.body.append(window.nativeMedia)
          document.querySelector('#play').onclick = () => window.nativeMedia.play()
        }, { owner, url: gate.url })
        await expect.poll(() => page.evaluate(() => window.nativeMedia.readyState >= 2 || Boolean(window.nativeMedia.error))).toBe(true)
        await page.locator('#play').click()
        let progressed = false
        let waiting = false
        try {
          await page.waitForFunction(() => window.nativeMedia.currentTime > 0.3, null, { timeout: 3000 })
          progressed = true
          await page.waitForFunction(() => window.nativeEvents.some(event => event.event === 'waiting' && event.trusted && event.time > 0.3 && event.readyState < 3), null, { timeout: 7000 })
          waiting = true
        }
        catch (error) {
          if (error.name !== 'TimeoutError')
            throw error
        }
        const before = await page.evaluate(() => ({ time: window.nativeMedia.currentTime, readyState: window.nativeMedia.readyState, paused: window.nativeMedia.paused, error: window.nativeMedia.error?.code || null, instances: window.Artplayer.instances.length, events: window.nativeEvents }))
        expect(before.instances).toBe(0)
        expect(gate.blocked).toBeGreaterThan(0)
        gate.release()
        await page.locator('#play').click()
        await expect.poll(() => page.evaluate(() => window.nativeMedia.currentTime)).toBeGreaterThan(before.time + 0.3)
        expect(await page.evaluate(() => window.nativeMedia.error)).toBeNull()
        await testInfo.attach('native-gate-capability', { contentType: 'application/json', body: JSON.stringify({ file, sha256: hash(bytes), limit, completeRanges, progressed, waiting, before, requests: gate.requests, after: await page.evaluate(() => ({ time: window.nativeMedia.currentTime, readyState: window.nativeMedia.readyState, paused: window.nativeMedia.paused })) }) })
      }
      finally {
        try {
          await page.evaluate(() => {
            window.nativeMedia?.pause()
            window.nativeMedia?.removeAttribute('src')
            window.nativeMedia?.load()
          })
        }
        finally {
          await gate.close()
        }
      }
    })
  }
}
