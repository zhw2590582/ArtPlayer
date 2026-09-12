import assert from 'node:assert/strict'
// eslint-disable-next-line test/no-import-node-test -- Run the same candidate assertions against frozen source to establish failures.
import test from 'node:test'
import { canvasCandidate, canvasEnvironment, canvasHistorical } from './helpers/canvas.js'

const implementation = await canvasCandidate()
const listenerCount = env => [...env.listeners.values()].reduce((count, set) => count + set.size, 0)
function deferred() {
  let resolve, reject
  const promise = new Promise((yes, no) => {
    resolve = yes
    reject = no
  })
  return { promise, resolve, reject }
}

test('Canvas candidate preserves native canvas methods, live video forwarding and normal resize/callback/event order', async () => {
  const observations = []
  for (const source of [...await canvasHistorical(), implementation]) {
    const env = await canvasEnvironment(source)
    const calls = []
    const canvas = env.factory((ctx, video) => calls.push(ctx === env.context && video === env.video))(env.art)
    canvas.src = 'movie.mp4'
    await canvas.play()
    env.art.emit('video:loadedmetadata')
    env.art.emit('resize')
    await env.flush()
    observations.push({ same: canvas === env.canvas, url: env.video.src, paused: env.video.paused, native: canvas.toDataURL(), callbacks: calls, size: [canvas.width, canvas.height], padding: canvas.style.padding, events: env.emitted.map(event => event.name) })
  }
  for (const value of observations.slice(1)) assert.deepEqual(value, observations[0])
})

for (const operation of ['pause', 'destroy', 'source']) {
  test(`Canvas candidate discards and closes bitmap that resolves after ${operation}`, async () => {
    const pending = deferred()
    let closed = 0
    const env = await canvasEnvironment(implementation, { createImageBitmap: () => pending.promise })
    const canvas = env.factory()(env.art)
    env.art.emit('video:play')
    if (operation === 'pause')
      env.art.emit('video:pause')
    else if (operation === 'destroy')
      env.art.destroy()
    else canvas.src = 'replacement.mp4'
    pending.resolve({ close() {
      closed++
    } })
    await env.flush()
    assert.equal(closed, 1)
    assert.equal(env.draws.length, 0)
    assert.equal(env.frames.size, 0)
    assert.equal(env.emitted.filter(event => event.name === 'artplayerProxyCanvas:draw').length, 0)
  })
}

test('Canvas candidate serializes repeated play and resize while discarding outdated frame results', async () => {
  const pending = [deferred(), deferred()]
  let count = 0
  let closed = 0
  const env = await canvasEnvironment(implementation, { createImageBitmap: () => pending[count++].promise })
  env.factory()(env.art)
  env.art.emit('video:play')
  env.art.emit('video:play')
  env.art.emit('resize')
  assert.equal(count, 1)
  pending[0].resolve({ close() {
    closed++
  } })
  await env.flush()
  assert.equal(env.draws.length, 0)
  assert.equal(count, 2)
  const latest = { close() {
    closed++
  } }
  pending[1].resolve(latest)
  await env.flush()
  assert.deepEqual(env.draws.map(args => args[0]), [latest])
  assert.equal(closed, 2)
  assert.equal(env.frames.size, 1)
  env.art.destroy()
  assert.equal(env.frames.size, 0)
})

test('Canvas candidate closes bitmap on draw error and preserves the original error before retry', async () => {
  const failure = new Error('draw failed')
  let closed = 0
  const env = await canvasEnvironment(implementation, { createImageBitmap: () => Promise.resolve({ close() {
    closed++
  } }), onDraw() {
    throw failure
  } })
  env.factory()(env.art)
  env.art.emit('video:play')
  await env.flush()
  assert.equal(closed, 1)
  assert.equal(env.emitted.at(-1).args[0], failure)
  assert.equal(env.frames.size, 1)
  env.art.destroy()
})

test('Canvas candidate contains callback exceptions and stops reentrant destroy before draw event or RAF', async () => {
  for (const throws of [false, true]) {
    const env = await canvasEnvironment(implementation)
    env.factory(() => {
      env.art.destroy()
      if (throws)
        throw new Error('callback destroyed then failed')
    })(env.art)
    env.art.emit('video:play')
    await env.flush()
    assert.equal(env.frames.size, 0)
    assert.equal(env.emitted.filter(event => event.name.startsWith('artplayerProxyCanvas:')).length, 0)
  }
})

