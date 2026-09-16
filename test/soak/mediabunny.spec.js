import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import { hash } from '../../refactor/scripts/releases.mjs'
import { expect, test } from '../browser/fixtures.js'
import { mbCandidate } from '../helpers/mediabunny.js'
import { soakOptions } from '../helpers/soak-options.js'

assert(process.env.ARTPLAYER_MB_ARTIFACT || process.env.ARTPLAYER_BROWSER_ARTIFACTS, 'Soak requires an explicit built artifact or verified installed artifact map')
const implementation = await mbCandidate()
const { phaseSeconds, minimumMediaSeconds } = soakOptions(process.env.ARTPLAYER_MB_SOAK_SECONDS)
assert(process.env.ARTPLAYER_MB_SOAK_MEDIA, 'Generate and specify the long HLS fixture directory')
const directory = path.resolve(process.env.ARTPLAYER_MB_SOAK_MEDIA)
const manifestBytes = fs.readFileSync(path.join(directory, 'manifest.json'))
const manifest = JSON.parse(manifestBytes)
assert(manifest.duration >= minimumMediaSeconds, `Soak needs at least ${minimumMediaSeconds} seconds of media for both uninterrupted phases`)
const media = new Map(Object.entries(manifest.files).map(([name, expected]) => {
  assert.equal(path.basename(name), name)
  const bytes = fs.readFileSync(path.join(directory, name))
  assert.equal(hash(bytes), expected.sha256, name)
  return [name, { file: path.join(directory, name), sha256: expected.sha256 }]
}))

