import assert from 'node:assert/strict'
// eslint-disable-next-line test/no-import-node-test -- Use the repository Node test runner.
import { test } from 'node:test'
import { loadModules } from './helpers/load.js'

const file = 'packages/artplayer/src/lifecycle/instance'
const { beginLifecycle, destroyInstance, duringTemplateMount, finishLifecycle, getScope, getFinalizationScope, ownContainer, isClosing, urlMix } = await loadModules({
  ...Object.fromEntries(['beginLifecycle', 'destroyInstance', 'duringTemplateMount', 'finishLifecycle', 'getScope', 'getFinalizationScope', 'ownContainer', 'isClosing'].map(name => [name, { file, name }])),
  urlMix: 'packages/artplayer/src/player/urlMix',
})

test('container reservations prevent concurrent mounts and release after failed rollback', () => {
  const container = {}
  const calls = []
  const first = { isDestroy: false, reset() {}, emit() {
    calls.push('destroy')
  } }
  const second = { isDestroy: false, reset() {}, emit() {} }
  assert.throws(() => getScope(first), /has not been initialized/)
  beginLifecycle(first)
  beginLifecycle(second)
  assert.equal(isClosing(first), false)
  ownContainer(first, container, () => {
    assert(isClosing(first))
    assert.throws(() => ownContainer(second, container, () => {}), /multiple instances/)
    calls.push('rollback')
  })
  assert.throws(() => ownContainer(second, container, () => {}), /multiple instances/)
  destroyInstance(first, [], false, false, true)
  assert.deepEqual(calls, ['destroy', 'rollback'])
  ownContainer(second, container, () => {
    throw new Error('Successful mounting must discard rollback')
  })
  assert(finishLifecycle(second))
  destroyInstance(second, [], true, false)
  assert.equal(finishLifecycle(second), false)
})

test('direct scope disposal finalizes retained resources once without a destroy phase', () => {
  const owner = {}
  const calls = []
  beginLifecycle(owner)
  getFinalizationScope(owner).add(() => {
    calls.push('finalized')
  })
  getScope(owner).dispose()
  assert(isClosing(owner))
  assert(getFinalizationScope(owner).closed)
  getScope(owner).dispose()
  assert.deepEqual(calls, ['finalized'])
})

test('cleanup failures preserve the first value and still finalize, roll back and release reservations', (context) => {
  const failures = [new Error('scope'), new Error('finalizer'), new Error('rollback')]
  const warnings = []
  context.mock.method(console, 'warn', (...args) => warnings.push(args))
  const container = {}
  const owner = { isDestroy: false, reset() {}, emit() {} }
  beginLifecycle(owner)
  getScope(owner).add(() => {
    throw failures[0]
  })
  getFinalizationScope(owner).add(() => {
    throw failures[1]
  })
  ownContainer(owner, container, () => {
    throw failures[2]
  })
  assert.throws(() => destroyInstance(owner, [owner], true, false, true), error => error === failures[0])
  assert.deepEqual(warnings, failures.slice(1).map(error => ['Additional ArtPlayer cleanup failure:', error]))
  assert(owner.isDestroy && getScope(owner).closed && getFinalizationScope(owner).closed)
  const replacement = { isDestroy: false, reset() {}, emit() {} }
  beginLifecycle(replacement)
  ownContainer(replacement, container, () => {})
  finishLifecycle(replacement)
  destroyInstance(replacement, [], true, false)
})

test('mounting template cleanup precedes destroy without exposing an early public property', () => {
  const calls = []
  const owner = { isDestroy: false, reset() {
    calls.push('reset')
  }, emit() {
    calls.push('destroy')
  } }
  beginLifecycle(owner)
  const template = { $video: {}, destroy(removeHtml) {
    calls.push(['template', removeHtml])
  } }
  duringTemplateMount(owner, template, () => {
    assert.equal(Object.hasOwn(owner, 'template'), false)
    destroyInstance(owner, [], false, true)
  })
  assert.deepEqual(calls, [['template', false], 'destroy'])
  assert(owner.isDestroy)
  assert.equal(Object.hasOwn(owner, 'template'), false)
})

test('temporary mounting ownership is cleared after failures and completed mounting', () => {
  for (const fail of [false, true]) {
    let cleanups = 0
    const owner = { isDestroy: false, reset() {}, emit() {} }
    beginLifecycle(owner)
    const template = { destroy() {
      cleanups++
    } }
    const failure = new Error('mount failed')
    const mount = () => duringTemplateMount(owner, template, () => {
      if (fail)
        throw failure
    })
    if (fail)
      assert.throws(mount, error => error === failure)
    else
      mount()
    destroyInstance(owner, [], true, true)
    assert.equal(cleanups, 0)
  }
})

test('instance teardown preserves order, public state and first-call removeHtml across reentry', () => {
  const calls = []
  const instances = []
  const owner = {
    isDestroy: false,
    reset() {
      calls.push(['reset', this.isDestroy])
      destroyInstance(this, instances, true, true)
    },
    template: { $video: {}, destroy(removeHtml) {
      calls.push(['template', removeHtml])
    } },
    emit(name) {
      calls.push([name, this.isDestroy, instances.includes(this)])
    },
  }
  const keys = Object.keys(owner)
  beginLifecycle(owner)
  assert.deepEqual(Object.keys(owner), keys)
  getScope(owner).add(() => {
    calls.push(['resources', owner.isDestroy])
  })
  assert(finishLifecycle(owner))
  instances.push(owner)
  destroyInstance(owner, instances, false, true)
  destroyInstance(owner, instances, true, true)
  assert.deepEqual(calls, [['reset', false], ['resources', false], ['template', false], ['destroy', true, false]])
})

test('reset failure still releases resources, removes the instance and dispatches destroy', () => {
  const error = new Error('reset failed')
  let released = false
  let emitted = false
  const owner = { isDestroy: false, reset() {
    throw error
  }, template: { $video: {}, destroy() {} }, emit() { emitted = true } }
  const instances = [owner]
  beginLifecycle(owner)
  getScope(owner).add(() => {
    released = true
  })
  assert.throws(() => destroyInstance(owner, instances, true, true), value => value === error)
  assert(released && emitted && owner.isDestroy)
  assert.deepEqual(instances, [])
  destroyInstance(owner, instances, true, true)
})

test('destroy listener error propagates unchanged after internal cleanup and remains consumed', () => {
  const error = new Error('listener failed')
  const sibling = {}
  const owner = { isDestroy: false, reset() {}, emit() {
    throw error
  } }
  const instances = [owner, sibling]
  beginLifecycle(owner)
  assert.throws(() => destroyInstance(owner, instances, true, false), value => value === error)
  assert(getScope(owner).closed)
  destroyInstance(owner, instances, true, false)
  assert.deepEqual(instances, [sibling])
})

test('custom-type continuation cannot start after its timer resolves but before its owner is destroyed', async (context) => {
  context.mock.timers.enable({ apis: ['setTimeout'] })
  let calls = 0
  const owner = {
    isDestroy: false,
    reset() {},
    emit() {},
    option: { type: 'custom', customType: { custom() { calls++ } } },
    template: { $video: { src: '' }, destroy() {} },
    loading: { show: false },
  }
  beginLifecycle(owner)
  urlMix(owner)
  owner.url = 'test.custom'
  context.mock.timers.tick(0)
  destroyInstance(owner, [], true, false)
  await Promise.resolve()
  assert.equal(calls, 0)
  assert.equal(owner.loading.show, false)
})
