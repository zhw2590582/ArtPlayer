import assert from 'node:assert/strict'
// eslint-disable-next-line test/no-import-node-test -- Node historical regression runner.
import test from 'node:test'
import { canvasEnvironment, canvasHistorical } from './helpers/canvas.js'

function deferred() {
  let resolve, reject
  const promise = new Promise((yes, no) => {
    resolve = yes
    reject = no
  })
  return { promise, resolve, reject }
}

for (const implementation of await canvasHistorical()) {
  test(`Canvas ${implementation.name}: historical pending bitmap draws and reschedules after pause or destroy`, async () => {
    for (const operation of ['video:pause', 'destroy']) {
      const pending = deferred()
      let closed = 0
      const bitmap = { close() {
        closed++
      } }
      const env = await canvasEnvironment(implementation, { createImageBitmap: () => pending.promise })
      env.factory()(env.art)
      env.art.emit('video:play')
      env.art.emit(operation)
      assert.equal(env.frames.size, 0)
      pending.resolve(bitmap)
      await env.flush()
      assert.equal(env.draws.length, 1)
      assert.equal(closed, 1)
      assert.equal(env.frames.size, 1)
      assert.equal(env.emitted.at(-1).name, 'artplayerProxyCanvas:draw')
    }
  })

  test(`Canvas ${implementation.name}: historical repeated play creates concurrent stale bitmap loops`, async () => {
    const pending = [deferred(), deferred()]
    let index = 0
    const env = await canvasEnvironment(implementation, { createImageBitmap: () => pending[index++].promise })
    env.factory()(env.art)
    env.art.emit('video:play')
    env.art.emit('video:play')
    const newer = { close() {} }
    const older = { close() {} }
    pending[1].resolve(newer)
    await env.flush()
    pending[0].resolve(older)
    await env.flush()
    assert.deepEqual(env.draws.map(args => args[0]), [newer, older])
    assert.equal(env.frames.size, 2)
    env.art.destroy()
    assert.equal(env.frames.size, 1, 'Only the latest stored RAF handle is cancelled')
  })

  test(`Canvas ${implementation.name}: historical draw failure emits its error but leaks the acquired bitmap`, async () => {
    const failure = new Error('draw failed')
    let closed = 0
    const bitmap = { close() {
      closed++
    } }
    const env = await canvasEnvironment(implementation, { createImageBitmap: () => Promise.resolve(bitmap), onDraw() {
      throw failure
    } })
    env.factory()(env.art)
    env.art.emit('video:play')
    await env.flush()
    assert.equal(closed, 0)
    assert.equal(env.emitted.at(-1).name, 'artplayerProxyCanvas:error')
    assert.equal(env.emitted.at(-1).args[0], failure)
    assert.equal(env.frames.size, 1)
  })

  test(`Canvas ${implementation.name}: historical bitmap rejection emits the original error without direct-video fallback`, async () => {
    const failure = new Error('bitmap rejected')
    const env = await canvasEnvironment(implementation, { createImageBitmap: () => Promise.reject(failure) })
    env.factory()(env.art)
    env.art.emit('video:play')
    await env.flush()
    assert.equal(env.draws.length, 0)
    assert.equal(env.emitted.at(-1).name, 'artplayerProxyCanvas:error')
    assert.equal(env.emitted.at(-1).args[0], failure)
    assert.equal(env.frames.size, 1)
  })

  test(`Canvas ${implementation.name}: callback errors occur after bitmap close and replace the draw event with an error`, async () => {
    const failure = new Error('callback failed')
    let closed = 0
    const env = await canvasEnvironment(implementation, { createImageBitmap: () => Promise.resolve({ close() {
      closed++
    } }) })
    env.factory(() => {
      throw failure
    })(env.art)
    env.art.emit('resize')
    await env.flush()
    assert.equal(closed, 1)
    assert.equal(env.emitted.filter(event => event.name === 'artplayerProxyCanvas:draw').length, 0)
    assert.equal(env.emitted.at(-1).args[0], failure)
  })

  test(`Canvas ${implementation.name}: historical callback destruction still emits draw and queues a new frame`, async () => {
    const env = await canvasEnvironment(implementation)
    env.factory(() => env.art.destroy())(env.art)
    env.art.emit('video:play')
    await env.flush()
    assert.deepEqual(env.emitted.map(event => event.name), ['video:play', 'destroy', 'artplayerProxyCanvas:draw'])
    assert.equal(env.frames.size, 1)
  })

  test(`Canvas ${implementation.name}: historical destroy before setup timeout retains host handlers and attaches media listeners later`, async () => {
    const env = await canvasEnvironment(implementation)
    env.factory()(env.art)
    env.art.destroy()
    assert.equal(env.timers.size, 1)
    assert.equal([...env.listeners.values()].reduce((count, set) => count + set.size, 0), 5)
    env.flushTimers()
    assert.equal(env.proxies.length, 5)
    env.emitVideo({ type: 'play' })
    await env.flush()
    assert.equal(env.frames.size, 1)
  })

  test(`Canvas ${implementation.name}: historical late attachment to a destroyed host still registers and draws`, async () => {
    const env = await canvasEnvironment(implementation)
    env.art.destroy()
    const result = env.factory()(env.art)
    assert.equal(result, env.canvas)
    env.flushTimers()
    env.emitVideo({ type: 'play' })
    await env.flush()
    assert.equal(env.proxies.length, 5)
    assert.equal(env.draws.length, 1)
    assert.equal(env.frames.size, 1)
  })

  test(`Canvas ${implementation.name}: historical setup subscription failure leaves deferred work and the partial host registration`, async () => {
    const env = await canvasEnvironment(implementation)
    const on = env.art.on
    const failure = new Error('subscription failed')
    env.art.on = (...args) => {
      on(...args)
      throw failure
    }
    assert.throws(() => env.factory()(env.art), error => error === failure)
    assert.equal(env.timers.size, 1)
    assert.equal([...env.listeners.values()].reduce((count, set) => count + set.size, 0), 1)
    env.flushTimers()
    assert.equal(env.proxies.length, 5)
  })

  test(`Canvas ${implementation.name}: historical zero media dimensions reach unguarded resize and drawing`, async () => {
    const env = await canvasEnvironment(implementation)
    env.video.videoWidth = 0
    env.video.videoHeight = 0
    env.factory()(env.art)
    env.art.emit('resize')
    await env.flush()
    assert(Number.isNaN(env.canvas.height), 'This controlled element does not apply native unsigned dimension coercion')
    assert.equal(env.canvas.style.padding, 'NaNpx 0px')
    assert.equal(env.draws.length, 1)
  })

  test(`Canvas ${implementation.name}: historical missing 2D context repeats a TypeError path with no capability guard`, async () => {
    const env = await canvasEnvironment(implementation, { noContext: true })
    env.factory()(env.art)
    env.art.emit('video:play')
    await env.flush()
    assert.equal(env.emitted.at(-1).name, 'artplayerProxyCanvas:error')
    assert.equal(env.emitted.at(-1).args[0].name, 'TypeError')
    assert.equal(env.frames.size, 1)
  })
}
