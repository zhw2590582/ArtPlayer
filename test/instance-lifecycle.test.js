import assert from 'node:assert/strict'
// eslint-disable-next-line test/no-import-node-test -- Use the repository Node test runner.
import { test } from 'node:test'
import { loadModules } from './helpers/load.js'

const file = 'packages/artplayer/src/lifecycle/instance'
const { beginLifecycle, destroyInstance, duringTemplateMount, finishLifecycle, getScope, urlMix } = await loadModules({
  ...Object.fromEntries(['beginLifecycle', 'destroyInstance', 'duringTemplateMount', 'finishLifecycle', 'getScope'].map(name => [name, { file, name }])),
  urlMix: 'packages/artplayer/src/player/urlMix',
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
