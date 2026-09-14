import process from 'node:process'
import { hash } from '../../refactor/scripts/releases.mjs'
import { browserCandidate } from '../helpers/browser-candidate.js'
import { expect, test } from './fixtures.js'

const { code, provenance } = await browserCandidate('artplayer-plugin-jassub', process.env.ARTPLAYER_JASSUB_ARTIFACT)
const artifact = provenance.file || 'source-build'

test.beforeEach(async ({ browserName }, testInfo) => {
  await testInfo.attach('jassub-selected-input', { contentType: 'application/json', body: JSON.stringify({ browserName, provenance }) })
})
const subtitle = `[Script Info]
ScriptType: v4.00+
PlayResX: 640
PlayResY: 360
YCbCr Matrix: MATRIX
[V4+ Styles]
Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding
Style: Default,Liberation Sans,36,&H00FFFFFF,&H000000FF,&H00000000,&H00000000,0,0,0,0,100,100,0,0,1,2,0,2,10,10,20,1
[Events]
Format: Layer, Start, End, Style, Name, MarginL, MarginR, Effect, Text
Dialogue: 0,0:00:00.00,0:00:30.00,Default,,0,0,,CAPTION
`

test('JASSUB actual subtitle color-space transitions tolerate a queued native hybrid bitmap and terminal track calls', async ({ page }, testInfo) => {
  await page.goto('/test/player.html?core=candidate')
  await page.addScriptTag({ content: code })
  await page.evaluate(() => window.createPlayer('/assets/sample/steve-jobs.mp4'))
  await expect.poll(() => page.evaluate(() => window.art.duration)).toBeGreaterThan(30)
  await page.locator('#play').click()
  await expect.poll(() => page.evaluate(() => window.art.currentTime)).toBeGreaterThan(0.1)
  try {
    const capabilities = await page.evaluate(async (subtitle) => {
      let matrix
      if (typeof VideoFrame === 'function') {
        const frame = new VideoFrame(window.art.video)
        matrix = frame.colorSpace.matrix
        frame.close()
      }
      const matched = matrix === 'bt709' ? 'TV.709' : 'TV.601'
      const mismatched = matched === 'TV.709' ? 'TV.601' : 'TV.709'
      const make = (color, caption) => subtitle.replace('MATRIX', color).replace('CAPTION', caption)
      const probe = window.hybridProbe = { available: 'transferControlToOffscreen' in HTMLCanvasElement.prototype, matrix, held: [], sent: [], received: [], errors: [], matched: make(matched, 'Replacement subtitle after transfer'), mismatched: make(mismatched, 'Original hybrid subtitle') }
      const register = window.artplayerPluginJassub.default || window.artplayerPluginJassub
      window.art.plugins.add(register({
        workerUrl: '/assets/jassub/jassub-worker.js',
        wasmUrl: '/assets/jassub/jassub-worker.wasm',
        modernWasmUrl: '/assets/jassub/jassub-worker-modern.wasm',
        availableFonts: { 'liberation sans': '/assets/jassub/default.woff2' },
        fonts: ['/assets/jassub/default.woff2'],
        subContent: probe.mismatched,
      }))
      const instance = window.jassub = window.art.plugins.artplayerPluginJassub.instance
      probe.selected = instance._offscreenRender
      instance.addEventListener('error', event => probe.errors.push(String(event.error)))
      const worker = instance._worker
      const dispatch = worker.onmessage
      probe.dispatch = event => dispatch.call(worker, event)
      worker.onmessage = (event) => {
        probe.received.push({ target: event.data.target, images: event.data.images?.length })
        if (probe.holdRender && event.data.target === 'render' && event.data.images.some(item => item.image instanceof ImageBitmap)) {
          probe.holdRender = false
          probe.held.push(event)
          return
        }
        probe.dispatch(event)
      }
      const post = worker.postMessage.bind(worker)
      worker.postMessage = (message, ...rest) => {
        probe.sent.push(message.target)
        return post(message, ...rest)
      }
      await new Promise((resolve, reject) => {
        instance.addEventListener('ready', resolve, { once: true })
        instance.addEventListener('error', event => reject(event.error), { once: true })
      })
      const canvas = document.createElement('canvas')
      probe.pixels = () => {
        canvas.width = instance._canvas.width
        canvas.height = instance._canvas.height
        const ctx = canvas.getContext('2d')
        ctx.drawImage(instance._canvas, 0, 0)
        const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data
        let visible = 0
        let signature = 0
        for (let i = 3; i < data.length; i += 4) {
          if (data[i])
            visible++
          signature = (signature + i * data[i]) >>> 0
        }
        return { visible, signature }
      }
      return { available: probe.available, selected: probe.selected, matrix }
    }, subtitle)
    await expect.poll(() => page.evaluate(() => window.hybridProbe.pixels().visible)).toBeGreaterThan(100)
    const before = await page.evaluate(() => window.hybridProbe.pixels())
    expect(capabilities.selected).toBe(capabilities.available)
    const hybridExpected = capabilities.selected && ['bt709', 'bt470bg', 'smpte170m'].includes(capabilities.matrix)
    if (hybridExpected) {
      await expect.poll(() => page.evaluate(() => Boolean(window.jassub._ctx))).toBe(true)
      await page.evaluate(() => {
        window.hybridProbe.holdRender = true
        window.jassub.resize(0, 0, 0, 0, true)
      })
      await expect.poll(() => page.evaluate(() => window.hybridProbe.held.length)).toBe(1)
      const delivered = await page.evaluate(() => {
        const probe = window.hybridProbe
        const event = probe.held.shift()
        const images = event.data.images.map(item => item.image)
        const widths = images.map(image => image.width)
        window.jassub.setTrack(probe.matched)
        const canvas = window.jassub._canvas
        const reattached = window.jassub._ctx === false
        let failure
        try {
          probe.dispatch(event)
        }
        catch (error) { failure = error.message }
        return probe.late = { reattached, widths, closedWidths: images.map(image => image.width), failure, sameCanvas: canvas === window.jassub._canvas, stillOffscreen: window.jassub._ctx === false }
      })
      expect(delivered.reattached).toBe(true)
      expect(delivered.widths.every(width => width > 0)).toBe(true)
      expect(delivered.failure).toBeUndefined()
      expect(delivered.sameCanvas).toBe(true)
      expect(delivered.stillOffscreen).toBe(true)
      expect(delivered.closedWidths.every(width => width === 0)).toBe(true)
    }
    else {
      await page.evaluate(() => window.jassub.setTrack(window.hybridProbe.matched))
    }
    await expect.poll(() => page.evaluate(() => window.hybridProbe.pixels().visible)).toBeGreaterThan(100)
    await expect.poll(() => page.evaluate(() => window.hybridProbe.pixels().signature)).not.toBe(before.signature)
    await page.evaluate(() => window.jassub.setTrack(window.hybridProbe.mismatched))
    if (hybridExpected)
      await expect.poll(() => page.evaluate(() => Boolean(window.jassub._ctx))).toBe(true)
    await expect.poll(() => page.evaluate(() => window.hybridProbe.pixels().visible)).toBeGreaterThan(100)
    const terminal = await page.evaluate(() => {
      const instance = window.jassub
      const canvas = instance._canvas
      instance.destroy()
      instance.setTrack(window.hybridProbe.matched)
      instance.setTrackByUrl('/unused-after-destroy.ass')
      window.art.destroy(false)
      return window.hybridProbe.terminal = { sameCanvas: canvas === instance._canvas, containers: document.querySelectorAll('.JASSUB').length }
    })
    expect(terminal).toEqual({ sameCanvas: true, containers: 0 })
    expect(await page.evaluate(() => window.hybridProbe.errors)).toEqual([])
  }
  finally {
    const state = await page.evaluate(() => {
      const probe = window.hybridProbe
      if (!probe)
        return null
      for (const event of probe.held) {
        for (const item of event.data.images) item.image?.close?.()
      }
      return { available: probe.available, selected: probe.selected, matrix: probe.matrix, sent: probe.sent, received: probe.received, late: probe.late, terminal: probe.terminal, errors: probe.errors, busy: window.jassub.busy, lastDemand: window.jassub._lastDemandTime }
    })
    await testInfo.attach('jassub-native-hybrid', { body: JSON.stringify({ artifact, provenance, sha256: hash(code), state, limitation: 'Actual Worker/WASM/ASS color-space transition and native ImageBitmap; one received render is held and delivered after synchronous public setTrack to reproduce a queued message. Not unmodified event timing, GPU endurance or physical-device evidence.' }), contentType: 'application/json' })
    await page.evaluate(() => {
      if (!window.art.isDestroy)
        window.art.destroy()
    })
  }
})
