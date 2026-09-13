import fs from 'node:fs'
import process from 'node:process'
import { verifyAsrContract } from '../../refactor/scripts/asr-contract.mjs'
import { hash, readMember } from '../../refactor/scripts/releases.mjs'
import { compilePackage } from '../helpers/load.js'
import { expect, test } from './fixtures.js'

let contract
let candidateCode
test.beforeAll(async () => {
  contract = await verifyAsrContract()
  candidateCode = process.env.ARTPLAYER_ASR_ARTIFACT ? fs.readFileSync(process.env.ARTPLAYER_ASR_ARTIFACT) : await compilePackage('artplayer-plugin-asr', 'umd')
})

for (const version of ['2.0.0', '2.1.0', 'candidate']) {
  for (const core of ['published', 'candidate']) {
    test(`ASR ${version} + ${core}: native Worklet supplies local PCM with owned stop and destroy`, async ({ page }, testInfo) => {
      const release = [contract.baseline.release, ...contract.baseline.previous].find(release => release.version === version)
      const code = version === 'candidate' ? candidateCode : readMember(contract.archives.get(version), 'package/dist/artplayer-plugin-asr.js')
      const media = fs.readFileSync(new URL('./media/audio-tone.m4a', import.meta.url))
      await testInfo.attach('asr-inputs', { contentType: 'application/json', body: JSON.stringify({ version, core, pluginSha256: hash(code), integrity: release?.integrity || null, candidate: process.env.ARTPLAYER_ASR_ARTIFACT || 'workspace source', mediaSha256: hash(media), media: 'local mono AAC 440 Hz tone', networkService: false }) })
      await page.goto(`/test/player.html?core=${core}`)
      const capabilities = await page.evaluate(() => ({ AudioContext: typeof window.AudioContext, webkitAudioContext: typeof window.webkitAudioContext, AudioWorkletNode: typeof window.AudioWorkletNode }))
      await testInfo.attach('asr-audio-capabilities', { contentType: 'application/json', body: JSON.stringify(capabilities) })
      const missing = capabilities.AudioContext === 'undefined' && capabilities.webkitAudioContext === 'undefined'
      if (missing) {
        expect(process.platform).toBe('win32')
        expect(testInfo.project.name).toBe('webkit')
        expect(capabilities.AudioWorkletNode).toBe('undefined')
        test.skip(true, 'Windows WebKit 26.6 has no AudioContext/AudioWorkletNode; native ASR acceptance remains open')
      }
      expect(capabilities.AudioWorkletNode).toBe('function')
      await page.addScriptTag({ content: code.toString() })
      await page.evaluate(() => {
        const NativeContext = window.AudioContext || window.webkitAudioContext
        window.asrContexts = []
        window.AudioContext = class extends NativeContext {
          constructor(options) {
            super(options)
            window.asrContexts.push(this)
          }
        }
        window.asrChunks = []
        window.art = new window.Artplayer({
          container: '.player',
          url: '/test/audio-tone.m4a',
          volume: 0.2,
          plugins: [window.artplayerPluginAsr({
            onAudioChunk({ pcm, wav }) {
              const samples = new Int16Array(pcm)
              let max = 0
              for (const sample of samples) max = Math.max(max, Math.abs(sample))
              window.asrChunks.push({ samples: samples.length, max, wavBytes: wav.byteLength, sampleRate: new DataView(wav).getUint32(24, true), source: window.art.video.currentSrc })
              return 'Local transcript.'
            },
          })],
        })
        document.querySelector('#play').onclick = () => window.art.play()
      })
      await expect.poll(() => page.evaluate(() => window.art.isReady)).toBe(true)
      await page.locator('#play').click()
      await expect.poll(() => page.evaluate(() => window.asrChunks.filter(chunk => chunk.max > 0).length)).toBeGreaterThanOrEqual(3)
      const chunks = await page.evaluate(() => window.asrChunks)
      expect(chunks.every(chunk => chunk.samples === 1600 && chunk.wavBytes === 3244 && chunk.sampleRate === 16000)).toBe(true)
      await expect(page.locator('.art-layer-asr')).toContainText('Local transcript.')
      if (version === 'candidate') {
        await page.evaluate(() => window.art.pause())
        const before = await page.evaluate(() => window.asrChunks.length)
        await page.waitForTimeout(250)
        expect(await page.evaluate(() => window.asrChunks.length)).toBe(before)
        await page.locator('#play').click()
        await expect.poll(() => page.evaluate(() => window.asrChunks.length)).toBeGreaterThan(before + 2)
        expect(await page.evaluate(() => window.asrContexts.length)).toBe(1)
        await page.evaluate(() => {
          window.art.url = '/test/audio-tone.m4a?asr=second'
        })
        await expect.poll(() => page.evaluate(() => window.art.video.currentSrc.includes('asr=second') && window.art.video.readyState >= 2)).toBe(true)
        await page.locator('#play').click()
        await expect.poll(() => page.evaluate(() => window.asrChunks.filter(chunk => chunk.source.includes('asr=second') && chunk.max > 0).length)).toBeGreaterThanOrEqual(3)
        expect(await page.evaluate(() => window.asrContexts.length)).toBe(1)
      }
      await page.evaluate(() => window.art.plugins.artplayerPluginAsr.stop())
      expect(await page.evaluate(() => window.asrContexts.map(context => context.state))).toEqual([version === 'candidate' ? 'running' : 'closed'])
      if (version === 'candidate') {
        await page.evaluate(() => window.art.pause())
        const before = await page.evaluate(() => window.asrChunks.filter(chunk => chunk.max > 0).length)
        await page.locator('#play').click()
        await expect.poll(() => page.evaluate(() => window.asrChunks.filter(chunk => chunk.max > 0).length)).toBeGreaterThan(before + 2)
        expect(await page.evaluate(() => window.asrContexts.length)).toBe(1)
        await page.evaluate(() => window.art.plugins.artplayerPluginAsr.stop())
        expect(await page.evaluate(() => window.asrContexts.map(context => context.state))).toEqual(['running'])
      }
      await testInfo.attach('asr-native-chunks', { contentType: 'application/json', body: JSON.stringify(await page.evaluate(() => window.asrChunks)) })
      await page.evaluate(() => window.art.destroy())
      await expect.poll(() => page.evaluate(() => window.asrContexts.map(context => context.state))).toEqual(['closed'])
    })
  }
}
