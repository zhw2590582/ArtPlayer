import assert from 'node:assert/strict'
import fs from 'node:fs'
// eslint-disable-next-line test/no-import-node-test -- Compare candidate cancellation with the frozen implementation.
import test from 'node:test'
import { mbCandidate, mbEnvironment } from './helpers/mediabunny.js'

const implementation = await mbCandidate()
const flush = () => new Promise(resolve => setImmediate(resolve))
function deferred() {
  let resolve, reject
  const promise = new Promise((yes, no) => {
    resolve = yes
    reject = no
  })
  return { promise, resolve, reject }
}

function environment(option = {}) {
  const timers = new Map()
  let sequence = 0
  const env = mbEnvironment(implementation, {
    setTimeout(fn, delay) {
      const id = sequence++
      timers.set(id, { fn, delay })
      return id
    },
    clearTimeout(id) { timers.delete(id) },
  })
  env.eventNames.push('waiting', 'loadstart', 'loadeddata', 'canplay')
  const canvas = env.factory(option)(env.art)
  const errors = []
  const warnings = []
  env.globals.console = { error: (...args) => errors.push(args), warn: (...args) => warnings.push(args), log() {}, debug() {} }
  function fire(delay) {
    for (const [id, timer] of [...timers]) {
      if (timer.delay === delay) {
        timers.delete(id)
        timer.fn()
      }
    }
  }
  return { ...env, canvas, engine: canvas.engine, timers, fire, errors, warnings }
}

test('MediaBunny candidate destroy settles pending load, drops deferred events and ignores late failure', async () => {
  const env = environment({ loadTimeout: 100 })
  const pending = deferred()
  env.engine.performLoad = () => pending.promise
  let settled = false
  const loading = env.engine.load('movie.mp4').then(() => settled = true)
  env.art.emit('destroy')
  await flush()
  assert.equal(settled, true, 'Cancellation must not wait for the underlying operation')
  assert.equal(env.timers.size, 0)
  const cursor = env.emitted.length
  pending.reject(new Error('late failure'))
  await loading
  await flush()
  assert.equal(env.engine.error, null)
  assert.equal(env.emitted.length, cursor)
})

test('MediaBunny candidate source replacement settles old load without waiting for its result', async () => {
  const env = environment({ loadTimeout: 100 })
  const pending = deferred()
  const sources = []
  env.engine.performLoad = (src) => {
    sources.push(src)
    return src === 'old' ? pending.promise : Promise.resolve()
  }
  let settled = false
  const old = env.engine.load('old').then(() => settled = true)
  await env.engine.load('new')
  await flush()
  assert.equal(settled, true)
  assert.deepEqual(sources, ['old', 'new'])
  assert.equal([...env.timers.values()].filter(timer => timer.delay === 100).length, 0)
  env.fire(0)
  assert.deepEqual(env.emitted.map(event => event.name), ['video:waiting', 'video:loadstart'])
  pending.reject(new Error('obsolete'))
  await old
  await flush()
  assert.equal(env.engine.error, null)
  env.art.emit('destroy')
})

test('MediaBunny candidate clears successful load deadline while keeping its normal deferred notifications', async () => {
  const env = environment({ loadTimeout: 100 })
  env.engine.performLoad = async () => {}
  await env.engine.load('movie.mp4')
  assert.deepEqual([...env.timers.values()].map(timer => timer.delay), [0, 0])
  env.fire(0)
  assert.deepEqual(env.emitted.map(event => event.name), ['video:waiting', 'video:loadstart'])
  env.art.emit('destroy')
  assert.equal(env.timers.size, 0)
})

test('MediaBunny candidate keeps active timeout error and suppresses a late operation failure', async () => {
  const env = environment({ loadTimeout: 100 })
  const pending = deferred()
  env.engine.performLoad = () => pending.promise
  const loading = env.engine.load('movie.mp4')
  env.fire(100)
  await loading
  assert.deepEqual({ ...env.engine.error }, { code: 4, message: 'Load timeout' })
  assert.equal(env.engine.networkState, 3)
  assert.equal(env.timers.size, 0)
  pending.reject(new Error('late failure'))
  await flush()
  assert.deepEqual(env.emitted.map(event => event.name), ['video:error'])
  assert.equal(env.engine.error.message, 'Load timeout')
  env.art.emit('destroy')
})

for (const ending of ['destroy', 'source', 'timeout']) {
  test(`MediaBunny candidate ${ending} aborts pending HEAD and suppresses stale Range errors`, async () => {
    const env = environment({ preflightRange: true, loadTimeout: 100 })
    const response = deferred()
    let request
    env.globals.fetch = (url, init) => {
      request = { url, init }
      return response.promise
    }
    const loading = env.engine.load('movie.mp4')
    assert.equal(request.init.method, 'HEAD')
    if (ending === 'destroy') {
      env.art.emit('destroy')
    }
    else if (ending === 'source') {
      env.engine.audio.handleNoAudioTrack = () => {}
      await env.engine.load(null)
    }
    else {
      env.fire(100)
    }
    await flush()
    assert.equal(request.init.signal?.aborted, true)
    const cursor = env.emitted.length
    response.resolve({ headers: { get: () => 'none' } })
    await loading
    await flush()
    assert.equal(env.emitted.length, cursor)
    assert.equal(env.warnings.length, 0)
    if (ending === 'timeout')
      assert.equal(env.engine.error.message, 'Load timeout')
    else assert.equal(env.engine.error, null)
    env.art.emit('destroy')
    assert.equal(env.timers.size, 0)
  })
}

