import assert from 'node:assert/strict'
import fs from 'node:fs'
import process from 'node:process'
import { ensureArchive, hash, readMember } from '../../refactor/scripts/releases.mjs'
import { compilePackage } from '../helpers/load.js'
import { expect, test } from './fixtures.js'

const implementations = new Map()
test.beforeAll(async () => {
  const release = JSON.parse(fs.readFileSync(new URL('../../refactor/baselines/danmuku-release.json', import.meta.url), 'utf8')).release
  const member = `package/${release.manifest.main.replace(/^\.\//u, '')}`
  const published = readMember(await ensureArchive(release), member)
  assert.equal(hash(published), release.files[member])
  implementations.set('published', published.toString())
  implementations.set('candidate', process.env.ARTPLAYER_DANMUKU_ARTIFACT
    ? fs.readFileSync(process.env.ARTPLAYER_DANMUKU_ARTIFACT, 'utf8')
    : await compilePackage('artplayer-plugin-danmuku', 'umd'))
})

for (const implementation of ['published', 'candidate']) {
  for (const rate of [2, 20]) {
    test(`${implementation}: ${rate} rows per second across three native playback cycles`, async ({ page }, testInfo) => {
      // Three 14-second media cycles plus setup/teardown; this is a bounded soak,
      // not the ordinary short browser test deadline or a synthetic clock jump.
      test.setTimeout(90000)
      await page.goto('/test/player.html?core=candidate')
      const code = implementations.get(implementation)
      await page.addScriptTag({ content: code })
      await page.evaluate(() => window.createPlayer('/assets/sample/video.mp4'))
      await page.click('#play')
      await expect.poll(() => page.evaluate(() => window.art.currentTime)).toBeGreaterThan(0.1)
      await page.click('#pause')
      await page.evaluate(() => {
        const art = window.art
        const evidence = window.stabilityEvidence = { workers: [], frames: [], samples: [], visible: [], recycled: [], callbacks: [], cycles: [], errors: [], allocations: 0, reuses: 0, bypassedPool: 0 }
        const NativeWorker = window.Worker
        window.Worker = class extends NativeWorker {
          constructor(...args) {
            super(...args)
            this.record = { posts: 0, replies: 0, terminated: 0, errors: [] }
            evidence.workers.push(this.record)
            this.addEventListener('message', () => this.record.replies++)
            this.addEventListener('error', event => this.record.errors.push(event.message))
          }

          postMessage(...args) {
            this.record.posts++
            return super.postMessage(...args)
          }

          terminate() {
            this.record.terminated++
            return super.terminate()
          }
        }
        art.on('artplayerPluginDanmuku:error', error => evidence.errors.push(String(error)))
        art.on('artplayerPluginDanmuku:visible', row => evidence.visible.push({ id: row.id, time: art.currentTime, wall: performance.now() }))
        art.plugins.add(window.artplayerPluginDanmuku({
          danmuku: [],
          heatmap: false,
          emitter: false,
          speed: 1,
          antiOverlap: false,
          beforeVisible(row) {
            evidence.callbacks.push({ id: row.id, time: art.currentTime })
            return true
          },
        }))
        const owner = window.stabilityOwner = art.plugins.artplayerPluginDanmuku.config({})
        const acquire = Object.getOwnPropertyDescriptor(Object.getPrototypeOf(owner), '$ref').get
        const acquired = new WeakSet()
        Object.defineProperty(owner, '$ref', { configurable: true, get() {
          const available = new Set(this.$refs)
          const ref = acquire.call(this)
          if (available.size && !available.has(ref))
            evidence.bypassedPool++
          if (acquired.has(ref))
            evidence.reuses++
          else evidence.allocations++
          acquired.add(ref)
          return ref
        } })
        const getter = Object.getOwnPropertyDescriptor(Object.getPrototypeOf(owner), 'readys').get
        Object.defineProperty(owner, 'readys', { configurable: true, get() {
          const rows = getter.call(this)
          evidence.samples.push({ time: art.currentTime, wall: performance.now(), ids: rows.map(row => row.id) })
          return rows
        } })
        const makeWait = owner.makeWait.bind(owner)
        owner.makeWait = (row) => {
          if (row.$state === 'emit')
            evidence.recycled.push({ id: row.id, time: art.currentTime })
          return makeWait(row)
        }
        const frame = (wall) => {
          if (art.playing)
            evidence.frames.push({ wall, time: art.currentTime })
          window.stabilityFrame = requestAnimationFrame(frame)
        }
        window.stabilityFrame = requestAnimationFrame(frame)
      })
      try {
        for (let cycle = 0; cycle < 3; cycle++) {
          await page.evaluate(async ({ cycle, rate }) => {
            const art = window.art
            const base = art.currentTime
            const rows = Array.from({ length: 12 * rate }, (_, index) => ({ id: `${cycle}-${index}`, text: `Row ${index}`, time: base + 0.5 + index / rate, mode: index % 3 }))
            await art.plugins.artplayerPluginDanmuku.load(rows)
            window.stabilityEnd = base + 14
            window.stabilityEvidence.cycles.push({ cycle, base, rows: rows.map(row => ({ id: row.id, time: row.time })), startWall: performance.now() })
          }, { cycle, rate })
          await page.click('#play')
          await expect.poll(() => page.evaluate(() => window.art.currentTime >= window.stabilityEnd), { timeout: 22000 }).toBe(true)
          await page.click('#pause')
          const snapshot = await page.evaluate(() => {
            const owner = window.stabilityOwner
            const record = window.stabilityEvidence.cycles.at(-1)
            const ids = new Set(record.rows.map(row => row.id))
            const visible = window.stabilityEvidence.visible.filter(row => ids.has(row.id))
            const sampled = new Set(window.stabilityEvidence.samples.flatMap(sample => sample.ids).filter(id => ids.has(id)))
            const shown = new Set(visible.map(row => row.id))
            const refs = owner.queue.map(row => row.$ref).filter(Boolean)
            const queue = new Set(owner.queue)
            const members = Object.values(owner.states).flat()
            const memory = performance.memory
            Object.assign(record, {
              endWall: performance.now(),
              time: window.art.currentTime,
              decodedWidth: window.art.video.videoWidth,
              visibleCount: visible.length,
              uniqueVisible: shown.size,
              missedSampling: record.rows.filter(row => !sampled.has(row.id)).map(row => row.id),
              sampledNotVisible: record.rows.filter(row => sampled.has(row.id) && !shown.has(row.id)).map(row => row.id),
              queue: owner.queue.length,
              states: Object.fromEntries(Object.entries(owner.states).map(([state, rows]) => [state, rows.length])),
              nodes: owner.$danmuku.children.length,
              pooled: owner.$refs.length,
              uniquePool: new Set(owner.$refs).size,
              referenced: refs.length,
              distinctReferences: new Set(refs).size,
              uniqueStateMembers: new Set(members).size,
              validStateMembers: Object.entries(owner.states).every(([state, rows]) => rows.every(row => queue.has(row) && row.$state === state)),
              heap: memory ? { used: memory.usedJSHeapSize, total: memory.totalJSHeapSize } : null,
            })
            return record
          })
          expect(snapshot.decodedWidth).toBeGreaterThan(0)
          expect(snapshot.time - snapshot.base).toBeGreaterThanOrEqual(14)
          // load(rows) appends by public contract; old rows stay in the queue.
          expect(snapshot.queue).toBe((cycle + 1) * 12 * rate)
          expect(Object.values(snapshot.states).reduce((sum, count) => sum + count, 0)).toBe(snapshot.queue)
          if (implementation === 'candidate') {
            expect(snapshot.missedSampling).toEqual([])
            expect(snapshot.sampledNotVisible).toEqual([])
            expect(snapshot.visibleCount).toBe(12 * rate)
            expect(snapshot.uniqueVisible).toBe(12 * rate)
            expect(snapshot.referenced).toBe(0)
            expect(snapshot.uniquePool).toBe(snapshot.pooled)
            expect(snapshot.nodes).toBe(snapshot.pooled)
            expect(snapshot.uniqueStateMembers).toBe(snapshot.queue)
            expect(snapshot.validStateMembers).toBe(true)
          }
        }
      }
      finally {
        const evidence = await page.evaluate(() => {
          cancelAnimationFrame(window.stabilityFrame)
          window.art.destroy()
          return { ...window.stabilityEvidence, destroyed: window.art.isDestroy, retainedPlayerRoots: document.querySelectorAll('.art-video-player').length }
        })
        await testInfo.attach('danmuku-stability-observation', { contentType: 'application/json', body: JSON.stringify({ implementation, rate, sha256: hash(code), evidence, scope: 'Three bounded real media cycles; published defects are observed, candidate delivery and resource ownership are asserted. Optional unforced heap readings are not leak proof or comparable across engines.' }) })
        expect(evidence.destroyed).toBe(true)
        expect(evidence.retainedPlayerRoots).toBe(0)
        expect(evidence.errors).toEqual([])
        expect(evidence.workers).toHaveLength(1)
        if (implementation === 'candidate' && evidence.cycles.length === 3) {
          const expected = evidence.cycles.flatMap(cycle => cycle.rows.map(row => row.id)).sort()
          expect(evidence.visible.map(row => row.id).sort()).toEqual(expected)
          expect(evidence.recycled.map(row => row.id).sort()).toEqual(expected)
          expect(evidence.bypassedPool).toBe(0)
          expect(evidence.reuses).toBeGreaterThan(0)
          expect(evidence.allocations + evidence.reuses).toBe(expected.length)
          expect(evidence.cycles.at(-1).nodes).toBe(evidence.allocations)
        }
        for (const worker of evidence.workers) {
          expect(worker.terminated).toBe(1)
          expect(worker.errors).toEqual([])
          if (implementation === 'candidate')
            expect(worker.posts).toBe(worker.replies)
        }
      }
    })
  }
}
