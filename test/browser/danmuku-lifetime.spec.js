import assert from 'node:assert/strict'
import fs from 'node:fs'
import process from 'node:process'
import { ensureArchive, hash, readMember } from '../../refactor/scripts/releases.mjs'
import { browserCandidate } from '../helpers/browser-candidate.js'
import { expect, test } from './fixtures.js'

let provenance
const implementations = new Map()
test.beforeAll(async () => {
  const release = JSON.parse(fs.readFileSync(new URL('../../refactor/baselines/danmuku-release.json', import.meta.url), 'utf8')).release
  const member = `package/${release.manifest.main.replace(/^\.\//u, '')}`
  const bytes = readMember(await ensureArchive(release), member)
  assert.equal(hash(bytes), release.files[member])
  implementations.set('published', bytes.toString())
  const candidate = await browserCandidate('artplayer-plugin-danmuku', process.env.ARTPLAYER_DANMUKU_ARTIFACT)
  provenance = candidate.provenance
  implementations.set('candidate', candidate.code)
})

for (const core of ['published', 'candidate']) {
  for (const implementation of ['published', 'candidate']) {
    for (const [mode, antiOverlap] of [0, 1].flatMap(mode => [true, false].map(antiOverlap => [mode, antiOverlap]))) {
      test(`${core} core / ${implementation} plugin / mode ${mode} / antiOverlap ${antiOverlap}: placement preserves visible lifetime`, async ({ page }, testInfo) => {
        await page.goto(`/test/player.html?core=${core}`)
        await page.evaluate(() => {
          const evidence = window.lifetimeEvidence = { posts: [], replies: [], visible: [], recycled: [] }
          const NativeWorker = window.Worker
          window.Worker = class DelayedNativeWorker extends NativeWorker {
            constructor(...args) {
              super(...args)
              this.addEventListener('message', event => evidence.replies.push({ id: event.data.id, wall: performance.now() }))
            }

            postMessage(message, ...args) {
              evidence.posts.push({ id: message.id, wall: performance.now() })
              // Delay delivery, then execute the actual native Worker and its real geometry.
              this.delay = setTimeout(() => super.postMessage(message, ...args), 1500)
            }

            terminate() {
              clearTimeout(this.delay)
              return super.terminate()
            }
          }
        })
        const code = implementations.get(implementation)
        await testInfo.attach('danmuku-selected-input', { contentType: 'application/json', body: JSON.stringify({ implementation, provenance: implementation === 'candidate' ? provenance : { kind: 'published', sha256: hash(code) } }) })
        await page.addScriptTag({ content: code })
        await page.evaluate(() => window.createPlayer('/assets/sample/video.mp4'))
        await page.click('#play')
        await expect.poll(() => page.evaluate(() => window.art.currentTime)).toBeGreaterThan(0.1)
        // Install after native playing, then start once. The published duplicate
        // play/playing loop defect is covered elsewhere and is not this timing case.
        await page.evaluate(async ({ mode, antiOverlap }) => {
          const art = window.art
          const evidence = window.lifetimeEvidence
          art.on('artplayerPluginDanmuku:visible', row => evidence.visible.push({ wall: performance.now(), clock: Date.now(), startedAt: row.$lastStartTime, rest: row.$restTime, mode: row.mode, time: art.currentTime, transition: row.$ref.style.transition }))
          art.plugins.add(window.artplayerPluginDanmuku({ danmuku: [], speed: 1, antiOverlap, heatmap: false, emitter: false }))
          const plugin = art.plugins.artplayerPluginDanmuku
          const owner = plugin.config({})
          const makeWait = owner.makeWait
          owner.makeWait = (row) => {
            if (row.$state === 'emit')
              evidence.recycled.push({ wall: performance.now(), rest: row.$restTime, time: art.currentTime })
            return makeWait.call(owner, row)
          }
          await plugin.load([{ id: 'delayed', text: 'Full visible lifetime', time: art.currentTime + 0.4, mode }])
          owner.start()
        }, { mode, antiOverlap })
        await expect.poll(() => page.evaluate(() => window.lifetimeEvidence.recycled.length)).toBe(1)
        await page.click('#pause')
        const evidence = await page.evaluate(() => ({ ...window.lifetimeEvidence, video: { width: window.art.video.videoWidth, time: window.art.currentTime } }))
        const workerPlacement = implementation === 'published' || antiOverlap
        await testInfo.attach('danmuku-lifetime', { contentType: 'application/json', body: JSON.stringify({ core, implementation, mode, antiOverlap, workerPlacement, sha256: hash(code), evidence, scope: 'Native video; Worker path has a controlled 1500ms request delay, candidate relaxed path must bypass it. Both candidate paths require full visible lifetime. Does not assert naturally occurring Worker starvation.' }) })
        expect(evidence.posts).toHaveLength(workerPlacement ? 1 : 0)
        expect(evidence.replies).toHaveLength(workerPlacement ? 1 : 0)
        expect(evidence.visible).toHaveLength(1)
        expect(evidence.video.width).toBeGreaterThan(0)
        if (workerPlacement)
          expect(evidence.replies[0].wall - evidence.posts[0].wall).toBeGreaterThanOrEqual(1400)
        const lifetime = evidence.recycled[0].wall - evidence.visible[0].wall
        if (implementation === 'published') {
          // Preserve the historical defect as explicit evidence, not the candidate contract.
          expect(lifetime).toBeLessThan(400)
          expect(evidence.visible[0].clock - evidence.visible[0].startedAt).toBeGreaterThanOrEqual(1400)
        }
        else {
          expect(lifetime).toBeGreaterThanOrEqual(900)
          expect(evidence.visible[0].rest).toBe(1)
        }
        await page.evaluate(() => window.art.destroy())
      })
    }
  }
}
