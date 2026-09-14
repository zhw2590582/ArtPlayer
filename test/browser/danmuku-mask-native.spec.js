import assert from 'node:assert/strict'
import fs from 'node:fs'
import process from 'node:process'
import { ensureArchive, hash, readMember } from '../../refactor/scripts/releases.mjs'
import { browserCandidate } from '../helpers/browser-candidate.js'
import { observeDanmukuLoad } from '../helpers/danmuku-combination-load.js'
import { danmukuMaskAssets } from '../helpers/danmuku-mask-assets.js'
import { expect, test } from './fixtures.js'

let artifact
let provenance
let danmukuProvenance
let code
const assets = danmukuMaskAssets(process.cwd()).map(resource => resource.source)
const media = 'docs/assets/sample/steve-jobs.mp4'
let danmukuFile
let danmukuCode
const danmukuImplementations = new Map()
test.beforeAll(async () => {
  const [mask, danmuku] = await Promise.all([
    browserCandidate('artplayer-plugin-danmuku-mask', process.env.ARTPLAYER_MASK_ARTIFACT),
    browserCandidate('artplayer-plugin-danmuku', process.env.ARTPLAYER_DANMUKU_ARTIFACT),
  ])
  code = mask.code
  provenance = mask.provenance
  artifact = provenance.file || provenance.kind
  danmukuCode = danmuku.code
  danmukuProvenance = danmuku.provenance
  danmukuFile = danmukuProvenance.file || danmukuProvenance.kind
  const release = JSON.parse(fs.readFileSync('refactor/baselines/danmuku-release.json', 'utf8')).release
  const member = 'package/dist/artplayer-plugin-danmuku.js'
  const published = readMember(await ensureArchive(release), member)
  assert.equal(hash(published), release.files[member])
  danmukuImplementations.set('published', { file: `npm ${release.version}`, code: published.toString() })
  danmukuImplementations.set('candidate', { file: danmukuFile, code: danmukuCode, provenance: danmukuProvenance })
})