test('Canvas candidate destroy before deferred setup removes every host handler and timer', async () => {
  const env = await canvasEnvironment(implementation)
  const canvas = env.factory()(env.art)
  const play = canvas.play
  env.art.destroy()
  canvas.src = 'late.mp4'
  await play()
  env.flushTimers()
  assert.equal(env.proxies.length, 0)
  assert.equal(env.timers.size, 0)
  assert.equal(listenerCount(env), 0)
  assert.notEqual(env.video.src, 'late.mp4')
  assert.equal(env.video.paused, true)
})

test('Canvas candidate mounts and owns backing media, releases subscriptions and media on destroy', async () => {
  const env = await canvasEnvironment(implementation)
  env.factory()(env.art)
  env.flushTimers()
  assert.deepEqual(env.art.template.$player.children, [env.video])
  assert.equal(env.proxies.length, 5)
  env.art.destroy()
  assert.deepEqual(env.art.template.$player.children, [])
  assert.equal(env.proxies.length, 0)
  assert.equal(listenerCount(env), 0)
  assert.equal(env.video.paused, true)
  assert.equal(env.calls.filter(call => call.name === 'load').length, 1)
})

test('Canvas candidate late registration returns inert canvas without resources', async () => {
  const env = await canvasEnvironment(implementation)
  env.art.destroy()
  assert.equal(env.factory()(env.art), env.canvas)
  env.flushTimers()
  assert.equal(env.timers.size, 0)
  assert.equal(listenerCount(env), 0)
  assert.equal(env.proxies.length, 0)
})

test('Canvas candidate setup rollback preserves failure and removes partially registered handler', async () => {
  const env = await canvasEnvironment(implementation)
  const on = env.art.on
  const failure = new Error('registration failed')
  env.art.on = (...args) => {
    on(...args)
    throw failure
  }
  assert.throws(() => env.factory()(env.art), error => error === failure)
  assert.equal(listenerCount(env), 0)
  assert.equal(env.timers.size, 0)
})

test('Canvas candidate zero dimensions defer drawing and keep finite geometry until metadata', async () => {
  const env = await canvasEnvironment(implementation)
  env.video.videoWidth = 0
  env.video.videoHeight = 0
  env.factory()(env.art)
  env.art.emit('resize')
  await env.flush()
  assert.equal(env.draws.length, 0)
  assert(Number.isFinite(env.canvas.width) && Number.isFinite(env.canvas.height))
  env.video.videoWidth = 320
  env.video.videoHeight = 180
  env.art.emit('video:loadedmetadata')
  env.art.emit('resize')
  await env.flush()
  assert.equal(env.draws.length, 1)
})

test('Canvas candidate missing 2D context reports a capability error and does not spin a frame loop', async () => {
  const env = await canvasEnvironment(implementation, { noContext: true })
  env.factory()(env.art)
  env.art.emit('video:play')
  await env.flush()
  assert.equal(env.emitted.filter(event => event.name === 'artplayerProxyCanvas:error').length, 1)
  assert.equal(env.frames.size, 0)
})

test('Canvas candidate RAF zero is cancelled and paused seek draws once without restarting playback', async () => {
  const env = await canvasEnvironment(implementation, { firstFrame: 0 })
  env.factory()(env.art)
  env.art.emit('video:play')
  await env.flush()
  assert(env.frames.has(0))
  env.art.emit('video:pause')
  assert.equal(env.frames.size, 0)
  const before = env.draws.length
  env.art.emit('video:seeked')
  await env.flush()
  assert.equal(env.draws.length, before + 1)
  assert.equal(env.frames.size, 0)
})

test('Canvas candidate waits for a decoded frame before requesting bitmap and then resumes drawing', async () => {
  let allocated = 0
  const env = await canvasEnvironment(implementation, { createImageBitmap: () => {
    allocated++
    return Promise.resolve({ close() {} })
  } })
  env.video.readyState = 1
  env.factory()(env.art)
  env.art.emit('video:play')
  await env.flush()
  assert.equal(allocated, 0)
  env.video.readyState = 4
  env.art.emit('resize')
  await env.flush()
  assert.equal(allocated, 1)
  env.art.destroy()
})

test('Canvas candidate ignores late bitmap rejection after terminal disposal', async () => {
  const pending = deferred()
  const env = await canvasEnvironment(implementation, { createImageBitmap: () => pending.promise })
  env.factory()(env.art)
  env.art.emit('video:play')
  env.art.destroy()
  pending.reject(new Error('late failure'))
  await env.flush()
  assert.equal(env.emitted.filter(event => event.name === 'artplayerProxyCanvas:error').length, 0)
  assert.equal(env.frames.size, 0)
})

test('Canvas candidate preserves active callback error identity and closes bitmap before invoking it', async () => {
  let closed = false
  const failure = new Error('callback failure')
  const env = await canvasEnvironment(implementation, { createImageBitmap: () => Promise.resolve({ close() {
    closed = true
  } }) })
  env.factory(() => {
    assert.equal(closed, true)
    throw failure
  })(env.art)
  env.art.emit('resize')
  await env.flush()
  assert.equal(env.emitted.at(-1).args[0], failure)
  assert.equal(env.frames.size, 0)
})

