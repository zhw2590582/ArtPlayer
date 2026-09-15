import fs from 'node:fs'
import process from 'node:process'
import { hash } from '../../refactor/scripts/releases.mjs'
import { browserCandidate } from '../helpers/browser-candidate.js'
import { expect, test } from './fixtures.js'

let candidate
test.beforeAll(async () => {
  candidate = await browserCandidate('artplayer-plugin-asr', process.env.ARTPLAYER_ASR_ARTIFACT)
})

test.afterEach(async ({ page }, testInfo) => {
  const observation = await page.evaluate(() => window.noAudioState?.()).catch(error => ({ error: error.message }))
  await testInfo.attach('asr-no-audio-final', { contentType: 'application/json', body: JSON.stringify(observation ?? null) })
  await page.evaluate(() => {
    if (window.art && !window.art.isDestroy)
      window.art.destroy()
  })
})

for (const core of ['published', 'candidate']) {
  for (const mode of ['default', 'capture']) {
    test(`ASR ${mode} + ${core}: video-only input keeps playback and recovers audio capture after switching`, async ({ page }, testInfo) => {
      const errors = []
      page.on('console', (message) => {
        if (message.type() === 'error')
          errors.push(message.text())
      })
      await page.goto(`/test/player.html?core=${core}`)
      const capabilities = await page.evaluate(() => ({ context: typeof (window.AudioContext || window.webkitAudioContext), worklet: typeof window.AudioWorkletNode, capture: typeof HTMLMediaElement.prototype.captureStream, mozCapture: typeof HTMLMediaElement.prototype.mozCaptureStream }))
      await testInfo.attach('asr-no-audio-inputs', { contentType: 'application/json', body: JSON.stringify({ core, mode, capabilities, provenance: candidate.provenance, pluginSha256: hash(candidate.code), videoSha256: hash(fs.readFileSync(new URL('./media/pattern.mp4', import.meta.url))), audioSha256: hash(fs.readFileSync(new URL('./media/audio-tone.m4a', import.meta.url))), forcedException: false, physicalAudioOutput: false }) })
      if (capabilities.context === 'undefined') {
        expect(process.platform).toBe('win32')
        expect(testInfo.project.name).toBe('webkit')
        expect(capabilities.worklet).toBe('undefined')
        test.skip(true, 'Windows WebKit has no WebAudio; not an Apple-device ASR acceptance')
      }
      expect(capabilities.worklet).toBe('function')
      await page.addScriptTag({ content: candidate.code })
      await page.evaluate((mode) => {
        const Context = window.AudioContext || window.webkitAudioContext
        const contexts = []
        const tracks = []
        const bindings = []
        const chunks = []
        window.AudioContext = class extends Context {
          constructor(options) {
            super(options)
            contexts.push(this)
          }

          createMediaElementSource(element) {
            bindings.push({ kind: 'direct', source: element.currentSrc })
            return super.createMediaElementSource(element)
          }

          createMediaStreamSource(stream) {
            bindings.push({ kind: 'stream', audio: stream.getAudioTracks().length, video: stream.getVideoTracks().length })
            tracks.push(...stream.getTracks())
            return super.createMediaStreamSource(stream)
          }
        }
        window.art = new window.Artplayer({
          container: '.player',
          url: '/test/pattern.mp4',
          volume: 0.6,
          loop: true,
          plugins: [window.artplayerPluginAsr({
            ...(mode === 'capture' ? { audioInput: { type: 'capture' } } : {}),
            onAudioChunk({ pcm }) {
              let peak = 0
              for (const value of new Int16Array(pcm))
                peak = Math.max(peak, Math.abs(value))
              chunks.push({ source: window.art.video.currentSrc, peak, bytes: pcm.byteLength })
            },
          })],
        })
        document.querySelector('#play').onclick = () => window.art.play()
        window.noAudioState = () => ({
          bindings,
          contexts: contexts.map(context => context.state),
          tracks: tracks.map(track => ({ kind: track.kind, state: track.readyState })),
          chunks,
          media: { time: window.art.currentTime, source: window.art.video.currentSrc, paused: window.art.video.paused, error: window.art.video.error?.code || null, volume: window.art.volume, muted: window.art.muted },
        })
        window.noAudioPixels = () => {
          const canvas = document.createElement('canvas')
          canvas.width = 32
          canvas.height = 18
          const context = canvas.getContext('2d')
          context.drawImage(window.art.video, 0, 0, 32, 18)
          return [...context.getImageData(0, 0, 32, 18).data]
        }
      }, mode)
      await expect.poll(() => page.evaluate(() => window.art.isReady)).toBe(true)
      await page.locator('#play').click()
      await expect.poll(() => page.evaluate(() => window.art.currentTime)).toBeGreaterThan(0.5)
      const first = await page.evaluate(() => ({ pixels: window.noAudioPixels(), time: window.art.currentTime }))
      await expect.poll(() => page.evaluate(() => window.art.currentTime)).toBeGreaterThan(first.time + 0.5)
      expect(await page.evaluate(() => window.noAudioPixels())).not.toEqual(first.pixels)
      const silent = await page.evaluate(() => window.noAudioState())
      expect(silent.media).toMatchObject({ paused: false, error: null, volume: 0.6, muted: false })
      expect(silent.chunks.every(chunk => chunk.peak === 0)).toBe(true)
      if (mode === 'capture') {
        expect(silent.bindings).toEqual([{ kind: 'stream', audio: 0, video: 1 }])
        expect(silent.contexts).toEqual(['closed'])
        expect(silent.tracks).toEqual([{ kind: 'video', state: 'ended' }])
        expect(silent.chunks).toEqual([])
        expect(errors).toHaveLength(1)
        expect(errors[0]).toContain('[artplayerPluginAsr] Initialization failed:')
      }
      else {
        expect(silent.bindings).toHaveLength(1)
        expect(silent.bindings[0].kind).toBe('direct')
        expect(silent.contexts).toEqual(['running'])
        expect(silent.tracks).toEqual([])
        expect(errors).toEqual([])
      }
      await testInfo.attach('asr-no-audio-playing', { contentType: 'application/json', body: JSON.stringify({ silent, errors: [...errors], changingDecodedPixels: true }) })
      await page.evaluate(() => {
        window.art.url = '/test/audio-tone.m4a?asr-no-audio=recovery'
      })
      await expect.poll(() => page.evaluate(() => window.art.video.currentSrc.includes('asr-no-audio=recovery') && window.art.video.readyState >= 2)).toBe(true)
      await page.locator('#play').click()
      await expect.poll(() => page.evaluate(() => window.noAudioState().chunks.filter(chunk => chunk.source.includes('asr-no-audio=recovery') && chunk.peak > 0).length)).toBeGreaterThanOrEqual(3)
      const recovered = await page.evaluate(() => window.noAudioState())
      expect(recovered.contexts).toEqual(mode === 'capture' ? ['closed', 'running'] : ['running'])
      expect(recovered.bindings.filter(binding => binding.kind === 'direct')).toHaveLength(mode === 'capture' ? 0 : 1)
      expect(recovered.media).toMatchObject({ paused: false, error: null, volume: 0.6, muted: false })
      await testInfo.attach('asr-audio-recovered', { contentType: 'application/json', body: JSON.stringify(recovered) })
      await page.evaluate(() => window.art.destroy())
      await expect.poll(() => page.evaluate(() => window.noAudioState().contexts.every(state => state === 'closed'))).toBe(true)
      expect(await page.evaluate(() => window.noAudioState().tracks.every(track => track.state === 'ended'))).toBe(true)
      await expect(page.locator('.art-video-player')).toHaveCount(0)
    })
  }
}
