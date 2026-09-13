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

for (const version of ['2.1.0', 'candidate']) {
  for (const core of ['published-5.3.0', 'published', 'candidate']) {
    test(`ASR ${version} + ${core}: native playback volume and mute`, async ({ page }, testInfo) => {
      const code = version === 'candidate' ? candidateCode : readMember(contract.archives.get(version), 'package/dist/artplayer-plugin-asr.js')
      await page.goto(`/test/player.html?core=${core}`)
      const supported = await page.evaluate(() => typeof AudioContext === 'function' && typeof AudioWorkletNode === 'function')
      if (!supported) {
        expect(process.platform).toBe('win32')
        expect(testInfo.project.name).toBe('webkit')
        test.skip(true, 'Windows WebKit lacks native AudioContext/AudioWorkletNode')
      }
      await testInfo.attach('asr-playback-inputs', { contentType: 'application/json', body: JSON.stringify({ version, core, pluginSha256: hash(code), mediaSha256: hash(fs.readFileSync(new URL('./media/audio-tone.m4a', import.meta.url))), meter: 'Native unity analyser inserted between plugin gain and destination', physicalAudioOutput: false }) })
      await page.addScriptTag({ content: code.toString() })
      await page.evaluate(() => {
        const NativeContext = window.AudioContext
        window.asrMeters = []
        window.asrChunks = []
        window.AudioContext = class extends NativeContext {
          createGain() {
            const gain = super.createGain()
            const analyser = super.createAnalyser()
            analyser.fftSize = 2048
            const connect = gain.connect.bind(gain)
            const disconnect = gain.disconnect.bind(gain)
            gain.connect = (destination, ...args) => {
              if (destination === this.destination) {
                connect(analyser)
                analyser.connect(destination)
                return destination
              }
              return connect(destination, ...args)
            }
            gain.disconnect = (...args) => {
              analyser.disconnect()
              return disconnect(...args)
            }
            window.asrMeters.push({ gain, analyser })
            return gain
          }
        }
        window.art = new window.Artplayer({
          container: '.player',
          url: '/test/audio-tone.m4a',
          volume: 1,
          loop: true,
          plugins: [window.artplayerPluginAsr({ onAudioChunk({ pcm }) {
            const samples = new Int16Array(pcm)
            window.asrChunks.push(Math.sqrt(samples.reduce((sum, value) => sum + value * value, 0) / samples.length) / 32768)
          } })],
        })
        document.querySelector('#play').onclick = () => window.art.play()
        window.measureOutput = () => {
          const meter = window.asrMeters.at(-1)
          const samples = new Float32Array(meter.analyser.fftSize)
          meter.analyser.getFloatTimeDomainData(samples)
          return { volume: window.art.volume, muted: window.art.muted, gain: meter.gain.gain.value, rms: Math.sqrt(samples.reduce((sum, value) => sum + value * value, 0) / samples.length), pcm: window.asrChunks.slice(-3) }
        }
      })
      await expect.poll(() => page.evaluate(() => window.art.isReady)).toBe(true)
      await page.locator('#play').click()
      await expect.poll(() => page.evaluate(() => window.asrChunks.length)).toBeGreaterThanOrEqual(3)
      const levels = []
      for (const [volume, muted] of [[1, false], [0.5, false], [0.25, false], [0.5, true], [0.5, false]]) {
        await page.evaluate(({ volume, muted }) => {
          window.art.volume = volume
          window.art.muted = muted
        }, { volume, muted })
        await page.waitForTimeout(450)
        levels.push(await page.evaluate(() => window.measureOutput()))
      }
      await testInfo.attach('asr-playback-levels', { contentType: 'application/json', body: JSON.stringify(levels) })
      expect(levels[0].rms).toBeGreaterThan(0.01)
      const expected = version === 'candidate' ? [1, 0.5, 0.25, 0, 0.5] : [1, 0.25, 0.0625, 0, 0.25]
      for (const [index, level] of levels.entries()) {
        expect(level.rms / levels[0].rms).toBeGreaterThanOrEqual(Math.max(0, expected[index] * 0.9))
        expect(level.rms / levels[0].rms).toBeLessThanOrEqual(expected[index] * 1.1)
      }
      if (version === 'candidate') {
        await page.evaluate(() => window.art.plugins.artplayerPluginAsr.stop())
        const count = await page.evaluate(() => window.asrChunks.length)
        await page.evaluate(() => {
          window.art.volume = 0.25
        })
        await page.waitForTimeout(450)
        expect(await page.evaluate(() => window.asrChunks.length)).toBe(count)
        const stopped = await page.evaluate(() => window.measureOutput())
        expect(stopped.rms / levels[0].rms).toBeGreaterThan(0.225)
        expect(stopped.rms / levels[0].rms).toBeLessThan(0.275)
        await page.evaluate(() => window.art.pause())
        await page.locator('#play').click()
        await expect.poll(() => page.evaluate(() => window.asrChunks.length)).toBeGreaterThan(count + 2)
        const resumed = await page.evaluate(() => window.measureOutput())
        expect(resumed.rms / levels[0].rms).toBeGreaterThan(0.225)
        expect(resumed.rms / levels[0].rms).toBeLessThan(0.275)
        await testInfo.attach('asr-playback-restart', { contentType: 'application/json', body: JSON.stringify({ stopped, resumed }) })
      }
      await page.evaluate(() => window.art.destroy())
    })
  }
}
