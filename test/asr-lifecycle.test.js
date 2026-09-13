import assert from 'node:assert/strict'
import { Buffer } from 'node:buffer'
import fs from 'node:fs'
import process from 'node:process'
// eslint-disable-next-line test/no-import-node-test -- Candidate ASR lifecycle uses the repository runner.
import test from 'node:test'
import { asrAudioEnvironment, deferredAudio } from './helpers/asr-audio.js'
import { asrEnvironment } from './helpers/asr.js'
import { compilePackage } from './helpers/load.js'

const artifact = process.env.ARTPLAYER_ASR_ARTIFACT
const implementation = {
  name: artifact || 'candidate-asr',
  code: artifact ? fs.readFileSync(artifact, 'utf8') : await compilePackage('artplayer-plugin-asr', 'umd'),
}
const block = (value = 0, length = 8) => new Float32Array(length).fill(value)

function create(option = {}, capabilities = {}) {
  return asrAudioEnvironment(implementation, { sampleRate: 8000, interval: 1, ...option }, capabilities)
}

function pcmSamples(chunk) {
  const bytes = new DataView(chunk.pcm)
  return Array.from({ length: chunk.pcm.byteLength / 2 }, (_, index) => bytes.getInt16(index * 2, true))
}

test('ASR candidate lazy factory and synchronous registration keep result keys and Promise stop', async () => {
  const environment = asrEnvironment(implementation)
  assert.equal(environment.exported.default, environment.exported, 'Both historical CJS factory paths remain callable')
  assert.deepEqual(Object.keys(environment.exported), [])
  const option = { length: 1, autoHideTimeout: 321 }
  const register = environment.factory(option)
  assert.equal(typeof register, 'function')
  assert.equal(environment.layers.length, 0)
  assert.equal(environment.listeners.size, 0)
  option.length = 3
  option.autoHideTimeout = 999
  const result = register(environment.art)
  assert.equal(result.then, undefined)
  assert.deepEqual(Object.keys(result), ['name', 'stop', 'hide', 'append'])
  assert.equal(result.name, 'artplayerPluginAsr')
  assert.equal(environment.layers.length, 1)
  assert.equal(environment.layers[0].name, 'asr')
  assert.equal(environment.layers[0].html, '')
  result.append('One. Two! <b>Three</b>')
  assert.equal(environment.layer.innerHTML, '<div class="art-asr-line"><b>Three</b></div>')
  assert.equal([...environment.timeouts.values()][0].delay, 321, 'Factory snapshots its configuration')
  const stopping = result.stop()
  assert.equal(typeof stopping.then, 'function')
  assert.equal(await stopping, undefined)
  assert.equal(environment.timeouts.size, 1, 'A displayed subtitle keeps its existing auto-hide deadline after stop')
  ;[...environment.timeouts.values()][0].callback()
  assert.equal(environment.layer.style.display, 'none')
  await environment.emit('destroy')
  assert.equal(environment.timeouts.size, 0)
})

test('ASR candidate append keeps punctuation, HTML, ignored non-string values and timer replacement', async () => {
  const environment = create({ length: 2, autoHideTimeout: 432 })
  assert.equal(environment.plugin.append('First. Second! Third?'), undefined)
  assert.equal(environment.layer.innerHTML, '<div class="art-asr-line">Second!</div><div class="art-asr-line">Third?</div>')
  const firstTimer = [...environment.timeouts.keys()][0]
  environment.plugin.append(42)
  assert.equal([...environment.timeouts.keys()][0], firstTimer)
  environment.plugin.append('<b>Raw</b>')
  assert.equal(environment.layer.innerHTML, '<div class="art-asr-line"><b>Raw</b></div>')
  assert.equal(environment.timeouts.size, 1)
  assert.notEqual([...environment.timeouts.keys()][0], firstTimer)
  const timer = [...environment.timeouts.values()][0]
  assert.equal(timer.delay, 432)
  timer.callback()
  assert.equal(environment.layer.style.display, 'none')
  environment.plugin.append('Visible.')
  assert.equal(environment.layer.style.display, '')
  assert.equal(environment.plugin.hide(), undefined)
  assert.equal(environment.layer.style.display, 'none')
  assert.equal(environment.layer.innerHTML, '<div class="art-asr-line">Visible.</div>')
  await environment.plugin.stop()
})

