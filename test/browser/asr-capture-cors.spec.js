import fs from 'node:fs'
import process from 'node:process'
import { hash } from '../../refactor/scripts/releases.mjs'
import { browserCandidate } from '../helpers/browser-candidate.js'
import { expect, test } from './fixtures.js'

let provenance
let code
test.beforeAll(async () => {
  const candidate = await browserCandidate('artplayer-plugin-asr', process.env.ARTPLAYER_ASR_ARTIFACT)
  code = candidate.code
  provenance = candidate.provenance
})

test.afterEach(async ({ page }, testInfo) => {
  const observation = await page.evaluate(() => window.captureCorsObservation?.()).catch(error => ({ error: error.message }))
  await testInfo.attach('capture-cors-final-observation', { contentType: 'application/json', body: JSON.stringify(observation ?? null) })
  await page.evaluate(() => {
    if (window.art && !window.art.isDestroy)
      window.art.destroy()
  })
})

for (const core of ['published', 'candidate']) {
  test(`ASR explicit capture + ${core}: opaque media keeps native routing and same-origin capture recovers`, async ({ page }, testInfo) => {
    const responses = []
    const consoleErrors = []
    page.on('response', (response) => {
      if (new URL(response.url()).pathname === '/test/audio-tone.m4a')
        responses.push({ url: response.url(), status: response.status(), allowOrigin: response.headers()['access-control-allow-origin'] || null })
    })
    page.on('console', (message) => {
      if (message.type() === 'error')
        consoleErrors.push(message.text())
    })
    await page.goto(`/test/player.html?core=${core}`)
    const capabilities = await page.evaluate(() => ({ context: typeof (window.AudioContext || window.webkitAudioContext), worklet: typeof window.AudioWorkletNode, capture: typeof HTMLMediaElement.prototype.captureStream, mozCapture: typeof HTMLMediaElement.prototype.mozCaptureStream }))
    await testInfo.attach('capture-cors-inputs', { contentType: 'application/json', body: JSON.stringify({ core, capabilities, provenance, pluginSha256: hash(code), mediaSha256: hash(fs.readFileSync(new URL('./media/audio-tone.m4a', import.meta.url))), nativeCapture: true, forcedException: false, analyserBinding: false, physicalAudioOutput: false, scope: 'Zero direct bindings and native media clock progression preserve routing; no claim about physical speaker output' }) })
    if (capabilities.context === 'undefined') {
      expect(process.platform).toBe('win32')
      expect(testInfo.project.name).toBe('webkit')
      expect(capabilities.worklet).toBe('undefined')
      test.skip(true, 'Windows WebKit lacks AudioContext/AudioWorklet; this is not Safari/device CORS acceptance')
    }
    expect(capabilities.worklet).toBe('function')
    expect([capabilities.capture, capabilities.mozCapture]).toContain('function')
    await page.addScriptTag({ content: code })
    await page.evaluate(() => {
      const NativeContext = window.AudioContext || window.webkitAudioContext
      window.captureContexts = []
      window.captureStreams = []
      window.captureTracks = []
      window.captureAttempts = []
      window.directBindings = 0
      window.captureChunks = []
      window.AudioContext = class extends NativeContext {
        constructor(options) {
          super(options)
          window.captureContexts.push(this)
        }

        createMediaElementSource(element) {
          window.directBindings++
          return super.createMediaElementSource(element)
        }
      }
      const prototype = HTMLMediaElement.prototype
      const method = prototype.captureStream ? 'captureStream' : 'mozCaptureStream'
      const nativeCapture = prototype[method]
      prototype[method] = function (...args) {
        const attempt = { source: this.currentSrc, error: null }
        window.captureAttempts.push(attempt)
        try {
          const stream = nativeCapture.apply(this, args)
          window.captureStreams.push(stream)
          const recordTrack = (track) => {
            if (!window.captureTracks.includes(track))
              window.captureTracks.push(track)
          }
          stream.getTracks().forEach(recordTrack)
          stream.addEventListener('addtrack', event => recordTrack(event.track))
          return stream
        }
        catch (error) {
          attempt.error = { name: error.name, message: error.message }
          throw error
        }
      }
      const opaque = new URL('/test/audio-tone.m4a?capture-cors=opaque', location.href)
      opaque.hostname = 'localhost'
      window.art = new window.Artplayer({
        container: '.player',
        url: opaque.href,
        volume: 0.6,
        muted: false,
        loop: true,
        plugins: [window.artplayerPluginAsr({
          audioInput: { type: 'capture' },
          onAudioChunk({ pcm, wav }) {
            let peak = 0
            for (const sample of new Int16Array(pcm))
              peak = Math.max(peak, Math.abs(sample))
            window.captureChunks.push({ source: window.art.video.currentSrc, peak, pcmBytes: pcm.byteLength, wavBytes: wav.byteLength })
          },
        })],
      })
      window.captureVideoProperties = () => {
        const video = window.art.video
        return {
          src: video.getAttribute('src'),
          crossOrigin: video.crossOrigin,
          crossOriginAttribute: video.getAttribute('crossorigin'),
          muted: video.muted,
          defaultMuted: video.defaultMuted,
          volume: video.volume,
          playbackRate: video.playbackRate,
          autoplay: video.autoplay,
          controls: video.controls,
          loop: video.loop,
          preload: video.preload,
          playsInline: video.playsInline,
        }
      }
      window.captureCorsObservation = () => ({
        attempts: window.captureAttempts,
        directBindings: window.directBindings,
        contexts: window.captureContexts.map(context => context.state),
        streams: window.captureStreams.map(stream => ({ active: stream.active, tracks: stream.getTracks().map(track => ({ kind: track.kind, muted: track.muted, enabled: track.enabled, readyState: track.readyState })) })),
        retainedTracks: window.captureTracks.map(track => ({ kind: track.kind, muted: track.muted, enabled: track.enabled, readyState: track.readyState })),
        chunks: window.captureChunks,
      })
      document.querySelector('#play').onclick = () => window.art.play()
      document.querySelector('#pause').onclick = () => window.art.pause()
    })
    await expect.poll(() => page.evaluate(() => window.art.isReady)).toBe(true)
    const initialProperties = await page.evaluate(() => window.captureVideoProperties())
    expect(initialProperties.crossOrigin).toBeNull()
    expect(initialProperties.crossOriginAttribute).toBeNull()
    expect(initialProperties.muted).toBe(false)
    expect(new URL(initialProperties.src, page.url()).origin).not.toBe(new URL(page.url()).origin)
    await page.locator('#play').click()
    await expect.poll(() => page.evaluate(() => window.captureAttempts.length)).toBeGreaterThanOrEqual(1)
    await expect.poll(() => page.evaluate(() => window.art.currentTime)).toBeGreaterThan(1)
    const opaqueStart = await page.evaluate(() => window.art.currentTime)
    await expect.poll(() => page.evaluate(() => window.art.currentTime)).toBeGreaterThan(opaqueStart + 0.5)
    const opaque = await page.evaluate(() => window.captureCorsObservation())
    expect(opaque.directBindings).toBe(0)
    expect(opaque.chunks.every(chunk => chunk.peak === 0)).toBe(true)
    expect(await page.evaluate(() => window.art.video.error)).toBeNull()
    expect(await page.evaluate(() => window.art.video.paused)).toBe(false)
    expect(await page.evaluate(() => window.captureVideoProperties())).toEqual(initialProperties)
    expect(responses.some(response => new URL(response.url).hostname === 'localhost' && [200, 206].includes(response.status))).toBe(true)
    expect(responses.every(response => response.allowOrigin === null)).toBe(true)
    expect(opaque.chunks).toEqual([])
    expect(opaque.attempts).toHaveLength(1)
    if (testInfo.project.name === 'chromium') {
      expect(opaque.attempts[0].error.name).toBe('SecurityError')
      expect(opaque.contexts).toEqual(['closed'])
      expect(opaque.streams).toEqual([])
      expect(consoleErrors).toHaveLength(1)
      expect(consoleErrors[0]).toContain('[artplayerPluginAsr] Initialization failed: SecurityError:')
    }
    else {
      expect(testInfo.project.name).toBe('firefox')
      expect(opaque.attempts[0].error).toBeNull()
      expect(opaque.contexts).toEqual(['running'])
      expect(opaque.streams).toHaveLength(1)
      expect(opaque.retainedTracks).toHaveLength(1)
      expect(opaque.retainedTracks[0].kind).toBe('audio')
      expect(opaque.retainedTracks[0].readyState).toBe('live')
      expect(consoleErrors).toEqual([])
    }
    await testInfo.attach('opaque-native-capture-observation', { contentType: 'application/json', body: JSON.stringify({ opaque, responses: [...responses], consoleErrors: [...consoleErrors], properties: initialProperties, clockAdvanced: true }) })

    await page.evaluate(() => {
      window.art.url = '/test/audio-tone.m4a?capture-cors=recovery'
    })
    await expect.poll(() => page.evaluate(() => window.art.video.currentSrc.includes('capture-cors=recovery') && window.art.video.readyState >= 2)).toBe(true)
    const recoveryProperties = await page.evaluate(() => window.captureVideoProperties())
    await page.locator('#play').click()
    await expect.poll(() => page.evaluate(() => window.captureChunks.filter(chunk => chunk.source.includes('capture-cors=recovery') && chunk.peak > 0).length)).toBeGreaterThanOrEqual(3)
    expect(await page.evaluate(() => window.directBindings)).toBe(0)
    expect(await page.evaluate(() => window.captureVideoProperties())).toEqual(recoveryProperties)
    expect(await page.evaluate(() => window.captureChunks.filter(chunk => chunk.source.includes('capture-cors=opaque')).every(chunk => chunk.peak === 0))).toBe(true)
    expect(await page.evaluate(() => window.captureAttempts.length)).toBeGreaterThanOrEqual(2)
    await page.evaluate(() => window.art.plugins.artplayerPluginAsr.stop())
    await expect.poll(() => page.evaluate(() => window.captureContexts.every(context => context.state === 'closed'))).toBe(true)
    expect(await page.evaluate(() => window.captureTracks.every(track => track.readyState === 'ended'))).toBe(true)
    const stopped = await page.evaluate(() => ({ chunks: window.captureChunks.length, time: window.art.currentTime }))
    await expect.poll(() => page.evaluate(() => window.art.currentTime)).toBeGreaterThan(stopped.time + 0.4)
    expect(await page.evaluate(() => window.captureChunks.length)).toBe(stopped.chunks)
    expect(await page.evaluate(() => window.art.video.paused)).toBe(false)
    expect(await page.evaluate(() => window.captureVideoProperties())).toEqual(recoveryProperties)
    await page.locator('#pause').click()
    await page.locator('#play').click()
    await expect.poll(() => page.evaluate(start => window.captureChunks.slice(start).filter(chunk => chunk.peak > 0).length, stopped.chunks)).toBeGreaterThanOrEqual(3)
    expect(await page.evaluate(() => window.directBindings)).toBe(0)
    await testInfo.attach('same-origin-capture-recovery', { contentType: 'application/json', body: JSON.stringify(await page.evaluate(() => window.captureCorsObservation())) })
    await page.evaluate(() => window.art.destroy())
    await expect.poll(() => page.evaluate(() => window.captureContexts.every(context => context.state === 'closed'))).toBe(true)
    expect(await page.evaluate(() => window.captureTracks.every(track => track.readyState === 'ended'))).toBe(true)
    expect(await page.evaluate(() => window.directBindings)).toBe(0)
    await expect(page.locator('.art-video-player')).toHaveCount(0)
  })
}
