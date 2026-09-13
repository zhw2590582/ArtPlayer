import assert from 'node:assert/strict'
// eslint-disable-next-line test/no-import-node-test -- Vendor lifecycle regressions use the repository runner.
import test from 'node:test'
import { jassubCandidate, jassubEnvironment } from './helpers/jassub.js'

const candidate = await jassubCandidate()

function environment() {
  // Expose platform controls only; every tested method is the actual bundled vendor.
  const code = `${candidate.code}\nObject.defineProperty(module.exports.default || module.exports, '__lifecyclePlatform', { value: { Error, ErrorEvent, Video: HTMLVideoElement, setGlobal: (name, value) => { globalThis[name] = value } } });`
  const env = jassubEnvironment({ ...candidate, code })
  env.platform = env.factory.__lifecyclePlatform
  return env
}

function trackListeners(target) {
  const listeners = new Map()
  const add = target.addEventListener
  const remove = target.removeEventListener
  target.addEventListener = function (type, callback, ...options) {
    if (!listeners.has(type))
      listeners.set(type, new Set())
    listeners.get(type).add(callback)
    return add?.call(this, type, callback, ...options)
  }
  target.removeEventListener = function (type, callback, ...options) {
    listeners.get(type)?.delete(callback)
    return remove?.call(this, type, callback, ...options)
  }
  return {
    size: () => [...listeners.values()].reduce((sum, entries) => sum + entries.size, 0),
    callbacks: type => [...listeners.get(type) || []],
    emit(type, event) {
      for (const callback of [...listeners.get(type) || []]) callback(event)
    },
  }
}

function frames(env) {
  const pending = new Map()
  let next = 0
  env.platform.Video.prototype.requestVideoFrameCallback = function (callback) {
    pending.set(++next, { video: this, callback })
    return next
  }
  env.platform.Video.prototype.cancelVideoFrameCallback = id => pending.delete(id)
  return {
    count: video => [...pending.values()].filter(row => row.video === video).length,
    take(video) {
      const entry = [...pending].find(([, row]) => row.video === video)
      assert(entry, 'take an actually queued native frame callback')
      pending.delete(entry[0])
      return entry[1].callback
    },
  }
}

async function queryEnvironment() {
  const env = environment()
  const timers = new Map()
  const errors = []
  let next = 0
  env.platform.setGlobal('setTimeout', (callback) => {
    timers.set(++next, callback)
    return next
  })
  env.platform.setGlobal('clearTimeout', id => timers.delete(id))
  // Capture the actual Error allocated by the timeout, without intercepting vendor methods.
  env.platform.setGlobal('Error', class extends env.platform.Error {
    constructor(...args) {
      super(...args)
      errors.push(this)
    }
  })
  const { instance } = env.factory()(env.art)
  await env.ready()
  const worker = env.workers[0]
  const listeners = trackListeners(worker)
  return {
    ...env,
    instance,
    worker,
    timers,
    errors,
    requests: listeners,
    timeout() {
      const entry = timers.entries().next().value
      assert(entry, 'fire an actually registered one-shot timeout')
      timers.delete(entry[0])
      entry[1]()
    },
  }
}

test('JASSUB repeated direct destroy returns synchronously and terminates once', async () => {
  const env = environment()
  const listeners = trackListeners(env.art.video)
  const { instance } = env.factory()(env.art)
  await env.ready()
  assert(listeners.size() > 0)
  assert.equal(instance.destroy(), undefined)
  assert.equal(instance.destroy(), undefined)
  env.emit('destroy')
  await env.flush()
  assert.equal(env.workers[0].terminated, 1)
  assert.equal(listeners.size(), 0)
  assert.deepEqual(env.parent.children, [env.art.video])
})