test('ASR candidate preserves chunk payload, exact PCM/WAV bytes and callback subtitles', async () => {
  let chunk
  const environment = create({ onAudioChunk(value) {
    chunk = value
    return 'One. Two!'
  } })
  await environment.emit('play')
  environment.send([-Infinity, -1, -0.5, Number.NaN, 0, 0.5, 1, Infinity])
  await environment.tick()
  assert.deepEqual(Object.keys(chunk), ['pcm', 'wav'])
  assert.deepEqual(pcmSamples(chunk), [-32768, -32768, -16384, 0, 0, 16383, 32767, 32767])
  const wav = Buffer.from(chunk.wav)
  assert.equal(wav.byteLength, 60)
  assert.equal(wav.toString('ascii', 0, 4), 'RIFF')
  assert.equal(wav.readUInt32LE(4), 52)
  assert.equal(wav.readUInt16LE(22), 1)
  assert.equal(wav.readUInt32LE(24), 8000)
  assert.equal(wav.readUInt32LE(28), 16000)
  assert.equal(wav.readUInt32LE(40), 16)
  assert.deepEqual(wav.subarray(44), Buffer.from(chunk.pcm))
  assert.equal(environment.layer.innerHTML, '<div class="art-asr-line">One.</div><div class="art-asr-line">Two!</div>')
  await environment.plugin.stop()
})

test('ASR candidate preserves short chunks across ticks and excess tail in FIFO order', async () => {
  const chunks = []
  const environment = create({ onAudioChunk: value => chunks.push(value) })
  await environment.emit('play')
  environment.send(block(0.5, 4))
  await environment.tick()
  assert.equal(chunks.length, 0)
  environment.send(block(-0.5, 8))
  await environment.tick()
  assert.deepEqual(pcmSamples(chunks[0]), [16383, 16383, 16383, 16383, -16384, -16384, -16384, -16384])
  await environment.tick()
  assert.equal(chunks.length, 1)
  environment.send(block(1, 4))
  await environment.tick()
  assert.deepEqual(pcmSamples(chunks[1]), [-16384, -16384, -16384, -16384, 32767, 32767, 32767, 32767])
  await environment.plugin.stop()
})

test('ASR candidate allows one in-flight recognizer and retains queued audio', async () => {
  const pending = deferredAudio()
  const calls = []
  const environment = create({ onAudioChunk: (chunk) => {
    calls.push(chunk)
    return calls.length === 1 ? pending.promise : 'Second.'
  } })
  await environment.emit('play')
  environment.send(block(0.5))
  const first = environment.tick()
  environment.send(block(-0.5))
  await environment.tick()
  await environment.tick()
  assert.equal(calls.length, 1)
  pending.resolve('First.')
  await first
  assert.equal(environment.layer.innerHTML, '<div class="art-asr-line">First.</div>')
  await environment.tick()
  assert.equal(calls.length, 2)
  assert.deepEqual(pcmSamples(calls[1]), Array.from({ length: 8 }, () => -16384))
  assert.equal(environment.layer.innerHTML, '<div class="art-asr-line">Second.</div>')
  await environment.plugin.stop()
})

for (const mode of ['throw', 'reject']) {
  test(`ASR candidate handles callback ${mode} and continues subsequent audio`, async () => {
    const failure = new Error('recognition failed')
    let count = 0
    const environment = create({ onAudioChunk: () => {
      if (++count > 1)
        return 'Recovered.'
      if (mode === 'throw')
        throw failure
      return Promise.reject(failure)
    } })
    await environment.emit('play')
    environment.send(block())
    await assert.doesNotReject(environment.tick())
    assert.equal(environment.errors.length, 1)
    assert.equal(environment.errors[0][1], failure)
    environment.send(block())
    await environment.tick()
    assert.equal(count, 2)
    assert.equal(environment.layer.innerHTML, '<div class="art-asr-line">Recovered.</div>')
    await environment.plugin.stop()
  })
}

