import assert from 'node:assert/strict'
// eslint-disable-next-line test/no-import-node-test -- Controlled document markers and owned MutationObserver callbacks.
import test from 'node:test'
import { iframeCandidate, iframeEnvironment } from './helpers/iframe.js'

const implementation = await iframeCandidate()
const flush = () => new Promise(resolve => setImmediate(resolve))
const control = 'artplayer-tool-iframe:session'
function marked(type, document, phase, data, id = 0) {
  return { type, data, id, __artplayerIframe: { version: 1, document, phase } }
}
function observe(promise) {
  const state = { status: 'pending' }
  promise.then(value => Object.assign(state, { status: 'resolved', value }), error => Object.assign(state, { status: 'rejected', error: error.message }))
  return state
}
function setup() {
  const env = iframeEnvironment(implementation)
  const observers = []
  env.box.MutationObserver = class {
    records = []
    disconnected = false
    constructor(callback) {
      this.callback = callback
      observers.push(this)
    }

    observe(target, options) {
      this.target = target
      this.options = options
    }

    takeRecords() { return this.records.splice(0) }
    disconnect() {
      this.disconnected = true
      this.records = []
    }
  }
  const frame = new env.Frame()
  frame.hasAttribute = () => false
  frame.getAttribute = name => name === 'src' ? frame.src : null
  const instance = new env.Factory({ iframe: frame, url: '/first' })
  const inject = (document = 'first') => env.dispatch(marked('inject', document, 'inject'), frame.contentWindow)
  const navigate = (value) => {
    const oldValue = frame.src
    frame.src = value
    assert(observers[0], 'a navigation observer must own native attribute changes')
    observers[0].records.push({ attributeName: 'src', oldValue })
  }
  const tick = () => {
    for (const [id, timer] of [...env.timers]) {
      env.timers.delete(id)
      timer.callback()
    }
  }
  return { ...env, instance, frame, observers, inject, navigate, tick }
}

test('Iframe document handshake keeps public callback data while acknowledging the peer privately', () => {
  const env = setup()
  const seen = []
  env.instance.message(packet => seen.push({ ...packet }))
  env.inject()
  assert.equal(env.instance.injected, true)
  assert.deepEqual(seen, [{ type: 'inject', data: undefined }])
  assert.equal(env.sent[0].packet.type, control)
  assert.deepEqual(JSON.parse(JSON.stringify(env.sent[0].packet.__artplayerIframe)), { version: 1, document: 'first', phase: 'ack' })
  assert.deepEqual(Object.keys(env.instance), ['url', '$iframe', 'promises', 'injected', 'destroyed', 'messageCallback', 'onMessage'])
  env.instance.destroy()
})

test('Iframe requests and replies remain associated with their active document', async () => {
  const env = setup()
  env.inject()
  const state = observe(env.instance.postMessage({ type: 'query' }))
  const request = env.sent.at(-1).packet
  assert.equal(request.__artplayerIframe.document, 'first')
  env.dispatch(marked('response', 'wrong', 'message', 'wrong reply', request.id), env.frame.contentWindow)
  await flush()
  assert.equal(state.status, 'pending')
  env.dispatch(marked('custom', 'first', 'message', 7, request.id), env.frame.contentWindow)
  await flush()
  assert.deepEqual(state, { status: 'resolved', value: 7 })
  env.instance.destroy()
})

test('Iframe a different document handshake cancels old requests and drops old notifications', async () => {
  const env = setup()
  env.inject()
  const state = observe(env.instance.postMessage({ type: 'query' }))
  const id = env.sent.at(-1).packet.id
  const messages = []
  env.instance.message(packet => messages.push(packet.type))
  env.inject('second')
  env.dispatch(marked('response', 'first', 'message', 'late', id), env.frame.contentWindow)
  env.dispatch(marked('custom-old', 'first', 'message', 'late'), env.frame.contentWindow)
  await flush()
  assert.deepEqual(state, { status: 'rejected', error: 'The iframe document has changed' })
  assert.deepEqual(messages, ['inject'])
  assert.equal(Object.keys(env.instance.promises).length, 0)
  env.instance.destroy()
})

test('Iframe repeated injection from the same document preserves its pending requests', async () => {
  const env = setup()
  env.inject()
  const state = observe(env.instance.postMessage({ type: 'query' }))
  const id = env.sent.at(-1).packet.id
  env.inject()
  env.dispatch(marked('response', 'first', 'message', 8, id), env.frame.contentWindow)
  await flush()
  assert.deepEqual(state, { status: 'resolved', value: 8 })
  env.instance.destroy()
})

