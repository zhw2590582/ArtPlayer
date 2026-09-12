import assert from 'node:assert/strict'
// eslint-disable-next-line test/no-import-node-test -- Candidate assertions also run unchanged against the frozen workspace.
import test from 'node:test'
import { iframeCandidate, iframeEnvironment } from './helpers/iframe.js'

const implementation = await iframeCandidate()
const flush = () => new Promise(resolve => setImmediate(resolve))
function observe(promise) {
  const state = { status: 'pending' }
  promise.then(value => Object.assign(state, { status: 'resolved', value }), error => Object.assign(state, { status: 'rejected', error: error.message }))
  return state
}
function setup(injected = true) {
  const env = iframeEnvironment(implementation)
  const instance = new env.Factory({ iframe: new env.Frame(), url: '/first' })
  if (injected)
    env.dispatch({ type: 'inject' })
  return { ...env, instance }
}
function tick(env) {
  for (const [id, timer] of [...env.timers]) {
    assert.equal(timer.delay, 200)
    env.timers.delete(id)
    timer.callback()
  }
}

test('Iframe candidate preserves instance shape, descriptors, binding and listener-before-src order', () => {
  const env = setup(false)
  const instance = env.instance
  assert.deepEqual(Object.getOwnPropertyNames(env.Factory.prototype), ['constructor', 'onMessage', 'postMessage', 'commit', 'message', 'destroy'])
  assert.deepEqual(Object.keys(instance), ['url', '$iframe', 'promises', 'injected', 'destroyed', 'messageCallback', 'onMessage'])
  for (const key of Object.keys(instance)) {
    const descriptor = Object.getOwnPropertyDescriptor(instance, key)
    assert(descriptor.writable && descriptor.enumerable && descriptor.configurable)
  }
  assert.deepEqual(env.order, ['listen:message', 'src'])
  assert.equal(instance.messageCallback(), null)
  const receiver = instance.onMessage
  receiver({ data: { type: 'inject' } })
  assert.equal(instance.injected, true)
  assert.equal(instance.destroy(), undefined)
})

test('Iframe candidate preserves numeric envelopes, resove spelling and generic response callback receiver', async () => {
  const env = setup()
  const registry = env.instance.promises
  const seen = []
  env.instance.message(function (packet) {
    seen.push({ receiver: this === env.instance, ...packet })
  })
  const pending = env.instance.postMessage({ type: 'custom-query', data: 3, id: 900 })
  assert.deepEqual(Object.keys(registry[1234]), ['resove', 'reject'])
  assert.deepEqual(JSON.parse(JSON.stringify(env.sent)), [{ packet: { type: 'custom-query', data: 3, id: 1234 }, origin: '*' }])
  env.dispatch({ type: 'custom-result', data: 4, id: 1234 })
  assert.equal(await pending, 4)
  assert.equal(registry, env.instance.promises)
  assert.deepEqual(Object.keys(registry), [])
  assert.deepEqual(seen, [{ receiver: true, type: 'custom-result', data: 4 }])
  env.instance.destroy()
})

test('Iframe candidate matches simultaneous requests independently and out of order', async () => {
  const env = setup()
  const first = observe(env.instance.postMessage({ type: 'one' }))
  const second = observe(env.instance.postMessage({ type: 'two' }))
  assert.deepEqual(env.sent.map(item => item.packet.id), [1234, 1235])
  env.dispatch({ type: 'response', data: 2, id: 1235 })
  env.dispatch({ type: 'response', data: 1, id: 1234 })
  await flush()
  assert.deepEqual([first, second], [{ status: 'resolved', value: 1 }, { status: 'resolved', value: 2 }])
  assert.equal(Object.keys(env.instance.promises).length, 0)
  env.instance.destroy()
})

