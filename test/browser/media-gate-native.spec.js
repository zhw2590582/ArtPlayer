import fs from 'node:fs'
import process from 'node:process'
import { hash } from '../../refactor/scripts/releases.mjs'
import { createMediaGate } from '../helpers/media-gate.js'
import { expect, test } from './fixtures.js'

for (const owner of ['video', 'audio']) {
  for (const completeRanges of [false, true]) {
    test(`native ${owner} ${completeRanges ? 'complete ranges' : 'streamed response'} capability without ArtPlayer instances`, async ({ page }, testInfo) => {
      const file = owner === 'video' ? 'pattern.mp4' : 'audio-tone.m4a'
      const bytes = fs.readFileSync(new URL(`./media/${file}`, import.meta.url))
      const configuredLimit = process.env[`ARTPLAYER_MEDIA_GATE_${owner.toUpperCase()}_LIMIT`]
      const limit = configuredLimit === undefined ? (owner === 'video' ? 96 * 1024 : 32 * 1024) : Number(configuredLimit)
      const gate = await createMediaGate(bytes, owner === 'video' ? 'video/mp4' : 'audio/mp4', limit, completeRanges)
      const observation = { file, sha256: hash(bytes), bytes: bytes.length, limit, completeRanges, configuredLimit: configuredLimit ?? null, progressed: false, waiting: false }
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
        try {
          await page.waitForFunction(() => window.nativeMedia.currentTime > 0.3, null, { timeout: 3000 })
          observation.progressed = true
          await page.waitForFunction(() => window.nativeEvents.some(event => event.event === 'waiting' && event.trusted && event.time > 0.3 && event.readyState < 3), null, { timeout: 7000 })
          observation.waiting = true
        }
        catch (error) {
          if (error.name !== 'TimeoutError')
            throw error
        }
        const before = await page.evaluate(() => ({ time: window.nativeMedia.currentTime, duration: window.nativeMedia.duration, ended: window.nativeMedia.ended, readyState: window.nativeMedia.readyState, paused: window.nativeMedia.paused, error: window.nativeMedia.error?.code || null, instances: window.Artplayer.instances.length, events: window.nativeEvents, buffered: Array.from({ length: window.nativeMedia.buffered.length }, (_, index) => [window.nativeMedia.buffered.start(index), window.nativeMedia.buffered.end(index)]) }))
        observation.before = before
        observation.requestsBeforeRelease = structuredClone(gate.requests)
        await testInfo.attach('native-gate-before-release', { contentType: 'application/json', body: JSON.stringify(observation) })
        expect(before.instances).toBe(0)
        expect(gate.blocked).toBeGreaterThan(0)
        gate.release()
        await page.locator('#play').click()
        await expect.poll(() => page.evaluate(() => window.nativeMedia.currentTime)).toBeGreaterThan(before.time + 0.3)
        expect(await page.evaluate(() => window.nativeMedia.error)).toBeNull()
        observation.after = await page.evaluate(() => ({ time: window.nativeMedia.currentTime, readyState: window.nativeMedia.readyState, paused: window.nativeMedia.paused }))
      }
      finally {
        try {
          await testInfo.attach('native-gate-capability', { contentType: 'application/json', body: JSON.stringify({ ...observation, requests: gate.requests }) })
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