for (const core of ['candidate', 'published', 'published-5.3.1-beta.1']) {
  test(`Mask actual local MediaPipe model renders, stops and restarts with ${core} core`, async ({ page }, testInfo) => {
    test.setTimeout(90000) // Includes two actual model initializations and native video decoding.
    await testInfo.attach('mask-selected-input', { contentType: 'application/json', body: JSON.stringify({ core, provenance }) })
    const external = []
    const resources = []
    const origin = new URL(testInfo.project.use.baseURL).origin
    await page.route('**/*', (route) => {
      if (new URL(route.request().url()).origin !== origin) {
        external.push(route.request().url())
        return route.abort()
      }
      return route.continue()
    })
    page.on('response', (response) => {
      if (response.url().includes('/assets/@mediapipe/'))
        resources.push({ url: response.url(), status: response.status() })
    })
    await page.goto(`/test/player.html?core=${core}`)
    await page.addScriptTag({ content: code })
    await page.evaluate(() => {
      window.maskNative = { outputs: [], snapshots: [] }
      const encode = HTMLCanvasElement.prototype.toDataURL
      HTMLCanvasElement.prototype.toDataURL = function (...args) {
        const url = encode.apply(this, args)
        window.maskNative.outputs.push({ canvas: this, url, time: window.art?.currentTime })
        return url
      }
      window.createPlayer('/assets/sample/steve-jobs.mp4')
      window.art.plugins.add(window.artplayerPluginDanmukuMask({ solutionPath: '/assets/@mediapipe/selfie_segmentation' }))
      window.maskPlugin = window.art.plugins.artplayerPluginDanmukuMask
      window.maskLayer = window.art.template.$danmuku
    })
    try {
      await expect.poll(() => page.evaluate(() => window.art.duration)).toBeGreaterThan(1)
      await page.evaluate(() => {
        window.art.currentTime = Math.min(5, window.art.duration / 2)
      })
      await page.locator('#play').click()
      await page.evaluate(() => window.maskPlugin.start())
      await expect.poll(() => page.evaluate(() => window.maskNative.outputs.length), { timeout: 30000 }).toBeGreaterThan(1)
      const first = await page.evaluate(async () => {
        const records = window.maskNative.outputs
        const output = records.at(-1)
        const image = new Image()
        image.src = output.url
        await image.decode()
        const canvas = document.createElement('canvas')
        canvas.width = image.naturalWidth
        canvas.height = image.naturalHeight
        const ctx = canvas.getContext('2d')
        ctx.drawImage(image, 0, 0)
        const pixels = ctx.getImageData(0, 0, canvas.width, canvas.height).data
        let transparent = 0
        let opaque = 0
        for (let i = 3; i < pixels.length; i += 4) {
          if (pixels[i] === 0)
            transparent++
          if (pixels[i] === 255)
            opaque++
        }
        const value = { time: window.art.currentTime, firstTime: records[0].time, lastTime: output.time, width: canvas.width, height: canvas.height, transparent, opaque, pixels: pixels.length / 4, maskImage: window.maskLayer.style.maskImage.slice(0, 45), outputs: records.length }
        window.maskNative.snapshots.push(value)
        return value
      })
      expect(first.width).toBeGreaterThan(0)
      expect(first.height).toBeGreaterThan(0)
      expect(first.lastTime).toBeGreaterThan(first.firstTime)
      expect(first.transparent).toBeGreaterThan(0)
      expect(first.opaque).toBeGreaterThan(0)
      expect(first.maskImage).toContain('data:image/png')
      await testInfo.attach('actual-model-page', { body: await page.screenshot(), contentType: 'image/png' })
      await page.evaluate(() => {
        window.maskPlugin.stop()
        window.stoppedOutputCount = window.maskNative.outputs.length
      })
      await expect.poll(() => page.evaluate(() => window.maskNative.outputs.every(({ canvas }) => canvas.width === 0 && canvas.height === 0))).toBe(true)
      expect(await page.evaluate(() => window.maskLayer.style.maskImage)).toBe('none')
      await page.waitForTimeout(500) // Bounded native observation after output cleanup.
      expect(await page.evaluate(() => window.maskNative.outputs.length)).toBe(await page.evaluate(() => window.stoppedOutputCount))
      expect(await page.evaluate(() => window.maskLayer.style.maskImage)).toBe('none')
      await page.evaluate(() => window.maskPlugin.start())
      await expect.poll(() => page.evaluate(() => window.maskNative.outputs.length > window.stoppedOutputCount), { timeout: 30000 }).toBe(true)
      await page.evaluate(() => {
        window.art.destroy(false)
        window.destroyedOutputCount = window.maskNative.outputs.length
      })
      await expect.poll(() => page.evaluate(() => window.maskNative.outputs.every(({ canvas }) => canvas.width === 0 && canvas.height === 0))).toBe(true)
      expect(await page.evaluate(() => window.maskLayer.style.maskImage)).toBe('none')
      await page.waitForTimeout(500)
      expect(await page.evaluate(() => window.maskNative.outputs.length)).toBe(await page.evaluate(() => window.destroyedOutputCount))
      expect(await page.evaluate(() => window.maskLayer.style.maskImage)).toBe('none')
      expect(external).toEqual([])
      expect(resources.some(item => item.url.endsWith('.wasm') && item.status === 200)).toBe(true)
      expect(resources.every(item => item.status === 200)).toBe(true)
    }
    finally {
      const state = await page.evaluate(() => ({ snapshots: window.maskNative?.snapshots, outputs: window.maskNative?.outputs.map(({ canvas, time }) => ({ width: canvas.width, height: canvas.height, time })), video: window.art ? { time: window.art.currentTime, duration: window.art.duration, paused: window.art.video.paused, size: [window.art.video.videoWidth, window.art.video.videoHeight] } : null, mask: window.maskLayer?.style.maskImage?.slice(0, 80) }))
      await testInfo.attach('actual-model-evidence', { body: JSON.stringify({ artifact, provenance, sha256: hash(code), core, assets, media: { file: media, sha256: hash(fs.readFileSync(media)) }, external, resources, state, limitation: 'Actual SDK/model, native video and output bitmap lifecycle. No assertion of private MediaPipe/GPU closure or Danmuku layout composition.' }, null, 2), contentType: 'application/json' })
      await page.evaluate(() => {
        if (window.art && !window.art.isDestroy)
          window.art.destroy()
      })
    }
  })

  for (const implementation of ['published', 'candidate']) {
    test(`Mask actual model and Danmuku share the layer through pause, seek and web fullscreen with ${core} core / ${implementation} plugin`, async ({ page }, testInfo) => {
      const danmuku = danmukuImplementations.get(implementation)
      await testInfo.attach('mask-selected-input', { contentType: 'application/json', body: JSON.stringify({ core, implementation, provenance, danmuku: danmuku.provenance || { kind: 'published', sha256: hash(danmuku.code) } }) })
      test.setTimeout(90000)
      await page.goto(`/test/player.html?core=${core}`)
      await page.addScriptTag({ content: danmuku.code })
      await page.addScriptTag({ content: code })
      const unexpected = []
      let load
      const origin = new URL(testInfo.project.use.baseURL).origin
      await page.route('**/*', (route) => {
        if (new URL(route.request().url()).origin !== origin) {
          unexpected.push(route.request().url())
          return route.abort()
        }
        return route.continue()
      })
      await page.evaluate(() => {
        window.maskCombination = { times: [], visible: [], snapshots: [], samples: [] }
        const encode = HTMLCanvasElement.prototype.toDataURL
        HTMLCanvasElement.prototype.toDataURL = function (...args) {
          const result = encode.apply(this, args)
          window.maskCombination.times.push(window.art?.currentTime)
          return result
        }
        window.art = new window.Artplayer({
          container: '.player',
          url: '/assets/sample/steve-jobs.mp4',
          muted: true,
          fullscreenWeb: true,
          plugins: [window.artplayerPluginDanmuku({ danmuku: [{ text: 'Native mask combination', time: 6, mode: 1 }], heatmap: false }), window.artplayerPluginDanmukuMask({ solutionPath: '/assets/@mediapipe/selfie_segmentation' })],
        })
        window.maskCombination.layer = window.art.template.$danmuku
        const owner = window.art.plugins.artplayerPluginDanmuku.config({})
        const ready = Object.getOwnPropertyDescriptor(Object.getPrototypeOf(owner), 'readys').get
        Object.defineProperty(owner, 'readys', { configurable: true, get() {
          const rows = ready.call(this)
          window.maskCombination.samples.push({ time: window.art.currentTime, wall: performance.now(), rows: rows.map(row => ({ time: row.time, text: row.text })) })
          return rows
        } })
        window.art.on('artplayerPluginDanmuku:visible', (row) => {
          const node = row.$ref
          const rect = node?.getBoundingClientRect()
          window.maskCombination.visible.push({ text: row.text, connected: node?.isConnected, inLayer: node ? window.maskCombination.layer.contains(node) : false, width: rect?.width, height: rect?.height, display: node ? getComputedStyle(node).display : null })
        })
        document.querySelector('#play').onclick = () => window.art.play()
        document.querySelector('#pause').onclick = () => window.art.pause()
        window.maskSnapshot = (phase) => {
          const layer = window.art.template.$danmuku
          const rect = layer.getBoundingClientRect()
          const snapshot = { phase, time: window.art.currentTime, outputs: window.maskCombination.times.length, sameLayer: layer === window.maskCombination.layer, mask: layer.style.maskImage.startsWith('url('), mode: getComputedStyle(layer).maskMode, width: rect.width, height: rect.height, fullscreenWeb: window.art.fullscreenWeb }
          window.maskCombination.snapshots.push(snapshot)
          return snapshot
        }
      })
      try {
        await expect.poll(() => page.evaluate(() => window.art.duration)).toBeGreaterThan(20)
        await page.evaluate(() => {
          window.art.currentTime = 5
        })
        await page.locator('#play').click()
        await expect.poll(() => page.evaluate(() => window.maskCombination.times.length), { timeout: 30000 }).toBeGreaterThan(2)
        // Keep the startup row and sampling history as diagnostics: native model
        // initialization may block its narrow existing timestamp window. Exercise
        // the ongoing combination after the real model has become operational.
        await page.evaluate(async () => {
          const time = window.art.currentTime + 1
          window.maskCombination.scheduled = time
          await window.art.plugins.artplayerPluginDanmuku.load([{ text: 'Ready mask combination', time, mode: 1 }])
        })
        await expect.poll(() => page.evaluate(() => window.maskCombination.visible.map(row => row.text))).toContain('Ready mask combination')
        const row = await page.evaluate(() => window.maskCombination.visible.find(row => row.text === 'Ready mask combination'))
        expect(row.connected && row.inLayer).toBe(true)
        expect(row.width).toBeGreaterThan(0)
        expect(row.height).toBeGreaterThan(0)
        expect(row.display).not.toBe('none')
        const initial = await page.evaluate(() => window.maskSnapshot('playing'))
        expect(initial.mask).toBe(true)
        expect(initial.sameLayer).toBe(true)
        await page.locator('#pause').click()
        await expect.poll(() => page.evaluate(() => window.art.video.paused)).toBe(true)
        // Wait native frames for the already-running SDK frame to finish. Compare
        // its media timestamp, rather than forbidding one legitimate late encode.
        const paused = await page.evaluate(async () => {
          const time = window.art.currentTime
          const beforeOutputs = window.maskCombination.times.length
          await new Promise(resolve => setTimeout(resolve, 500))
          return { before: time, after: window.art.currentTime, extraOutputs: window.maskCombination.times.length - beforeOutputs, snapshot: window.maskSnapshot('paused') }
        })
        expect(Math.abs(paused.after - paused.before)).toBeLessThan(0.01)
        expect(paused.extraOutputs).toBeLessThanOrEqual(1)
        await page.evaluate(async () => {
          const seeked = new Promise(resolve => window.art.video.addEventListener('seeked', resolve, { once: true }))
          window.art.currentTime = 20
          window.art.fullscreenWeb = true
          await seeked
          window.maskCombination.seeked = { time: window.art.currentTime, outputs: window.maskCombination.times.length }
        })
        await expect.poll(() => page.evaluate(() => window.art.currentTime)).toBeGreaterThanOrEqual(19.9)
        const full = await page.evaluate(() => window.maskSnapshot('fullscreen-paused'))
        expect(full.sameLayer).toBe(true)
        expect(full.fullscreenWeb).toBe(true)
        expect(full.width).toBeGreaterThan(initial.width)
        await page.evaluate(() => window.art.play())
        await expect.poll(() => page.evaluate(() => window.maskCombination.times.length - window.maskCombination.seeked.outputs), { timeout: 30000 }).toBeGreaterThanOrEqual(2)
        expect(await page.evaluate(() => window.maskCombination.times.at(-1))).toBeGreaterThan(20)
        await page.evaluate(async () => {
          window.art.fullscreenWeb = false
          window.art.plugins.artplayerPluginDanmuku.hide()
          window.art.plugins.artplayerPluginDanmuku.show()
          await window.art.plugins.artplayerPluginDanmuku.load([{ text: 'After seek and visibility', time: window.art.currentTime + 1, mode: 1 }])
        })
        await expect.poll(() => page.evaluate(() => window.maskCombination.visible.map(row => row.text))).toContain('After seek and visibility')
        const afterRow = await page.evaluate(() => window.maskCombination.visible.find(row => row.text === 'After seek and visibility'))
        expect(afterRow.connected && afterRow.inLayer).toBe(true)
        expect(afterRow.width).toBeGreaterThan(0)
        expect(afterRow.height).toBeGreaterThan(0)
        expect(afterRow.display).not.toBe('none')
        const restored = await page.evaluate(() => window.maskSnapshot('restored'))
        expect(restored.sameLayer).toBe(true)
        expect(restored.mask).toBe(true)
        expect(restored.width).toBe(initial.width)
        expect(restored.mode).toBe('alpha')
        await testInfo.attach('actual-combination-page', { body: await page.screenshot(), contentType: 'image/png' })
        const outputsBeforeLoad = await page.evaluate(() => window.maskCombination.times.length)
        let profiler
        if (process.env.ARTPLAYER_MASK_PROFILE === '1') {
          assert.equal(testInfo.project.name, 'chromium', 'CDP profiling requires the Chromium diagnostic subset')
          profiler = await page.context().newCDPSession(page)
          await profiler.send('Profiler.enable')
          await profiler.send('Profiler.start')
        }
        try {
          load = await observeDanmukuLoad(page, { label: 'Mask load', requireComplete: implementation === 'candidate' })
        }
        finally {
          if (profiler) {
            const { profile } = await profiler.send('Profiler.stop')
            await testInfo.attach('mask-cpu-profile', { contentType: 'application/json', body: JSON.stringify(profile) })
            await profiler.detach()
          }
        }
        load.modelOutputs = await page.evaluate(before => window.maskCombination.times.length - before, outputsBeforeLoad)
        expect(load.modelOutputs).toBeGreaterThan(1)
        await page.evaluate(() => window.art.destroy(false))
        expect(await page.evaluate(() => window.maskCombination.layer.style.maskImage)).toBe('none')
        expect(unexpected).toEqual([])
      }
      finally {
        const state = await page.evaluate(() => ({ times: window.maskCombination.times, visible: window.maskCombination.visible, snapshots: window.maskCombination.snapshots, scheduled: window.maskCombination.scheduled, samples: window.maskCombination.samples, seeked: window.maskCombination.seeked, incompleteLoad: window.danmukuCombinationLoadResult }))
        await testInfo.attach('actual-combination-evidence', { body: JSON.stringify({ core, implementation, mask: { file: artifact, provenance, sha256: hash(code) }, danmuku: { file: danmuku.file, provenance: danmuku.provenance, sha256: hash(danmuku.code) }, unexpected, state, load, limitation: 'Actual model, native media, timestamp-delivered Danmuku and CSS web fullscreen. Bounded 20 rows/s after model readiness. No OS fullscreen, GPU completion or device coverage claim.' }, null, 2), contentType: 'application/json' })
        await page.evaluate(() => {
          if (window.art && !window.art.isDestroy)
            window.art.destroy()
        })
      }
    })
  }
}
