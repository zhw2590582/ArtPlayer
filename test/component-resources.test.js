import assert from 'node:assert/strict'
// eslint-disable-next-line test/no-import-node-test -- Use the repository Node test runner.
import { test } from 'node:test'
import { loadModules } from './helpers/load.js'

const resources = 'packages/artplayer/src/component/resources'
const lifecycle = 'packages/artplayer/src/lifecycle/instance'
const { Emitter, Control, installControls, qualityMix, trackSelection, captureSelection, beginLifecycle, destroyInstance, getScope, ownEntry, entryScope, releaseEntry, proxyEntry, subscribeEntry } = await loadModules({
  Emitter: 'packages/artplayer/src/utils/emitter',
  Control: 'packages/artplayer/src/control/index',
  installControls: { file: 'packages/artplayer/src/control/builtins', name: 'installControls' },
  qualityMix: 'packages/artplayer/src/player/qualityMix',
  ...Object.fromEntries(['trackSelection', 'captureSelection'].map(name => [name, { file: 'packages/artplayer/src/component/selection', name }])),
  ...Object.fromEntries(['beginLifecycle', 'destroyInstance', 'getScope'].map(name => [name, { file: lifecycle, name }])),
  ...Object.fromEntries(['ownEntry', 'entryScope', 'releaseEntry', 'proxyEntry', 'subscribeEntry'].map(name => [name, { file: resources, name }])),
})

test('deferred builtin quality initialization reports its original failure', async (t) => {
  t.mock.timers.enable({ apis: ['setTimeout'] })
  const { art } = fixture()
  const failure = new Error('quality option getter')
  const warnings = []
  t.mock.method(console, 'warn', (...args) => warnings.push(args))
  let reads = 0
  art.option = {
    controls: [],
    get quality() {
      if (reads++ === 0)
        return [{ html: 'A', url: 'a' }]
      throw failure
    },
  }
  installControls({ art, add() {} })
  t.mock.timers.tick(0)
  await Promise.resolve()
  await Promise.resolve()
  assert.deepEqual(warnings, [['ArtPlayer quality initialization failed:', failure]])
  getScope(art).dispose()
})

test('control factories do not run during the reset portion of instance destruction', () => {
  const { art } = fixture()
  art.isDestroy = false
  art.template = { $video: {}, destroy() {} }
  let factories = 0
  art.reset = () => {
    assert.equal(art.isDestroy, false)
    assert.equal(getScope(art).closed, false)
    const result = Control.prototype.add.call({ art }, () => {
      factories++
      return { html: 'late' }
    })
    assert.equal(result, undefined)
  }
  destroyInstance(art, [art], true, true)
  assert.equal(factories, 0)
  assert.equal(art.isDestroy, true)
})

test('quality callbacks keep return values while obsolete and removed selections stop notices', async () => {
  const { art, element } = fixture()
  let option
  art.controls = { update(value) {
    option = value
  } }
  art.notice = { show: '' }
  art.i18n = { get: key => key }
  const pending = []
  art.switchQuality = url => new Promise(resolve => pending.push({ url, resolve }))
  qualityMix(art)
  const quality = [{ html: 'A', url: 'a' }, { html: 'B', url: 'b' }]
  art.quality = quality
  let generation = 0
  const run = (item) => {
    const current = ++generation
    const scope = entryScope(element)
    const event = new Event('click')
    const release = scope.add(trackSelection(event, () => !scope.closed && current === generation))
    return option.onSelect.call(art, item, element, event).finally(release)
  }
  const first = run(quality[0])
  const second = run(quality[1])
  pending[1].resolve()
  assert.equal(await second, 'B')
  assert.equal(art.notice.show, 'Switch Video: B')
  pending[0].resolve()
  assert.equal(await first, 'A')
  assert.equal(art.notice.show, 'Switch Video: B')
  const removed = run(quality[0])
  releaseEntry(element)
  pending[2].resolve()
  assert.equal(await removed, 'A')
  assert.equal(art.notice.show, 'Switch Video: B')
  ownEntry(art, element)
  art.i18n.get = (key) => {
    releaseEntry(element)
    return key
  }
  const reentrant = run(quality[0])
  pending[3].resolve()
  assert.equal(await reentrant, 'A')
  assert.equal(art.notice.show, 'Switch Video: B')
  assert.deepEqual(pending.map(item => item.url), ['a', 'b', 'a', 'a'])
})

