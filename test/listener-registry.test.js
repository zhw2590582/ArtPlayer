import assert from 'node:assert/strict'
// eslint-disable-next-line test/no-import-node-test -- Use the repository Node test runner.
import { test } from 'node:test'
import { loadModules } from './helpers/load.js'

const { ownListeners, proxyListener, removeListener, destroyListeners, beginLifecycle, getScope } = await loadModules({
  ...Object.fromEntries(['ownListeners', 'proxyListener', 'removeListener', 'destroyListeners'].map(name => [name, { file: 'packages/artplayer/src/events/listener-registry', name }])),
  beginLifecycle: { file: 'packages/artplayer/src/lifecycle/instance', name: 'beginLifecycle' },
  getScope: { file: 'packages/artplayer/src/lifecycle/instance', name: 'getScope' },
})

function fixture() {
  const art = {}
  beginLifecycle(art)
  const registry = { destroyEvents: new Set() }
  ownListeners(registry, art)
  const scope = getScope(art)
  scope.add(() => {
    destroyListeners(registry)
    return undefined
  })
  return { registry, scope, target: new EventTarget() }
}

test('native callbacks keep identity, receiver and event; direct disposal is idempotent', () => {
  const { registry, target, scope } = fixture()
  const received = []
  function callback(event) {
    received.push([this, event])
  }
  const dispose = proxyListener(registry, target, 'example', callback)
  const event = new Event('example')
  target.dispatchEvent(event)
  assert.deepEqual(received, [[target, event]])
  target.removeEventListener('example', callback)
  target.dispatchEvent(event)
  assert.equal(received.length, 1)
  assert.equal(dispose(), undefined)
  assert.equal(dispose(), undefined)
  assert.equal(registry.destroyEvents.size, 0)
  scope.dispose()
})

test('capture is read once and removal uses the registration snapshot', () => {
  const { registry, scope } = fixture()
  const calls = []
  const target = {
    addEventListener: (...args) => calls.push(['add', ...args]),
    removeEventListener: (...args) => calls.push(['remove', ...args]),
  }
  let reads = 0
  const callback = () => {}
  const options = {
    get capture() { return ++reads === 1 },
    once: true,
    passive: false,
  }
  proxyListener(registry, target, 'example', callback, options)()
  assert.equal(reads, 1)
  assert.deepEqual(calls, [
    ['add', 'example', callback, { capture: true, once: true, passive: false, signal: undefined }],
    ['remove', 'example', callback, true],
  ])
  scope.dispose()
})

test('once and object listeners use native dispatch; explicit disposal clears their records', () => {
  const { registry, target, scope } = fixture()
  const listener = {
    hits: 0,
    handleEvent() { this.hits++ },
  }
  const dispose = proxyListener(registry, target, 'example', listener, { once: true })
  target.dispatchEvent(new Event('example'))
  target.dispatchEvent(new Event('example'))
  assert.equal(listener.hits, 1)
  assert.equal(registry.destroyEvents.has(dispose), true)
  dispose()
  assert.equal(registry.destroyEvents.size, 0)
  scope.dispose()
})

test('aborted signals skip registration and later abort clears the owned record', () => {
  const { registry, target, scope } = fixture()
  let hits = 0
  const controller = new AbortController()
  proxyListener(registry, target, 'example', () => hits++, { signal: controller.signal })
  target.dispatchEvent(new Event('example'))
  controller.abort()
  target.dispatchEvent(new Event('example'))
  assert.equal(hits, 1)
  assert.equal(registry.destroyEvents.size, 0)
  proxyListener(registry, target, 'example', () => hits++, { signal: controller.signal })
  target.dispatchEvent(new Event('example'))
  assert.equal(hits, 1)
  assert.equal(registry.destroyEvents.size, 0)
  scope.dispose()
})

test('registration failure after native add rolls back an entire array and keeps error identity', () => {
  const { registry, target, scope } = fixture()
  const original = target.addEventListener
  const failure = new Error('registration failed')
  target.addEventListener = function (name, ...args) {
    original.call(this, name, ...args)
    if (name === 'second')
      throw failure
  }
  let hits = 0
  assert.throws(() => proxyListener(registry, target, ['first', 'second'], () => hits++), error => error === failure)
  target.dispatchEvent(new Event('first'))
  target.dispatchEvent(new Event('second'))
  assert.equal(hits, 0)
  assert.equal(registry.destroyEvents.size, 0)
  scope.dispose()
})

test('destruction during native registration removes a listener added after cleanup', () => {
  const { registry, target, scope } = fixture()
  const original = target.addEventListener
  target.addEventListener = function (...args) {
    scope.dispose()
    original.apply(this, args)
  }
  let hits = 0
  proxyListener(registry, target, 'example', () => hits++)
  target.dispatchEvent(new Event('example'))
  assert.equal(hits, 0)
  assert.equal(registry.destroyEvents.size, 0)
  assert.equal(scope.closed, true)
})

test('failed removal retains a retryable record and does not prevent other cleanup', (t) => {
  const { registry, target, scope } = fixture()
  const failure = new Error('temporary removal failure')
  const warnings = []
  t.mock.method(console, 'warn', (...args) => warnings.push(args))
  const original = target.removeEventListener
  let denied = true
  target.removeEventListener = function (name, ...args) {
    if (denied && name === 'first')
      throw failure
    original.call(this, name, ...args)
  }
  const calls = []
  const first = proxyListener(registry, target, 'first', () => calls.push('first'))
  proxyListener(registry, target, 'second', () => calls.push('second'))
  removeListener(registry, first)
  assert.equal(registry.destroyEvents.size, 2)
  destroyListeners(registry)
  assert.equal(registry.destroyEvents.size, 1)
  target.dispatchEvent(new Event('first'))
  target.dispatchEvent(new Event('second'))
  assert.deepEqual(calls, ['first'])
  assert.deepEqual(warnings.map(item => item[1]), [failure, failure])
  denied = false
  destroyListeners(registry)
  assert.equal(registry.destroyEvents.size, 0)
  target.dispatchEvent(new Event('first'))
  assert.deepEqual(calls, ['first'])
  scope.dispose()
})

test('manual destroy suppresses reentrant registrations but allows reuse until owner closes', () => {
  const { registry, target, scope } = fixture()
  const original = target.removeEventListener
  let hits = 0
  target.removeEventListener = function (...args) {
    destroyListeners(registry)
    proxyListener(registry, target, 'reentrant', () => hits++)
    original.apply(this, args)
  }
  proxyListener(registry, target, 'first', () => hits++)
  destroyListeners(registry)
  target.dispatchEvent(new Event('reentrant'))
  assert.equal(hits, 0)
  assert.equal(registry.destroyEvents.size, 0)
  proxyListener(registry, target, 'next', () => hits++)
  target.dispatchEvent(new Event('next'))
  assert.equal(hits, 1)
  scope.dispose()
  proxyListener(registry, target, 'closed', () => hits++)
  target.dispatchEvent(new Event('closed'))
  assert.equal(hits, 1)
  assert.equal(registry.destroyEvents.size, 0)
})

test('duplicate registrations preserve native callback deduplication without reference counting', () => {
  const { registry, target, scope } = fixture()
  let hits = 0
  const callback = () => hits++
  const first = proxyListener(registry, target, 'example', callback)
  proxyListener(registry, target, 'example', callback)
  target.dispatchEvent(new Event('example'))
  assert.equal(hits, 1)
  first()
  target.dispatchEvent(new Event('example'))
  assert.equal(hits, 1)
  scope.dispose()
  assert.equal(registry.destroyEvents.size, 0)
})