test('JASSUB destroy after ready cancels queued resize and track messages and settles sendMessage', async () => {
  const env = environment()
  const { instance } = env.factory()(env.art)
  await env.ready()
  const worker = env.workers[0]
  const sent = worker.messages.length
  assert.equal(instance.resize(640, 360, 4, 5, false), undefined)
  assert.equal(instance.setTrack('[Script Info]'), undefined)
  const pending = instance.sendMessage('queued-before-destroy')
  assert.equal(instance.destroy(), undefined)
  assert.equal(await pending, undefined)
  await env.flush()
  assert.equal(worker.messages.length, sent)
  assert.equal(worker.terminated, 1)
})

test('JASSUB setVideo across parents destroys the actual owned container', async () => {
  const env = environment()
  const originalListeners = trackListeners(env.art.video)
  const { instance } = env.factory()(env.art)
  await env.ready()
  const parent = new env.parent.constructor()
  const video = parent.appendChild(new env.platform.Video())
  const listeners = trackListeners(video)
  instance.setVideo(video)
  assert.equal(originalListeners.size(), 0)
  assert(listeners.size() > 0)
  assert.equal(instance.destroy(), undefined)
  assert.equal(listeners.size(), 0)
  assert.equal(env.workers[0].terminated, 1)
  assert.deepEqual(env.parent.children, [env.art.video])
  assert.deepEqual(parent.children, [video])
})

test('JASSUB Worker constructor SecurityError rolls back DOM and video listeners without replacing the error', async () => {
  const env = environment()
  const listeners = trackListeners(env.art.video)
  const failure = new DOMException('Controlled Worker construction failure', 'SecurityError')
  env.platform.setGlobal('Worker', class {
    constructor() { throw failure }
  })
  assert.throws(() => env.factory()(env.art), error => error === failure)
  await env.flush()
  assert.equal(listeners.size(), 0)
  assert.deepEqual(env.parent.children, [env.art.video])
  assert.equal(env.workers.length, 0)
  assert.equal(env.listeners.get('destroy')?.length || 0, 0)
})

test('JASSUB destroy before ready prevents queued initialization and application messages from posting', async () => {
  const env = environment()
  const { instance } = env.factory()(env.art)
  const worker = env.workers[0]
  const afterTermination = []
  const post = worker.postMessage
  worker.postMessage = function (message) {
    if (this.terminated)
      afterTermination.push(message.target)
    return post.call(this, message)
  }
  instance.sendMessage('queued-before-destroy')
  instance.destroy()
  await env.flush()
  // A ready event already queued by a real Worker may still be delivered after termination.
  worker.onmessage?.({ data: { target: 'ready' } })
  await env.flush()
  assert.deepEqual(afterTermination, [])
  assert.equal(worker.messages.some(message => ['init', 'queued-before-destroy'].includes(message.target)), false)
  assert.equal(worker.terminated, 1)
})

test('JASSUB stale queued video frame cannot drive or duplicate the replacement video loop', async () => {
  const env = environment()
  const clock = frames(env)
  const { instance } = env.factory()(env.art)
  await env.ready()
  const oldCallback = clock.take(env.art.video)
  const video = env.createVideo()
  video.currentTime = 9
  instance.setVideo(video)
  assert.equal(clock.count(video), 1)
  oldCallback(0, { mediaTime: 123, width: 640, height: 360 })
  await env.flush()
  assert.equal(env.workers[0].messages.some(message => message.target === 'demand' && message.time === 123), false)
  assert.equal(clock.count(video), 1)
  clock.take(video)(0, { mediaTime: 9, width: 640, height: 360 })
  await env.flush()
  assert.equal(env.workers[0].messages.filter(message => message.target === 'demand').at(-1).time, 9)
  assert.equal(clock.count(video), 1)
  instance.destroy()
  assert.equal(clock.count(video), 0)
})

test('JASSUB fallback ratechange sends the current numeric playbackRate', async () => {
  const env = environment()
  const { instance } = env.factory({ onDemandRender: false })(env.art)
  await env.ready()
  env.art.video.playbackRate = 1.75
  env.art.video.dispatchEvent(new Event('ratechange'))
  await env.flush()
  const message = env.workers[0].messages.at(-1)
  assert.equal(message.target, 'video')
  assert.equal(message.rate, 1.75)
  instance.destroy()
})

