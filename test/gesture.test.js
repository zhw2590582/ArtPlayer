import assert from 'node:assert/strict'
// eslint-disable-next-line test/no-import-node-test -- Use the repository Node test runner.
import { test } from 'node:test'
import { loadModules } from './helpers/load.js'

const savedAgent = Object.getOwnPropertyDescriptor(globalThis, 'CUSTOM_USER_AGENT')
Object.defineProperty(globalThis, 'CUSTOM_USER_AGENT', { configurable: true, value: 'ArtPlayer Android gesture unit fixture' })
let modules
try {
  modules = await loadModules({
    gestureController: { file: 'packages/artplayer/src/input/gesture-controller', name: 'gestureController' },
    slideDirection: { file: 'packages/artplayer/src/input/gesture-direction', name: 'slideDirection' },
    gestureInit: 'packages/artplayer/src/events/gestureInit',
    Emitter: 'packages/artplayer/src/utils/emitter',
    beginLifecycle: { file: 'packages/artplayer/src/lifecycle/instance', name: 'beginLifecycle' },
    getScope: { file: 'packages/artplayer/src/lifecycle/instance', name: 'getScope' },
    beginSource: { file: 'packages/artplayer/src/source/operation', name: 'beginSource' },
  })
}
finally {
  if (savedAgent)
    Object.defineProperty(globalThis, 'CUSTOM_USER_AGENT', savedAgent)
  else
    delete globalThis.CUSTOM_USER_AGENT
}
const { gestureController, slideDirection, gestureInit, Emitter, beginLifecycle, getScope, beginSource } = modules

function touch(x, y, identifier = 1, count = 1) {
  return { touches: Array.from({ length: count }, () => ({ pageX: x, pageY: y, clientX: x, clientY: y, identifier })) }
}

function fixture() {
  const calls = []
  const art = Object.assign(new Emitter(), {
    template: { $video: {}, $progress: { clientWidth: 100, getBoundingClientRect: () => ({ left: 10 }) } },
    option: { isLive: false, gesture: true },
    constructor: { TOUCH_MOVE_RATIO: 0.5 },
    currentTime: 20,
    duration: 100,
    width: 200,
    height: 100,
    top: 10,
    isRotate: false,
    isLock: false,
    notice: { show: '' },
  })
  // eslint-disable-next-line accessor-pairs -- The real seek API is write-only.
  Object.defineProperty(art, 'seek', {
    set(time) {
      art.currentTime = time
      calls.push(['seek', time])
      art.emit('seek', time)
    },
  })
  art.on('setBar', (kind, value, event) => calls.push(['bar', kind, value, event]))
  beginLifecycle(art)
  const gesture = gestureController(art)
  return { art, gesture, calls, dispose: () => getScope(art).dispose() }
}

test('gesture directions retain the two-pixel threshold and exact diagonal boundaries', () => {
  for (const [x, y, expected] of [[1, 1, 0], [2, 0, 4], [0, 2, 2], [-2, 0, 3], [0, -2, 1], [2, 2, 4], [2, -2, 1], [-2, -2, 3], [-2, 2, 2]])
    assert.equal(slideDirection(0, 0, x, y), expected)
  assert.equal(slideDirection(0, 0, Number.NaN, 0), 0)
})

test('video dragging retains seek/bar/notice values and clamps against duration', () => {
  const f = fixture()
  const event = touch(40, 0)
  f.gesture.start(f.art.template.$video, touch(0, 0))
  f.gesture.move(event)
  assert.deepEqual(f.calls, [['seek', 30], ['bar', 'played', 0.3, event]])
  assert.equal(f.art.notice.show, '00:30 / 01:40')
  f.art.constructor.TOUCH_MOVE_RATIO = 2
  f.gesture.move(touch(1000, 0))
  assert.equal(f.art.currentTime, 100)
  f.dispose()
})

test('progress start retains bar-before-seek and its full-width drag multiplier', () => {
  const f = fixture()
  const event = touch(60, 20)
  f.gesture.start(f.art.template.$progress, event)
  assert.deepEqual(f.calls, [['bar', 'played', 0.5, event], ['seek', 50]])
  f.gesture.move(touch(100, 20))
  assert.equal(f.art.currentTime, 70)
  f.dispose()
})

test('rotation uses the vertical axis for absolute progress and subsequent drag', () => {
  const f = fixture()
  f.art.isRotate = true
  f.gesture.start(f.art.template.$progress, touch(60, 60))
  assert.equal(f.art.currentTime, 50)
  f.gesture.move(touch(90, 60))
  assert.equal(f.art.currentTime, 50)
  f.gesture.move(touch(60, 80))
  assert.equal(f.art.currentTime, 70)
  f.dispose()
})

