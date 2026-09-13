import assert from 'node:assert/strict'
import { Buffer } from 'node:buffer'
// eslint-disable-next-line test/no-import-node-test -- Historical ASR audio uses the repository runner.
import test from 'node:test'
import { asrAudioEnvironment, deferredAudio, runAsrWorklet } from './helpers/asr-audio.js'
import { asrHistorical } from './helpers/asr.js'

// These fixtures are immutable historical implementations, never the candidate.
// Defect observations must become separate red/green candidate regressions when fixed.
const implementations = await asrHistorical()

function samples(pcm) {
  const view = new DataView(pcm)
  return Array.from({ length: pcm.byteLength / 2 }, (_, index) => view.getInt16(index * 2, true))
}

for (const implementation of implementations) {
  const label = `ASR audio history ${implementation.name}`

  test(`${label}: default PCM clamping and mono WAV bytes`, async () => {
    const chunks = []
    const environment = asrAudioEnvironment(implementation, { onAudioChunk: chunk => chunks.push(chunk) })
    await environment.emit('play')
    assert.equal(environment.contexts[0].options.sampleRate, 16000)
    assert.equal([...environment.intervals.values()][0].delay, 100)
    const input = new Float32Array(1600)
    input.set([-2, -1, -0.5, 0, 0.5, 1, 2, Number.NaN])
    environment.send(input)
    await environment.tick()
    assert.equal(chunks.length, 1)
    assert.deepEqual(Object.keys(chunks[0]), ['pcm', 'wav'])
    assert.equal(chunks[0].pcm.byteLength, 3200)
    assert.deepEqual(samples(chunks[0].pcm).slice(0, 8), [-32768, -32768, -16384, 0, 16383, 32767, 32767, 0])
    const wav = Buffer.from(chunks[0].wav)
    assert.equal(wav.length, 3244)
    assert.equal(wav.toString('ascii', 0, 4), 'RIFF')
    assert.equal(wav.readUInt32LE(4), 3236)
    assert.equal(wav.toString('ascii', 8, 16), 'WAVEfmt ')
    assert.equal(wav.readUInt32LE(16), 16)
    assert.equal(wav.readUInt16LE(20), 1)
    assert.equal(wav.readUInt16LE(22), 1)
    assert.equal(wav.readUInt32LE(24), 16000)
    assert.equal(wav.readUInt32LE(28), 32000)
    assert.equal(wav.readUInt16LE(32), 2)
    assert.equal(wav.readUInt16LE(34), 16)
    assert.equal(wav.toString('ascii', 36, 40), 'data')
    assert.equal(wav.readUInt32LE(40), 3200)
    assert.deepEqual(wav.subarray(44), Buffer.from(chunks[0].pcm))
    await environment.plugin.stop()
  })

  test(`${label}: custom sampling concatenates worklet messages in order`, async () => {
    const chunks = []
    const environment = asrAudioEnvironment(implementation, { sampleRate: 8000, interval: 1, onAudioChunk: chunk => chunks.push(chunk) })
    await environment.emit('play')
    environment.send([-1, -0.5, 0])
    environment.send([0.5, 1, 0, -1, 1])
    await environment.tick()
    assert.equal(chunks.length, 1)
    assert.deepEqual(samples(chunks[0].pcm), [-32768, -16384, 0, 16383, 32767, 0, -32768, 32767])
    assert.equal(new DataView(chunks[0].wav).getUint32(24, true), 8000)
    assert.equal([...environment.intervals.values()][0].delay, 1)
    await environment.plugin.stop()
  })

  test(`${label}: actual worklet emits first channel and survives empty input`, async () => {
    const environment = asrAudioEnvironment(implementation)
    await environment.emit('play')
    const { processor, messages } = await runAsrWorklet(environment.modules[0].blob)
    const left = Float32Array.of(0.1, 0.2)
    const right = Float32Array.of(0.9, 0.8)
    assert.equal(processor.process([]), true)
    assert.equal(processor.process([[]]), true)
    assert.equal(processor.process([[left, right]]), true)
    assert.equal(messages.length, 1)
    assert.equal(messages[0], left)
    assert.equal(environment.blobs.size, 0)
    assert.equal(environment.revoked.length, 1)
    await environment.plugin.stop()
  })

  test(`${label}: historical defect drops sub-threshold audio each tick and excess samples`, async () => {
    const chunks = []
    const environment = asrAudioEnvironment(implementation, { sampleRate: 8000, interval: 1, onAudioChunk: chunk => chunks.push(chunk) })
    await environment.emit('play')
    for (let index = 0; index < 2; index++) {
      environment.send([1, 1, 1, 1])
      await environment.tick()
    }
    assert.equal(chunks.length, 0, 'Eight samples across two ticks were lost')
    environment.send(new Float32Array(12).fill(0.5))
    await environment.tick()
    environment.send(new Float32Array(4).fill(-0.5))
    await environment.tick()
    assert.equal(chunks.length, 1, 'Four excess samples were not retained for the next four')
    assert.deepEqual(samples(chunks[0].pcm), Array.from({ length: 8 }, () => 16383))
    await environment.plugin.stop()
  })

  test(`${label}: historical defect overlaps slow callbacks and paints stale completion`, async () => {
    const pending = []
    const environment = asrAudioEnvironment(implementation, { sampleRate: 8000, interval: 1, onAudioChunk: () => {
      const call = deferredAudio()
      pending.push(call)
      return call.promise
    } })
    await environment.emit('play')
    environment.send(new Float32Array(8))
    const first = environment.tick()
    environment.send(new Float32Array(8))
    const second = environment.tick()
    assert.equal(pending.length, 2, 'No backpressure while the first callback is pending')
    pending[1].resolve('New result.')
    await second
    assert.equal(environment.layer.innerHTML, '<div class="art-asr-line">New result.</div>')
    pending[0].resolve('Old result.')
    await first
    assert.equal(environment.layer.innerHTML, '<div class="art-asr-line">Old result.</div>')
    await environment.plugin.stop()
  })

  test(`${label}: historical defect rejects the detached interval callback`, async () => {
    const failure = new Error('recognizer unavailable')
    const environment = asrAudioEnvironment(implementation, { sampleRate: 8000, interval: 1, onAudioChunk: () => Promise.reject(failure) })
    await environment.emit('play')
    environment.send(new Float32Array(8))
    // Capture the real returned Promise; do not create an unhandled rejection in node:test.
    await assert.rejects(environment.tick(), error => error === failure)
    assert.equal(environment.intervals.size, 1)
    assert.equal(environment.errors.length, 0)
    assert.equal(environment.layer.innerHTML, '')
    await environment.plugin.stop()
  })

  for (const event of ['pause', 'destroy', 'stop']) {
    test(`${label}: historical defect accepts callback completion after ${event}`, async () => {
      const pending = deferredAudio()
      const environment = asrAudioEnvironment(implementation, { sampleRate: 8000, interval: 1, onAudioChunk: () => pending.promise })
      await environment.emit('play')
      environment.send(new Float32Array(8))
      const work = environment.tick()
      await (event === 'stop' ? environment.plugin.stop() : environment.emit(event))
      assert.equal(environment.intervals.size, 0)
      assert.equal(environment.recorders[0].port.onmessage, null)
      assert.equal(environment.contexts[0].closes, event === 'pause' ? 0 : 1)
      pending.resolve('Late result.')
      await work
      assert.equal(environment.layer.innerHTML, '<div class="art-asr-line">Late result.</div>')
      assert.equal(environment.timeouts.size, 1, 'Late completion creates a new hide timer')
      await environment.plugin.stop()
    })
  }

  test(`${label}: historical defect resume replaces element source with captured stream`, async () => {
    const environment = asrAudioEnvironment(implementation, {}, { suspended: true, webkit: true, moz: true })
    await environment.emit('play')
    assert.equal(environment.contexts[0].resumes, 1)
    assert.equal(environment.captures(), 0)
    assert.equal(environment.nodes.find(node => node.kind === 'gain').gain.value, 1, 'Initial gain ignores art.volume=0.5')
    await environment.emit('video:volumechange')
    assert.equal(environment.nodes.find(node => node.kind === 'gain').gain.value, 0.5)
    await environment.emit('pause')
    assert.equal(environment.recorders[0].disconnects, 1)
    assert.equal(environment.nodes.find(node => node.kind === 'element').disconnects, 0)
    await environment.emit('play')
    assert.equal(environment.contexts.length, 1)
    assert.equal(environment.modules.length, 1)
    assert.equal(environment.captures(), 1)
    assert.equal(environment.nodes.filter(node => node.kind === 'stream').length, 1)
    await environment.plugin.stop()
    assert.equal(environment.tracks[0].stops, 1)
    assert.equal(environment.contexts[0].closes, 1)
  })

  test(`${label}: historical defect cannot resume direct source without captureStream`, async () => {
    const environment = asrAudioEnvironment(implementation, {}, { capture: false })
    await environment.emit('play')
    await environment.emit('pause')
    await environment.emit('play')
    assert.equal(environment.recorders.length, 1)
    assert.equal(environment.intervals.size, 0)
    assert.equal(environment.errors.length, 1)
    assert.equal(environment.errors[0][1].message, 'Could not establish audio source')
    await environment.plugin.stop()
  })

  test(`${label}: fallback stops captured tracks and disconnects on destroy`, async () => {
    const environment = asrAudioEnvironment(implementation, {}, { directError: new Error('already attached') })
    await environment.emit('play')
    assert.equal(environment.captures(), 1)
    assert.equal(environment.warnings.length, 1)
    const source = environment.nodes.find(node => node.kind === 'stream')
    assert.equal(source.connections.length, 2)
    await environment.emit('destroy')
    assert.equal(source.disconnects, 1)
    assert.equal(environment.tracks[0].stops, 1)
    assert.equal(environment.contexts[0].closes, 1)
    await environment.plugin.stop()
    assert.equal(environment.tracks[0].stops, 1)
  })

  test(`${label}: play after successful initialization is idempotent`, async () => {
    const environment = asrAudioEnvironment(implementation)
    await environment.emit('play')
    await environment.emit('play')
    assert.equal(environment.contexts.length, 1)
    assert.equal(environment.modules.length, 1)
    assert.equal(environment.recorders.length, 1)
    assert.equal(environment.intervals.size, 1)
    assert.equal(environment.captures(), 0)
    await environment.plugin.stop()
  })

  test(`${label}: historical defect source restart keeps queued audio and stale recognizer result`, async () => {
    const calls = []
    const pending = deferredAudio()
    const environment = asrAudioEnvironment(implementation, { sampleRate: 8000, interval: 1, onAudioChunk: (chunk) => {
      calls.push(chunk)
      return calls.length === 1 ? pending.promise : undefined
    } })
    await environment.emit('play')
    environment.send(new Float32Array(8).fill(0.5))
    const recognizing = environment.tick()
    environment.send(new Float32Array(8).fill(-0.5))
    environment.art.video.src = 'local-new-source.mp4'
    await environment.emit('restart')
    await environment.tick()
    assert.equal(calls.length, 2)
    assert.deepEqual(samples(calls[1].pcm), Array.from({ length: 8 }, () => -16384))
    pending.resolve('Previous source.')
    await recognizing
    assert.equal(environment.layer.innerHTML, '<div class="art-asr-line">Previous source.</div>')
    await environment.plugin.stop()
  })

  test(`${label}: explicit stop followed by play uses capture fallback for already attached video`, async () => {
    const environment = asrAudioEnvironment(implementation)
    await environment.emit('play')
    await environment.plugin.stop()
    await environment.emit('play')
    assert.equal(environment.contexts.length, 2)
    assert.equal(environment.contexts[0].closes, 1)
    assert.equal(environment.contexts[1].closes, 0)
    assert.equal(environment.captures(), 1)
    assert.equal(environment.modules.length, 2)
    assert.equal(environment.recorders.length, 2)
    assert.equal(environment.warnings[0][1].message, 'HTMLMediaElement already connected to a MediaElementSourceNode')
    assert.equal(environment.intervals.size, 1)
    await environment.plugin.stop()
  })

  test(`${label}: historical defect concurrent play creates two graphs and leaks one timer`, async () => {
    const gate = deferredAudio()
    const environment = asrAudioEnvironment(implementation, {}, { moduleGate: gate })
    const first = environment.emit('play')
    const second = environment.emit('play')
    gate.resolve()
    await Promise.all([first, second])
    assert.equal(environment.contexts.length, 1)
    assert.equal(environment.modules.length, 2)
    assert.equal(environment.recorders.length, 2)
    assert.equal(environment.intervals.size, 2)
    await environment.plugin.stop()
    assert.equal(environment.intervals.size, 1, 'Only the most recently assigned interval is cleared')
    assert.equal(typeof environment.recorders[0].port.onmessage, 'function')
    assert.equal(environment.recorders[0].disconnects, 0)
    assert.equal(environment.recorders[1].port.onmessage, null)
  })

  test(`${label}: historical defect pause during worklet loading does not cancel start`, async () => {
    const gate = deferredAudio()
    const entered = deferredAudio()
    const environment = asrAudioEnvironment(implementation, {}, { moduleGate: gate, moduleEntered: entered })
    const starting = environment.emit('play')
    await entered.promise
    await environment.emit('pause')
    assert.equal(environment.intervals.size, 0)
    gate.resolve()
    await starting
    assert.equal(environment.intervals.size, 1)
    assert.equal(environment.recorders.length, 1)
    await environment.plugin.stop()
  })

  test(`${label}: historical defect destroy during pending worklet reports late initialization error`, async () => {
    const gate = deferredAudio()
    const entered = deferredAudio()
    const environment = asrAudioEnvironment(implementation, {}, { moduleGate: gate, moduleEntered: entered })
    const starting = environment.emit('play')
    await entered.promise
    await environment.emit('destroy')
    assert.equal(environment.contexts[0].closes, 1)
    gate.resolve()
    await starting
    assert.equal(environment.intervals.size, 0)
    assert.equal(environment.recorders.length, 0)
    assert.equal(environment.revoked.length, 1)
    assert.equal(environment.errors.length, 1)
    assert.equal(environment.errors[0][1].name, 'TypeError')
    assert.match(environment.errors[0][1].message, /createGain/u)
  })

  test(`${label}: historical defect failed worklet load retains context, source and blob URL`, async () => {
    const failure = new Error('worklet unavailable')
    const environment = asrAudioEnvironment(implementation, {}, { moduleError: failure })
    await environment.emit('play')
    assert.equal(environment.errors[0][1], failure)
    assert.equal(environment.intervals.size, 0)
    assert.equal(environment.contexts[0].closes, 0)
    assert.equal(environment.blobs.size, 1)
    assert.equal(environment.revoked.length, 0)
    const source = environment.nodes.find(node => node.kind === 'element')
    assert.equal(source.disconnects, 0)
    await environment.plugin.stop()
    assert.equal(source.disconnects, 1)
    assert.equal(environment.contexts[0].closes, 1)
    assert.equal(environment.blobs.size, 1, 'Explicit stop also leaves the failed module URL allocated')
  })
}