for (const event of ['pause', 'stop', 'destroy', 'restart']) {
  test(`ASR candidate invalidates pending callback after ${event}`, async () => {
    const pending = deferredAudio()
    const environment = create({ onAudioChunk: () => pending.promise })
    await environment.emit('play')
    environment.send(block())
    const recognizing = environment.tick()
    await (event === 'stop' ? environment.plugin.stop() : environment.emit(event))
    pending.resolve('Obsolete.')
    await recognizing
    assert.equal(environment.layer.innerHTML, '')
    assert.equal(environment.timeouts.size, 0)
    assert.equal(environment.errors.length, 0)
    assert.equal(environment.intervals.size, event === 'restart' ? 1 : 0)
    await environment.plugin.stop()
  })
}

test('ASR candidate reset clears old queued audio without dropping the next source', async () => {
  const calls = []
  const environment = create({ onAudioChunk: value => calls.push(value) })
  await environment.emit('play')
  environment.send(block(0.5))
  environment.art.video.src = 'local-new-source.mp4'
  await environment.emit('restart')
  await environment.tick()
  assert.equal(calls.length, 0)
  environment.send(block(-0.5))
  await environment.tick()
  assert.deepEqual(pcmSamples(calls[0]), Array.from({ length: 8 }, () => -16384))
  await environment.plugin.stop()
})

test('ASR candidate old callback completion cannot unlock a new session pending callback', async () => {
  const pending = [deferredAudio(), deferredAudio()]
  let calls = 0
  const environment = create({ onAudioChunk: () => pending[calls++].promise })
  await environment.emit('play')
  environment.send(block())
  const old = environment.tick()
  await environment.emit('pause')
  await environment.emit('play')
  environment.send(block())
  const current = environment.tick()
  pending[0].resolve('Old.')
  await old
  environment.send(block())
  await environment.tick()
  assert.equal(calls, 2)
  assert.equal(environment.layer.innerHTML, '')
  pending[1].resolve('Current.')
  await current
  assert.equal(environment.layer.innerHTML, '<div class="art-asr-line">Current.</div>')
  await environment.plugin.stop()
})

test('ASR candidate concurrent play creates one graph and one interval', async () => {
  const moduleGate = deferredAudio()
  const moduleEntered = deferredAudio()
  const environment = create({}, { moduleGate, moduleEntered })
  const starting = environment.emit('play')
  const duplicate = environment.emit('play')
  await moduleEntered.promise
  assert.equal(environment.modules.length, 1)
  moduleGate.resolve()
  await Promise.all([starting, duplicate])
  await environment.emit('play')
  assert.equal(environment.contexts.length, 1)
  assert.equal(environment.recorders.length, 1)
  assert.equal(environment.intervals.size, 1)
  await environment.plugin.stop()
  assert.equal(environment.intervals.size, 0)
  assert.equal(environment.recorders[0].port.onmessage, null)
  assert.equal(environment.recorders[0].disconnects, 1)
})

test('ASR candidate pause during module loading prevents late connection and later resumes prepared graph', async () => {
  const moduleGate = deferredAudio()
  const moduleEntered = deferredAudio()
  const environment = create({}, { moduleGate, moduleEntered, capture: false })
  const starting = environment.emit('play')
  await moduleEntered.promise
  await environment.emit('pause')
  moduleGate.resolve()
  await starting
  assert.equal(environment.intervals.size, 0)
  assert.equal(environment.recorders.length, 0)
  assert.equal(environment.contexts[0].closes, 0)
  await environment.emit('play')
  assert.equal(environment.contexts.length, 1)
  assert.equal(environment.modules.length, 1)
  assert.equal(environment.recorders.length, 1)
  assert.equal(environment.intervals.size, 1)
  assert.equal(environment.captures(), 0)
  assert.equal(environment.errors.length, 0)
  await environment.plugin.stop()
})