test('Iframe synchronous post after src change cancels old work and queues for the new injection', async () => {
  const env = setup()
  env.inject()
  const first = observe(env.instance.postMessage({ type: 'query' }))
  env.navigate('/second')
  const second = observe(env.instance.postMessage({ type: 'query' }))
  env.dispatch(marked(control, 'first', 'leave'), env.frame.contentWindow)
  await flush()
  assert.deepEqual(first, { status: 'rejected', error: 'The iframe document has changed' })
  assert.equal(second.status, 'pending')
  assert.equal(env.instance.injected, false)
  assert.equal(env.observers[0].records.length, 0)
  assert.equal(env.sent.filter(item => item.packet.type === 'query').length, 1)
  env.inject('second')
  env.tick()
  const request = env.sent.at(-1).packet
  assert.equal(request.__artplayerIframe.document, 'second')
  env.dispatch(marked('response', 'second', 'message', 9, request.id), env.frame.contentWindow)
  await flush()
  assert.deepEqual(second, { status: 'resolved', value: 9 })
  assert.equal(env.instance.url, '/first')
  env.instance.destroy()
})

test('Iframe old pagehide and repeated old inject cannot cancel or activate a newly queued navigation', async () => {
  const env = setup()
  env.inject()
  env.navigate('/second')
  const state = observe(env.instance.postMessage({ type: 'query' }))
  env.inject('first')
  env.dispatch(marked(control, 'first', 'leave'), env.frame.contentWindow)
  env.dispatch(marked(control, 'first', 'leave'), env.frame.contentWindow)
  await flush()
  assert.equal(state.status, 'pending')
  assert.equal(env.instance.injected, false)
  env.inject('second')
  env.tick()
  const request = env.sent.at(-1).packet
  env.dispatch(marked('response', 'second', 'message', 10, request.id), env.frame.contentWindow)
  await flush()
  assert.deepEqual(state, { status: 'resolved', value: 10 })
  env.instance.destroy()
})

test('Iframe native attribute observation suspends sends and confirmed departure cancels old work', async () => {
  const env = setup()
  env.inject()
  const state = observe(env.instance.postMessage({ type: 'query' }))
  env.navigate('/second')
  const observer = env.observers[0]
  observer.callback(observer.takeRecords())
  await flush()
  assert.equal(state.status, 'pending')
  assert.equal(env.instance.injected, false)
  env.dispatch(marked(control, 'first', 'leave'), env.frame.contentWindow)
  await flush()
  assert.deepEqual(state, { status: 'rejected', error: 'The iframe document has changed' })
  assert.equal(env.instance.injected, false)
  env.instance.destroy()
  assert.equal(observer.disconnected, true)
  observer.callback([{ attributeName: 'src', oldValue: '/second' }])
  assert.equal(env.timers.size, 0)
})

test('Iframe consecutive source mutations preserve requests queued after navigation started', async () => {
  for (const departed of [false, true]) {
    const env = setup()
    env.inject()
    const old = observe(env.instance.postMessage({ type: 'query' }))
    env.navigate('/second')
    const queued = observe(env.instance.postMessage({ type: 'query' }))
    if (departed)
      env.dispatch(marked(control, 'first', 'leave'), env.frame.contentWindow)
    env.navigate('/third')
    env.observers[0].callback(env.observers[0].takeRecords())
    env.dispatch(marked(control, 'first', 'leave'), env.frame.contentWindow)
    await flush()
    assert.equal(old.error, 'The iframe document has changed')
    assert.equal(queued.status, 'pending')
    env.inject('third')
    env.tick()
    const request = env.sent.at(-1).packet
    env.dispatch(marked('response', 'third', 'message', 13, request.id), env.frame.contentWindow)
    await flush()
    assert.deepEqual(queued, { status: 'resolved', value: 13 })
    env.instance.destroy()
  }
})

test('Iframe confirmed fragment navigation preserves requests; a same-source document departure cancels them', async () => {
  const env = setup()
  env.inject()
  const state = observe(env.instance.postMessage({ type: 'query' }))
  env.navigate('/first#chapter')
  const observer = env.observers[0]
  observer.callback(observer.takeRecords())
  env.dispatch(marked(control, 'first', 'fragment', '/first#chapter'), env.frame.contentWindow)
  await flush()
  assert.equal(state.status, 'pending')
  assert.equal(env.instance.injected, true)
  env.navigate('/first#chapter')
  observer.callback(observer.takeRecords())
  env.dispatch(marked(control, 'first', 'leave'), env.frame.contentWindow)
  await flush()
  assert.deepEqual(state, { status: 'rejected', error: 'The iframe document has changed' })
  env.instance.destroy()
})

test('Iframe pagehide cancels current work; a restored document can resume after another document', async () => {
  const env = setup()
  env.inject()
  const first = observe(env.instance.postMessage({ type: 'query' }))
  env.dispatch(marked(control, 'first', 'leave'), env.frame.contentWindow)
  await flush()
  assert.equal(first.error, 'The iframe document has changed')
  env.inject('second')
  const second = observe(env.instance.postMessage({ type: 'query' }))
  env.dispatch(marked(control, 'first', 'resume'), env.frame.contentWindow)
  await flush()
  assert.equal(second.error, 'The iframe document has changed')
  const restored = observe(env.instance.postMessage({ type: 'query' }))
  assert.equal(env.sent.at(-1).packet.__artplayerIframe.document, 'first')
  env.instance.destroy()
  await flush()
  assert.equal(restored.error, 'The instance has been destroyed')
})

