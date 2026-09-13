import assert from 'node:assert/strict'
import fs from 'node:fs'
import process from 'node:process'
// eslint-disable-next-line test/no-import-node-test -- Explicit ASR capture uses the repository runner.
import test from 'node:test'
import { asrAudioEnvironment, deferredAudio } from './helpers/asr-audio.js'
import { compilePackage } from './helpers/load.js'

const artifact = process.env.ARTPLAYER_ASR_ARTIFACT
const implementation = {
  name: artifact || 'candidate-asr',
  code: artifact ? fs.readFileSync(artifact, 'utf8') : await compilePackage('artplayer-plugin-asr', 'umd'),
}

function create(option = {}, capabilities = {}) {
  const chunks = []
  const environment = asrAudioEnvironment(implementation, {
    sampleRate: 8000,
    interval: 1,
    audioInput: { type: 'capture' },
    onAudioChunk(chunk) { chunks.push(chunk) },
    ...option,
  }, capabilities)
  const prototype = environment.context.AudioContext.prototype
  const direct = prototype.createMediaElementSource
  let directCalls = 0
  prototype.createMediaElementSource = function (...args) {
    directCalls++
    return direct.apply(this, args)
  }
  return { ...environment, chunks, directCalls: () => directCalls }
}

function assertCapture(environment) {
  assert.equal(environment.directCalls(), 0, 'Explicit capture must never attempt to bind the media element')
  const source = environment.nodes.filter(node => node.kind === 'stream').at(-1)
  const recorder = environment.recorders.at(-1)
  assert.ok(source)
  assert.deepEqual(source.connections, [recorder])
  assert.equal(recorder.connections.length, 1)
  const sink = recorder.connections[0]
  assert.equal(sink.kind, 'gain')
  assert.equal(sink.gain.value, 0)
  assert.deepEqual(sink.connections, [environment.contexts.at(-1).destination])
  return { source, recorder, sink }
}

async function assertChunk(environment) {
  const before = environment.chunks.length
  environment.send(new Float32Array(8).fill(0.5))
  await environment.tick()
  assert.equal(environment.chunks.length, before + 1)
  const chunk = environment.chunks.at(-1)
  assert.equal(chunk.pcm.byteLength, 16)
  assert.equal(new DataView(chunk.pcm).getInt16(0, true), 16383)
  assert.equal(new DataView(chunk.wav).getUint32(24, true), 8000)
}

function assertReleased(environment) {
  assert.equal(environment.directCalls(), 0)
  assert.equal(environment.intervals.size, 0)
  assert.equal(environment.blobs.size, 0)
  assert.ok(environment.contexts.every(context => context.closes === 1))
  assert.ok(environment.nodes.every(node => node.connections.length === 0))
  assert.ok(environment.recorders.every(recorder => recorder.port.onmessage === null))
}

for (const moz of [false, true]) {
  test(`ASR explicit ${moz ? 'mozCaptureStream' : 'captureStream'} skips a working direct binding`, async () => {
    const environment = create({}, { moz })
    await environment.emit('play')
    assertCapture(environment)
    assert.equal(environment.captures(), 1)
    await assertChunk(environment)
    await environment.emit('destroy')
    assertReleased(environment)
    assert.equal(environment.tracks[0].stops, 1)
  })
}

test('ASR omitted audioInput preserves direct-first acquisition', async () => {
  const environment = create({ audioInput: undefined })
  await environment.emit('play')
  assert.equal(environment.directCalls(), 1)
  assert.equal(environment.captures(), 0)
  assert.ok(environment.nodes.some(node => node.kind === 'element'))
  await assertChunk(environment)
  await environment.emit('destroy')
  assert.equal(environment.contexts[0].closes, 1)
})

for (const failure of ['unsupported', 'throws']) {
  test(`ASR explicit capture ${failure} cleans up without attempting direct fallback`, async () => {
    const environment = create({}, { capture: failure !== 'unsupported' })
    let attempts = 0
    if (failure === 'throws') {
      environment.art.video.captureStream = () => {
        attempts++
        throw new Error('Capture is unavailable for this media')
      }
    }
    await environment.emit('play')
    assertReleased(environment)
    assert.equal(environment.errors.length, 1)
    assert.equal(environment.recorders.length, 0)
    assert.equal(environment.tracks[0].stops, 0)
    assert.equal(attempts, failure === 'throws' ? 1 : 0)
    await environment.emit('destroy')
    assertReleased(environment)
  })
}