for (const event of ['stop', 'destroy']) {
  test(`ASR candidate ${event} during module loading frees URL and context without resurrection`, async () => {
    const moduleGate = deferredAudio()
    const moduleEntered = deferredAudio()
    const environment = create({}, { moduleGate, moduleEntered })
    const starting = environment.emit('play')
    await moduleEntered.promise
    assert.equal(environment.blobs.size, 1)
    await (event === 'stop' ? environment.plugin.stop() : environment.emit(event))
    assert.equal(environment.blobs.size, 0)
    assert.equal(environment.contexts[0].closes, 1)
    moduleGate.resolve()
    await starting
    assert.equal(environment.revoked.length, 1)
    assert.equal(environment.intervals.size, 0)
    assert.equal(environment.recorders.length, 0)
    assert.equal(environment.errors.length, 0)
  })
}

test('ASR candidate failed module initialization releases context and URL before binding video', async () => {
  const failure = new Error('failed worklet')
  const environment = create({}, { moduleError: failure })
  await environment.emit('play')
  assert.equal(environment.errors.length, 1)
  assert.equal(environment.errors[0][1], failure)
  assert.equal(environment.contexts[0].closes, 1)
  assert.equal(environment.blobs.size, 0)
  assert.equal(environment.revoked.length, 1)
  assert.equal(environment.nodes.filter(node => node.kind === 'element').length, 0)
  assert.equal(environment.intervals.size, 0)
  await environment.plugin.stop()
  assert.equal(environment.contexts[0].closes, 1)
})

test('ASR candidate pause/resume reuses direct source without captureStream', async () => {
  const environment = create({}, { capture: false })
  await environment.emit('play')
  const source = environment.nodes.find(node => node.kind === 'element')
  await environment.emit('pause')
  assert.equal(source.connections.length, 1, 'The player-owned audio route remains available while ASR is paused')
  assert.equal(source.connections[0].kind, 'gain')
  assert.equal(source.connections[0].connections[0], environment.contexts[0].destination)
  assert.equal(environment.recorders[0].port.onmessage, null)
  await environment.emit('play')
  assert.equal(environment.contexts.length, 1)
  assert.equal(environment.modules.length, 1)
  assert.equal(environment.nodes.filter(node => node.kind === 'element').length, 1)
  assert.equal(source.connections.length, 2)
  assert.equal(environment.errors.length, 0)
  assert.equal(environment.intervals.size, 1)
  await environment.plugin.stop()
})

test('ASR candidate ignores old worklet delivery after pause/resume reconnect', async () => {
  const calls = []
  const environment = create({ onAudioChunk: value => calls.push(value) })
  await environment.emit('play')
  const staleMessage = environment.recorders[0].port.onmessage
  await environment.emit('pause')
  await environment.emit('play')
  staleMessage({ data: block(0.5) })
  environment.send(block(-0.5))
  await environment.tick()
  assert.equal(calls.length, 1)
  assert.deepEqual(pcmSamples(calls[0]), Array.from({ length: 8 }, () => -16384))
  await environment.plugin.stop()
})

test('ASR candidate overload explicitly reports and pauses instead of silently discarding samples', async () => {
  const environment = create()
  await environment.emit('play')
  environment.send(block(0, 8000 * 60))
  assert.equal(environment.errors.length, 0)
  assert.equal(environment.intervals.size, 1)
  environment.send(block(0, 1))
  assert.equal(environment.errors.length, 1)
  assert.deepEqual(environment.errors[0], ['[artplayerPluginAsr] Audio callback backlog exceeded its capture limit'])
  assert.equal(environment.intervals.size, 0)
  assert.equal(environment.recorders[0].port.onmessage, null)
  await environment.plugin.stop()
  await environment.emit('destroy')
  const longChunk = create({ interval: 120000 })
  await longChunk.emit('play')
  longChunk.send(block(0, 8000 * 60 + 1))
  assert.equal(longChunk.errors.length, 0, 'A configured chunk longer than 60 seconds must still be collectable')
  assert.equal(longChunk.intervals.size, 1)
  await longChunk.emit('destroy')
})

