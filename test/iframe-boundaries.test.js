import assert from 'node:assert/strict'
// eslint-disable-next-line test/no-import-node-test -- Real source compiled into an isolated window for ownership and protocol boundaries.
import test from 'node:test'
import { iframeCandidate, iframeEnvironment } from './helpers/iframe.js'

const implementation = await iframeCandidate()
const flush = () => new Promise(resolve => setImmediate(resolve))
function setup() {
  const env = iframeEnvironment(implementation)
  const frame = new env.Frame()
  const instance = new env.Factory({ iframe: frame, url: '/first' })
  return { ...env, frame, instance }
}
function observe(promise) {
  const state = { status: 'pending' }
  promise.then(value => Object.assign(state, { status: 'resolved', value }), error => Object.assign(state, { status: 'rejected', error: error.message }))
  return state
}

test('Iframe source setter failure releases its bound listener and preserves the exact setup error', () => {
  const env = iframeEnvironment(implementation)
  const frame = new env.Frame()
  const failure = new Error('src assignment rejected')
  Object.defineProperty(frame, 'src', {
    get() { return '/' },
    set() {
      throw failure
    },
  })
  assert.throws(() => new env.Factory({ iframe: frame, url: '/' }), error => error === failure)
  assert.equal(env.handlers.get('message').size, 0)
  assert.equal(env.timers.size, 0)
})

test('Iframe partial listener acquisition failure releases ownership and keeps the first error', () => {
  const env = iframeEnvironment(implementation)
  const add = env.box.addEventListener
  const failure = new Error('registration rejected after acquiring')
  env.box.addEventListener = (...args) => {
    add(...args)
    throw failure
  }
  assert.throws(() => new env.Factory({ iframe: new env.Frame(), url: '/' }), error => error === failure)
  assert.equal(env.handlers.get('message').size, 0)
  assert.equal(env.order.includes('src'), false)
})

test('Iframe setup keeps the source error when releasing a partially constructed instance also throws', () => {
  const env = iframeEnvironment(implementation)
  const frame = new env.Frame()
  const failure = new Error('original source error')
  Object.defineProperty(frame, 'src', {
    get() { return '/' },
    set() {
      throw failure
    },
  })
  const remove = env.box.removeEventListener
  let removals = 0
  env.box.removeEventListener = (...args) => {
    removals++
    remove(...args)
    throw new Error('secondary release error')
  }
  assert.throws(() => new env.Factory({ iframe: frame, url: '/' }), error => error === failure)
  assert.equal(removals, 1)
  assert.equal(env.handlers.get('message').size, 0)
})

test('Iframe destroy cancels requests even if listener release throws and does not repeat release', async () => {
  const env = setup()
  const state = observe(env.instance.postMessage({ type: 'waiting' }))
  const failure = new Error('listener release failure')
  const remove = env.box.removeEventListener
  let removals = 0
  env.box.removeEventListener = (...args) => {
    removals++
    remove(...args)
    throw failure
  }
  assert.throws(() => env.instance.destroy(), error => error === failure)
  await flush()
  assert.deepEqual(state, { status: 'rejected', error: 'The instance has been destroyed' })
  assert.equal(env.timers.size, 0)
  assert.equal(env.handlers.get('message').size, 0)
  assert.doesNotThrow(() => env.instance.destroy())
  assert.equal(removals, 1)
})

for (const injected of [false, true]) {
  test(`Iframe failed construction cancels a reentrant ${injected ? 'sent' : 'waiting'} request`, async () => {
    const env = iframeEnvironment(implementation)
    const frame = new env.Frame()
    const failure = new Error('source setter failed after reentry')
    const receive = env.Factory.prototype.onMessage
    let state
    let partial
    env.Factory.prototype.onMessage = function (event) {
      partial = this
      receive.call(this, event)
      state = observe(this.postMessage({ type: 'query' }))
    }
    Object.defineProperty(frame, 'src', {
      get() { return '/' },
      set() {
        env.dispatch({ type: injected ? 'inject' : 'custom' }, frame.contentWindow)
        throw failure
      },
    })
    assert.throws(() => new env.Factory({ iframe: frame, url: '/' }), error => error === failure)
    await flush()
    assert.deepEqual(state, { status: 'rejected', error: 'The instance has been destroyed' })
    assert.equal(partial.destroyed, true)
    assert.equal(env.timers.size, 0)
    assert.equal(Object.keys(partial.promises).length, 0)
    assert.equal(env.handlers.get('message').size, 0)
  })
}