test('Iframe candidate never reuses a settled ID when the clock moves backwards', async () => {
  const env = setup()
  const first = env.instance.postMessage({ type: 'one' })
  env.dispatch({ type: 'response', data: 1, id: 1234 })
  assert.equal(await first, 1)
  env.now(1000)
  const second = observe(env.instance.postMessage({ type: 'two' }))
  assert.equal(env.sent.at(-1).packet.id, 1235)
  env.dispatch({ type: 'response', data: 'duplicate', id: 1234 })
  await flush()
  assert.equal(second.status, 'pending')
  env.dispatch({ type: 'response', data: 2, id: 1235 })
  await flush()
  assert.deepEqual(second, { status: 'resolved', value: 2 })
  env.instance.destroy()
})

test('Iframe candidate separates two instances sharing the same iframe window', async () => {
  const env = setup()
  const second = new env.Factory({ iframe: env.instance.$iframe, url: '/first' })
  env.dispatch({ type: 'inject' })
  const one = observe(env.instance.postMessage({ type: 'one' }))
  const two = observe(second.postMessage({ type: 'two' }))
  assert.deepEqual(env.sent.map(item => item.packet.id), [1234, 1235])
  env.dispatch({ type: 'response', data: 1, id: 1234 })
  env.dispatch({ type: 'response', data: 2, id: 1235 })
  await flush()
  assert.deepEqual([one, two], [{ status: 'resolved', value: 1 }, { status: 'resolved', value: 2 }])
  env.instance.destroy()
  second.destroy()
})

test('Iframe candidate destroys sent requests immediately and ignores saved receivers', async () => {
  const env = setup()
  const state = observe(env.instance.postMessage({ type: 'one' }))
  const receiver = env.instance.onMessage
  let calls = 0
  env.instance.message(() => calls++)
  env.instance.destroy()
  receiver({ data: { type: 'response', data: 'late', id: 1234 } })
  await flush()
  assert.deepEqual(state, { status: 'rejected', error: 'The instance has been destroyed' })
  assert.equal(Object.keys(env.instance.promises).length, 0)
  assert.equal(calls, 0)
  assert.equal(env.handlers.get('message').size, 0)
  assert.equal(env.instance.destroy(), undefined)
})

test('Iframe candidate destroys waiting requests immediately and cancels every polling timer', async () => {
  const env = setup(false)
  const states = Array.from({ length: 3 }, () => observe(env.instance.postMessage({ type: 'wait' })))
  const late = [...env.timers.values()].map(timer => timer.callback)
  env.instance.destroy()
  await flush()
  assert.equal(env.timers.size, 0)
  assert(states.every(state => state.status === 'rejected' && state.error === 'The instance has been destroyed'))
  late.forEach(callback => callback())
  assert.equal(env.timers.size, 0)
  assert.equal(env.sent.length, 0)
})

test('Iframe candidate preserves 200ms injection waiting and allocates unique IDs after handshake', async () => {
  const env = setup(false)
  const one = observe(env.instance.postMessage({ type: 'one' }))
  const two = observe(env.instance.postMessage({ type: 'two' }))
  tick(env)
  assert.equal(env.sent.length, 0)
  assert.equal(env.timers.size, 2)
  env.dispatch({ type: 'inject' })
  assert.equal(env.sent.length, 0)
  tick(env)
  assert.equal(env.timers.size, 0)
  assert.deepEqual(env.sent.map(item => item.packet.id), [1234, 1235])
  env.dispatch({ type: 'response', data: 1, id: 1234 })
  env.dispatch({ type: 'error', data: 'remote failure', id: 1235 })
  await flush()
  assert.deepEqual([one, two], [{ status: 'resolved', value: 1 }, { status: 'rejected', error: 'remote failure' }])
  env.instance.destroy()
})

for (const deferred of [false, true]) {
  test(`Iframe candidate clears ${deferred ? 'deferred' : 'immediate'} send failure and preserves the exact rejection`, async () => {
    const env = setup(!deferred)
    const failure = new Error('clone failure')
    env.instance.$iframe.contentWindow.postMessage = () => {
      throw failure
    }
    const promise = env.instance.postMessage({ type: 'query' })
    const rejected = assert.rejects(promise, error => error === failure)
    if (deferred) {
      env.dispatch({ type: 'inject' })
      tick(env)
    }
    await rejected
    assert.equal(Object.keys(env.instance.promises).length, 0)
    assert.equal(env.timers.size, 0)
    env.instance.destroy()
  })
}

