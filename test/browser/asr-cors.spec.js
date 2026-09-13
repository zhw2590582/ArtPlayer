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
  for (const core of ['published', 'candidate']) {
    for (const scenario of ['anonymous-cors', 'opaque', 'opaque-redirect']) {
      test(`ASR ${version} + ${core}: ${scenario} native audio access and source recovery`, async ({ page }, testInfo) => {
        await page.goto(`/test/player.html?core=${core}`)
        const capabilities = await page.evaluate(() => ({ context: typeof window.AudioContext, prefixed: typeof window.webkitAudioContext, worklet: typeof window.AudioWorkletNode }))
        await testInfo.attach('asr-cors-capabilities', { contentType: 'application/json', body: JSON.stringify(capabilities) })
        if (capabilities.context === 'undefined' && capabilities.prefixed === 'undefined') {
          expect(process.platform).toBe('win32')
          expect(testInfo.project.name).toBe('webkit')
          expect(capabilities.worklet).toBe('undefined')
          test.skip(true, 'Windows WebKit lacks native WebAudio; this is not Safari CORS acceptance')
        }
        const code = version === 'candidate' ? candidateCode : readMember(contract.archives.get(version), 'package/dist/artplayer-plugin-asr.js')
        await testInfo.attach('asr-cors-inputs', { contentType: 'application/json', body: JSON.stringify({ version, core, scenario, pluginSha256: hash(code), mediaSha256: hash(fs.readFileSync(new URL('./media/audio-tone.m4a', import.meta.url))), physicalAudioOutput: false, securityBypass: false }) })
        const responses = []
        page.on('response', (response) => {
          if (/\/test\/(?:asr-cors\.m4a|audio-tone\.m4a|asr-opaque-redirect)(?:\?|$)/u.test(response.url()))
            responses.push({ url: response.url(), status: response.status(), allowOrigin: response.headers()['access-control-allow-origin'] || null })
        })
        await page.addScriptTag({ content: code.toString() })
        await page.evaluate((scenario) => {
          const NativeContext = window.AudioContext || window.webkitAudioContext
          window.asrContexts = []
          window.asrChunks = []
          window.asrMeters = []
          window.AudioContext = class extends NativeContext {
            constructor(options) {
              super(options)
              window.asrContexts.push(this)
            }

            createGain() {
              const gain = super.createGain()
              const analyser = super.createAnalyser()
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
              window.asrMeters.push(analyser)
              return gain
            }
          }
          const alternate = location.origin.replace('127.0.0.1', 'localhost')
          const url = scenario === 'anonymous-cors' ? `${alternate}/test/asr-cors.m4a` : scenario === 'opaque' ? `${alternate}/test/audio-tone.m4a` : '/test/asr-opaque-redirect'
          window.art = new window.Artplayer({
            container: '.player',
            url,
            volume: 1,
            loop: true,
            moreVideoAttr: scenario === 'anonymous-cors' ? { crossOrigin: 'anonymous' } : {},
            plugins: [window.artplayerPluginAsr({ onAudioChunk({ pcm }) {
              const values = new Int16Array(pcm)
              window.asrChunks.push({ max: values.reduce((max, value) => Math.max(max, Math.abs(value)), 0), source: window.art.video.currentSrc })
            } })],
          })
          document.querySelector('#play').onclick = () => window.art.play()
          window.asrReading = () => {
            const analyser = window.asrMeters.at(-1)
            const values = new Float32Array(analyser.fftSize)
            analyser.getFloatTimeDomainData(values)
            return { outputMax: values.reduce((max, value) => Math.max(max, Math.abs(value)), 0), chunks: window.asrChunks.slice(-3), time: window.art.currentTime, paused: window.art.video.paused, error: window.art.video.error?.code || null, crossOrigin: window.art.video.crossOrigin }
          }
        }, scenario)
        await expect.poll(() => page.evaluate(() => window.art.isReady)).toBe(true)
        await page.locator('#play').click()
        // Firefox suppresses restricted input entirely; Chromium delivers zero samples.
        if (testInfo.project.name === 'firefox' && scenario !== 'anonymous-cors') {
          await expect.poll(() => page.evaluate(() => window.asrMeters.length)).toBe(1)
          await expect.poll(() => page.evaluate(() => window.art.currentTime)).toBeGreaterThan(1)
          expect(await page.evaluate(() => window.asrChunks.length)).toBe(0)
        }
        else {
          await expect.poll(() => page.evaluate(() => window.asrChunks.length)).toBeGreaterThanOrEqual(4)
        }
        const initial = await page.evaluate(() => window.asrReading())
        expect(initial.error).toBeNull()
        expect(initial.paused).toBe(false)
        if (scenario === 'anonymous-cors') {
          expect(initial.crossOrigin).toBe('anonymous')
          expect(initial.outputMax).toBeGreaterThan(0.01)
          expect(initial.chunks.every(chunk => chunk.max > 0)).toBe(true)
          expect(responses.some(response => response.allowOrigin === '*')).toBe(true)
        }
        else {
          expect(initial.crossOrigin).toBeNull()
          expect(initial.outputMax).toBe(0)
          expect(initial.chunks.every(chunk => chunk.max === 0)).toBe(true)
          expect(responses.every(response => response.allowOrigin === null)).toBe(true)
          if (scenario === 'opaque-redirect')
            expect(responses.some(response => response.status === 302)).toBe(true)
        }
        await expect.poll(() => page.evaluate(() => window.art.currentTime)).toBeGreaterThan(initial.time + 0.3)
        let recovery
        if (version === 'candidate') {
          await page.evaluate(() => {
            window.art.url = '/test/audio-tone.m4a?asr-cors=recovery'
          })
          await expect.poll(() => page.evaluate(() => window.art.video.currentSrc.includes('asr-cors=recovery') && window.art.video.readyState >= 2)).toBe(true)
          await page.locator('#play').click()
          await expect.poll(() => page.evaluate(() => window.asrChunks.filter(chunk => chunk.source.includes('asr-cors=recovery') && chunk.max > 0).length)).toBeGreaterThanOrEqual(3)
          recovery = await page.evaluate(() => window.asrReading())
          expect(recovery.outputMax).toBeGreaterThan(0.01)
          expect(await page.evaluate(() => window.asrContexts.length)).toBe(1)
        }
        await testInfo.attach('asr-cors-observation', { contentType: 'application/json', body: JSON.stringify({ initial, recovery, responses }) })
        await page.evaluate(() => window.art.destroy())
        await expect.poll(() => page.evaluate(() => window.asrContexts.map(context => context.state))).toEqual(['closed'])
      })
    }
  }
}
