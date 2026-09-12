import assert from 'node:assert/strict'
// eslint-disable-next-line test/no-import-node-test -- Freeze historical lifecycle failures before candidate fixes.
import test from 'node:test'
import { mbEnvironment, mbHistorical } from './helpers/mediabunny.js'

function deferred() {
  let resolve
  let reject
  const promise = new Promise((yes, no) => {
    resolve = yes
    reject = no
  })
  return { promise, resolve, reject }
}

function timedEnvironment(implementation, option) {
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
  env.eventNames.push('playing')
  const canvas = env.factory(option)(env.art)
  return { ...env, canvas, engine: canvas.engine, timers }
}

for (const implementation of await mbHistorical()) {
  test(`MediaBunny historical ${implementation.name}: destroy still permits late load errors and scheduled events`, async () => {
    const timers = new Map()
    let nextTimer = 0
    const env = mbEnvironment(implementation, {
      setTimeout(fn) {
        const id = nextTimer++
        timers.set(id, fn)
        return id
      },
      clearTimeout(id) { timers.delete(id) },
    })
    const canvas = env.factory()(env.art)
    const engine = canvas.engine
    const events = []
    for (const name of ['waiting', 'loadstart', 'error'])
      canvas.events.addEventListener(name, () => events.push(name))
    let reject
    const pending = new Promise((resolve, fail) => {
      reject = fail
    })
    engine.performLoad = () => pending
    const loading = engine.load('controlled-input')
    const generation = engine.loadSeq
    env.art.emit('destroy')
    assert.equal(engine.loadSeq, generation, 'Destroy does not invalidate the load generation')
    assert.equal(env.art.mediabunny, undefined)
    assert.equal(timers.size, 2, 'Waiting and loadstart timers still exist after destroy')
    reject(new Error('late controlled rejection'))
    await loading
    for (const fn of timers.values()) fn()
    timers.clear()
    assert.deepEqual(events, ['error', 'waiting', 'loadstart'])
    assert.equal(env.emitted.at(-1).name, 'video:error')
    assert.deepEqual({ ...engine.error }, { code: 4, message: 'late controlled rejection' })
    assert.equal(engine.networkState, 3)
  })

  test(`MediaBunny historical ${implementation.name}: pending play starts video after a newer pause`, async () => {
    const { engine, emitted } = timedEnvironment(implementation)
    const audio = deferred()
    let starts = 0
    engine.audio.play = () => audio.promise
    engine.video.start = () => starts++
    const playing = engine.play()
    assert.equal(engine.paused, false)
    engine.pause()
    audio.resolve()
    await playing
    assert.equal(engine.paused, true)
    assert.equal(starts, 1)
    assert.deepEqual(emitted.map(item => item.name), ['video:pause', 'video:play', 'video:playing'])
  })

  test(`MediaBunny historical ${implementation.name}: pending play starts video after destroy`, async () => {
    const { art, engine, emitted } = timedEnvironment(implementation)
    const audio = deferred()
    let starts = 0
    engine.audio.play = () => audio.promise
    engine.video.start = () => starts++
    const playing = engine.play()
    art.emit('destroy')
    const cursor = emitted.length
    audio.resolve()
    await playing
    assert.equal(starts, 1)
    assert.deepEqual(emitted.slice(cursor).map(item => item.name), ['video:play', 'video:playing'])
    assert.equal(engine.paused, true)
  })

  test(`MediaBunny historical ${implementation.name}: rejected audio play leaves false paused state and prevents retry`, async () => {
    const { engine } = timedEnvironment(implementation)
    const error = new Error('controlled audio resume rejection')
    let attempts = 0
    engine.audio.play = () => {
      attempts++
      return Promise.reject(error)
    }
    await assert.rejects(engine.play(), item => item === error)
    assert.equal(engine.paused, false)
    await engine.play()
    assert.equal(attempts, 1)
  })

  test(`MediaBunny historical ${implementation.name}: pending seek emits and resumes playback after destroy`, async () => {
    const { art, engine, canvas } = timedEnvironment(implementation)
    const audio = deferred()
    const events = []
    for (const name of ['seeking', 'waiting', 'pause', 'seeked'])
      canvas.events.addEventListener(name, () => events.push(name))
    engine.paused = false
    engine.audio.seek = () => audio.promise
    engine.video.seek = () => Promise.resolve()
    engine.play = () => {
      events.push('resumed-after-destroy')
      return Promise.resolve()
    }
    const seeking = engine.seek(1)
    art.emit('destroy')
    audio.resolve()
    await seeking
    assert.deepEqual(events, ['seeking', 'waiting', 'pause', 'seeked', 'resumed-after-destroy'])
    assert.equal(engine.seeking, false)
  })

  test(`MediaBunny historical ${implementation.name}: successful load and destroy retain their timeout timer`, async () => {
    const { art, engine, timers } = timedEnvironment(implementation, { loadTimeout: 1234 })
    engine.performLoad = () => Promise.resolve()
    await engine.load('controlled-input')
    assert.equal(timers.size, 3)
    assert.equal([...timers.values()].filter(item => item.delay === 1234).length, 1)
    art.emit('destroy')
    assert.equal(timers.size, 3)
    for (const { fn } of timers.values()) fn()
    timers.clear()
    await Promise.resolve()
    assert.equal(engine.error, null, 'Settled Promise.race observes the late timeout rejection without changing the successful result')
  })

  test(`MediaBunny historical ${implementation.name}: active timeout keeps its error when the underlying load rejects later`, async () => {
    const { engine, timers } = timedEnvironment(implementation, { loadTimeout: 5678 })
    const pending = deferred()
    engine.performLoad = () => pending.promise
    const loading = engine.load('controlled-input')
    const timeout = [...timers.values()].find(item => item.delay === 5678)
    timeout.fn()
    await loading
    assert.deepEqual({ ...engine.error }, { code: 4, message: 'Load timeout' })
    const error = engine.error
    pending.reject(new Error('late underlying rejection'))
    await Promise.resolve()
    await Promise.resolve()
    assert.equal(engine.error, error)
    timers.clear()
  })

  test(`MediaBunny historical ${implementation.name}: Range preflight rejects absent support, tolerates fetch errors and keeps its HLS version boundary`, async () => {
    const { engine, canvas, globals } = timedEnvironment(implementation, { preflightRange: true })
    const calls = []
    const errors = []
    const warnings = []
    canvas.events.addEventListener('error', event => errors.push(event.detail.type))
    globals.console = { ...console, warn: (...args) => warnings.push(args) }
    globals.fetch = async (url, options) => {
      calls.push({ url, options: { ...options } })
      return { headers: { get: () => 'bytes' } }
    }
    assert.equal(await engine.video.preflight('https://example.invalid/media.mp4'), true)
    assert.deepEqual(calls, [{ url: 'https://example.invalid/media.mp4', options: { method: 'HEAD' } }])
    globals.fetch = async () => ({ headers: { get: () => null } })
    assert.equal(await engine.video.preflight('https://example.invalid/media.mp4'), false)
    assert.deepEqual(errors, ['RangeNotSupported'])
    assert.equal(engine.error, null, 'Range refusal is an event, not engine.error state')
    const failure = new Error('controlled HEAD rejection')
    globals.fetch = async () => {
      throw failure
    }
    assert.equal(await engine.video.preflight('https://example.invalid/media.mp4'), true)
    assert.equal(warnings.length, 1)
    assert.equal(warnings[0][1], failure)
    let requests = 0
    globals.fetch = async () => {
      requests++
      return { headers: { get: () => 'bytes' } }
    }
    assert.equal(await engine.video.preflight('https://example.invalid/media.m3u8'), true)
    assert.equal(requests, implementation.name === 'published-1.0.0' ? 1 : 0)
    assert.equal(await engine.video.preflight(new Blob([])), true)
    assert.equal(requests, implementation.name === 'published-1.0.0' ? 1 : 0)
  })
}
