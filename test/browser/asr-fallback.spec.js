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

for (const { version, captureOnly } of [{ version: '2.1.0', captureOnly: false }, { version: 'candidate', captureOnly: false }, { version: 'candidate', captureOnly: true }]) {
  for (const core of ['published-5.3.0', 'published', 'candidate']) {
    test(`ASR ${version}${captureOnly ? ' capture' : ''} + ${core}: native capture fallback does not create a second audible route`, async ({ page }, testInfo) => {
      const code = version === 'candidate' ? candidateCode : readMember(contract.archives.get(version), 'package/dist/artplayer-plugin-asr.js')
      await page.goto(`/test/player.html?core=${core}`)
      const capabilities = await page.evaluate(() => ({ context: typeof AudioContext, worklet: typeof AudioWorkletNode, capture: typeof HTMLMediaElement.prototype.captureStream, mozCapture: typeof HTMLMediaElement.prototype.mozCaptureStream }))
      const forceRejection = testInfo.project.name === 'firefox' && !captureOnly
      await testInfo.attach('asr-fallback-inputs', { contentType: 'application/json', body: JSON.stringify({ version, core, captureOnly, pluginSha256: hash(code), capabilities, forcedException: forceRejection, reason: captureOnly ? 'Explicit capture mode never binds the element; no forced exceptions' : forceRejection ? 'Firefox permits a second native media source; force only binding rejection to reach real captureStream/Worklet' : 'Native duplicate binding rejection', externalContext: 'Native media-element source remains owned and running', physicalOutput: false }) })
      if (capabilities.context !== 'function') {
        expect(process.platform).toBe('win32')
        expect(testInfo.project.name).toBe('webkit')
        test.skip(true, 'Windows WebKit has no native WebAudio')
      }
      expect(capabilities.worklet).toBe('function')
      expect([capabilities.capture, capabilities.mozCapture]).toContain('function')
      await page.addScriptTag({ content: code.toString() })
      await page.evaluate(({ forceRejection, captureOnly }) => {
        const NativeContext = window.AudioContext
        window.asrContexts = []
        window.asrMeters = []
        window.asrStreams = []
        window.asrChunks = []
        window.asrDirectFailures = []
        window.asrDirectCalls = 0
        window.AudioContext = class extends NativeContext {
          constructor(option) {
            super(option)
            window.asrContexts.push(this)
          }

          createMediaElementSource(video) {
            window.asrDirectCalls++
            try {
              if (forceRejection)
                throw new DOMException('Controlled duplicate binding rejection for native capture test', 'InvalidStateError')
              return super.createMediaElementSource(video)
            }
            catch (error) {
              window.asrDirectFailures.push({ name: error.name, message: error.message })
              throw error
            }
          }

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
            window.asrMeters.push(analyser)
            return gain
          }
        }
        window.art = new window.Artplayer({
          container: '.player',
          url: '/test/audio-tone.m4a',
          volume: 1,
          loop: true,
          plugins: [window.artplayerPluginAsr({ audioInput: captureOnly ? { type: 'capture' } : undefined, onAudioChunk({ pcm }) {
            const samples = new Int16Array(pcm)
            const max = samples.reduce((value, sample) => Math.max(value, Math.abs(sample)), 0)
            window.asrChunks.push({ max, source: window.art.video.currentSrc, samples: samples.length })
          } })],
        })
        const capture = window.art.video.captureStream || window.art.video.mozCaptureStream
        window.art.video.captureStream = function () {
          const stream = capture.call(this)
          window.asrStreams.push({ stream, tracks: stream.getTracks() })
          return stream
        }
        window.externalContext = new NativeContext({ sampleRate: 16000 })
        const source = window.externalContext.createMediaElementSource(window.art.video)
        window.externalMeter = window.externalContext.createAnalyser()
        window.externalMeter.fftSize = 2048
        source.connect(window.externalMeter)
        window.externalMeter.connect(window.externalContext.destination)
        document.querySelector('#play').onclick = async () => {
          await window.externalContext.resume()
          await window.art.play()
        }
        window.readFallback = () => {
          const rms = (analyser) => {
            const samples = new Float32Array(analyser.fftSize)
            analyser.getFloatTimeDomainData(samples)
            return Math.sqrt(samples.reduce((sum, value) => sum + value * value, 0) / samples.length)
          }
          return { external: rms(window.externalMeter), asr: window.asrMeters.map(rms), contexts: window.asrContexts.map(c => c.state), owner: window.externalContext.state, streams: window.asrStreams.map(s => s.tracks.map(t => ({ kind: t.kind, state: t.readyState }))), chunks: window.asrChunks.slice(-3), failures: window.asrDirectFailures, directCalls: window.asrDirectCalls }
        }
      }, { forceRejection, captureOnly })
      await expect.poll(() => page.evaluate(() => window.art.isReady)).toBe(true)
      await page.locator('#play').click()
      await expect.poll(() => page.evaluate(() => window.asrChunks.filter(c => c.max > 0).length)).toBeGreaterThanOrEqual(3)
      const playing = await page.evaluate(() => window.readFallback())
      await page.evaluate(() => {
        window.art.muted = true
      })
      await page.waitForTimeout(450)
      const muted = await page.evaluate(() => window.readFallback())
      await testInfo.attach('asr-fallback-output', { contentType: 'application/json', body: JSON.stringify({ playing, muted }) })
      expect(playing.failures.length).toBe(captureOnly ? 0 : 1)
      expect(playing.directCalls).toBe(captureOnly ? 0 : 1)
      expect(playing.external).toBeGreaterThan(0.01)
      expect(muted.external).toBe(0)
      if (version === '2.1.0') {
        expect(playing.asr.at(-1)).toBeGreaterThan(0.01)
        expect(muted.asr.at(-1)).toBeGreaterThan(0.01)
      }
      else {
        expect(playing.asr.at(-1)).toBe(0)
        expect(muted.asr.at(-1)).toBe(0)
      }
      expect(muted.chunks.every(chunk => chunk.max > 0)).toBe(true)
      await page.evaluate(() => {
        window.art.muted = false
      })
      await page.evaluate(() => window.art.plugins.artplayerPluginAsr.stop())
      await page.waitForTimeout(200)
      const stopped = await page.evaluate(() => window.readFallback())
      expect(stopped.contexts).toEqual(['closed'])
      expect(stopped.owner).toBe('running')
      expect(stopped.external).toBeGreaterThan(0.01)
      expect(stopped.streams.flat().every(t => t.state === 'ended')).toBe(true)
      await testInfo.attach('asr-fallback-stop', { contentType: 'application/json', body: JSON.stringify(stopped) })
      if (version === 'candidate') {
        const count = await page.evaluate(() => window.asrChunks.length)
        await page.evaluate(() => window.art.pause())
        await page.locator('#play').click()
        await expect.poll(() => page.evaluate(() => window.asrChunks.filter(c => c.max > 0).length)).toBeGreaterThan(count + 2)
        expect(await page.evaluate(() => window.asrStreams[1].tracks.every(track => !window.asrStreams[0].tracks.includes(track)))).toBe(true)
        await page.evaluate(() => {
          window.art.url = '/test/audio-tone.m4a?asr=fallback-second'
        })
        await expect.poll(() => page.evaluate(() => window.art.video.currentSrc.includes('fallback-second') && window.art.video.readyState >= 2)).toBe(true)
        await page.locator('#play').click()
        await expect.poll(() => page.evaluate(() => window.asrChunks.filter(c => c.source.includes('fallback-second') && c.max > 0).length)).toBeGreaterThanOrEqual(3)
        const restarted = await page.evaluate(() => window.readFallback())
        expect(restarted.owner).toBe('running')
        expect(restarted.contexts).toEqual(['closed', 'closed', 'running'])
        expect(restarted.asr.at(-1)).toBe(0)
        expect(restarted.streams.slice(0, -1).flat().every(track => track.state === 'ended')).toBe(true)
        expect(restarted.streams.at(-1).every(track => track.state === 'live')).toBe(true)
        await testInfo.attach('asr-fallback-restart', { contentType: 'application/json', body: JSON.stringify(restarted) })
      }
      await page.evaluate(() => window.art.destroy())
      await expect.poll(() => page.evaluate(() => window.asrContexts.every(context => context.state === 'closed'))).toBe(true)
      expect(await page.evaluate(() => window.externalContext.state)).toBe('running')
      if (captureOnly)
        expect(await page.evaluate(() => window.asrDirectCalls)).toBe(0)
      await page.evaluate(() => window.externalContext.close())
    })
  }
}
