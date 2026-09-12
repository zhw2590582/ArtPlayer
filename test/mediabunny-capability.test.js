import assert from 'node:assert/strict'
import fs from 'node:fs'
// eslint-disable-next-line test/no-import-node-test -- Actual SDK tracks and decoder/coordinator code with controlled capability responses.
import test from 'node:test'
import { mbCandidate, mbEnvironment } from './helpers/mediabunny.js'

const implementation = await mbCandidate()
const sources = {
  video: new Blob([fs.readFileSync(new URL('./browser/media/pattern.mp4', import.meta.url))]),
  audio: new Blob([fs.readFileSync(new URL('./browser/media/audio-tone.m4a', import.meta.url))]),
}
const readiness = ['loadedmetadata', 'loadeddata', 'canplay', 'canplaythrough']
const flush = () => new Promise(resolve => setImmediate(resolve))
const message = 'Input has no decodable audio or video tracks.'
function deferred() {
  let resolve, reject
  const promise = new Promise((yes, no) => {
    resolve = yes
    reject = no
  })
  return { promise, resolve, reject }
}
function environment(kind, response = false) {
  const env = mbEnvironment(implementation)
  env.globals.console = { ...console, error() {}, warn() {} }
  env.globals.window.AudioContext = class {
    currentTime = 0
    state = 'running'
    destination = {}
    createGain() { return { gain: { value: 0 }, connect() {}, disconnect() {} } }
    async close() { this.state = 'closed' }
  }
  const canvas = env.factory()(env.art)
  const engine = canvas.engine
  const events = []
  const queries = []
  for (const name of [...readiness, 'error', 'play', 'playing', 'seeked'])
    canvas.events.addEventListener(name, () => events.push(name))
  const decoder = engine[kind]
  const load = decoder.load.bind(decoder)
  decoder.load = (media, ...args) => {
    const track = media[`${kind}Track`]
    assert(track, 'The real input must contain the selected track')
    if (response === null) {
      Object.defineProperty(track, 'codec', { value: null, configurable: true })
    }
    else {
      track.canDecode = () => {
        queries.push(track)
        return typeof response === 'function' ? response() : Promise.resolve(response)
      }
    }
    return load(media, ...args)
  }
  return { ...env, canvas, engine, decoder, events, queries }
}

for (const kind of ['video', 'audio']) {
  for (const response of [false, null]) {
    test(`MediaBunny ${kind}-only input with capability ${response} rejects before any readiness`, async () => {
      const env = environment(kind, response)
      await env.engine.load(sources[kind])
      assert.equal(env.canvas.readyState, 0)
      assert.deepEqual({ ...env.canvas.error }, { code: 4, message })
      assert.equal(env.canvas.networkState, 3)
      assert.deepEqual(env.events, ['error'])
      assert.equal(env.engine.input, null)
      assert.equal(env.engine.media, null)
      assert.equal(env.queries.length, response === null ? 0 : 1)
      assert.equal(env.canvas.canPlayType('video/mp4'), 'maybe')
      env.art.emit('destroy')
    })
  }
  test(`MediaBunny ${kind} track replacement cannot publish readiness without a decoder`, async () => {
    const env = environment(kind)
    let prepared = false
    const load = env.decoder.load
    env.decoder.load = (media, ...args) => {
      if (!prepared) {
        prepared = true
        // Prepare a supported decoder without native decoding in Node; keep the real Input alive.
        env.decoder[`${kind}Sink`] = {}
        args[0]?.()
        return Promise.resolve()
      }
      return load(media, ...args)
    }
    await env.engine.load(sources[kind])
    assert.equal(env.canvas.readyState, 4)
    assert.equal(env.canvas.error, null)
    env.events.length = 0
    await assert.rejects(env.engine.replaceTracks({}), error => error.message === message)
    assert.equal(env.canvas.readyState, 0)
    assert.equal(env.canvas.paused, true)
    assert.equal(env.canvas.seeking, false)
    assert.equal(env.canvas.networkState, 3)
    assert.deepEqual(env.events, ['error'])
    env.art.emit('destroy')
  })
}

test('MediaBunny audio-only input preserves one readiness sequence when its decoder is supported', async () => {
  const env = environment('audio', true)
  await env.engine.load(sources.audio)
  assert.equal(env.canvas.readyState, 4)
  assert.equal(env.canvas.error, null)
  assert(env.engine.audio.audioSink)
  assert.equal(env.engine.video.videoSink, null)
  assert.deepEqual(env.events, readiness)
  assert.equal(env.queries.length, 1)
  env.art.emit('destroy')
})

for (const ending of ['source', 'destroy']) {
  for (const result of ['false', 'reject']) {
    test(`MediaBunny late capability ${result} after ${ending} cannot publish readiness or errors`, async () => {
      const pending = deferred()
      const env = environment('video', () => pending.promise)
      const loading = env.engine.load(sources.video)
      await flush()
      assert.equal(env.queries.length, 1)
      if (ending === 'source') {
        env.engine.performLoad = async () => {}
        await env.engine.load('replacement.mp4')
      }
      else {
        env.art.emit('destroy')
      }
      await loading
      env.events.length = 0
      if (result === 'false')
        pending.resolve(false)
      else pending.reject(new Error('stale decoder query'))
      await flush()
      assert.deepEqual(env.events, [])
      assert.equal(env.canvas.error, null)
      env.art.emit('destroy')
    })
  }
}

for (const supported of [false, true]) {
  test(`MediaBunny pause during capability query preserves load result ${supported} without autoplay`, async () => {
    const pending = deferred()
    const env = environment('audio', () => pending.promise)
    const loading = env.engine.load(sources.audio)
    await flush()
    env.engine.pause()
    pending.resolve(supported)
    await loading
    assert.equal(env.canvas.paused, true)
    assert.deepEqual(env.events, supported ? readiness : ['error'])
    assert.equal(env.queries.length, 1)
    env.art.emit('destroy')
  })
}

for (const kind of ['video', 'audio']) {
  test(`MediaBunny active ${kind} capability rejection keeps the SDK error instead of inventing unsupported status`, async () => {
    const env = environment(kind, () => Promise.reject(new Error('Decoder capability query failed')))
    await env.engine.load(sources[kind])
    assert.deepEqual({ ...env.canvas.error }, { code: 4, message: 'Decoder capability query failed' })
    assert.deepEqual(env.events, ['error'])
    assert.equal(env.canvas.readyState, 0)
    env.art.emit('destroy')
  })
}

test('MediaBunny supported source can recover after an unsupported source without keeping its error', async () => {
  let supported = false
  const env = environment('audio', () => Promise.resolve(supported))
  await env.engine.load(sources.audio)
  assert.equal(env.canvas.error?.message, message)
  supported = true
  env.events.length = 0
  await env.engine.load(sources.audio)
  assert.equal(env.canvas.error, null)
  assert.equal(env.canvas.readyState, 4)
  assert.equal(env.canvas.networkState, 1)
  assert.deepEqual(env.events, readiness)
  assert.equal(env.queries.length, 2)
  env.art.emit('destroy')
})