for (const ending of ['destroy', 'source', 'timeout']) {
  test(`MediaBunny candidate ${ending} disposes the real SDK Input while its first stream read is pending`, async () => {
    const env = environment({ loadTimeout: 100 })
    let cancellations = 0
    const stream = new ReadableStream({ cancel() {
      cancellations++
    } })
    let settled = false
    const loading = env.engine.load(stream).then(() => settled = true)
    await flush()
    assert.equal(stream.locked, true, 'The SDK must have started reading the real stream')
    if (ending === 'destroy')
      env.art.emit('destroy')
    else if (ending === 'source')
      await env.engine.load(null)
    else env.fire(100)
    await flush()
    assert.equal(settled, true)
    assert.equal(cancellations, 1)
    assert.equal(env.engine.input, null)
    assert.equal(env.engine.media, null)
    await loading
    env.art.emit('destroy')
    assert.equal(cancellations, 1)
    assert.equal(env.timers.size, 0)
  })
}

test('MediaBunny candidate Range retains supported, missing, network-failure and HLS bypass behavior', async () => {
  const env = environment({ preflightRange: true })
  const requests = []
  env.globals.fetch = async (url, init) => {
    requests.push({ url, init })
    if (url === 'network')
      throw new Error('network failure')
    return { headers: { get: () => url === 'supported' ? 'bytes' : null } }
  }
  assert.equal(await env.engine.video.preflight('supported'), true)
  assert.equal(await env.engine.video.preflight('missing'), false)
  assert.equal(env.emitted.at(-1).args[0].detail.type, 'RangeNotSupported')
  assert.equal(env.engine.error, null)
  assert.equal(await env.engine.video.preflight('network'), true)
  assert.equal(env.warnings.length, 1)
  assert.equal(await env.engine.video.preflight('LIVE.M3U8?x=1'), true)
  assert.equal(await env.engine.video.preflight(new Blob()), true)
  assert.deepEqual(requests.map(({ url, init }) => ({ url, init: { ...init } })), ['supported', 'missing', 'network'].map(url => ({ url, init: { method: 'HEAD' } })))
  env.art.emit('destroy')
})

test('MediaBunny candidate has no load side effects after destruction', async () => {
  const env = environment()
  let calls = 0
  env.engine.performLoad = async () => calls++
  env.art.emit('destroy')
  await env.engine.load('later.mp4')
  assert.equal(calls, 0)
  assert.equal(env.timers.size, 0)
})

for (const failure of [false, true]) {
  test(`MediaBunny candidate suppresses stale HEAD ${failure ? 'rejection' : 'response'} without AbortController`, async () => {
    const env = environment({ preflightRange: true })
    env.globals.AbortController = undefined
    const response = deferred()
    env.globals.fetch = () => response.promise
    let settled = false
    const loading = env.engine.load('movie.mp4').then(() => settled = true)
    env.art.emit('destroy')
    await flush()
    assert.equal(settled, true)
    const cursor = env.emitted.length
    if (failure)
      response.reject(new Error('obsolete'))
    else response.resolve({ headers: { get: () => null } })
    await loading
    await flush()
    assert.equal(env.emitted.length, cursor)
    assert.equal(env.warnings.length, 0)
  })
}

for (const timeout of [0, -1, Number.NaN, Infinity, '100']) {
  test(`MediaBunny candidate keeps ${String(timeout)} timeout disabled`, async () => {
    const env = environment({ loadTimeout: timeout })
    env.engine.performLoad = async () => {}
    await env.engine.load('movie.mp4')
    assert.deepEqual([...env.timers.values()].map(timer => timer.delay), [0, 0])
    env.art.emit('destroy')
  })
}

test('MediaBunny candidate releases the real SDK input after decoder setup failure and ignores late metadata', async () => {
  const env = environment()
  const pendingAudio = deferred()
  let metadata
  let disposals = 0
  env.engine.video.load = async (media) => {
    const dispose = media.input.dispose.bind(media.input)
    media.input.dispose = () => {
      disposals++
      dispose()
    }
    throw new Error('decoder setup failed')
  }
  env.engine.audio.load = (media, onMetadata) => {
    metadata = onMetadata
    return pendingAudio.promise
  }
  await env.engine.load(new Blob([fs.readFileSync(new URL('./browser/media/pattern.mp4', import.meta.url))]))
  assert.equal(disposals, 1)
  assert.equal(env.engine.input, null)
  assert.equal(env.engine.error.message, 'decoder setup failed')
  const cursor = env.emitted.length
  metadata()
  pendingAudio.resolve()
  await flush()
  assert.equal(env.emitted.length, cursor)
  assert.equal(env.engine.readyState, 0)
  env.art.emit('destroy')
  assert.equal(disposals, 1)
})