for (const method of ['getEvents', 'getStyles']) {
  for (const mode of ['success', 'timeout', 'worker-error']) {
    for (const throws of [false, true]) {
      test(`JASSUB ${method} ${mode} cleans before its single callback${throws ? ' even when that callback throws' : ''}`, async () => {
        const env = await queryEnvironment()
        const calls = []
        const cleanupAtCallback = []
        const callbackFailure = new Error('Controlled user callback failure')
        assert.equal(env.instance[method]((...args) => {
          calls.push(args)
          cleanupAtCallback.push([env.requests.size(), env.timers.size])
          if (throws)
            throw callbackFailure
        }), undefined)
        assert.equal(env.worker.messages.at(-1).target, method)
        const staleMessage = env.requests.callbacks('message')[0]
        const staleError = env.requests.callbacks('error')[0]
        const workerError = new env.platform.ErrorEvent('error', { error: new Error('Controlled Worker error') })
        const result = [{ sample: 1 }]
        const message = { data: { target: method, [method === 'getEvents' ? 'events' : 'styles']: result } }
        const complete = () => {
          if (mode === 'success')
            env.requests.emit('message', message)
          else if (mode === 'timeout')
            env.timeout()
          else
            env.requests.emit('error', workerError)
        }
        if (throws)
          assert.throws(complete, error => error === callbackFailure)
        else
          assert.doesNotThrow(complete)
        assert.equal(calls.length, 1)
        assert.deepEqual(cleanupAtCallback, [[0, 0]])
        assert.equal(calls[0][0], mode === 'success' ? null : mode === 'timeout' ? env.errors[0] : workerError)
        assert.equal(calls[0][1], mode === 'success' ? result : undefined)
        staleMessage(message)
        staleError(workerError)
        assert.equal(calls.length, 1)
        assert.equal(env.requests.size(), 0)
        assert.equal(env.timers.size, 0)
        env.instance.destroy()
      })
    }
  }
}

for (const throws of [false, true]) {
  test(`JASSUB destroy settles all pending queries after releasing resources${throws ? ' despite a throwing callback' : ''}`, async () => {
    const env = await queryEnvironment()
    const calls = []
    const callbackFailure = new Error('Controlled destroy callback failure')
    for (const method of ['getEvents', 'getStyles']) {
      env.instance[method]((error, result) => {
        calls.push({ method, error, result, listeners: env.requests.size(), timers: env.timers.size })
        if (throws && method === 'getEvents')
          throw callbackFailure
      })
    }
    const lateMessages = env.requests.callbacks('message')
    const lateErrors = env.requests.callbacks('error')
    assert(env.requests.size() > 0)
    assert.equal(env.timers.size, 2)
    if (throws)
      assert.throws(() => env.instance.destroy(), error => error === callbackFailure)
    else
      assert.equal(env.instance.destroy(), undefined)
    assert.equal(calls.length, 2)
    assert.deepEqual(calls.map(call => call.method), ['getEvents', 'getStyles'])
    for (const call of calls) {
      assert(call.error instanceof env.platform.Error)
      assert.match(call.error.message, /destroy/i)
      assert.equal(call.result, undefined)
      assert.equal(call.listeners, 0)
      assert.equal(call.timers, 0)
    }
    for (const callback of lateMessages) callback({ data: { target: 'getEvents', events: [] } })
    for (const callback of lateErrors) callback(new Error('Late Worker failure'))
    assert.equal(calls.length, 2)
    assert.equal(env.worker.terminated, 1)
    assert.equal(env.requests.size(), 0)
    assert.equal(env.timers.size, 0)
    assert.deepEqual(env.parent.children, [env.art.video])
    assert.equal(env.instance.destroy(), undefined)
    assert.equal(env.worker.terminated, 1)
  })
}