test('ASR candidate destroy cancels subtitle timers, removes subscriptions and forbids public append resurrection', async () => {
  const environment = create()
  await environment.emit('play')
  environment.plugin.append('Kept.')
  assert.equal(environment.timeouts.size, 1)
  await environment.emit('destroy')
  assert.equal(environment.timeouts.size, 0)
  assert.equal([...environment.listeners.values()].flat().length, 0)
  const html = environment.layer.innerHTML
  const display = environment.layer.style.display
  environment.plugin.append('Unexpected.')
  environment.plugin.hide()
  await environment.emit('play')
  await environment.emit('restart')
  await environment.emit('video:volumechange')
  await environment.plugin.stop()
  assert.equal(environment.layer.innerHTML, html)
  assert.equal(environment.layer.style.display, display)
  assert.equal(environment.timeouts.size, 0)
  assert.equal(environment.contexts.length, 1)
  assert.equal(environment.contexts[0].closes, 1)
  assert.equal(environment.intervals.size, 0)
})

test('ASR candidate public stop retains the current hide deadline and allows append and subsequent play', async () => {
  const environment = create({}, { capture: false })
  await environment.emit('play')
  environment.plugin.append('Before.')
  const beforeTimer = [...environment.timeouts.keys()][0]
  await environment.plugin.stop()
  assert.equal(environment.timeouts.size, 1)
  assert.equal([...environment.timeouts.keys()][0], beforeTimer)
  assert.equal(environment.contexts[0].closes, 0, 'Direct media ownership lasts until player destruction')
  const source = environment.nodes.find(node => node.kind === 'element')
  assert.equal(source.connections[0].kind, 'gain')
  assert.equal(source.connections[0].connections[0], environment.contexts[0].destination)
  environment.plugin.append('After.')
  assert.equal(environment.layer.innerHTML, '<div class="art-asr-line">After.</div>')
  await environment.emit('play')
  assert.equal(environment.contexts.length, 1)
  assert.equal(environment.captures(), 0)
  assert.equal(environment.intervals.size, 1)
  await environment.plugin.stop()
  await environment.emit('destroy')
  assert.equal(environment.contexts[0].closes, 1)
  assert.equal(source.connections.length, 0)
})

test('ASR candidate volume route survives stop and resume without resetting gain', async () => {
  const environment = create({}, { capture: false })
  await environment.emit('play')
  environment.art.volume = 0.25
  await environment.emit('video:volumechange')
  await environment.plugin.stop()
  const source = environment.nodes.find(node => node.kind === 'element')
  assert.equal(source.connections[0].gain.value, 0.25)
  await environment.emit('play')
  assert.equal(source.connections.find(node => node.kind === 'gain').gain.value, 0.25)
  await environment.emit('destroy')
  assert.equal(environment.contexts[0].closes, 1)
})

test('ASR candidate source restart releases captured tracks and obtains a new fallback source', async () => {
  const environment = create({}, { directError: new Error('video belongs to another context') })
  await environment.emit('play')
  assert.equal(environment.captures(), 1)
  await environment.emit('restart')
  assert.equal(environment.captures(), 2)
  assert.equal(environment.contexts[0].closes, 1)
  assert.equal(environment.contexts[1].closes, 0)
  assert.equal(environment.tracks[0].stops, 1)
  assert.equal(environment.intervals.size, 1)
  await environment.plugin.stop()
  assert.equal(environment.contexts[1].closes, 1)
  assert.equal(environment.tracks[0].stops, 2)
})
