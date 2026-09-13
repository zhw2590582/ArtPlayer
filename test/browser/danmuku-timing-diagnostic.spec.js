import assert from 'node:assert/strict'
import fs from 'node:fs'
import process from 'node:process'
import { ensureArchive, hash, readMember } from '../../refactor/scripts/releases.mjs'
import { compilePackage } from '../helpers/load.js'
import { expect, test } from './fixtures.js'

const release = JSON.parse(fs.readFileSync(new URL('../../refactor/baselines/danmuku-release.json', import.meta.url), 'utf8')).release
const implementations = new Map()
test.beforeAll(async () => {
  const member = `package/${release.manifest.main.replace(/^\.\//u, '')}`
  const published = readMember(await ensureArchive(release), member)
  assert.equal(hash(published), release.files[member])
  implementations.set('published', published.toString())
  implementations.set('candidate', process.env.ARTPLAYER_DANMUKU_ARTIFACT
    ? fs.readFileSync(process.env.ARTPLAYER_DANMUKU_ARTIFACT, 'utf8')
    : await compilePackage('artplayer-plugin-danmuku', 'umd'))
})

for (const implementation of ['published', 'candidate']) {
  for (const scenario of ['main-thread-gap', 'async-visibility-gap']) {
    test(`${implementation}: native ${scenario} records actual frame and eligibility gaps`, async ({ page }, testInfo) => {
      await page.goto('/test/player.html?core=candidate')
      const code = implementations.get(implementation)
      await page.addScriptTag({ content: code })
      await page.evaluate(() => window.createPlayer('/assets/sample/video.mp4'))
      await page.click('#play')
      await expect.poll(() => page.evaluate(() => window.art.currentTime)).toBeGreaterThan(0.1)
      await page.click('#pause')
      await page.evaluate(async (scenario) => {
        const art = window.art
        const evidence = window.timingEvidence = { frames: [], eligibility: [], visible: [], callbacks: [], block: null }
        const base = art.currentTime
        window.timingEnd = base + 2.5
        const rows = [
          { id: 'first', text: 'first', time: base + 0.45, mode: 1 },
          { id: 'middle', text: 'middle', time: base + 0.75, mode: 1 },
          { id: 'sentinel', text: 'after gap', time: base + 1.7, mode: 2 },
        ]
        art.on('artplayerPluginDanmuku:visible', row => evidence.visible.push({ id: row.id, time: art.currentTime, wall: performance.now() }))
        art.plugins.add(window.artplayerPluginDanmuku({
          danmuku: [],
          heatmap: false,
          emitter: false,
          antiOverlap: false,
          beforeVisible(row) {
            const entry = { id: row.id, start: performance.now(), media: art.currentTime }
            evidence.callbacks.push(entry)
            if (scenario === 'async-visibility-gap' && row.id === 'first') {
              return new Promise(resolve => setTimeout(() => {
                entry.end = performance.now()
                resolve(true)
              }, 600))
            }
            entry.end = performance.now()
            return true
          },
        }))
        const plugin = art.plugins.artplayerPluginDanmuku
        const owner = window.timingOwner = plugin.config({})
        const getter = Object.getOwnPropertyDescriptor(Object.getPrototypeOf(owner), 'readys').get
        // Record the real getter invocation without changing rows, state or returned order.
        Object.defineProperty(owner, 'readys', { configurable: true, get() {
          const ready = getter.call(this)
          evidence.eligibility.push({ wall: performance.now(), time: art.currentTime, ids: ready.map(row => row.id) })
          return ready
        } })
        await plugin.load(rows)
        let blocked = false
        function observe(wall) {
          if (art.playing) {
            evidence.frames.push({ wall, time: art.currentTime })
            if (scenario === 'main-thread-gap' && !blocked && art.currentTime >= base + 0.2) {
              blocked = true
              const start = performance.now()
              const before = art.currentTime
              // Intentional bounded main-thread work. Media and native RAF are never faked.
              while (performance.now() - start < 800) { /* Controlled CPU load. */ }
              evidence.block = { start, end: performance.now(), before, after: art.currentTime }
            }
          }
          window.timingFrame = requestAnimationFrame(observe)
        }
        window.timingFrame = requestAnimationFrame(observe)
      }, scenario)
      await page.click('#play')
      await expect.poll(() => page.evaluate(() => window.art.currentTime >= window.timingEnd)).toBe(true)
      await page.click('#pause')
      const observation = await page.evaluate(() => {
        cancelAnimationFrame(window.timingFrame)
        const evidence = window.timingEvidence
        const rows = window.timingOwner.queue.map(row => ({ id: row.id, time: row.time, state: row.$state }))
        const visible = new Set(evidence.visible.map(row => row.id))
        return { ...evidence, rows, missing: rows.filter(row => !visible.has(row.id)).map(row => row.id), media: { time: window.art.currentTime, width: window.art.video.videoWidth } }
      })
      await testInfo.attach('danmuku-timing-observation', { contentType: 'application/json', body: JSON.stringify({ implementation, scenario, sha256: hash(code), observation, scope: 'Diagnostic only: native timing with controlled load, original readys getter and unmodified queue states. Missing rows are reported, not waived as stability acceptance.' }) })
      expect(observation.media.width).toBeGreaterThan(0)
      expect(observation.rows).toHaveLength(3)
      expect(observation.frames.length).toBeGreaterThan(2)
      expect(observation.eligibility.length).toBeGreaterThan(2)
      expect(observation.visible.some(row => row.id === 'sentinel')).toBe(true)
      if (scenario === 'main-thread-gap')
        expect(observation.block.end - observation.block.start).toBeGreaterThanOrEqual(800)
      else
        expect(observation.callbacks.find(row => row.id === 'first').end - observation.callbacks.find(row => row.id === 'first').start).toBeGreaterThanOrEqual(550)
      if (scenario === 'async-visibility-gap') {
        expect(observation.missing).toEqual(implementation === 'candidate' ? [] : ['middle'])
        expect(observation.visible.map(row => row.id)).toEqual(implementation === 'candidate' ? ['first', 'middle', 'sentinel'] : ['first', 'sentinel'])
        if (implementation === 'candidate') {
          for (let index = 1; index < observation.callbacks.length; index++)
            expect(observation.callbacks[index].start).toBeGreaterThanOrEqual(observation.callbacks[index - 1].end)
        }
      }
      await page.evaluate(() => window.art.destroy())
    })
  }
}
