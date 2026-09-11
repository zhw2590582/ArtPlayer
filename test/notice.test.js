import assert from 'node:assert/strict'
// eslint-disable-next-line test/no-import-node-test -- Use the repository Node test runner.
import { test } from 'node:test'
import { loadModules } from './helpers/load.js'

const { Notice, Emitter, beginLifecycle, getScope } = await loadModules({
  Notice: 'packages/artplayer/src/notice',
  Emitter: 'packages/artplayer/src/utils/emitter',
  beginLifecycle: { file: 'packages/artplayer/src/lifecycle/instance', name: 'beginLifecycle' },
  getScope: { file: 'packages/artplayer/src/lifecycle/instance', name: 'getScope' },
})

function fixture(t) {
  const timers = new Map()
  let id = 0
  t.mock.method(globalThis, 'setTimeout', (callback, delay) => {
    const key = ++id
    timers.set(key, { callback, delay })
    return key
  })
  t.mock.method(globalThis, 'clearTimeout', key => timers.delete(key))
  const classes = new Set()
  const classList = {
    add: value => classes.add(value),
    remove: value => classes.delete(value),
    contains: value => classes.has(value),
  }
  const inner = { textContent: '' }
  const art = Object.assign(new Emitter(), {
    template: { $player: { classList }, $noticeInner: inner },
    constructor: { NOTICE_TIME: 100 },
  })
  beginLifecycle(art)
  const scope = getScope(art)
  const notice = new Notice(art)
  return { art, scope, notice, inner, classList, timers }
}

test('notice preserves fields, descriptors, text, live delay and hide semantics', (t) => {
  const f = fixture(t)
  assert.deepEqual(Object.keys(f.notice), ['art', 'timer'])
  assert.deepEqual(Object.getOwnPropertyNames(Object.getPrototypeOf(f.notice)), ['constructor', 'destroy', 'show'])
  assert.equal(f.notice.show, false)
  assert.equal(f.notice.timer, null)
  f.notice.show = new Error('  example  ')
  assert.equal(f.inner.textContent, 'example')
  assert.equal(f.notice.show, true)
  assert.equal(f.timers.get(f.notice.timer).delay, 100)
  f.art.constructor.NOTICE_TIME = 200
  f.notice.show = ' next '
  assert.equal(f.inner.textContent, ' next ')
  assert.equal(f.timers.size, 1)
  assert.equal(f.timers.get(f.notice.timer).delay, 200)
  f.notice.show = ''
  assert.equal(f.notice.show, false)
  assert.equal(f.inner.textContent, ' next ')
  assert.equal(f.timers.size, 1)
  f.timers.get(f.notice.timer).callback()
  assert.equal(f.inner.textContent, '')
})

test('manual notice destroy cancels its timer and permits reuse while alive', (t) => {
  const f = fixture(t)
  f.notice.show = 'visible'
  assert.equal(f.notice.destroy(), undefined)
  assert.equal(f.notice.timer, null)
  assert.equal(f.timers.size, 0)
  assert.equal(f.notice.show, true)
  assert.equal(f.inner.textContent, 'visible')
  f.notice.destroy()
  f.notice.show = 'reused'
  assert.equal(f.timers.size, 1)
  f.art.emit('destroy')
  assert.equal(f.timers.size, 0)
  f.notice.show = 'again'
  assert.equal(f.timers.size, 1)
  f.scope.dispose()
  f.notice.show = 'ignored'
  assert.equal(f.timers.size, 0)
  assert.equal(f.inner.textContent, 'again')
})

test('notice does not allocate a timer after destruction during DOM text writes', (t) => {
  const f = fixture(t)
  Object.defineProperty(f.inner, 'textContent', {
    get: () => '',
    set() {
      f.scope.dispose()
    },
  })
  f.notice.show = 'destroy during setter'
  assert.equal(f.notice.timer, null)
  assert.equal(f.timers.size, 0)
  assert.equal(f.notice.show, false)
})

test('obsolete notice timer callbacks cannot erase a newer message', (t) => {
  const f = fixture(t)
  f.notice.show = 'old'
  const stale = f.timers.get(f.notice.timer).callback
  f.notice.show = 'new'
  stale()
  assert.equal(f.inner.textContent, 'new')
  assert.equal(f.notice.show, true)
  f.scope.dispose()
  stale()
  assert.equal(f.inner.textContent, 'new')
})

test('notice expiry does not hide a message installed by a nested DOM write', (t) => {
  const f = fixture(t)
  f.notice.show = 'old'
  const expire = f.timers.get(f.notice.timer).callback
  let value = 'old'
  Object.defineProperty(f.inner, 'textContent', {
    get: () => value,
    set(next) {
      value = next
      if (next === '')
        f.notice.show = 'nested'
    },
  })
  expire()
  assert.equal(f.inner.textContent, 'nested')
  assert.equal(f.notice.show, true)
  assert.equal(f.timers.size, 1)
})

test('nested notice writes keep only the newest timer', (t) => {
  const f = fixture(t)
  let value = ''
  Object.defineProperty(f.inner, 'textContent', {
    get: () => value,
    set(next) {
      value = next
      if (next === 'outer')
        f.notice.show = 'inner'
    },
  })
  f.notice.show = 'outer'
  assert.equal(f.inner.textContent, 'inner')
  assert.equal(f.notice.show, true)
  assert.equal(f.timers.size, 1)
  f.scope.dispose()
  assert.equal(f.timers.size, 0)
})

test('notice message updates do not invoke a consumer override of the public destroy method', (t) => {
  const f = fixture(t)
  let calls = 0
  const original = f.notice.destroy
  f.notice.destroy = function () {
    calls++
    return original.call(this)
  }
  f.notice.show = 'first'
  f.notice.show = 'second'
  assert.equal(calls, 0)
  assert.equal(f.inner.textContent, 'second')
  f.notice.destroy()
  assert.equal(calls, 1)
  f.scope.dispose()
})
