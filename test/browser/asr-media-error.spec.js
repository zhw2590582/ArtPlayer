import process from 'node:process'
import { browserCandidate } from '../helpers/browser-candidate.js'
import { expect, test } from './fixtures.js'

let candidate
test.beforeAll(async () => {
  candidate = await browserCandidate('artplayer-plugin-asr', process.env.ARTPLAYER_ASR_ARTIFACT)
})

test.afterEach(async ({ page }, testInfo) => {
  const state = await page.evaluate(() => window.mediaErrorState?.()).catch(error => ({ error: error.message }))
  await testInfo.attach('asr-media-error-final', { contentType: 'application/json', body: JSON.stringify(state ?? null) })
  await page.evaluate(() => {
    if (window.art && !window.art.isDestroy)
      window.art.destroy()
  })
})

for (const core of ['published-5.3.0', 'published', 'candidate']) {
  for (const mode of ['default', 'capture']) {
    test(`ASR ${mode} + ${core}: native media error invalidates pending recognition and permits recovery`, async ({ page }, testInfo) => {
      await page.goto(`/test/player.html?core=${core}`)
      const capabilities = await page.evaluate(() => ({ context: typeof (window.AudioContext || window.webkitAudioContext), worklet: typeof window.AudioWorkletNode }))
      await testInfo.attach('asr-media-error-inputs', { contentType: 'application/json', body: JSON.stringify({ core, mode, capabilities, provenance: candidate.provenance, recognizer: 'Controlled pending caller Promise; PCM and media errors are native', errorSource: '/test/manifest.json', mediaAssignment: 'public art.video.src' }) })
      if (capabilities.context === 'undefined') {
        expect(process.platform).toBe('win32')
        expect(testInfo.project.name).toBe('webkit')
        expect(capabilities.worklet).toBe('undefined')
        test.skip(true, 'Windows WebKit lacks native WebAudio; not Safari/device ASR acceptance')
      }
      await page.addScriptTag({ content: candidate.code })
      await page.evaluate((mode) => {
        const Context = window.AudioContext || window.webkitAudioContext
        const contexts = []
        const events = []
        const chunks = []
        window.AudioContext = class extends Context {
          constructor(options) {
            super(options)
            contexts.push(this)
          }
        }
        window.art = new window.Artplayer({
          container: '.player',
          url: '/test/audio-tone.m4a',
          volume: 0.6,
          plugins: [window.artplayerPluginAsr({
            ...(mode === 'capture' ? { audioInput: { type: 'capture' } } : {}),
            onAudioChunk({ pcm }) {
              let peak = 0
              for (const sample of new Int16Array(pcm))
                peak = Math.max(peak, Math.abs(sample))
              chunks.push({ peak, source: window.art.video.currentSrc })
              if (!window.completeRecognition) {
                if (peak > 0)
                  return new Promise(resolve => window.completeRecognition = resolve)
                return
              }
              return 'Recovered recognition'
            },
          })],
        })
        for (const name of ['play', 'pause', 'restart', 'video:emptied', 'video:error'])
          window.art.on(name, () => events.push({ name, at: performance.now(), error: window.art.video.error?.code || null }))
        window.mediaErrorState = () => ({
          contexts: contexts.map(context => context.state),
          events,
          chunks,
          subtitle: document.querySelector('.art-layer-asr')?.textContent || '',
          error: window.art.video.error?.code || null,
          source: window.art.video.currentSrc,
          paused: window.art.video.paused,
        })
        document.querySelector('#play').onclick = () => window.art.play()
      }, mode)
      await expect.poll(() => page.evaluate(() => window.art.isReady)).toBe(true)
      await page.locator('#play').click()
      await expect.poll(() => page.evaluate(() => window.mediaErrorState().chunks.some(chunk => chunk.peak > 0))).toBe(true)
      await page.evaluate(() => {
        window.art.video.src = '/test/manifest.json?asr-media-error=unsupported'
      })
      await expect.poll(() => page.evaluate(() => window.mediaErrorState().error)).toBe(4)
      await page.evaluate(async () => {
        window.completeRecognition('Obsolete recognition')
        await Promise.resolve()
        await Promise.resolve()
      })
      const failed = await page.evaluate(() => window.mediaErrorState())
      await testInfo.attach('asr-native-media-failure', { contentType: 'application/json', body: JSON.stringify(failed) })
      expect(failed.subtitle).not.toContain('Obsolete recognition')
      if (mode === 'capture')
        await expect.poll(() => page.evaluate(() => window.mediaErrorState().contexts.every(state => state === 'closed'))).toBe(true)
      await page.evaluate(() => {
        window.art.url = '/test/audio-tone.m4a?asr-media-error=recovery'
      })
      await expect.poll(() => page.evaluate(() => window.art.video.currentSrc.includes('asr-media-error=recovery') && window.art.video.readyState >= 2)).toBe(true)
      await page.locator('#play').click()
      await expect.poll(() => page.evaluate(() => window.mediaErrorState().chunks.filter(chunk => chunk.source.includes('asr-media-error=recovery') && chunk.peak > 0).length)).toBeGreaterThanOrEqual(3)
      await expect(page.locator('.art-layer-asr')).toHaveText('Recovered recognition')
      await page.evaluate(() => window.art.destroy())
      await expect.poll(() => page.evaluate(() => window.mediaErrorState().contexts.every(state => state === 'closed'))).toBe(true)
    })
  }
}
