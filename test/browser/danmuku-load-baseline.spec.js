import assert from 'node:assert/strict'
import fs from 'node:fs'
import { ensureArchive, hash, readMember } from '../../refactor/scripts/releases.mjs'
import { expect, test } from './fixtures.js'

const baseline = JSON.parse(fs.readFileSync(new URL('../../refactor/baselines/danmuku-release.json', import.meta.url), 'utf8'))
const release = baseline.release
const mediaSha256 = hash(fs.readFileSync(new URL('./media/pattern.mp4', import.meta.url)))
const implementations = new Map()
assert.equal(release.version, '5.3.0')

test.beforeAll(async () => {
  const archive = await ensureArchive(release)
  for (const format of ['main', 'legacy']) {
    const member = `package/${release.manifest[format].replace(/^\.\//u, '')}`
    const bytes = readMember(archive, member)
    assert.equal(hash(bytes), release.files[member])
    implementations.set(format, { member, sha256: hash(bytes), code: bytes.toString() })
  }
})

test.afterEach(async ({ page }, testInfo) => {
  await page.evaluate(() => {
    if (window.loadObserverFrame !== undefined)
      cancelAnimationFrame(window.loadObserverFrame)
    if (window.loadArt && !window.loadArt.isDestroy)
      window.loadArt.destroy()
  })
  await testInfo.attach('danmuku-load-final-observations', { contentType: 'application/json', body: JSON.stringify(await page.evaluate(() => ({
    evidence: window.loadEvidence,
    destroyed: window.loadArt?.isDestroy,
    retainedPlayerRoots: document.querySelectorAll('#danmuku-load-player .art-video-player').length,
    retainedExternalSettings: document.querySelectorAll('#danmuku-load-mount .artplayer-plugin-danmuku').length,
  }))) })
})