test('ASR explicit capture retains a silent sink through media mute and volume changes', async () => {
  const environment = create()
  await environment.emit('play')
  const route = assertCapture(environment)
  for (const [muted, volume] of [[true, 0], [false, 0.25], [false, 1]]) {
    environment.art.muted = environment.art.video.muted = muted
    environment.art.volume = environment.art.video.volume = volume
    await environment.emit('video:volumechange')
    assert.equal(assertCapture(environment).sink, route.sink)
    assert.equal(environment.art.video.muted, muted)
    assert.equal(environment.art.video.volume, volume)
    await assertChunk(environment)
  }
  await environment.emit('destroy')
  assertReleased(environment)
})

test('ASR explicit capture pause retains its stream and resumes with a fresh recorder', async () => {
  const environment = create()
  await environment.emit('play')
  const before = assertCapture(environment)
  await environment.emit('pause')
  assert.equal(environment.intervals.size, 0)
  assert.equal(environment.contexts[0].closes, 0)
  assert.equal(environment.tracks[0].stops, 0)
  assert.equal(before.recorder.port.onmessage, null)
  for (const node of Object.values(before))
    assert.deepEqual(node.connections, [])
  await environment.emit('play')
  const after = assertCapture(environment)
  assert.equal(after.source, before.source)
  assert.notEqual(after.recorder, before.recorder)
  assert.equal(environment.captures(), 1)
  await assertChunk(environment)
  await environment.emit('destroy')
  assertReleased(environment)
})

for (const operation of ['stop/play', 'restart']) {
  test(`ASR explicit capture ${operation} releases the old graph and acquires another stream`, async () => {
    const environment = create()
    await environment.emit('play')
    const before = assertCapture(environment)
    if (operation === 'stop/play') {
      await environment.plugin.stop()
      assertReleased(environment)
      await environment.emit('play')
    }
    else {
      await environment.emit('restart')
    }
    const after = assertCapture(environment)
    assert.notEqual(after.source, before.source)
    assert.equal(environment.captures(), 2)
    assert.equal(environment.contexts[0].closes, 1)
    assert.equal(environment.contexts[1].closes, 0)
    assert.equal(environment.tracks[0].stops, 1)
    for (const node of Object.values(before))
      assert.deepEqual(node.connections, [])
    await assertChunk(environment)
    await environment.emit('destroy')
    assertReleased(environment)
    assert.equal(environment.tracks[0].stops, 2)
    await environment.emit('play')
    assert.equal(environment.captures(), 2)
    assert.equal(environment.intervals.size, 0)
  })
}

test('ASR explicit capture snapshots the nested input choice before later caller mutation', async () => {
  const input = { type: 'capture' }
  const environment = create({ audioInput: input })
  input.type = 'changed by caller'
  await environment.emit('play')
  assertCapture(environment)
  await environment.plugin.stop()
  await environment.emit('play')
  assertCapture(environment)
  assert.equal(environment.captures(), 2)
  await environment.emit('destroy')
  assertReleased(environment)
})

test('ASR explicit capture destroy during worklet loading never binds or captures late', async () => {
  const moduleGate = deferredAudio()
  const moduleEntered = deferredAudio()
  const environment = create({}, { moduleGate, moduleEntered })
  const starting = environment.emit('play')
  await moduleEntered.promise
  await environment.emit('destroy')
  moduleGate.resolve()
  await starting
  assertReleased(environment)
  assert.equal(environment.captures(), 0)
  assert.equal(environment.recorders.length, 0)
  assert.equal(environment.tracks[0].stops, 0)
})

for (const action of ['pause', 'stop']) {
  test(`ASR explicit capture ${action} cancels a restart waiting for the old context to close`, async () => {
    const environment = create()
    await environment.emit('play')
    assertCapture(environment)
    const closeGate = deferredAudio()
    const context = environment.contexts[0]
    const close = context.close.bind(context)
    context.close = async () => {
      await close()
      await closeGate.promise
    }
    const restarting = environment.emit('restart')
    const cancelling = action === 'pause' ? environment.emit('pause') : environment.plugin.stop()
    assert.equal(environment.intervals.size, 0)
    closeGate.resolve()
    await Promise.all([restarting, cancelling])
    assert.equal(environment.captures(), 1, 'A superseded restart must not acquire another stream')
    assert.equal(environment.contexts.length, 1)
    assert.equal(environment.tracks[0].stops, 1)
    assertReleased(environment)
    await environment.emit('play')
    assertCapture(environment)
    assert.equal(environment.captures(), 2, 'A subsequent explicit play may start a new capture')
    await assertChunk(environment)
    await environment.emit('destroy')
    assertReleased(environment)
    assert.equal(environment.tracks[0].stops, 2)
  })
}
