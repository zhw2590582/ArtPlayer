import assert from 'node:assert/strict'
// eslint-disable-next-line test/no-import-node-test -- Use the repository Node test runner.
import { test } from 'node:test'
import { setImmediate } from 'node:timers/promises'
import { loadModules } from './helpers/load.js'

const { nativeOrientation, beginLifecycle, getScope } = await loadModules({
  nativeOrientation: { file: 'packages/artplayer/src/display/orientation-native', name: 'nativeOrientation' },
  beginLifecycle: { file: 'packages/artplayer/src/lifecycle/instance', name: 'beginLifecycle' },
  getScope: { file: 'packages/artplayer/src/lifecycle/instance', name: 'getScope' },
})

function fixture(shared, need = () => true) {
  const calls = []
  const locks = []
  const orientation = shared || {
    type: 'portrait-primary',
    lock(mode) {
      calls.push(mode)
      return new Promise((resolve, reject) => locks.push({ resolve, reject }))
    },
    unlock() {
      calls.push('unlock')
    },
  }
  const classes = new Set()
  const art = {
    template: { $player: { classList: { add: name => classes.add(name), remove: name => classes.delete(name) }, ownerDocument: { defaultView: { screen: { orientation } } } } },
    notice: { show: '' },
  }
  beginLifecycle(art)
  return { art, orientation, calls, locks, classes, set: nativeOrientation(art, need), dispose: () => getScope(art).dispose() }
}

test('orientation invokes synchronously, marks after success, and unlocks on exit', async () => {
  const f = fixture()
  assert.equal(f.set(true), undefined)
  assert.deepEqual(f.calls, ['landscape'])
  assert.equal(f.classes.size, 0)
  f.locks[0].resolve()
  await setImmediate()
  assert.deepEqual([...f.classes], ['art-auto-orientation-fullscreen'])
  f.set(false)
  assert.deepEqual(f.calls, ['landscape', 'unlock'])
  assert.equal(f.classes.size, 0)
  f.dispose()
})

test('orientation repeated entry uses one pending or active lock', async () => {
  const f = fixture()
  f.set(true)
  f.set(true)
  f.locks[0].resolve()
  await setImmediate()
  f.set(true)
  assert.deepEqual(f.calls, ['landscape'])
  f.dispose()
})

test('cancelled late orientation success is released without reactivating classes', async () => {
  const f = fixture()
  f.set(true)
  f.set(false)
  f.locks[0].resolve()
  await setImmediate()
  assert.deepEqual(f.calls, ['landscape', 'unlock', 'unlock'])
  assert.equal(f.classes.size, 0)
  assert.equal(f.art.notice.show, '')
  f.dispose()
})

test('destroyed pending orientation ignores late rejection and further events', async () => {
  const f = fixture()
  f.set(true)
  f.dispose()
  f.art.notice.show = 'replacement notice'
  f.locks[0].reject(new Error('aborted'))
  await setImmediate()
  f.set(true)
  assert.deepEqual(f.calls, ['landscape', 'unlock'])
  assert.equal(f.art.notice.show, 'replacement notice')
  assert.equal(f.classes.size, 0)
})

test('orientation failure preserves original error identity and allows retry', async () => {
  const f = fixture()
  const error = new Error('unsupported')
  f.set(true)
  f.locks[0].reject(error)
  await setImmediate()
  assert.equal(f.art.notice.show, error)
  f.orientation.type = 'landscape-primary'
  f.set(true)
  assert.deepEqual(f.calls, ['landscape', 'portrait'])
  f.locks[1].resolve()
  await setImmediate()
  f.dispose()
})

test('orientation synchronous lock failures are reported and cleanup failure remains best effort', () => {
  const f = fixture()
  const error = new Error('sync denied')
  f.orientation.lock = () => {
    throw error
  }
  f.set(true)
  assert.equal(f.art.notice.show, error)
  f.orientation.lock = () => new Promise(() => {})
  f.orientation.unlock = () => {
    throw new Error('unlock denied')
  }
  f.set(true)
  assert.doesNotThrow(f.dispose)
})

test('superseded orientation completion and old destruction cannot unlock a newer instance', async () => {
  const first = fixture()
  const second = fixture(first.orientation)
  first.set(true)
  second.set(true)
  first.locks[1].resolve()
  await setImmediate()
  first.locks[0].resolve()
  await setImmediate()
  first.dispose()
  assert.deepEqual(first.calls, ['landscape', 'landscape'])
  assert.equal(first.classes.size, 0)
  assert.equal(second.classes.size, 1)
  second.dispose()
  assert.deepEqual(first.calls, ['landscape', 'landscape', 'unlock'])
})

test('no rotation requirement and incomplete platform capabilities do not call lock', () => {
  const f = fixture(undefined, () => false)
  f.set(true)
  assert.deepEqual(f.calls, [])
  f.dispose()
  const missing = fixture({ type: 'portrait-primary', lock: true })
  assert.doesNotThrow(() => missing.set(true))
  missing.dispose()
})
