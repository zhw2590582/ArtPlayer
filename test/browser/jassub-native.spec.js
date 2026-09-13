import fs from 'node:fs'
import process from 'node:process'
import { ensureArchive, hash, readMember } from '../../refactor/scripts/releases.mjs'
import { expect, test } from './fixtures.js'

const baseline = JSON.parse(fs.readFileSync('refactor/baselines/jassub-release.json', 'utf8'))
const release = baseline.release
const archive = await ensureArchive(release)
const member = `package/${release.manifest.main.replace(/^\.\//, '')}`
const artifact = process.env.ARTPLAYER_JASSUB_ARTIFACT
const customCanvas = process.env.ARTPLAYER_JASSUB_CUSTOM_CANVAS === 'true'
const code = artifact ? fs.readFileSync(artifact, 'utf8') : readMember(archive, member).toString()
const onDemandRender = process.env.ARTPLAYER_JASSUB_ON_DEMAND !== 'false'
const defaultOffscreen = process.env.ARTPLAYER_JASSUB_OFFSCREEN === 'default'
const subtitles = `[Script Info]
ScriptType: v4.00+
PlayResX: 640
PlayResY: 360
[V4+ Styles]
Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding
Style: Default,Liberation Sans,36,&H00FFFFFF,&H000000FF,&H00000000,&H00000000,0,0,0,0,100,100,0,0,1,2,0,2,10,10,20,1
[Events]
Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text
Dialogue: 0,0:00:00.00,0:00:04.00,Default,,0,0,0,,Before seek
Dialogue: 0,0:00:05.00,0:00:30.00,Default,,0,0,0,,After seek with actual WASM
`

