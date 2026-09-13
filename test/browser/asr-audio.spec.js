import fs from 'node:fs'
import process from 'node:process'
import { verifyAsrContract } from '../../refactor/scripts/asr-contract.mjs'
import { hash, readMember } from '../../refactor/scripts/releases.mjs'
import { expect, test } from './fixtures.js'

let contract
test.beforeAll(async () => {
  contract = await verifyAsrContract()
})

for (const version of ['2.0.0', '2.1.0']) {
  for (const core of ['published', 'candidate']) {
    test(`ASR ${version} + ${core}: native Worklet supplies local PCM and stop closes AudioContext`, async ({ page }, testInfo) => {
      const release = [contract.baseline.release, ...contract.baseline.previous].find(release => release.version === version)
      const code = readMember(contract.archives.get(version), 'package/dist/artplayer-plugin-asr.js')
      const media = fs.readFileSync(new URL('./media/audio-tone.m4a', import.meta.url))
      await testInfo.attach('asr-inputs', { contentType: 'application/json', body: JSON.stringify({ version, core, pluginSha256: hash(code), integrity: release.integrity, mediaSha256: hash(media), media: 'local mono AAC 440 Hz tone', networkService: false }) })
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
              window.asrChunks.push({ samples: samples.length, max, wavBytes: wav.byteLength, sampleRate: new DataView(wav).getUint32(24, true) })
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
      await page.evaluate(() => window.art.plugins.artplayerPluginAsr.stop())
      expect(await page.evaluate(() => window.asrContexts.map(context => context.state))).toEqual(['closed'])
      await testInfo.attach('asr-native-chunks', { contentType: 'application/json', body: JSON.stringify(chunks) })
      await page.evaluate(() => window.art.destroy())
    })
  }
}
