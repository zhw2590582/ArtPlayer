import assert from 'node:assert/strict'
// eslint-disable-next-line test/no-import-node-test -- Use the repository Node test runner.
import { test } from 'node:test'
import { loadModules } from './helpers/load.js'

const resources = 'packages/artplayer/src/setting/resources'
const lifecycle = 'packages/artplayer/src/lifecycle/instance'
const { formatTree, bindSettingActions, ownSettingItem, releaseSettingItem, releaseSettingTree, proxySetting, settingScope, suspendSettingItem, beginLifecycle, getScope } = await loadModules({
  formatTree: { file: 'packages/artplayer/src/setting/model', name: 'formatTree' },
  bindSettingActions: { file: 'packages/artplayer/src/setting/selection', name: 'bindSettingActions' },
  ...Object.fromEntries(['ownSettingItem', 'releaseSettingItem', 'releaseSettingTree', 'proxySetting', 'settingScope', 'suspendSettingItem'].map(name => [name, { file: resources, name }])),
  ...Object.fromEntries(['beginLifecycle', 'getScope'].map(name => [name, { file: lifecycle, name }])),
})

function fixture(items) {
  const listeners = new Set()
  const art = {
    events: {
      remove(cleanup) {
        cleanup()
        listeners.delete(cleanup)
      },
    },
    proxy(target, name, callback) {
      target.addEventListener(name, callback)
      const cleanup = () => target.removeEventListener(name, callback)
      listeners.add(cleanup)
      return cleanup
    },
  }
  beginLifecycle(art)
  formatTree({ id: 0 }, items)
  return { art, listeners, setting: { art, cache: new Map(), option: items } }
}

test('setting callback results use latest operation and stop after item replacement', async () => {
  const pending = []
  const item = { name: 'button', tooltip: 'initial' }
  const { art, setting, listeners } = fixture([item])
  const target = new EventTarget()
  item.onClick = function (owner, element, event) {
    assert.equal(this, art)
    assert.equal(owner, item)
    assert.equal(element, target)
    assert.equal(event.type, 'click')
    return new Promise(resolve => pending.push(resolve))
  }
  ownSettingItem(art, item)
  bindSettingActions(setting, item, target, 'button')
  target.dispatchEvent(new Event('click'))
  target.dispatchEvent(new Event('click'))
  pending[1]('new')
  await Promise.resolve()
  pending[0]('old')
  await Promise.resolve()
  assert.equal(item.tooltip, 'new')
  target.dispatchEvent(new Event('click'))
  const previous = settingScope(item)
  ownSettingItem(art, item)
  assert.equal(previous.closed, true)
  pending[2]('removed')
  await Promise.resolve()
  assert.equal(item.tooltip, 'new')
  assert.equal(listeners.size, 0)
  getScope(art).dispose()
})

test('setting callback rejection is reported with the original error and no UI write', async (t) => {
  const failure = new Error('selection')
  const warnings = []
  t.mock.method(console, 'warn', (...args) => warnings.push(args))
  const item = { tooltip: 'retained', onClick() {
    return Promise.reject(failure)
  } }
  const { art, setting } = fixture([item])
  const target = new EventTarget()
  ownSettingItem(art, item)
  bindSettingActions(setting, item, target, 'button')
  target.dispatchEvent(new Event('click'))
  await Promise.resolve()
  assert.deepEqual(warnings, [['ArtPlayer setting callback failed:', failure]])
  assert.equal(item.tooltip, 'retained')
  getScope(art).dispose()
})

test('removing a setting tree releases descendants and their panel caches', () => {
  const child = { name: 'child' }
  const parent = { name: 'parent', selector: [child] }
  const other = { name: 'other' }
  const { art, setting, listeners } = fixture([parent, other])
  const target = new EventTarget()
  let calls = 0
  let removedPanels = 0
  for (const item of [parent, child, other]) {
    ownSettingItem(art, item)
    proxySetting(art, item, target, 'click', () => calls++)
  }
  setting.cache.set(parent.selector, { remove() {
    removedPanels++
  } })
  target.dispatchEvent(new Event('click'))
  assert.equal(calls, 3)
  releaseSettingTree(setting, parent)
  assert.equal(removedPanels, 1)
  assert.equal(setting.cache.has(parent.selector), false)
  assert.equal(parent.$events.length, 0)
  assert.equal(child.$events.length, 0)
  assert.equal(other.$events.length, 1)
  target.dispatchEvent(new Event('click'))
  assert.equal(calls, 4)
  assert.equal(listeners.size, 1)
  getScope(art).dispose()
  assert.equal(listeners.size, 0)
})

test('setting listener cleanup attempts every callback even when one fails', () => {
  const item = {}
  const { art } = fixture([item])
  ownSettingItem(art, item)
  const failure = new Error('cleanup')
  const calls = []
  item.$events.push(() => {
    calls.push('first')
    throw failure
  }, () => {
    calls.push('last')
  })
  assert.throws(() => releaseSettingItem(art, item), error => error.errors.length === 1 && error.errors[0] === failure)
  assert.deepEqual(calls, ['first', 'last'])
  assert.deepEqual(item.$events, [])
  releaseSettingItem(art, item)
  getScope(art).dispose()
})