test('Iframe legacy peer remains unmarked and source replacement still waits for its ordinary injection', async () => {
  const env = setup()
  env.dispatch({ type: 'inject' }, env.frame.contentWindow)
  const first = observe(env.instance.postMessage({ type: 'query' }))
  assert.deepEqual(Object.keys(env.sent.at(-1).packet), ['type', 'data', 'id'])
  env.navigate('/second')
  const second = observe(env.instance.postMessage({ type: 'query' }))
  env.dispatch({ type: 'inject' }, env.frame.contentWindow)
  env.tick()
  const request = env.sent.at(-1).packet
  assert.deepEqual(Object.keys(request), ['type', 'data', 'id'])
  env.dispatch({ type: 'response', data: 11, id: request.id }, env.frame.contentWindow)
  await flush()
  assert.equal(first.error, 'The iframe document has changed')
  assert.deepEqual(second, { status: 'resolved', value: 11 })
  env.instance.destroy()
})

test('Iframe child advertises a document without changing ordinary messages to an unmodified parent', () => {
  const env = iframeEnvironment(implementation, true)
  env.Factory.inject()
  const injection = env.sent[0].packet
  assert.equal(injection.type, 'inject')
  assert.equal(injection.id, 0)
  assert.equal(injection.data, undefined)
  assert.equal(injection.__artplayerIframe.version, 1)
  assert.equal(typeof injection.__artplayerIframe.document, 'string')
  env.Factory.postMessage({ type: 'custom', data: 1 })
  assert.deepEqual(Object.keys(env.sent.at(-1).packet), ['type', 'data', 'id'])
  for (const callback of env.handlers.get('pagehide') || []) callback({})
  assert.equal(env.sent.length, 2)
})

test('Iframe child tags acknowledged responses, ignores stale-document commands and hides lifecycle from legacy parents', async () => {
  const env = iframeEnvironment(implementation, true)
  env.Factory.inject()
  const document = env.sent[0].packet.__artplayerIframe.document
  await env.Factory.onMessage({ data: marked(control, document, 'ack'), source: env.box.parent })
  await env.Factory.onMessage({ data: marked('commit', 'old-document', 'message', 'return 7', 7), source: env.box.parent })
  assert.equal(env.sent.length, 1)
  await env.Factory.onMessage({ data: marked('commit', document, 'message', 'return 8', 8), source: env.box.parent })
  assert.equal(env.sent.at(-1).packet.data, 8)
  assert.equal(env.sent.at(-1).packet.__artplayerIframe.document, document)
  env.Factory.inject()
  assert.equal(env.handlers.get('pagehide').size, 1)
  assert.equal(env.handlers.get('pageshow').size, 1)
  for (const callback of env.handlers.get('pagehide')) callback({})
  assert.equal(env.sent.at(-1).packet.__artplayerIframe.phase, 'leave')
  for (const callback of env.handlers.get('pageshow')) callback({ persisted: true })
  assert.equal(env.sent.at(-1).packet.__artplayerIframe.phase, 'resume')
})

test('Iframe failed child listener acquisition releases partial registrations and can be retried', () => {
  const env = iframeEnvironment(implementation, true)
  const add = env.box.addEventListener
  const failure = new Error('pageshow listener failure')
  env.box.addEventListener = (name, callback) => {
    add(name, callback)
    if (name === 'pageshow')
      throw failure
  }
  assert.throws(() => env.Factory.inject(), error => error === failure)
  for (const name of ['message', 'pagehide', 'pageshow']) assert.equal(env.handlers.get(name).size, 0)
  env.box.addEventListener = add
  env.Factory.inject()
  for (const name of ['message', 'pagehide', 'pageshow']) assert.equal(env.handlers.get(name).size, 1)
})

test('Iframe internal cancellation retains ownership when a consumer replaces public reject', async () => {
  const env = setup()
  env.inject()
  const state = observe(env.instance.postMessage({ type: 'query' }))
  const id = env.sent.at(-1).packet.id
  let calls = 0
  env.instance.promises[id].reject = () => calls++
  env.dispatch(marked('error', 'first', 'message', 'remote error', id), env.frame.contentWindow)
  await flush()
  assert.equal(calls, 1)
  assert.equal(state.status, 'pending')
  env.instance.destroy()
  await flush()
  assert.deepEqual(state, { status: 'rejected', error: 'The instance has been destroyed' })
  assert.equal(calls, 1)
  assert.equal(Object.keys(env.instance.promises).length, 0)
})

test('Iframe a changed src getter resolution without an attribute mutation does not invent a navigation', async () => {
  const env = setup()
  env.inject()
  env.frame.getAttribute = name => name === 'src' ? '/first' : null
  Object.defineProperty(env.frame, 'src', { value: 'https://new-base.example/first' })
  const state = observe(env.instance.postMessage({ type: 'query' }))
  assert.equal(env.instance.injected, true)
  assert.equal(env.sent.at(-1).packet.type, 'query')
  env.dispatch(marked('response', 'first', 'message', 13, env.sent.at(-1).packet.id), env.frame.contentWindow)
  await flush()
  assert.deepEqual(state, { status: 'resolved', value: 13 })
  env.instance.destroy()
})
