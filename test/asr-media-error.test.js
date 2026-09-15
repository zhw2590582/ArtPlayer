import assert from 'node:assert/strict'
import fs from 'node:fs'
import process from 'node:process'
// eslint-disable-next-line test/no-import-node-test -- Exercise cancellation after a native media error without depending on browser timing.
import test from 'node:test'
import { asrAudioEnvironment, deferredAudio } from './helpers/asr-audio.js'
import { compilePackage } from './helpers/load.js'

const artifact = process.env.ARTPLAYER_ASR_ARTIFACT
const implementation = { name: artifact || 'candidate-asr', code: artifact ? fs.readFileSync(artifact, 'utf8') : await compilePackage('artplayer-plugin-asr', 'umd') }

for (const capture of [false, true]) {
  const option = capture ? { audioInput: { type: 'capture' } } : {}
  test(`ASR media error cancels pending recognition and permits ${capture ? 'capture' : 'direct'} recovery`, async () => {
    const pending = deferredAudio()
    let calls = 0
    const environment = asrAudioEnvironment(implementation, { ...option, sampleRate: 8000, interval: 1, onAudioChunk: () => ++calls === 1 ? pending.promise : 'Recovered' })
    await environment.emit('play')
    environment.send(new Float32Array(8).fill(0.5))
    const recognizing = environment.tick()
    assert.equal(calls, 1)
    const oldMessage = environment.recorders[0].port.onmessage
    await environment.emit('video:error')
    assert.equal(environment.intervals.size, 0, 'Media error must stop collection even without a pause event')
    assert.equal(environment.recorders[0].port.onmessage, null)
    pending.resolve('Obsolete')
    await recognizing
    assert.equal(environment.layer.innerHTML, '')
    assert.equal(environment.timeouts.size, 0)
    assert.equal(environment.contexts[0].state, capture ? 'closed' : 'running')
    assert.equal(environment.tracks[0].stops, capture ? 1 : 0)
    oldMessage({ data: new Float32Array(8).fill(1) })
    assert.equal(calls, 1)
    await environment.emit('play')
    assert.equal(environment.contexts.length, capture ? 2 : 1)
    assert.equal(environment.intervals.size, 1)
    environment.send(new Float32Array(8).fill(0.25))
    await environment.tick()
    assert.match(environment.layer.innerHTML, /Recovered/)
    await environment.emit('destroy')
    assert(environment.contexts.every(context => context.state === 'closed'))
    assert.equal(environment.listeners.get('video:error').length, 0)
  })

  test(`ASR media error during ${capture ? 'capture' : 'direct'} worklet loading cancels late initialization`, async () => {
    const moduleGate = deferredAudio()
    const moduleEntered = deferredAudio()
    const environment = asrAudioEnvironment(implementation, option, { moduleGate, moduleEntered })
    const starting = environment.emit('play')
    await moduleEntered.promise
    await environment.emit('video:error')
    moduleGate.resolve()
    await starting
    assert.equal(environment.contexts[0].state, 'closed')
    assert.equal(environment.recorders.length, 0)
    assert.equal(environment.nodes.filter(node => ['element', 'stream'].includes(node.kind)).length, 0)
    assert.equal(environment.intervals.size, 0)
    assert.equal(environment.blobs.size, 0)
    assert.equal(environment.errors.length, 0)
    await environment.emit('play')
    assert.equal(environment.intervals.size, 1)
    await environment.emit('destroy')
    assert(environment.contexts.every(context => context.state === 'closed'))
  })
}

test('ASR media error cancels a capture restart waiting for close without hiding an existing subtitle', async () => {
  const environment = asrAudioEnvironment(implementation, { audioInput: { type: 'capture' } })
  environment.plugin.append('Existing')
  const timers = [...environment.timeouts.keys()]
  await environment.emit('play')
  const closing = deferredAudio()
  const close = environment.contexts[0].close.bind(environment.contexts[0])
  environment.contexts[0].close = async () => {
    await close()
    await closing.promise
  }
  const restarting = environment.emit('restart')
  const failing = environment.emit('video:error')
  closing.resolve()
  await Promise.all([restarting, failing])
  assert.equal(environment.captures(), 1)
  assert.equal(environment.intervals.size, 0)
  assert.match(environment.layer.innerHTML, /Existing/)
  assert.deepEqual([...environment.timeouts.keys()], timers)
  await environment.emit('destroy')
  await environment.emit('video:error')
  assert.equal(environment.timeouts.size, 0)
  assert.equal(environment.contexts.length, 1)
})