test('Iframe candidate rejects after destroy without allocating a request or timer', async () => {
  const env = setup(false)
  env.instance.destroy()
  await assert.rejects(env.instance.postMessage({ type: 'late' }), /The instance has been destroyed/)
  assert.equal(env.timers.size, 0)
  assert.equal(env.sent.length, 0)
  assert.equal(Object.keys(env.instance.promises).length, 0)
})

test('Iframe candidate permits public resove/reject callbacks and releases their owned requests', async () => {
  const env = setup()
  const first = env.instance.postMessage({ type: 'one' })
  env.instance.promises[1234].resove(5)
  assert.equal(await first, 5)
  assert.equal(Object.keys(env.instance.promises).length, 0)
  const second = env.instance.postMessage({ type: 'two' })
  const rejected = assert.rejects(second, /external rejection/)
  env.instance.promises[env.sent.at(-1).packet.id].reject(new Error('external rejection'))
  await rejected
  assert.equal(Object.keys(env.instance.promises).length, 0)
  env.instance.destroy()
})

test('Iframe candidate cancels owned promises even when public records were removed by a consumer', async () => {
  const env = setup()
  const state = observe(env.instance.postMessage({ type: 'one' }))
  delete env.instance.promises[1234]
  env.instance.destroy()
  await flush()
  assert.deepEqual(state, { status: 'rejected', error: 'The instance has been destroyed' })
})

test('Iframe candidate ignores inherited request keys without changing generic message callbacks', () => {
  const env = setup()
  const seen = []
  env.instance.message(packet => seen.push(packet.type))
  assert.doesNotThrow(() => env.dispatch({ type: 'custom', id: 'toString' }))
  assert.deepEqual(seen, ['custom'])
  env.instance.promises[7] = undefined
  assert.doesNotThrow(() => env.dispatch({ type: 'empty', id: 7 }))
  assert.deepEqual(seen, ['custom', 'empty'])
  env.instance.destroy()
})

test('Iframe candidate preserves commit serialization, synchronous response and async resolver behavior', async () => {
  const parent = setup()
  const promise = parent.instance.commit(() => {
    return 7
  })
  const packet = parent.sent[0].packet
  assert.equal(packet.data.trim(), 'return 7')
  const child = iframeEnvironment(implementation, true)
  const handling = child.Factory.onMessage({ data: packet })
  assert.equal(child.sent[0].packet.data, 7)
  await handling
  parent.dispatch(child.sent[0].packet)
  assert.equal(await promise, 7)
  const async = child.Factory.onMessage({ data: { type: 'commit', data: 'resolve(8)', id: 18 } })
  assert.equal(child.sent.length, 1)
  await async
  assert.equal(child.sent[1].packet.data, 8)
  parent.instance.destroy()
})

test('Iframe candidate preserves child errors, injection repetition and argument validation', async () => {
  const parent = setup()
  assert.throws(() => new parent.Factory({ iframe: {}, url: '/' }), /needs to be a HTMLIFrameElement/)
  assert.throws(() => parent.instance.commit(null), /needs to be a function/)
  assert.throws(() => parent.instance.message(null), /needs to be a function/)
  assert.throws(() => parent.Factory.inject(), /can only be used in iframe/)
  const child = iframeEnvironment(implementation, true)
  child.Factory.inject()
  child.Factory.inject()
  assert.equal(child.handlers.get('message').size, 1)
  assert.deepEqual(child.sent.map(item => item.packet.id), [0, 0])
  await assert.rejects(child.Factory.onMessage({ data: { type: 'commit', data: 'throw new Error("child failure")', id: 19 } }), /child failure/)
  assert.equal(child.sent.at(-1).packet.type, 'error')
  assert.equal(child.sent.at(-1).packet.data, 'child failure')
  parent.instance.destroy()
})
