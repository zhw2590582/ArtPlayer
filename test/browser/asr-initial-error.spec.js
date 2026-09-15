import process from 'node:process'
import { browserCandidate } from '../helpers/browser-candidate.js'
import { expect, test } from './fixtures.js'

let candidate
test.beforeAll(async () => {
  candidate = await browserCandidate('artplayer-plugin-asr', process.env.ARTPLAYER_ASR_ARTIFACT)
})

async function createFailedPlayer(page, core, mode, testInfo) {
  await page.goto(`/test/player.html?core=${core}`)
  const capabilities = await page.evaluate(() => ({ context: typeof (window.AudioContext || window.webkitAudioContext), worklet: typeof window.AudioWorkletNode }))
  await testInfo.attach('asr-initial-error-inputs', { contentType: 'application/json', body: JSON.stringify({ core, mode, capabilities, provenance: candidate.provenance, errorSource: '/test/manifest.json', initialReady: false, forcedFailure: false }) })
  await page.addScriptTag({ content: candidate.code })
  await page.evaluate((mode) => {
    const Context = window.AudioContext || window.webkitAudioContext
    const contexts = []
    const chunks = []
    if (Context) {
      window.AudioContext = class extends Context {
        constructor(options) {
          super(options)
          contexts.push(this)
        }
      }
    }
    window.art = new window.Artplayer({
      container: '.player',
      url: '/test/manifest.json?asr-initial-error=unsupported',
      plugins: [window.artplayerPluginAsr({
        ...(mode === 'capture' ? { audioInput: { type: 'capture' } } : {}),
        onAudioChunk({ pcm }) {
          let peak = 0
          for (const sample of new Int16Array(pcm))
            peak = Math.max(peak, Math.abs(sample))
          chunks.push({ peak, source: window.art.video.currentSrc })
          return 'Recovered audio'
        },
      })],
    })
    window.initialErrorState = () => ({ ready: window.art.isReady, destroyed: window.art.isDestroy, error: window.art.video.error?.code || null, paused: window.art.video.paused, contexts: contexts.map(context => context.state), chunks, playResult: window.playResult, subtitle: document.querySelector('.art-layer-asr')?.textContent || '' })
    document.querySelector('#play').onclick = async () => {
      window.playResult = { outcome: 'pending' }
      try {
        await window.art.play()
        window.playResult = { outcome: 'resolved' }
      }
      catch (error) {
        window.playResult = { outcome: 'rejected', name: error.name, message: error.message }
      }
    }
  }, mode)
  await expect.poll(() => page.evaluate(() => window.initialErrorState().error)).toBe(4)
  await page.locator('#play').click()
  await expect.poll(() => page.evaluate(() => window.initialErrorState().playResult?.outcome)).toBe('rejected')
  const failed = await page.evaluate(() => window.initialErrorState())
  expect(failed.playResult.name).toBe('NotSupportedError')
  expect(failed.ready).toBe(false)
  expect(failed.contexts).toEqual([])
  expect(failed.chunks).toEqual([])
  expect(failed.subtitle).toBe('')
  await testInfo.attach('asr-initial-media-failure', { contentType: 'application/json', body: JSON.stringify(failed) })
  return capabilities
}

test.afterEach(async ({ page }, testInfo) => {
  await page.evaluate(() => {
    if (window.art && !window.art.isDestroy)
      window.art.destroy()
  })
  const state = await page.evaluate(() => window.initialErrorState?.()).catch(error => ({ error: error.message }))
  await testInfo.attach('asr-initial-error-final', { contentType: 'application/json', body: JSON.stringify(state ?? null) })
})

for (const core of ['published-5.3.0', 'published', 'candidate']) {
  for (const mode of ['default', 'capture']) {
    test(`ASR ${mode} + ${core}: initial unsupported media remains lazy through stop and destroy`, async ({ page }, testInfo) => {
      await createFailedPlayer(page, core, mode, testInfo)
      await page.evaluate(() => window.art.plugins.artplayerPluginAsr.stop())
      expect(await page.evaluate(() => window.initialErrorState().contexts)).toEqual([])
      await page.evaluate(() => window.art.destroy())
      expect(await page.evaluate(() => window.initialErrorState())).toMatchObject({ destroyed: true, contexts: [], chunks: [] })
      await expect(page.locator('.art-video-player')).toHaveCount(0)
    })

    test(`ASR ${mode} + ${core}: initial unsupported media recovers on the first valid source`, async ({ page }, testInfo) => {
      const capabilities = await createFailedPlayer(page, core, mode, testInfo)
      if (capabilities.context === 'undefined') {
        expect(process.platform).toBe('win32')
        expect(testInfo.project.name).toBe('webkit')
        expect(capabilities.worklet).toBe('undefined')
        test.skip(true, 'Initial failure checked; WebKit lacks WebAudio for recovery, not Safari acceptance')
      }
      await page.evaluate(() => {
        window.art.url = '/test/audio-tone.m4a?asr-initial-error=recovery'
      })
      await expect.poll(() => page.evaluate(() => window.art.isReady && window.art.video.readyState >= 2)).toBe(true)
      await page.locator('#play').click()
      await expect.poll(() => page.evaluate(() => window.initialErrorState().chunks.filter(chunk => chunk.peak > 0 && chunk.source.includes('asr-initial-error=recovery')).length)).toBeGreaterThanOrEqual(3)
      expect(await page.evaluate(() => window.initialErrorState().contexts)).toEqual(['running'])
      await expect(page.locator('.art-layer-asr')).toHaveText('Recovered audio')
      await testInfo.attach('asr-first-valid-source', { contentType: 'application/json', body: JSON.stringify(await page.evaluate(() => window.initialErrorState())) })
      await page.evaluate(() => window.art.destroy())
      await expect.poll(() => page.evaluate(() => window.initialErrorState().contexts)).toEqual(['closed'])
    })
  }
}