test('registration that closes the owner releases the just-returned listener', () => {
  const item = {}
  const { art, listeners } = fixture([item])
  ownSettingItem(art, item)
  const proxy = art.proxy
  art.proxy = (...args) => {
    const result = proxy(...args)
    getScope(art).dispose()
    return result
  }
  let calls = 0
  const target = new EventTarget()
  proxySetting(art, item, target, 'click', () => calls++)
  target.dispatchEvent(new Event('click'))
  assert.equal(calls, 0)
  assert.equal(listeners.size, 0)
  assert.equal(item.$events.length, 0)
})

test('synchronous setting navigation errors are reported at the owned listener boundary', (t) => {
  const item = {}
  const { art } = fixture([item])
  ownSettingItem(art, item)
  const failure = new Error('navigation render')
  const warnings = []
  t.mock.method(console, 'warn', (...args) => warnings.push(args))
  const target = new EventTarget()
  proxySetting(art, item, target, 'click', () => {
    throw failure
  })
  target.dispatchEvent(new Event('click'))
  assert.deepEqual(warnings, [['ArtPlayer setting callback failed:', failure]])
  getScope(art).dispose()
})

test('a failed replacement resumes the original scope and event array without registering it again', () => {
  const item = {}
  const { art, listeners } = fixture([item])
  const oldNode = new EventTarget()
  const newNode = new EventTarget()
  let oldCalls = 0
  let newCalls = 0
  const original = ownSettingItem(art, item)
  proxySetting(art, item, oldNode, 'click', () => oldCalls++)
  const events = item.$events
  const cleanup = events[0]
  const suspended = suspendSettingItem(art, item)
  assert.equal(original.closed, false)
  assert.equal(events.length, 0)
  assert.throws(() => suspendSettingItem(art, item), /already in progress/)
  oldNode.dispatchEvent(new Event('click'))
  const replacement = ownSettingItem(art, item)
  proxySetting(art, item, newNode, 'click', () => newCalls++)
  newNode.dispatchEvent(new Event('click'))
  suspended.resume()
  suspended.resume()
  suspended.dispose()
  assert.equal(replacement.closed, true)
  assert.equal(settingScope(item), original)
  assert.equal(item.$events, events)
  assert.deepEqual(events, [cleanup])
  assert.equal(listeners.size, 1)
  oldNode.dispatchEvent(new Event('click'))
  newNode.dispatchEvent(new Event('click'))
  assert.deepEqual([oldCalls, newCalls], [1, 1])
  getScope(art).dispose()
})

test('successful replacement disposes only the suspended listeners', () => {
  const item = {}
  const { art, listeners } = fixture([item])
  const target = new EventTarget()
  const calls = []
  const original = ownSettingItem(art, item)
  proxySetting(art, item, target, 'click', () => calls.push('old'))
  const suspended = suspendSettingItem(art, item)
  const replacement = ownSettingItem(art, item)
  proxySetting(art, item, target, 'click', () => calls.push('new'))
  const cleanup = item.$events[0]
  suspended.dispose()
  suspended.resume()
  assert.equal(original.closed, true)
  assert.equal(replacement.closed, false)
  assert.deepEqual(item.$events, [cleanup])
  assert.equal(listeners.size, 1)
  target.dispatchEvent(new Event('click'))
  assert.deepEqual(calls, ['new'])
  getScope(art).dispose()
  assert.equal(listeners.size, 0)
})

test('destroying a suspended replacement releases both generations and cannot resume either', () => {
  const item = {}
  const { art, listeners } = fixture([item])
  const target = new EventTarget()
  let calls = 0
  ownSettingItem(art, item)
  proxySetting(art, item, target, 'click', () => calls++)
  const suspended = suspendSettingItem(art, item)
  ownSettingItem(art, item)
  proxySetting(art, item, target, 'click', () => calls++)
  getScope(art).dispose()
  suspended.resume()
  target.dispatchEvent(new Event('click'))
  assert.equal(calls, 0)
  assert.equal(item.$events.length, 0)
  assert.equal(listeners.size, 0)
})

test('replacement cleanup failure still resumes the original registered listener', () => {
  const item = {}
  const { art, listeners } = fixture([item])
  const target = new EventTarget()
  let calls = 0
  ownSettingItem(art, item)
  proxySetting(art, item, target, 'click', () => calls++)
  const suspended = suspendSettingItem(art, item)
  ownSettingItem(art, item)
  proxySetting(art, item, target, 'click', () => calls += 10)
  const replacement = item.$events[0]
  const failure = new Error('replacement cleanup')
  const remove = art.events.remove
  art.events.remove = (cleanup) => {
    remove(cleanup)
    if (cleanup === replacement)
      throw failure
  }
  assert.throws(() => suspended.resume(), error => error.errors.length === 1 && error.errors[0] === failure)
  target.dispatchEvent(new Event('click'))
  assert.equal(calls, 1)
  assert.equal(listeners.size, 1)
  getScope(art).dispose()
})
