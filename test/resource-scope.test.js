import assert from 'node:assert/strict'
// eslint-disable-next-line test/no-import-node-test -- Control timers and native API failures.
import { test } from 'node:test'
import { loadModules } from './helpers/load.js'

const source = 'packages/artplayer/src/lifecycle/'
const { ResourceScope, ResourceCleanupError, timeout, animationFrame, listen, requestController, objectURL, wait, Emitter } = await loadModules({
  ResourceScope: `${source}scope`,
  ResourceCleanupError: { file: `${source}scope`, name: 'ResourceCleanupError' },
  ...Object.fromEntries(['timeout', 'animationFrame', 'listen', 'requestController', 'objectURL', 'wait'].map(name => [name, { file: `${source}resources`, name }])),
  Emitter: 'packages/artplayer/src/utils/emitter',
})

test('scope closes before cleanup, unwinds children and collects failures without retaining registrations', () => {
  const scope = new ResourceScope()
  const calls = []
  const first = new Error('first')
  const second = new Error('second')
  scope.add(() => {
    calls.push('oldest')
    throw first
  })
  const child = scope.child()
  child.add(() => {
    calls.push('child')
    throw second
  })
  scope.add(() => {
    assert(scope.closed)
    scope.dispose()
    scope.add(() => {
      calls.push('late')
    })
    calls.push('newest')
  })
  assert.throws(() => scope.dispose(), error => error instanceof ResourceCleanupError && assert.deepEqual(error.errors, [second, first]) === undefined)
  assert.deepEqual(calls, ['late', 'newest', 'child', 'oldest'])
  assert(child.closed)
  scope.dispose()
  assert.equal(calls.length, 4)
})

test('operation completion detaches from the live instance and siblings remain usable', () => {
  const instance = new ResourceScope()
  const operation = instance.child()
  const sibling = instance.child()
  let calls = 0
  const release = operation.add(() => {
    calls++
  })
  release()
  release()
  operation.dispose()
  assert.equal(calls, 1)
  assert.equal(instance.closed, false)
  assert.equal(sibling.closed, false)
  // A completed operation must no longer be invoked by its former owner.
  operation.dispose = () => {
    throw new Error('retained operation')
  }
  instance.dispose()
  assert(sibling.closed)
  assert(instance.child().closed)
})

test('failed explicit release is consumed and cannot prevent later scope cleanup', () => {
  const scope = new ResourceScope()
  const error = new Error('release')
  let calls = 0
  scope.add(() => {
    calls++
  })
  const release = scope.add(() => {
    throw error
  })
  assert.throws(release, value => value === error)
  release()
  scope.dispose()
  assert.equal(calls, 1)
})

test('scope owns subscriptions without removing unrelated emitter listeners', () => {
  const emitter = new Emitter()
  const scope = new ResourceScope()
  const calls = []
  const owned = value => calls.push(value)
  emitter.on('value', owned).on('value', () => calls.push('external'))
  scope.add(() => {
    emitter.off('value', owned)
  })
  emitter.emit('value', 1)
  scope.dispose()
  emitter.emit('value', 2)
  assert.deepEqual(calls, [1, 'external', 'external'])
})

test('timers finish or cancel independently and reject work after disposal', (context) => {
  context.mock.timers.enable({ apis: ['setTimeout'] })
  const scope = new ResourceScope()
  const calls = []
  timeout(scope, () => calls.push('finished'), 5)
  timeout(scope, () => calls.push('cancelled'), 10)()
  timeout(scope, () => calls.push('disposed'), 20)
  context.mock.timers.tick(5)
  scope.dispose()
  timeout(scope, () => calls.push('late'), 0)
  context.mock.timers.tick(100)
  assert.deepEqual(calls, ['finished'])
})

test('queued RAF is guarded after cancellation, timestamp is forwarded and completed frames detach', (context) => {
  const callbacks = []
  const cancelled = []
  const descriptors = Object.getOwnPropertyDescriptors(globalThis)
  globalThis.requestAnimationFrame = callback => callbacks.push(callback)
  globalThis.cancelAnimationFrame = id => cancelled.push(id)
  context.after(() => {
    for (const key of ['requestAnimationFrame', 'cancelAnimationFrame']) {
      if (descriptors[key])
        Object.defineProperty(globalThis, key, descriptors[key])
      else
        delete globalThis[key]
    }
  })
  const scope = new ResourceScope()
  const calls = []
  animationFrame(scope, time => calls.push(time))
  callbacks[0](12)
  animationFrame(scope, time => calls.push(time))()
  callbacks[1](18)
  animationFrame(scope, time => calls.push(time))
  scope.dispose()
  callbacks[2](24)
  animationFrame(scope, () => calls.push('late'))
  assert.deepEqual(calls, [12])
  assert.deepEqual(cancelled, [1, 2, 3])
  assert.equal(callbacks.length, 3)
})

test('DOM once reentry, receiver, object listener, external abort and captured options', () => {
  const scope = new ResourceScope()
  const target = new EventTarget()
  let calls = 0
  listen(scope, target, 'value', function () {
    assert.equal(this, target)
    calls++
    target.dispatchEvent(new Event('value'))
  }, { once: true })
  target.dispatchEvent(new Event('value'))
  assert.equal(calls, 1)
  const controller = new AbortController()
  const options = { signal: controller.signal, capture: false }
  const listener = { handleEvent() {
    assert.equal(this, listener)
    calls++
  } }
  listen(scope, target, 'object', listener, options)
  options.capture = true
  target.dispatchEvent(new Event('object'))
  controller.abort()
  target.dispatchEvent(new Event('object'))
  scope.dispose()
  listen(scope, target, 'object', listener)
  target.dispatchEvent(new Event('object'))
  assert.equal(calls, 2)
})

test('request cancellation and URL ownership are scoped; caller URLs stay available', async () => {
  const instance = new ResourceScope()
  const operation = instance.child()
  const controller = requestController(operation)
  const url = objectURL(operation, new Blob(['owned']))
  const external = URL.createObjectURL(new Blob(['external']))
  try {
    assert.equal(await (await fetch(url)).text(), 'owned')
    operation.dispose()
    assert(controller.signal.aborted)
    await assert.rejects(fetch(url))
    assert.equal(await (await fetch(external)).text(), 'external')
    assert.equal(instance.closed, false)
    assert(requestController(operation).signal.aborted)
  }
  finally {
    URL.revokeObjectURL(external)
    instance.dispose()
  }
})

test('request controller capability absence does not prevent synchronous cleanup', (context) => {
  const descriptor = Object.getOwnPropertyDescriptor(globalThis, 'AbortController')
  Object.defineProperty(globalThis, 'AbortController', { configurable: true, value: undefined })
  context.after(() => Object.defineProperty(globalThis, 'AbortController', descriptor))
  const scope = new ResourceScope()
  assert.equal(requestController(scope), undefined)
  scope.dispose()
})

test('owned waits resolve on cancellation and preserve normal timer-to-microtask completion', async (context) => {
  context.mock.timers.enable({ apis: ['setTimeout'] })
  const scope = new ResourceScope()
  const completed = wait(scope, 5)
  const cancelled = wait(scope, 10)
  context.mock.timers.tick(5)
  assert.equal(await completed, true)
  scope.dispose()
  assert.equal(await cancelled, false)
  assert.equal(await wait(scope), false)
  context.mock.timers.tick(20)
})
