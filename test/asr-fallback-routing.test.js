import assert from 'node:assert/strict'
import fs from 'node:fs'
import process from 'node:process'
// eslint-disable-next-line test/no-import-node-test -- Candidate ASR fallback uses the repository runner.
import test from 'node:test'
import { asrAudioEnvironment } from './helpers/asr-audio.js'
import { compilePackage } from './helpers/load.js'

const artifact = process.env.ARTPLAYER_ASR_ARTIFACT
const implementation = {
  name: artifact || 'candidate-asr',
  code: artifact ? fs.readFileSync(artifact, 'utf8') : await compilePackage('artplayer-plugin-asr', 'umd'),
}

function create(capabilities = {}) {
  const chunks = []
  const environment = asrAudioEnvironment(implementation, {
    sampleRate: 8000,
    interval: 1,
    onAudioChunk(chunk) {
      chunks.push(chunk)
      return 'Captured.'
    },
  }, { directError: new Error('Video belongs to another audio context'), ...capabilities })
  return { ...environment, chunks }
}

function assertSilentCaptureRoute(environment) {
  const source = environment.nodes.filter(node => node.kind === 'stream').at(-1)
  const recorder = environment.recorders.at(-1)
  assert.ok(source, 'The occupied media element must use its captured stream')
  assert.deepEqual(source.connections, [recorder], 'Captured audio must not have a parallel speaker route')
  assert.equal(recorder.connections.length, 1)
  const sink = recorder.connections[0]
  assert.equal(sink.kind, 'gain')
  assert.equal(sink.gain.value, 0, 'The worklet output sink must stay inaudible')
  assert.deepEqual(sink.connections, [environment.contexts.at(-1).destination])
  return { source, recorder, sink }
}

async function assertCaptures(environment) {
  const before = environment.chunks.length
  environment.send(new Float32Array(8).fill(0.5))
  await environment.tick()
  assert.equal(environment.chunks.length, before + 1)
  const chunk = environment.chunks.at(-1)
  assert.equal(chunk.pcm.byteLength, 16)
  assert.equal(new DataView(chunk.pcm).getInt16(0, true), 16383)
  assert.equal(chunk.wav.byteLength, 60)
  assert.equal(environment.layer.innerHTML, '<div class="art-asr-line">Captured.</div>')
}

for (const moz of [false, true]) {
  test(`ASR fallback ${moz ? 'mozCaptureStream' : 'captureStream'} captures PCM through an inaudible sink`, async () => {
    const environment = create({ moz })
    await environment.emit('play')
    assert.equal(environment.captures(), 1)
    assertSilentCaptureRoute(environment)
    await assertCaptures(environment)
    await environment.emit('destroy')
    assert.equal(environment.contexts[0].closes, 1)
    assert.equal(environment.tracks[0].stops, 1)
    assert.equal(environment.intervals.size, 0)
    assert.ok(environment.nodes.every(node => node.connections.length === 0))
  })
}

test('ASR fallback pause disconnects its sink without restoring a raw speaker route', async () => {
  const environment = create()
  await environment.emit('play')
  const retired = assertSilentCaptureRoute(environment)
  await assertCaptures(environment)
  await environment.emit('pause')
  assert.equal(environment.intervals.size, 0)
  assert.equal(environment.contexts[0].closes, 0)
  assert.equal(environment.tracks[0].stops, 0)
  assert.equal(retired.recorder.port.onmessage, null)
  for (const node of Object.values(retired))
    assert.deepEqual(node.connections, [])
  await environment.emit('play')
  assert.equal(environment.captures(), 1)
  assert.equal(environment.contexts.length, 1)
  const resumed = assertSilentCaptureRoute(environment)
  assert.equal(resumed.source, retired.source)
  assert.notEqual(resumed.recorder, retired.recorder)
  await assertCaptures(environment)
  await environment.emit('destroy')
  assert.equal(environment.tracks[0].stops, 1)
})

test('ASR fallback explicit stop releases its graph and subsequent play captures without a speaker route', async () => {
  const environment = create()
  await environment.emit('play')
  const retired = assertSilentCaptureRoute(environment)
  await environment.plugin.stop()
  assert.equal(environment.contexts[0].closes, 1)
  assert.equal(environment.tracks[0].stops, 1)
  assert.equal(environment.intervals.size, 0)
  for (const node of Object.values(retired))
    assert.deepEqual(node.connections, [])
  await environment.emit('play')
  assert.equal(environment.captures(), 2)
  assert.equal(environment.contexts.length, 2)
  assert.notEqual(assertSilentCaptureRoute(environment).source, retired.source)
  await assertCaptures(environment)
  await environment.emit('destroy')
  assert.equal(environment.contexts[1].closes, 1)
  assert.equal(environment.tracks[0].stops, 2)
  assert.ok(environment.nodes.every(node => node.connections.length === 0))
})

test('ASR fallback source restart replaces its capture and keeps the new graph inaudible', async () => {
  const environment = create()
  await environment.emit('play')
  const retired = assertSilentCaptureRoute(environment)
  await environment.emit('restart')
  assert.equal(environment.captures(), 2)
  assert.equal(environment.contexts[0].closes, 1)
  assert.equal(environment.contexts[1].closes, 0)
  assert.equal(environment.tracks[0].stops, 1)
  assert.equal(retired.recorder.port.onmessage, null)
  for (const node of Object.values(retired))
    assert.deepEqual(node.connections, [])
  assert.notEqual(assertSilentCaptureRoute(environment).source, retired.source)
  await assertCaptures(environment)
  await environment.emit('destroy')
  assert.equal(environment.contexts[1].closes, 1)
  assert.equal(environment.tracks[0].stops, 2)
  assert.equal(environment.intervals.size, 0)
})