test('cancel, lock, multitouch, changed finger, source and rotation cannot resume the old drag', () => {
  for (const reason of ['cancel', 'lock', 'multitouch', 'identifier', 'source', 'rotation']) {
    const f = fixture()
    f.gesture.start(f.art.template.$video, touch(0, 0))
    if (reason === 'cancel')
      f.art.emit('document:touchcancel', {})
    if (reason === 'lock') {
      f.art.isLock = true
      f.art.emit('lock', true)
      f.art.isLock = false
    }
    if (reason === 'multitouch')
      f.gesture.move(touch(10, 0, 1, 2))
    if (reason === 'identifier')
      f.gesture.move(touch(10, 0, 2))
    if (reason === 'source')
      beginSource(f.art)
    if (reason === 'rotation')
      f.art.isRotate = true
    f.gesture.move(touch(40, 0))
    assert.equal(f.art.currentTime, 20, reason)
    f.dispose()
  }
})

test('non-finite or zero geometry cancels movement instead of producing invalid positions', () => {
  for (const [key, value] of [['width', 0], ['width', Infinity], ['duration', Infinity], ['duration', 0]]) {
    const f = fixture()
    f.gesture.start(f.art.template.$video, touch(0, 0))
    const before = f.art[key]
    f.art[key] = value
    f.gesture.move(touch(40, 0))
    f.art[key] = before
    f.gesture.move(touch(60, 0))
    assert.deepEqual(f.calls, [], key)
    f.dispose()
  }
  const f = fixture()
  f.art.template.$progress.clientWidth = 0
  f.gesture.start(f.art.template.$progress, touch(60, 0))
  assert.deepEqual(f.calls, [])
  f.dispose()
})

test('destroy inside absolute progress notification prevents the following seek', () => {
  const f = fixture()
  f.art.on('setBar', f.dispose)
  f.gesture.start(f.art.template.$progress, touch(60, 0))
  assert.equal(f.art.currentTime, 20)
  assert.equal(f.calls.length, 1)
  f.gesture.move(touch(80, 0))
  assert.equal(f.calls.length, 1)
})

test('destroy inside relative seek prevents bar and notice updates', () => {
  const f = fixture()
  f.art.on('seek', f.dispose)
  f.gesture.start(f.art.template.$video, touch(0, 0))
  f.gesture.move(touch(40, 0))
  assert.deepEqual(f.calls, [['seek', 30]])
  assert.equal(f.art.notice.show, '')
})

test('nested touch start supersedes the interrupted absolute progress transaction', () => {
  const f = fixture()
  f.art.once('setBar', () => f.gesture.start(f.art.template.$video, touch(0, 0, 2)))
  f.gesture.start(f.art.template.$progress, touch(60, 0))
  assert.equal(f.art.currentTime, 20)
  f.gesture.move(touch(40, 0, 2))
  assert.equal(f.art.currentTime, 30)
  f.dispose()
})

test('failed progress start retains the caller error and cancels the unfinished drag', () => {
  const f = fixture()
  const error = new Error('progress callback failed')
  f.art.once('setBar', () => {
    throw error
  })
  assert.throws(() => f.gesture.start(f.art.template.$progress, touch(60, 0)), thrown => thrown === error)
  f.gesture.move(touch(80, 0))
  assert.equal(f.art.currentTime, 20)
  f.dispose()
})

test('touch end and owner disposal remove internal subscriptions but preserve external listeners', () => {
  const f = fixture()
  let external = 0
  f.art.on('document:touchend', () => external++)
  f.gesture.start(f.art.template.$video, touch(0, 0))
  f.art.emit('document:touchend', {})
  f.gesture.move(touch(40, 0))
  assert.equal(f.art.currentTime, 20)
  f.dispose()
  f.art.emit('document:touchend', {})
  assert.equal(external, 2)
  assert.equal(f.art.e['document:touchcancel'], undefined)
  assert.equal(f.art.e.lock, undefined)
})

test('mobile gesture=false still installs progress interactions, while live mode installs none', () => {
  const f = fixture()
  f.art.option.gesture = false
  const registrations = []
  const events = { proxy: (target, name) => registrations.push([target, name]) }
  gestureInit(f.art, events)
  assert.deepEqual(registrations.map(item => item[1]), ['touchstart', 'touchmove', 'touchcancel'])
  assert(registrations.every(item => item[0] === f.art.template.$progress))
  f.art.option.isLive = true
  registrations.length = 0
  gestureInit(f.art, events)
  assert.deepEqual(registrations, [])
  f.dispose()
})