test('quality rejection identity and captured selection closure survive disposal', async () => {
  const { art, element } = fixture()
  let option
  const failure = new Error('quality failed')
  art.controls = { update(value) {
    option = value
  } }
  art.notice = { show: '' }
  art.i18n = { get: key => key }
  art.switchQuality = () => Promise.reject(failure)
  qualityMix(art)
  const quality = [{ html: 'A', url: 'a' }]
  art.quality = quality
  const event = new Event('click')
  const scope = entryScope(element)
  scope.add(trackSelection(event, () => !scope.closed))
  const active = captureSelection(event)
  const result = option.onSelect.call(art, quality[0], element, event)
  releaseEntry(element)
  assert.equal(active(), false)
  await assert.rejects(result, error => error === failure)
  assert.equal(art.notice.show, '')
})

function fixture() {
  const art = new Emitter()
  const registered = new Set()
  art.events = {
    proxy(target, name, callback) {
      target.addEventListener(name, callback)
      const cleanup = () => target.removeEventListener(name, callback)
      registered.add(cleanup)
      return cleanup
    },
    remove(cleanup) {
      cleanup()
      registered.delete(cleanup)
    },
  }
  beginLifecycle(art)
  const element = new EventTarget()
  ownEntry(art, element)
  return { art, element, registered }
}

test('entry disposal removes DOM listeners and preserves unrelated entries', () => {
  const { art, element, registered } = fixture()
  const second = new EventTarget()
  ownEntry(art, second)
  const events = []
  proxyEntry(art, element, element, 'click', event => events.push(event))
  proxyEntry(art, second, second, 'click', event => events.push(event))
  const original = new Event('click')
  element.dispatchEvent(original)
  assert.equal(events[0], original)
  releaseEntry(element)
  element.dispatchEvent(new Event('click'))
  second.dispatchEvent(new Event('click'))
  assert.equal(events.length, 2)
  assert.equal(registered.size, 1)
  assert.equal(entryScope(element).closed, true)
  assert.equal(getScope(art).closed, false)
  getScope(art).dispose()
  assert.equal(registered.size, 0)
})

test('entry listeners stop within an existing emitter snapshot while user listeners survive', () => {
  const { art, element } = fixture()
  const calls = []
  art.on('update', () => {
    calls.push('first')
    releaseEntry(element)
  })
  subscribeEntry(art, element, 'update', () => calls.push('owned'))
  art.on('update', () => calls.push('last'))
  art.emit('update')
  art.emit('update')
  assert.deepEqual(calls, ['first', 'last', 'first', 'last'])
  assert.equal(art.e.update.length, 2)
})

test('root closure stops all entry resources and late registrations remain inert', () => {
  const { art, element, registered } = fixture()
  let calls = 0
  proxyEntry(art, element, element, 'click', () => calls++)
  subscribeEntry(art, element, 'update', () => calls++)
  getScope(art).dispose()
  proxyEntry(art, element, element, 'click', () => calls++)
  subscribeEntry(art, element, 'update', () => calls++)
  element.dispatchEvent(new Event('click'))
  art.emit('update')
  releaseEntry(element)
  assert.equal(calls, 0)
  assert.equal(registered.size, 0)
})

test('cleanup failure does not prevent releasing other component resources', () => {
  const { art, element } = fixture()
  const failures = [new Error('first'), new Error('second')]
  const attempts = []
  art.events.remove = () => {
    const error = failures[attempts.length]
    attempts.push(error)
    throw error
  }
  proxyEntry(art, element, element, 'click', () => {})
  proxyEntry(art, element, element, 'change', () => {})
  assert.throws(() => releaseEntry(element), (error) => {
    assert.deepEqual(error.errors, failures)
    return true
  })
  assert.deepEqual(attempts, failures)
  assert.equal(entryScope(element).closed, true)
  releaseEntry(element)
  assert.equal(attempts.length, 2)
})
