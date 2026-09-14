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
[V4+ Styles]
Format: Name, Fontname, Fontsize, PrimaryColour, OutlineColour, BackColour, Bold, Italic, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding
Style: Default,Liberation Sans,40,&H0000FF00,&H00000000,&H00000000,0,0,1,0,0,2,10,10,10,1
[Events]
Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text
Dialogue: 0,0:00:00.00,0:02:00.00,Default,,0,0,0,,Resource recovery subtitle
`

test('JASSUB closes the entire bitmap batch after a native draw failure and renders the next frame', async ({ page }, testInfo) => {
  await page.goto('/test/player.html?core=candidate')
  await page.addScriptTag({ content: code })
  await page.evaluate(() => window.createPlayer('/assets/sample/steve-jobs.mp4'))
  await page.locator('#play').click()
  try {
    await page.evaluate((subtitle) => {
      const register = window.artplayerPluginJassub.default || window.artplayerPluginJassub
      window.art.plugins.add(register({
        offscreenRender: false,
        asyncRender: true,
        workerUrl: '/assets/jassub/jassub-worker.js',
        wasmUrl: '/assets/jassub/jassub-worker.wasm',
        modernWasmUrl: '/assets/jassub/jassub-worker-modern.wasm',
        availableFonts: { 'liberation sans': '/assets/jassub/default.woff2' },
        fonts: ['/assets/jassub/default.woff2'],
        subContent: subtitle,
      }))
      const { instance } = window.art.plugins.artplayerPluginJassub
      const probe = window.bitmapFailureProbe = { instance, held: [], holding: true, errors: [] }
      instance.addEventListener('error', event => probe.errors.push(String(event.error)))
      probe.dispatch = instance._worker.onmessage
      instance._worker.onmessage = (event) => {
        if (probe.holding && event.data.target === 'render' && event.data.images.some(item => item.image instanceof ImageBitmap))
          probe.held.push(event)
        else
          probe.dispatch(event)
      }
    }, subtitle)
    await expect.poll(() => page.evaluate(() => window.bitmapFailureProbe.held.length)).toBeGreaterThan(0)
    const evidence = await page.evaluate(async () => {
      const probe = window.bitmapFailureProbe
      window.art.video.pause()
      const event = probe.held.shift()
      const first = event.data.images.find(item => item.image instanceof ImageBitmap)
      const copies = await Promise.all([createImageBitmap(first.image), createImageBitmap(first.image)])
      for (const item of event.data.images) {
        if (item !== first)
          item.image?.close?.()
      }
      event.data.images = [first, ...copies.map(image => ({ image, x: 0, y: 0 }))]
      const before = event.data.images.map(item => item.image.width)
      first.image.close()
      let failure
      try {
        probe.dispatch(event)
      }
      catch (error) { failure = { name: error.name, message: error.message } }
      const after = event.data.images.map(item => item.image.width)
      // Clean the failing historical candidate too, after recording its resource state.
      for (const item of event.data.images)
        item.image.close()
      for (const held of probe.held.splice(0)) {
        for (const item of held.data.images)
          item.image?.close?.()
      }
      probe.holding = false
      return { before, after, failure, asyncRender: event.data.asyncRender }
    })
    await testInfo.attach('bitmap-failure', { contentType: 'application/json', body: JSON.stringify({ artifact, provenance, sha256: hash(code), evidence, limitation: 'Actual JASSUB Worker/WASM bitmap, plus two native bitmap copies. Deliberately closing the first bitmap injects a native draw error; this does not claim spontaneous Worker corruption or Firefox offscreen recovery.' }) })
    expect(evidence.before.every(width => width > 0)).toBe(true)
    expect(evidence.asyncRender).toBe(true)
    expect(evidence.failure?.name).toBe('InvalidStateError')
    expect(evidence.after).toEqual([0, 0, 0])
    // A busy renderer intentionally ignores resize(force); let its pending demand finish first.
    await expect.poll(() => page.evaluate(() => window.bitmapFailureProbe.instance.busy)).toBe(false)
    await page.evaluate(() => window.bitmapFailureProbe.instance.resize(0, 0, 0, 0, true))
    await expect.poll(() => page.evaluate(() => {
      const { instance } = window.bitmapFailureProbe
      const pixels = instance._ctx.getImageData(0, 0, instance._canvas.width, instance._canvas.height).data
      let green = 0
      for (let i = 0; i < pixels.length; i += 4) {
        if (pixels[i + 1] > 150 && pixels[i] < 100 && pixels[i + 2] < 100 && pixels[i + 3] > 100)
          green++
      }
      return green
    })).toBeGreaterThan(100)
    expect(await page.evaluate(() => window.bitmapFailureProbe.errors)).toEqual([])
  }
  finally {
    await page.evaluate(() => {
      for (const event of window.bitmapFailureProbe?.held || []) {
        for (const item of event.data.images)
          item.image?.close?.()
      }
      window.art?.destroy(false)
    })
  }
})
