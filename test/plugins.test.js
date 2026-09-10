import assert from 'node:assert/strict'
// eslint-disable-next-line test/no-import-node-test -- Use the repository Node runner.
import { test } from 'node:test'
import vm from 'node:vm'
import { loadModules } from './helpers/load.js'

const lifecycle = 'packages/artplayer/src/lifecycle/instance'
const { Plugins, beginLifecycle, getScope, destroyInstance } = await loadModules({
  Plugins: 'packages/artplayer/src/plugins/index',
  ...Object.fromEntries(['beginLifecycle', 'getScope', 'destroyInstance'].map(name => [name, { file: lifecycle, name }])),
})

function create(plugins = []) {
  const art = { option: { miniProgressBar: false, isLive: false, lock: false, autoPlayback: false, autoOrientation: false, fastForward: false, plugins } }
  beginLifecycle(art)
  return { art, registry: new Plugins(art) }
}

test('plugin registration keeps receiver, arguments, id, descriptors and naming precedence', () => {
  const { art, registry } = create()
  const result = { name: 'returnedName' }
  function factory(value) {
    assert.equal(this, art)
    assert.equal(value, art)
    assert.equal(arguments.length, 1)
    return result
  }
  assert.equal(registry.add(factory), registry)
  assert.equal(registry.returnedName, result)
  assert.equal(registry.id, 1)
  assert.deepEqual(Object.getOwnPropertyDescriptor(registry, 'returnedName'), { value: result, writable: false, enumerable: false, configurable: false })
  function named() {}
  assert.equal(registry.add(named), registry)
  assert(Object.hasOwn(registry, 'named'))
  registry.add((0, () => null))
  assert.equal(registry.plugin3, null)
  assert.throws(() => registry.add(() => result), /Cannot add a plugin that already has the same name: returnedName/)
  assert.equal(registry.id, 4)
  assert.deepEqual(Object.keys(registry), ['art', 'id'])
})

test('async factories preserve pending visibility, completion-time fallback and registry fulfillment', async () => {
  const { registry } = create()
  let resolve
  const result = registry.add((0, () => new Promise(done => resolve = done)))
  assert(result instanceof Promise)
  assert(!Object.hasOwn(registry, 'plugin1'))
  registry.add(() => ({ name: 'second' }))
  resolve(undefined)
  assert.equal(await result, registry)
  assert(Object.hasOwn(registry, 'plugin2'))
  assert(!Object.hasOwn(registry, 'plugin1'))
  const failure = new Error('factory failure')
  await assert.rejects(registry.add(() => Promise.reject(failure)), error => error === failure)
  assert.throws(() => registry.add(() => {
    throw failure
  }), error => error === failure)
})

test('only same-realm Promises are awaited, preserving catch-less thenables and foreign promises', () => {
  const { registry } = create()
  const thenable = { name: 'thenable', then() {
    throw new Error('must not assimilate')
  } }
  assert.equal(registry.add(() => thenable), registry)
  assert.equal(registry.thenable, thenable)
  const foreign = vm.runInNewContext('Promise.resolve({ name: "foreignResult" })')
  const foreignFactory = () => foreign
  assert.equal(registry.add(foreignFactory), registry)
  assert.equal(registry.foreignFactory, foreign)
})

test('closed registries ignore late results without inspecting or destroying them and reject new factories', async () => {
  const { art, registry } = create()
  let resolve
  const pending = registry.add(() => new Promise(done => resolve = done))
  getScope(art).dispose()
  resolve({ get name() {
    throw new Error('late result must not be inspected')
  }, destroy() {
    throw new Error('not a lifecycle hook')
  } })
  assert.equal(await pending, registry)
  assert.deepEqual(Object.getOwnPropertyNames(registry), ['art', 'id'])
  assert.throws(() => registry.add(() => {
    throw new Error('factory must not run')
  }), /Cannot add a plugin after ArtPlayer is destroyed/)
  assert.equal(registry.id, 1)
})

test('reentrant destruction in a name getter or property-key coercion cannot publish a result', () => {
  for (const closeAt of [0, 1, 2, 3]) {
    const { art, registry } = create()
    const coercions = []
    const name = { [Symbol.toPrimitive](hint) {
      coercions.push(hint)
      if (coercions.length === closeAt)
        getScope(art).dispose()
      return 'closing'
    } }
    const result = closeAt > 0
      ? { name }
      : { get name() {
          getScope(art).dispose()
          return 'closing'
        } }
    assert.equal(registry.add(() => result), registry)
    assert(!Object.hasOwn(registry, 'closing'))
    assert.deepEqual(coercions, Array.from({ length: closeAt }, () => 'string'))
  }
})

test('live key coercion order and symbol-name failure retain native behavior', () => {
  const { registry } = create()
  const calls = []
  const result = { name: { [Symbol.toPrimitive](hint) {
    calls.push(hint)
    return `key${calls.length}`
  } } }
  registry.add(() => result)
  assert.equal(registry.key3, result)
  assert.deepEqual(calls, ['string', 'string', 'string'])
  assert.throws(() => registry.add(() => ({ name: Symbol('name') })), TypeError)
})

test('constructor stops after a synchronous close and observes its own async rejection', async (context) => {
  const failure = new Error('initial async failure')
  const warnings = []
  context.mock.method(console, 'warn', (...args) => warnings.push(args))
  const { art } = create([() => Promise.reject(failure), function close() {
    getScope(this).dispose()
  }, () => {
    throw new Error('must not start')
  }])
  assert(getScope(art).closed)
  await new Promise(resolve => setImmediate(resolve))
  assert.deepEqual(warnings, [['Failed to initialize ArtPlayer plugin:', failure]])
})

test('registration during reset is rejected before resource scope disposal', () => {
  const { art, registry } = create()
  Object.assign(art, { isDestroy: false, reset() {
    assert.equal(getScope(art).closed, false)
    assert.throws(() => registry.add(() => {
      throw new Error('must not execute during reset')
    }), /Cannot add a plugin after ArtPlayer is destroyed/)
  }, template: { $video: {}, destroy() {} }, emit() {} })
  destroyInstance(art, [art], true, true)
  assert.equal(registry.id, 0)
})