for (const format of ['main', 'legacy']) {
  test(`published core / Danmuku 5.3.0 ${format}: 300-comment native load and frame/heap observation`, async ({ page }, testInfo) => {
    const external = []
    const origin = new URL(testInfo.project.use.baseURL).origin
    await page.route('**/*', (route) => {
      const url = new URL(route.request().url())
      if (url.origin !== origin) {
        external.push(url.href)
        return route.abort()
      }
      return route.continue()
    })
    await page.goto('/test/player.html?core=published')
    await page.evaluate(() => {
      window.loadEvidence = { workers: [], loaded: [], visible: [], frameTimes: [], filtered: 0, heaps: [], failures: [], destroyEvents: 0 }
      window.readLoadHeap = (phase) => {
        const memory = performance.memory
        const snapshot = memory && [memory.usedJSHeapSize, memory.totalJSHeapSize, memory.jsHeapSizeLimit].every(Number.isFinite)
          ? { usedJSHeapSize: memory.usedJSHeapSize, totalJSHeapSize: memory.totalJSHeapSize, jsHeapSizeLimit: memory.jsHeapSizeLimit }
          : null
        window.loadEvidence.heaps.push({ phase, timestamp: performance.now(), memory: snapshot })
      }
      window.readLoadHeap('before-plugin-script')
      const NativeWorker = window.Worker
      window.Worker = class ObservedLoadWorker extends NativeWorker {
        constructor(url, options) {
          super(url, options)
          this.observation = { url: String(url), posts: 0, replies: 0, terminated: 0, errors: [] }
          window.loadEvidence.workers.push(this.observation)
          this.addEventListener('message', () => this.observation.replies++)
          this.addEventListener('error', event => this.observation.errors.push(event.message))
        }

        postMessage(message, ...options) {
          this.observation.posts++
          return super.postMessage(message, ...options)
        }

        terminate() {
          this.observation.terminated++
          return super.terminate()
        }
      }
      // Independent observer: never replace the plugin's RAF or mutate its clock.
      function frame(timestamp) {
        if (window.loadArt?.playing)
          window.loadEvidence.frameTimes.push(timestamp)
        window.loadObserverFrame = requestAnimationFrame(frame)
      }
      window.loadObserverFrame = requestAnimationFrame(frame)
    })
    const implementation = implementations.get(format)
    await page.addScriptTag({ content: implementation.code })
    await testInfo.attach('danmuku-load-inputs', { contentType: 'application/json', body: JSON.stringify({ core: 'published', coreVersion: await page.evaluate(() => window.Artplayer.version), pluginVersion: release.version, format, member: implementation.member, sha256: implementation.sha256, integrity: release.integrity, mediaSha256, comments: 300, modes: [0, 1, 2], scheduledTime: 0.5, heatmap: false, scope: 'Single bounded native sample; independent RAF observer and optional performance.memory readings. No forced GC, leak diagnosis, cross-browser heap equivalence or performance threshold.' }) })
    await page.evaluate(async () => {
      const container = document.querySelector('.player')
      container.id = 'danmuku-load-player'
      container.style.cssText = 'width:640px;height:360px'
      const mount = document.createElement('div')
      mount.id = 'danmuku-load-mount'
      mount.style.cssText = 'width:640px;height:36px;background:#333'
      container.after(mount)
      const art = window.loadArt = new window.Artplayer({ container, url: '/test/pattern.mp4?case=danmuku-load-300', muted: true })
      art.on('artplayerPluginDanmuku:loaded', queue => window.loadEvidence.loaded.push({ count: queue.length, ids: queue.map(item => item.id) }))
      art.on('artplayerPluginDanmuku:visible', item => window.loadEvidence.visible.push({ id: item.id, mode: item.mode, mediaTime: art.currentTime, timestamp: performance.now() }))
      art.on('artplayerPluginDanmuku:error', error => window.loadEvidence.failures.push(String(error)))
      art.on('artplayerPluginDanmuku:destroy', () => window.loadEvidence.destroyEvents++)
      art.plugins.add(window.artplayerPluginDanmuku({
        danmuku: [],
        mount,
        heatmap: false,
        speed: 8,
        fontSize: 18,
        margin: [10, 10],
        antiOverlap: true,
        filter(item) {
          window.loadEvidence.filtered++
          return item.id.startsWith('load-')
        },
      }))
      const plugin = window.loadPlugin = art.plugins.artplayerPluginDanmuku
      const input = Array.from({ length: 300 }, (_, index) => ({ id: `load-${String(index).padStart(3, '0')}`, text: `Load ${index}`, mode: index % 3, time: 0.5 }))
      await plugin.load(input)
      window.readLoadHeap('after-300-loaded')
      document.querySelector('#play').onclick = () => art.play()
      document.querySelector('#pause').onclick = () => art.pause()
    })
    await expect.poll(() => page.evaluate(() => window.loadArt.isReady && window.loadArt.template.$video.videoWidth > 0)).toBe(true)
    const loaded = await page.evaluate(() => ({ latest: window.loadEvidence.loaded.at(-1), filtered: window.loadEvidence.filtered }))
    expect(loaded.latest.count).toBe(300)
    expect(new Set(loaded.latest.ids).size).toBe(300)
    expect(loaded.filtered).toBe(300)
    await page.click('#play')
    // A state deadline, not a performance pass/fail budget or a fixed sleep.
    await expect.poll(() => page.evaluate(() => window.loadArt.currentTime), { timeout: 15000 }).toBeGreaterThanOrEqual(4)
    await page.click('#pause')
    await expect.poll(() => page.evaluate(() => window.loadArt.template.$video.paused && window.loadPlugin.isStop)).toBe(true)
    const sample = await page.evaluate(() => {
      cancelAnimationFrame(window.loadObserverFrame)
      window.loadObserverFrame = undefined
      window.readLoadHeap('paused-after-four-media-seconds')
      const art = window.loadArt
      const rect = art.template.$player.getBoundingClientRect()
      const nodes = [...art.template.$danmuku.children].map((node) => {
        const position = node.getBoundingClientRect()
        const style = getComputedStyle(node)
        return { id: node.dataset.id, state: node.dataset.state, mode: node.dataset.mode, text: node.textContent, x: position.x - rect.x, y: position.y - rect.y, width: position.width, height: position.height, visibility: style.visibility, display: style.display }
      })
      const times = window.loadEvidence.frameTimes
      const frameIntervals = times.slice(1).map((timestamp, index) => timestamp - times[index])
      const sorted = [...frameIntervals].sort((a, b) => a - b)
      return {
        coreVersion: window.Artplayer.version,
        mediaTime: art.currentTime,
        video: { width: art.template.$video.videoWidth, height: art.template.$video.videoHeight, duration: art.duration },
        loadedCount: window.loadEvidence.loaded.at(-1).count,
        visibleEvents: window.loadEvidence.visible.length,
        uniqueVisible: new Set(window.loadEvidence.visible.map(item => item.id)).size,
        nodeCount: nodes.length,
        visibleNodeCount: nodes.filter(node => node.visibility === 'visible' && node.display !== 'none').length,
        hiddenNodeCount: nodes.filter(node => node.visibility === 'hidden' || node.display === 'none').length,
        nodes,
        frameTimes: times,
        frameIntervals,
        frameSummary: { count: frameIntervals.length, median: sorted[Math.floor(sorted.length / 2)] ?? null, p95: sorted[Math.floor(sorted.length * 0.95)] ?? null, max: sorted.at(-1) ?? null },
        heaps: window.loadEvidence.heaps,
        workers: window.loadEvidence.workers,
      }
    })
    await testInfo.attach('danmuku-load-sample', { contentType: 'application/json', body: JSON.stringify(sample) })
    await testInfo.attach('danmuku-load-screenshot', { contentType: 'image/png', body: await page.screenshot() })
    expect(sample.mediaTime).toBeGreaterThanOrEqual(4)
    expect(sample.uniqueVisible).toBeGreaterThan(0)
    expect(sample.visibleNodeCount).toBeGreaterThan(0)
    expect(sample.frameIntervals.length).toBeGreaterThan(1)
    expect(sample.workers).toHaveLength(1)
    expect(sample.workers[0].url).toMatch(/^blob:/u)
    expect(sample.workers[0].posts).toBeGreaterThan(0)
    expect(sample.workers[0].replies).toBeGreaterThan(0)
    expect(sample.workers[0].errors).toEqual([])
    await page.evaluate(() => {
      window.loadArt.destroy()
      window.readLoadHeap('immediately-after-destroy')
    })
    expect(await page.evaluate(() => window.loadArt.isDestroy)).toBe(true)
    expect(await page.evaluate(() => window.loadEvidence.destroyEvents)).toBe(1)
    expect(await page.evaluate(() => window.loadEvidence.workers[0].terminated)).toBe(1)
    expect(external).toEqual([])
  })
}
