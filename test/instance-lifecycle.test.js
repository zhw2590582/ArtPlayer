import assert from 'node:assert/strict'
// eslint-disable-next-line test/no-import-node-test -- Use the repository Node test runner.
import { test } from 'node:test'
import { loadModules } from './helpers/load.js'

const file = 'packages/artplayer/src/lifecycle/instance'
const { beginLifecycle, destroyInstance, finishLifecycle, getScope, urlMix } = await loadModules({
  ...Object.fromEntries(['beginLifecycle', 'destroyInstance', 'finishLifecycle', 'getScope'].map(name => [name, { file, name }])),
  urlMix: 'packages/artplayer/src/player/urlMix',
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