for (const core of ['candidate', 'published', 'published-5.3.1-beta.1']) {
  test(`JASSUB ${artifact ? 'candidate artifact' : `published ${release.version}`} renders actual WASM subtitles through seek and layout with ${core} core, customCanvas=${customCanvas}, defaultOffscreen=${defaultOffscreen}`, async ({ page, context }, testInfo) => {
    const resources = []
    const external = []
    const origin = new URL(testInfo.project.use.baseURL).origin
    await context.route('**/*', (route) => {
      if (new URL(route.request().url()).origin !== origin) {
        external.push(route.request().url())
        return route.abort()
      }
      return route.continue()
    })
    context.on('response', (response) => {
      if (response.url().includes('/assets/jassub/'))
        resources.push({ url: response.url(), status: response.status(), contentType: response.headers()['content-type'] })
    })
    await page.goto(`/test/player.html?core=${core}`)
    await page.evaluate(() => {
      window.jassubFramePlatform = { before: typeof HTMLVideoElement.prototype.requestVideoFrameCallback, registered: 0, delivered: 0 }
    })
    await page.addScriptTag({ content: code })
    await page.evaluate(() => {
      const frames = window.jassubFramePlatform
      frames.after = typeof HTMLVideoElement.prototype.requestVideoFrameCallback
      if (frames.after === 'function') {
        const request = HTMLVideoElement.prototype.requestVideoFrameCallback
        HTMLVideoElement.prototype.requestVideoFrameCallback = function (callback) {
          frames.registered++
          return request.call(this, function (...args) {
            frames.delivered++
            frames.lastMetadata = args[1]
            return callback.apply(this, args)
          })
        }
      }
      window.jassubNative = { workers: [], snapshots: [], errors: [], frames }
      const NativeWorker = window.Worker
      window.Worker = class extends NativeWorker {
        constructor(...args) {
          super(...args)
          this.observation = { url: String(args[0]), terminated: 0, sent: [], received: [] }
          window.jassubNative.workers.push(this.observation)
          this.addEventListener('message', ({ data }) => this.observation.received.push({ target: data.target, images: data.images?.length, width: data.width, height: data.height }))
        }

        postMessage(message, ...rest) {
          this.observation.sent.push({ target: message.target, time: message.time, width: message.width, height: message.height })
          return super.postMessage(message, ...rest)
        }

        terminate() {
          this.observation.terminated++
          return super.terminate()
        }
      }
      window.createPlayer('/assets/sample/steve-jobs.mp4')
    })
    try {
      await expect.poll(() => page.evaluate(() => window.art.duration)).toBeGreaterThan(30)
      await page.locator('#play').click()
      await expect.poll(() => page.evaluate(() => window.art.currentTime)).toBeGreaterThan(0.1)
      await page.locator('#pause').click()
      await page.evaluate(async ({ subContent, onDemandRender, customCanvas, defaultOffscreen }) => {
        const register = window.artplayerPluginJassub.default || window.artplayerPluginJassub
        let canvas
        if (customCanvas) {
          canvas = document.createElement('canvas')
          canvas.style.position = 'absolute'
          canvas.style.pointerEvents = 'none'
          canvas.style.zIndex = '20'
          window.art.video.insertAdjacentElement('afterend', canvas)
          window.jassubUserCanvas = canvas
        }
        window.art.plugins.add(register({
          subContent,
          workerUrl: '/assets/jassub/jassub-worker.js',
          wasmUrl: '/assets/jassub/jassub-worker.wasm',
          modernWasmUrl: '/assets/jassub/jassub-worker-modern.wasm',
          availableFonts: { 'liberation sans': '/assets/jassub/default.woff2' },
          fonts: ['/assets/jassub/default.woff2'],
          ...(defaultOffscreen ? {} : { offscreenRender: false }),
          onDemandRender,
          ...(canvas ? { canvas } : {}),
        }))
        window.jassub = window.art.plugins.artplayerPluginJassub.instance
        window.jassubNative.renderCalls = []
        const render = window.jassub._render
        window.jassub._render = function (message) {
          window.jassubNative.renderCalls.push({ context: Boolean(this._ctx), images: message.images.length })
          return render.call(this, message)
        }
        window.jassubNative.offscreen = { available: 'transferControlToOffscreen' in HTMLCanvasElement.prototype, selected: window.jassub._offscreenRender }
        window.jassub.addEventListener('error', event => window.jassubNative.errors.push(String(event.error)))
        await new Promise((resolve, reject) => {
          window.jassub.addEventListener('ready', resolve, { once: true })
          window.jassub.addEventListener('error', event => reject(event.error), { once: true })
        })
        const readback = document.createElement('canvas')
        window.jassubPixels = (phase) => {
          const canvas = window.jassub._canvas
          const rect = canvas.getBoundingClientRect()
          readback.width = canvas.width
          readback.height = canvas.height
          const context = readback.getContext('2d')
          context.drawImage(canvas, 0, 0)
          const pixels = context.getImageData(0, 0, readback.width, readback.height).data
          let visible = 0
          let signature = 0
          for (let i = 3; i < pixels.length; i += 4) {
            if (pixels[i] > 0) {
              visible++
              signature = (signature + i * pixels[i]) >>> 0
            }
          }
          const video = window.art.video
          const quality = video.getVideoPlaybackQuality?.()
          const state = { phase, visible, signature, width: canvas.width, height: canvas.height, cssWidth: rect.width, cssHeight: rect.height, time: window.art.currentTime, connected: canvas.isConnected, media: { paused: video.paused, readyState: video.readyState, totalFrames: quality?.totalVideoFrames, droppedFrames: quality?.droppedVideoFrames, decodedFrames: video.webkitDecodedFrameCount, mozPresentedFrames: video.mozPresentedFrames }, onDemand: window.jassub._onDemandRender }
          window.jassubNative.lastPixel = state
          if (phase)
            window.jassubNative.snapshots.push(state)
          return state
        }
      }, { subContent: subtitles, onDemandRender, customCanvas, defaultOffscreen })
      const offscreen = await page.evaluate(() => window.jassubNative.offscreen)
      expect(offscreen.selected).toBe(defaultOffscreen && !customCanvas && offscreen.available)
      await page.locator('#play').click()
      await expect.poll(() => page.evaluate(() => window.jassubPixels().visible)).toBeGreaterThan(100)
      const before = await page.evaluate(() => window.jassubPixels('before-seek'))
      expect(before.connected).toBe(true)
      await page.locator('#pause').click()
      await page.evaluate(async () => {
        const seeked = new Promise(resolve => window.art.video.addEventListener('seeked', resolve, { once: true }))
        window.art.currentTime = 10
        await seeked
      })
      await page.locator('#play').click()
      await expect.poll(() => page.evaluate(() => window.jassubPixels().signature)).not.toBe(before.signature)
      await expect.poll(() => page.evaluate(() => window.jassubPixels().visible)).toBeGreaterThan(100)
      const after = await page.evaluate(() => window.jassubPixels('after-seek'))
      expect(after.time).toBeGreaterThanOrEqual(10)
      expect(after.signature).not.toBe(before.signature)
      await page.evaluate(() => {
        window.art.fullscreenWeb = true
      })
      await expect.poll(() => page.evaluate(() => window.jassubPixels().cssWidth)).toBeGreaterThan(before.cssWidth)
      await expect.poll(() => page.evaluate(() => window.jassubPixels().visible)).toBeGreaterThan(100)
      await page.evaluate(() => window.jassubPixels('fullscreen'))
      await testInfo.attach('actual-jassub-page', { body: await page.screenshot(), contentType: 'image/png' })
      if (artifact)
        await page.evaluate(() => window.jassub.destroy())
      await page.evaluate(() => window.art.destroy(false))
      if (customCanvas)
        expect(await page.evaluate(() => window.jassubUserCanvas.isConnected)).toBe(true)
      expect(await page.evaluate(() => document.querySelectorAll('.JASSUB').length)).toBe(0)
      expect(await page.evaluate(() => window.jassubNative.workers.map(worker => worker.terminated))).toEqual([1])
      expect(await page.evaluate(() => window.jassubNative.errors)).toEqual([])
      expect(external).toEqual([])
      expect(resources.some(item => item.url.endsWith('.wasm') && item.status === 200 && item.contentType === 'application/wasm')).toBe(true)
      expect(resources.some(item => item.url.endsWith('.woff2') && item.status === 200)).toBe(true)
    }
    finally {
      const state = await page.evaluate(() => window.jassubNative).catch(error => ({ unavailable: error.message }))
      await testInfo.attach('actual-jassub-evidence', { body: JSON.stringify({ core, onDemandRender, customCanvas, defaultOffscreen, source: artifact ? { artifact, sha256: hash(code) } : { version: release.version, integrity: release.integrity, member, sha256: hash(code) }, subtitleSha256: hash(subtitles), resources, external, state, limitation: `Actual worker, WASM and local font; offscreen option ${defaultOffscreen ? 'omitted, actual capability/selection recorded' : 'explicitly false'}. Canvas pixels are read from a separate canvas copying the native display bitmap. No full failure recovery, sustained GPU/memory or physical-device acceptance; candidate adds direct-then-host destruction.` }, null, 2), contentType: 'application/json' })
      if (!page.isClosed()) {
        await page.evaluate(() => {
          if (window.art && !window.art.isDestroy)
            window.art.destroy()
        })
      }
    }
  })
}
