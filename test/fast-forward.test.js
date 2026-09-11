import assert from 'node:assert/strict'
// eslint-disable-next-line test/no-import-node-test -- Use the repository Node test runner.
import { test } from 'node:test'
import { loadModules } from './helpers/load.js'

const { fastForward, Emitter, beginLifecycle, getScope, beginSource } = await loadModules({
  fastForward: 'packages/artplayer/src/plugins/fastForward',
  Emitter: 'packages/artplayer/src/utils/emitter',
  beginLifecycle: { file: 'packages/artplayer/src/lifecycle/instance', name: 'beginLifecycle' },
  getScope: { file: 'packages/artplayer/src/lifecycle/instance', name: 'getScope' },
  beginSource: { file: 'packages/artplayer/src/source/operation', name: 'beginSource' },
})

function fixture(t) {
  let id = 0
  const timers = new Map()
  t.mock.method(globalThis, 'setTimeout', (callback, delay) => {
    const key = ++id
    timers.set(key, { callback, delay })
    return key
  })
  t.mock.method(globalThis, 'clearTimeout', key => timers.delete(key))
  const classes = new Set()
  const video = new EventTarget()
  const art = Object.assign(new Emitter(), {
    template: { $video: video, $player: { classList: {
      add: value => classes.add(value),
      remove: value => classes.delete(value),
      contains: value => classes.has(value),
    } } },
    constructor: { FAST_FORWARD_TIME: 100, FAST_FORWARD_VALUE: 3 },
    playing: true,
    isLock: false,
    playbackRate: 1.5,
    proxy(target, name, callback) {
      target.addEventListener(name, callback)
      const remove = () => target.removeEventListener(name, callback)
      getScope(art).add(() => {
        remove()
      })
      return remove
    },
  })
  beginLifecycle(art)
  beginSource(art)
  const plugin = fastForward(art)
  const start = (count = 1) => {
    const event = new Event('touchstart')
    Object.defineProperty(event, 'touches', { value: Array.from({ length: count }, (_, identifier) => ({ identifier })) })
    video.dispatchEvent(event)
  }
  const flush = () => {
    const callbacks = [...timers.values()]
    timers.clear()
    for (const { callback } of callbacks)
      callback()
  }
  return { art, plugin, start, flush, timers, video, scope: getScope(art) }
}

test('fastForward preserves name, state, live constants and previous playback rate', (t) => {
  const f = fixture(t)
  assert.deepEqual(Object.keys(f.plugin), ['name', 'state'])
  assert.equal(f.plugin.name, 'fastForward')
  assert.equal(f.plugin.state, false)
  f.art.constructor.FAST_FORWARD_TIME = 200
  f.start()
  assert.equal([...f.timers.values()][0].delay, 200)
  f.art.constructor.FAST_FORWARD_VALUE = 4
  f.flush()
  assert.equal(f.art.playbackRate, 4)
  assert.equal(f.plugin.state, true)
  f.art.emit('document:touchend', new Event('touchend'))
  assert.equal(f.art.playbackRate, 1.5)
  assert.equal(f.plugin.state, false)
  f.scope.dispose()
})

test('fastForward only schedules a single playing unlocked touch', (t) => {
  const f = fixture(t)
  f.start(2)
  f.art.playing = false
  f.start()
  f.art.playing = true
  f.art.isLock = true
  f.start()
  assert.equal(f.timers.size, 0)
  f.scope.dispose()
})

test('repeated touch starts do not leave timers or overwrite the original rate', (t) => {
  const f = fixture(t)
  f.start()
  f.start()
  assert.equal(f.timers.size, 1)
  f.flush()
  f.start(2)
  assert.equal(f.art.playbackRate, 1.5)
  assert.equal(f.plugin.state, false)
  f.scope.dispose()
})

for (const event of ['document:touchmove', 'document:touchend', 'document:touchcancel', 'video:pause', 'destroy']) {
  test(`fastForward cancels pending and active presses on ${event}`, (t) => {
    const f = fixture(t)
    f.start()
    const stale = [...f.timers.values()][0].callback
    f.art.emit(event, new Event(event))
    assert.equal(f.timers.size, 0)
    stale()
    assert.equal(f.art.playbackRate, 1.5)
    f.start()
    f.flush()
    assert.equal(f.plugin.state, true)
    f.art.emit(event, new Event(event))
    assert.equal(f.art.playbackRate, 1.5)
    assert.equal(f.plugin.state, false)
    f.scope.dispose()
  })
}

test('native touchcancel, lock, source replacement and destruction release the press', (t) => {
  const f = fixture(t)
  f.start()
  f.video.dispatchEvent(new Event('touchcancel'))
  assert.equal(f.timers.size, 0)
  f.start()
  f.flush()
  f.art.isLock = true
  f.art.emit('lock', true)
  assert.equal(f.art.playbackRate, 1.5)
  f.art.isLock = false
  f.start()
  f.flush()
  beginSource(f.art)
  assert.equal(f.art.playbackRate, 1.5)
  assert.equal(f.plugin.state, false)
  f.start()
  f.flush()
  f.scope.dispose()
  assert.equal(f.art.playbackRate, 1.5)
  assert.equal(f.plugin.state, false)
  f.start()
  f.art.emit('lock', false)
  assert.equal(f.timers.size, 0)
})

test('destruction inside the playback rate setter cannot leave an active class', (t) => {
  const f = fixture(t)
  let rate = 1.5
  Object.defineProperty(f.art, 'playbackRate', {
    get: () => rate,
    set(value) {
      rate = value
      if (value === 3)
        f.scope.dispose()
    },
  })
  f.start()
  f.flush()
  assert.equal(rate, 1.5)
  assert.equal(f.plugin.state, false)
  assert.equal(f.timers.size, 0)
})

test('failed rate assignments release press state and preserve the thrown value', (t) => {
  const f = fixture(t)
  const failure = new Error('rate refused')
  Object.defineProperty(f.art, 'playbackRate', {
    get: () => 1.5,
    set(value) {
      if (value === 3)
        throw failure
    },
  })
  f.start()
  assert.throws(f.flush, error => error === failure)
  assert.equal(f.plugin.state, false)
  assert.equal(f.timers.size, 0)
  f.scope.dispose()
})

test('source replacement cancels pending work and callback-time flags are rechecked', (t) => {
  const f = fixture(t)
  f.start()
  const stale = [...f.timers.values()][0].callback
  beginSource(f.art)
  assert.equal(f.timers.size, 0)
  stale()
  assert.equal(f.art.playbackRate, 1.5)
  f.start()
  f.art.playing = false
  f.flush()
  assert.equal(f.plugin.state, false)
  f.art.playing = true
  f.start()
  f.art.isLock = true
  f.flush()
  assert.equal(f.art.playbackRate, 1.5)
  assert.equal(f.plugin.state, false)
  f.scope.dispose()
})

test('a new press started during rate restoration supersedes the outer restart', (t) => {
  const f = fixture(t)
  f.start()
  f.flush()
  let rate = 3
  let reentered = false
  Object.defineProperty(f.art, 'playbackRate', {
    get: () => rate,
    set(value) {
      rate = value
      if (value === 1.5 && !reentered) {
        reentered = true
        f.start()
        f.flush()
      }
    },
  })
  f.start()
  assert.equal(f.timers.size, 0)
  assert.equal(f.plugin.state, true)
  assert.equal(rate, 3)
  f.art.emit('document:touchend', new Event('touchend'))
  assert.equal(rate, 1.5)
  assert.equal(f.plugin.state, false)
  f.scope.dispose()
})