for (const core of ['published', 'candidate']) {
  test(`MediaBunny sustained HLS playback with ${core} core`, async ({ page }, testInfo) => {
    await page.route('**/mb-soak/**', async (route) => {
      const name = new URL(route.request().url()).pathname.split('/').at(-1)
      const entry = media.get(name)
      const body = entry && fs.readFileSync(entry.file)
      if (body)
        assert.equal(hash(body), entry.sha256, 'Soak media changed during playback')
      await route.fulfill({ status: body ? 200 : 404, body: body || 'Missing fixture', contentType: name.endsWith('.m3u8') ? 'application/vnd.apple.mpegurl' : 'video/mp2t' })
    })
    await page.goto(`/test/player.html?core=${core}`)
    const capabilities = await page.evaluate(() => ({ audio: typeof window.AudioContext, videoDecoder: typeof window.VideoDecoder, audioDecoder: typeof window.AudioDecoder }))
    const evidence = { core, implementation: implementation.name, sha256: hash(implementation.code), manifestSha256: hash(manifestBytes), mediaDuration: manifest.duration, requestedPhaseSeconds: phaseSeconds, capabilities, outcome: 'incomplete', phases: [], checkpoints: [] }
    const progressFile = testInfo.outputPath('progress.jsonl')
    fs.mkdirSync(path.dirname(progressFile), { recursive: true })
    fs.writeFileSync(progressFile, `${JSON.stringify({ kind: 'started', project: testInfo.project.name, ...evidence })}\n`)
    if (Object.values(capabilities).some(value => value !== 'function')) {
      evidence.outcome = 'missing-native-capability-control'
      await testInfo.attach('mediabunny-soak', { contentType: 'application/json', body: JSON.stringify(evidence) })
      return
    }
    await page.addScriptTag({ content: `(() => { const module = { exports: {} }; const exports = module.exports; ${implementation.code}; window.mbFactory = module.exports.default || module.exports; })();` })
    await page.evaluate(() => {
      const active = new Set()
      const iterators = new Set()
      const counters = { created: 0, disconnected: 0, maxActive: 0, draws: 0 }
      window.mbSoak = { active, iterators, counters, phase: null, stats: {}, contexts: new Set() }
      const create = AudioContext.prototype.createBufferSource
      AudioContext.prototype.createBufferSource = function (...args) {
        window.mbSoak.contexts.add(this)
        const node = create.apply(this, args)
        active.add(node)
        counters.created++
        counters.maxActive = Math.max(counters.maxActive, active.size)
        const disconnect = node.disconnect.bind(node)
        node.disconnect = (...args) => {
          const result = disconnect(...args)
          if (active.delete(node))
            counters.disconnected++
          return result
        }
        return node
      }
      window.art = new window.Artplayer({ container: '.player', url: '/mb-soak/master.m3u8', muted: true, proxy: window.mbFactory() })
      window.mbCanvas = window.art.video
      document.querySelector('#play').onclick = () => {
        window.mbPlaying = window.art.play()
      }
    })
    try {
      await expect.poll(() => page.evaluate(() => window.art.isReady)).toBe(true)
      await page.evaluate(async () => {
        const engine = window.mbCanvas.engine
        const times = new WeakMap()
        for (const [sink, method] of [[engine.video.videoSink, 'canvases'], [engine.audio.audioSink, 'buffers']]) {
          const prototype = Object.getPrototypeOf(sink)
          const original = prototype[method]
          prototype[method] = function (...args) {
            const iterator = original.apply(this, args)
            window.mbSoak.iterators.add(iterator)
            const next = iterator.next.bind(iterator)
            const finish = iterator.return.bind(iterator)
            iterator.next = async (...args) => {
              try {
                const value = await next(...args)
                if (value.done)
                  window.mbSoak.iterators.delete(iterator)
                else if (method === 'canvases')
                  times.set(value.value.canvas, value.value.timestamp)
                return value
              }
              catch (error) {
                window.mbSoak.iterators.delete(iterator)
                throw error
              }
            }
            iterator.return = async (...args) => {
              try {
                return await finish(...args)
              }
              finally { window.mbSoak.iterators.delete(iterator) }
            }
            return iterator
          }
        }
        const draw = engine.video.ctx.drawImage.bind(engine.video.ctx)
        engine.video.ctx.drawImage = (...args) => {
          const state = window.mbSoak
          state.counters.draws++
          if (state.phase && times.has(args[0]) && !window.mbCanvas.paused) {
            const stats = state.stats[state.phase]
            const delta = Math.abs(times.get(args[0]) - engine.audio.currentTime)
            stats.frames++
            stats.maxError = Math.max(stats.maxError, delta)
            stats.sumError += delta
            stats.histogram[Math.min(1000, Math.floor(delta * 1000))]++
          }
          return draw(...args)
        }
        await engine.seek(1)
      })
      await page.click('#play')
      await page.evaluate(() => window.mbPlaying)
      const snapshot = () => page.evaluate(() => ({ wall: performance.now(), time: window.mbCanvas.currentTime, rate: window.mbCanvas.playbackRate, active: window.mbSoak.active.size, queued: window.mbCanvas.engine.audio.queuedNodes.size, iterators: window.mbSoak.iterators.size, draws: window.mbSoak.counters.draws, visibility: document.visibilityState, paused: window.mbCanvas.paused, error: window.mbCanvas.error, maxAVError: window.mbSoak.stats[window.mbSoak.phase]?.maxError ?? null }))
      async function sustain(name, seconds, rate) {
        await page.evaluate((name) => {
          window.mbSoak.stats[name] = { frames: 0, maxError: 0, sumError: 0, histogram: Array.from({ length: 1001 }, () => 0) }
          window.mbSoak.phase = name
        }, name)
        const start = await snapshot()
        let last = start
        while (last.wall - start.wall < seconds * 1000) {
          await page.waitForTimeout(5000)
          const current = await snapshot()
          evidence.checkpoints.push({ phase: name, ...current })
          fs.appendFileSync(progressFile, `${JSON.stringify({ kind: 'sample', phase: name, ...current })}\n`)
          expect(current.visibility).toBe('visible')
          expect(current.error).toBeNull()
          expect(current.paused).toBe(false)
          expect(current.rate).toBe(rate)
          expect(current.time).toBeGreaterThan(last.time + 2)
          expect(current.draws).toBeGreaterThan(last.draws + 20)
          expect(current.active).toBeLessThan(96)
          expect(current.iterators).toBeLessThanOrEqual(2)
          last = current
        }
        const stats = await page.evaluate(() => {
          const state = window.mbSoak
          const stats = state.stats[state.phase]
          state.phase = null
          return stats
        })
        const wallSeconds = (last.wall - start.wall) / 1000
        evidence.phases.push({ name, wallSeconds, mediaSeconds: last.time - start.time, rate, ...stats })
        expect(wallSeconds).toBeGreaterThanOrEqual(seconds)
        expect(Math.abs(last.time - start.time - wallSeconds * rate)).toBeLessThan(1)
        expect(stats.frames).toBeGreaterThan(seconds * 12)
        expect(stats.maxError).toBeLessThan(0.25)
      }
      await sustain('continuous-1x', phaseSeconds, 1)
      await page.evaluate(() => {
        window.mbCanvas.playbackRate = 2
      })
      await sustain('continuous-2x', phaseSeconds, 2)
      await page.evaluate(async () => {
        window.mbCanvas.playbackRate = 1
        await window.mbCanvas.engine.seek(100)
      })
      await sustain('after-seek', 5, 1)
      await page.evaluate(async () => {
        const state = await window.mbCanvas.getM3u8State()
        await window.mbCanvas.switchM3u8Quality(state.levels.find(level => level.height === 90).id)
      })
      await sustain('after-quality', 5, 1)
      await page.evaluate(async () => {
        const state = await window.mbCanvas.getM3u8State()
        await window.mbCanvas.switchM3u8Audio(state.audios.find(audio => audio.lang === 'fr').id)
      })
      await sustain('after-audio', 5, 1)
      const selection = await page.evaluate(async () => {
        const state = await window.mbCanvas.getM3u8State()
        return { height: state.currentLevel.height, language: state.currentAudio.lang }
      })
      expect(selection).toEqual({ height: 90, language: 'fr' })
      evidence.selection = selection
      evidence.outcome = 'native-sustained-hls-playback'
    }
    finally {
      await page.evaluate(() => window.art.destroy(false))
      await expect.poll(() => page.evaluate(() => ({ active: window.mbSoak.active.size, iterators: window.mbSoak.iterators.size, contextsClosed: [...window.mbSoak.contexts].every(context => context.state === 'closed') }))).toEqual({ active: 0, iterators: 0, contextsClosed: true })
      const cleanup = await page.evaluate(() => ({ ...window.mbSoak.counters, audioIterator: Boolean(window.mbCanvas.engine.audio.audioIterator), videoIterator: Boolean(window.mbCanvas.engine.video.videoIterator), queued: window.mbCanvas.engine.audio.queuedNodes.size, destroyed: window.mbCanvas.engine.destroyed }))
      await page.waitForTimeout(300)
      expect(await page.evaluate(() => window.mbSoak.counters.draws)).toBe(cleanup.draws)
      expect(await page.evaluate(() => window.mbSoak.counters.created)).toBe(cleanup.created)
      expect(cleanup).toMatchObject({ audioIterator: false, videoIterator: false, queued: 0, destroyed: true })
      expect(cleanup.created).toBe(cleanup.disconnected)
      evidence.cleanup = cleanup
      evidence.scope = `Actual ${manifest.duration}s generated HLS input, requested ${phaseSeconds}s wall playback at each of 1x/2x then seek/quality/audio; achieved duration is recorded per phase. Decoded frame vs audio clock, not acoustic output, heap leak proof, background throttling or physical devices. Only active nodes/iterators are retained by instrumentation; fixture files are read on demand.`
      await testInfo.attach('mediabunny-soak', { contentType: 'application/json', body: JSON.stringify(evidence) })
    }
  })
}
