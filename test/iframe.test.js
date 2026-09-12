import assert from 'node:assert/strict'
// eslint-disable-next-line test/no-import-node-test -- Repository Node runner.
import test from 'node:test'
import { iframeEnvironment, iframeHistorical } from './helpers/iframe.js'

const implementations = (await iframeHistorical()).filter(item => item.global !== 'ArtplayerHelperIframe')
const flush = () => new Promise(resolve => setImmediate(resolve))
function observe(promise) {
  const state = { status: 'pending' }
  promise.then(value => Object.assign(state, { status: 'resolved', value }), error => Object.assign(state, { status: 'rejected', error: error.message }))
  return state
}
function setup(implementation, injected = true) {
  const env = iframeEnvironment(implementation)
  const instance = new env.Factory({ iframe: new env.Frame(), url: '/first' })
  if (injected)
    env.dispatch({ type: 'inject' })
  return { ...env, instance }
}

for (const implementation of implementations) {
  test(`Iframe ${implementation.name}: same-millisecond requests overwrite a pending callback`, async () => {
    const env = setup(implementation)
    const first = observe(env.instance.postMessage({ type: 'one', data: 1 }))
    const second = observe(env.instance.postMessage({ type: 'two', data: 2 }))
    assert.deepEqual(env.sent.map(item => item.packet.id), [1234, 1234])
    assert.equal(Object.keys(env.instance.promises).length, 1)
    env.dispatch({ type: 'response', data: 'first response', id: 1234 })
    await flush()
    assert.deepEqual(first, { status: 'pending' })
    assert.deepEqual(second, { status: 'resolved', value: 'first response' })
    env.instance.destroy()
  })

  test(`Iframe ${implementation.name}: destroy retains already-sent pending requests`, async () => {
    const env = setup(implementation)
    const state = observe(env.instance.postMessage({ type: 'one', data: 1 }))
    env.instance.destroy()
    await flush()
    assert.equal(state.status, 'pending')
    assert.deepEqual(Object.keys(env.instance.promises), ['1234'])
    assert.equal(env.handlers.get('message').size, 0)
  })

  test(`Iframe ${implementation.name}: destroy leaves injection polling until the old timer runs`, async () => {
    const env = setup(implementation, false)
    const state = observe(env.instance.postMessage({ type: 'one', data: 1 }))
    assert.equal(env.timers.size, 1)
    env.instance.destroy()
    await flush()
    assert.equal(state.status, 'pending')
    const [id, timer] = [...env.timers][0]
    assert.equal(timer.delay, 200)
    env.timers.delete(id)
    timer.callback()
    await flush()
    assert.deepEqual(state, { status: 'rejected', error: 'The instance has been destroyed' })
    assert.equal(env.timers.size, 0)
    assert.equal(env.sent.length, 0)
  })

  test(`Iframe ${implementation.name}: requests started after destroy reject without a timer`, async () => {
    const env = setup(implementation)
    env.instance.destroy()
    await assert.rejects(env.instance.postMessage({ type: 'late' }), /The instance has been destroyed/)
    assert.equal(env.timers.size, 0)
    assert.equal(env.sent.length, 0)
  })

  test(`Iframe ${implementation.name}: distinct IDs settle out of order and errors retain their message`, async () => {
    const env = setup(implementation)
    const first = observe(env.instance.postMessage({ type: 'one' }))
    env.now(1235)
    const second = observe(env.instance.postMessage({ type: 'two' }))
    env.dispatch({ type: 'error', data: 'remote failure', id: 1235 })
    env.dispatch({ type: 'response', data: 7, id: 1234 })
    await flush()
    assert.deepEqual(first, { status: 'resolved', value: 7 })
    assert.deepEqual(second, { status: 'rejected', error: 'remote failure' })
    assert.equal(Object.keys(env.instance.promises).length, 0)
    env.instance.destroy()
  })

  test(`Iframe ${implementation.name}: custom non-error response types remain part of the generic protocol`, async () => {
    const env = setup(implementation)
    const result = env.instance.postMessage({ type: 'custom-query' })
    env.dispatch({ type: 'custom-result', data: { ok: true }, id: 1234 })
    assert.deepEqual(await result, { ok: true })
    env.instance.destroy()
  })

  test(`Iframe ${implementation.name}: malformed message data throws from the public receiver`, () => {
    const env = setup(implementation)
    assert.throws(() => env.dispatch(null), error => error.name === 'TypeError')
    env.instance.destroy()
  })

  test(`Iframe ${implementation.name}: immediate send failure rejects but leaves its public record`, async () => {
    const env = setup(implementation)
    env.instance.$iframe.contentWindow.postMessage = () => {
      throw new Error('clone failure')
    }
    await assert.rejects(env.instance.postMessage({ type: 'one' }), /clone failure/)
    assert.deepEqual(Object.keys(env.instance.promises), ['1234'])
    env.instance.destroy()
  })

  test(`Iframe ${implementation.name}: send failure after polling escapes while its promise stays pending`, async () => {
    const env = setup(implementation, false)
    const state = observe(env.instance.postMessage({ type: 'one' }))
    env.dispatch({ type: 'inject' })
    env.instance.$iframe.contentWindow.postMessage = () => {
      throw new Error('late clone failure')
    }
    const [id, timer] = [...env.timers][0]
    env.timers.delete(id)
    assert.throws(() => timer.callback(), /late clone failure/)
    await flush()
    assert.equal(state.status, 'pending')
    assert.deepEqual(Object.keys(env.instance.promises), ['1234'])
    env.instance.destroy()
  })

  test(`Iframe ${implementation.name}: saved message receiver can still settle and notify after destroy`, async () => {
    const env = setup(implementation)
    const state = observe(env.instance.postMessage({ type: 'one' }))
    const callback = env.instance.onMessage
    let calls = 0
    env.instance.message(() => calls++)
    env.instance.destroy()
    callback({ data: { type: 'response', data: 'late', id: 1234 } })
    await flush()
    assert.deepEqual(state, { status: 'resolved', value: 'late' })
    assert.equal(calls, 1)
  })

  test(`Iframe ${implementation.name}: navigation retains the previous injected state`, () => {
    const env = setup(implementation)
    env.instance.$iframe.src = '/second'
    observe(env.instance.postMessage({ type: 'before-second-inject' }))
    assert.equal(env.instance.injected, true)
    assert.equal(env.sent.length, 1)
    assert.equal(env.timers.size, 0)
    assert.equal(env.instance.url, '/first')
    env.instance.destroy()
  })

  test(`Iframe ${implementation.name}: repeated child inject repeats handshake but deduplicates its DOM listener`, () => {
    const env = iframeEnvironment(implementation, true)
    env.Factory.inject()
    env.Factory.inject()
    assert.deepEqual(env.sent.map(item => item.packet.type), ['inject', 'inject'])
    assert.equal(env.handlers.get('message').size, 1)
  })

  test(`Iframe ${implementation.name}: child errors send a packet then reject and later commands still run`, async () => {
    const env = iframeEnvironment(implementation, true)
    await assert.rejects(env.Factory.onMessage({ data: { type: 'commit', data: 'throw new Error("child failure")', id: 1 } }), /child failure/)
    await env.Factory.onMessage({ data: { type: 'commit', data: 'return 9', id: 2 } })
    assert.deepEqual(JSON.parse(JSON.stringify(env.sent)), [{ packet: { type: 'error', data: 'child failure', id: 1 }, origin: '*' }, { packet: { type: 'response', data: 9, id: 2 }, origin: '*' }])
  })
}