test('Canvas candidate deferred partial media registration failure rolls back native and host subscriptions', async () => {
  const env = await canvasEnvironment(implementation)
  const proxy = env.art.proxy
  const failure = new Error('partial media registration')
  env.art.proxy = (...args) => {
    proxy(...args)
    throw failure
  }
  env.factory()(env.art)
  env.flushTimers()
  assert.equal(env.proxies.length, 0)
  assert.equal(listenerCount(env), 0)
  assert.equal(env.video.parentNode, null)
  assert.equal(env.emitted.at(-1).args[0], failure)
})

test('Canvas candidate handles destruction reentered before host registration returns', async () => {
  const env = await canvasEnvironment(implementation)
  const on = env.art.on
  env.art.on = (name, handler) => {
    if (name === 'destroy') {
      env.art.isDestroy = true
      handler()
    }
    return on(name, handler)
  }
  env.factory()(env.art)
  assert.equal(listenerCount(env), 0)
  assert.equal(env.timers.size, 0)
})

test('Canvas candidate attempts remaining cleanup when a host unsubscribe throws', async () => {
  const env = await canvasEnvironment(implementation)
  env.factory()(env.art)
  env.flushTimers()
  const off = env.art.off
  const failure = new Error('unsubscribe failure')
  env.art.off = (...args) => {
    off(...args)
    throw failure
  }
  assert.throws(() => env.art.destroy(), error => error === failure)
  assert.equal(listenerCount(env), 0)
  assert.equal(env.proxies.length, 0)
  assert.equal(env.video.parentNode, null)
  assert.equal(env.canvas.width, 0)
})

test('Canvas candidate drops bitmap errors from frames invalidated by a native seeking transition', async () => {
  const pending = deferred()
  const env = await canvasEnvironment(implementation, { createImageBitmap: () => pending.promise })
  env.factory()(env.art)
  env.art.emit('video:play')
  env.video.readyState = 1
  env.video.seeking = true
  pending.reject(new Error('old native frame unavailable'))
  await env.flush()
  assert.equal(env.emitted.filter(event => event.name === 'artplayerProxyCanvas:error').length, 0)
  env.art.destroy()
})

test('Canvas candidate defers only initial unavailable bitmap errors, without trusting zero frame counters as a global capability gate', async () => {
  let frames = 0
  const failure = Object.assign(new Error('first frame unavailable'), { name: 'InvalidStateError' })
  const env = await canvasEnvironment(implementation, { createImageBitmap: () => Promise.reject(failure) })
  env.video.getVideoPlaybackQuality = () => ({ totalVideoFrames: frames })
  env.factory()(env.art)
  env.art.emit('resize')
  await env.flush()
  assert.equal(env.draws.length, 0)
  assert.equal(env.emitted.filter(event => event.name === 'artplayerProxyCanvas:error').length, 0)
  frames = 1
  env.art.emit('resize')
  await env.flush()
  assert.equal(env.emitted.at(-1).args[0], failure)
  const direct = await canvasEnvironment(implementation)
  direct.video.getVideoPlaybackQuality = () => ({ totalVideoFrames: 0 })
  direct.factory()(direct.art)
  direct.art.emit('resize')
  await direct.flush()
  assert.equal(direct.draws.length, 1)
})

test('Canvas candidate never classifies a user callback InvalidStateError as a missing native first frame', async () => {
  const failure = Object.assign(new Error('callback invalid state'), { name: 'InvalidStateError' })
  const env = await canvasEnvironment(implementation, { createImageBitmap: () => Promise.resolve({ close() {} }) })
  env.video.getVideoPlaybackQuality = () => ({ totalVideoFrames: 0 })
  env.factory(() => {
    throw failure
  })(env.art)
  env.art.emit('resize')
  await env.flush()
  assert.equal(env.emitted.at(-1).args[0], failure)
})

test('Canvas candidate preserves historical JavaScript calls with a falsy callback', async () => {
  for (const source of [...await canvasHistorical(), implementation]) {
    for (const option of [undefined, null, false, 0, '']) {
      const env = await canvasEnvironment(source)
      env.factory(option)(env.art)
      env.art.emit('resize')
      await env.flush()
      assert.equal(env.emitted.filter(event => event.name === 'artplayerProxyCanvas:error').length, 0, `${source.name}: ${String(option)}`)
      assert.equal(env.emitted.at(-1).name, 'artplayerProxyCanvas:draw')
    }
  }
})