test('Iframe parent rejects foreign handshakes, responses and callbacks but accepts its selected cross-origin peer', async () => {
  const env = setup()
  const seen = []
  env.instance.message(packet => seen.push(packet.type))
  env.dispatch({ type: 'inject' }, {})
  assert.equal(env.instance.injected, false)
  assert.deepEqual(seen, [])
  env.dispatch({ type: 'inject' }, env.frame.contentWindow, 'https://redirected.example')
  const state = observe(env.instance.postMessage({ type: 'query' }))
  env.dispatch({ type: 'custom-result', data: 'forged', id: 1234 }, {})
  await flush()
  assert.deepEqual(state, { status: 'pending' })
  assert.deepEqual(seen, ['inject'])
  env.dispatch({ type: 'custom-result', data: 'real', id: 1234 }, env.frame.contentWindow, 'null')
  await flush()
  assert.deepEqual(state, { status: 'resolved', value: 'real' })
  assert.deepEqual(seen, ['inject', 'custom-result'])
  env.instance.destroy()
})

test('Iframe child rejects a foreign executable command and accepts only its actual parent peer', async () => {
  const env = iframeEnvironment(implementation, true)
  env.box.executions = 0
  const data = { type: 'commit', data: 'window.executions++; return 7', id: 17 }
  await env.Factory.onMessage({ data, source: {}, origin: 'https://sibling.example' })
  assert.equal(env.box.executions, 0)
  assert.equal(env.sent.length, 0)
  await env.Factory.onMessage({ data, source: env.box.parent, origin: 'https://parent.example' })
  assert.equal(env.box.executions, 1)
  assert.equal(env.sent[0].packet.data, 7)
})

for (const data of [null, undefined, false, 3, 'message', {}, { type: null }, { type: 3 }]) {
  test(`Iframe receivers ignore malformed payload ${JSON.stringify(data)} without callbacks or child rejection`, async () => {
    const env = setup()
    let calls = 0
    env.instance.message(() => calls++)
    assert.doesNotThrow(() => env.dispatch(data, env.frame.contentWindow))
    assert.equal(calls, 0)
    assert.equal(env.instance.injected, false)
    const child = iframeEnvironment(implementation, true)
    await assert.doesNotReject(child.Factory.onMessage({ data, source: child.box.parent }))
    assert.equal(child.sent.length, 0)
    env.instance.destroy()
  })
}

test('Iframe public receivers keep source-less and null-source direct invocation as a local API', async () => {
  const env = setup()
  env.instance.onMessage({ data: { type: 'inject' } })
  const promise = env.instance.postMessage({ type: 'query' })
  env.instance.onMessage({ data: { type: 'custom', data: 9, id: 1234 }, source: null })
  assert.equal(await promise, 9)
  const child = iframeEnvironment(implementation, true)
  await child.Factory.onMessage({ data: { type: 'commit', data: 'return 8', id: 9 }, source: null })
  assert.equal(child.sent[0].packet.data, 8)
  env.instance.destroy()
})

test('Iframe trusted protocol retains generic message types and child commit error serialization', async () => {
  const env = setup()
  const seen = []
  env.instance.message(packet => seen.push({ ...packet }))
  env.dispatch({ type: '', data: 'custom empty type' }, env.frame.contentWindow)
  assert.deepEqual(seen, [{ type: '', data: 'custom empty type' }])
  const child = iframeEnvironment(implementation, true)
  await assert.rejects(child.Factory.onMessage({ data: { type: 'commit', data: 3, id: 7 }, source: child.box.parent }), error => error.name === 'TypeError')
  assert.equal(child.sent[0].packet.type, 'error')
  assert.equal(child.sent[0].packet.id, 7)
  env.instance.destroy()
})
