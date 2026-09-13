import assert from 'node:assert/strict'
import fs from 'node:fs'
// eslint-disable-next-line test/no-import-node-test -- Demo lifecycle uses the repository runner.
import test from 'node:test'
import vm from 'node:vm'
import { deferredAudio } from './helpers/asr-audio.js'

const code = fs.readFileSync(new URL('../docs/assets/example/asr.local.js', import.meta.url), 'utf8')

function example() {
  const requests = []
  const statistics = { textContent: '' }
  let instance
  let option
  let asrOption
  const stop = deferredAudio()
  function forbidden(...args) {
    requests.push(args)
    throw new Error('The local ASR example must not open a recognition connection')
  }
  const context = vm.createContext({
    document: { createElement: () => statistics },
    Artplayer: class {
      isDestroy = false
      plugins = { artplayerPluginAsr: { stop: () => stop.promise } }
      constructor(value) {
        option = value
        instance = this
      }
    },
    artplayerPluginAsr(value) {
      asrOption = value
      return () => ({ name: 'artplayerPluginAsr' })
    },
    fetch: forbidden,
    WebSocket: forbidden,
    XMLHttpRequest: forbidden,
    EventSource: forbidden,
    navigator: { sendBeacon: forbidden },
  })
  vm.runInContext(code, context, { timeout: 1000 })
  return { statistics, instance, option, asrOption, requests, stop }
}

function chunk() {
  const pcm = new ArrayBuffer(8000)
  const wav = new ArrayBuffer(8044)
  const samples = new DataView(pcm)
  samples.setInt16(0, -32768, true)
  samples.setInt16(2, 32767, true)
  new DataView(wav).setUint32(24, 16000, true)
  return { pcm, wav }
}

test('ASR local example uses a real same-site sample and reports PCM/WAV without a recognition connection', () => {
  const environment = example()
  assert.equal(environment.option.url, '/assets/sample/steve-jobs.mp4')
  assert.ok(fs.statSync(new URL(`../docs${environment.option.url}`, import.meta.url)).size > 0)
  assert.equal(environment.option.layers[0].html, environment.statistics)
  assert.equal(environment.asrOption.interval, 250)
  assert.equal(environment.asrOption.onAudioChunk(chunk()), 'Simulated local subtitle: audio chunk 1 received.')
  assert.match(environment.statistics.textContent, /Chunks: 1 \| 16000 Hz mono PCM16 \| 0\.25 seconds captured/u)
  assert.match(environment.statistics.textContent, /PCM: 8000 bytes \| WAV: 8044 bytes \| Current peak: 32768/u)
  environment.asrOption.onAudioChunk(chunk())
  assert.match(environment.statistics.textContent, /Chunks: 2.*0\.50 seconds captured/u)
  assert.match(environment.statistics.textContent, /simulated subtitles, no speech recognition/u)
  assert.deepEqual(environment.requests, [])
})

test('ASR local example waits for stop and reports how to resume capture', async () => {
  const environment = example()
  environment.asrOption.onAudioChunk(chunk())
  const before = environment.statistics.textContent
  const stopping = environment.option.controls[0].click()
  assert.equal(environment.statistics.textContent, before)
  environment.stop.resolve()
  await stopping
  assert.equal(environment.statistics.textContent, 'Local capture stopped. Pause and play to restart. Nothing was uploaded.')
  assert.deepEqual(environment.requests, [])
})

test('ASR local example ignores late audio and stop completion after player destruction', async () => {
  const environment = example()
  const stopping = environment.option.controls[0].click()
  const before = environment.statistics.textContent
  environment.instance.isDestroy = true
  assert.equal(environment.asrOption.onAudioChunk(chunk()), undefined)
  environment.stop.resolve()
  await stopping
  assert.equal(environment.statistics.textContent, before)
  assert.deepEqual(environment.requests, [])
})
