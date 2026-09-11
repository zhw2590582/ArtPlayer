import assert from 'node:assert/strict'
// eslint-disable-next-line test/no-import-node-test -- Use the repository Node test runner.
import { test } from 'node:test'
import { loadModules } from './helpers/load.js'

const { resizeInit, viewInit, updateInit, inViewport, Emitter, beginLifecycle, getScope } = await loadModules({
  resizeInit: 'packages/artplayer/src/events/resizeInit',
  viewInit: 'packages/artplayer/src/events/viewInit',
  updateInit: 'packages/artplayer/src/events/updateInit',
  inViewport: { file: 'packages/artplayer/src/events/viewport', name: 'inViewport' },
  Emitter: 'packages/artplayer/src/utils/emitter',
  beginLifecycle: { file: 'packages/artplayer/src/lifecycle/instance', name: 'beginLifecycle' },
  getScope: { file: 'packages/artplayer/src/lifecycle/instance', name: 'getScope' },
})

function fixture(t) {
  const timers = new Map()
  const frames = new Map()
  let id = 0
  t.mock.method(globalThis, 'setTimeout', (callback, delay) => {
    const key = ++id
    timers.set(key, { callback, delay })
    return key
  })
  t.mock.method(globalThis, 'clearTimeout', key => timers.delete(key))
  for (const [name, value] of Object.entries({
    requestAnimationFrame(callback) {
      const key = ++id
      frames.set(key, callback)
      return key
    },
    cancelAnimationFrame: key => frames.delete(key),
  })) {
    const before = Object.getOwnPropertyDescriptor(globalThis, name)
    Object.defineProperty(globalThis, name, { configurable: true, value })
    t.after(() => before ? Object.defineProperty(globalThis, name, before) : Reflect.deleteProperty(globalThis, name))
  }
  const orientation = new EventTarget()
  orientation.onchange = null
  const document = { defaultView: { innerHeight: 100, innerWidth: 200, screen: { orientation } }, documentElement: { clientHeight: 80, clientWidth: 160 } }
  const rect = { top: 0, left: 0, width: 20, height: 20 }
  const container = { ownerDocument: document, getBoundingClientRect: () => rect }
  const calls = []
  const art = Object.assign(new Emitter(), {
    template: { $player: { ownerDocument: document }, $container: container },
    constructor: { RESIZE_TIME: 10, SCROLL_TIME: 20, SCROLL_GAP: 0, USE_RAF: true },
    option: { autoSize: true, autoMini: true },
    aspectRatio: '16:9',
    state: 'standard',
    autoSize: () => calls.push('autoSize'),
    mini: false,
    playing: false,
    notice: { show: 'before' },
  })
  beginLifecycle(art)
  const scope = getScope(art)
  const registry = { proxy(target, name, callback) {
    target.addEventListener(name, callback)
    scope.add(() => {
      target.removeEventListener(name, callback)
    })
  } }
  const flushTimers = () => {
    const pending = [...timers.values()]
    timers.clear()
    for (const timer of pending)
      timer.callback()
  }
  const frame = () => {
    const [key, callback] = frames.entries().next().value
    frames.delete(key)
    callback(0)
  }
  return { art, scope, registry, calls, timers, frames, frame, flushTimers, orientation, rect, document }
}

test('resize coalesces with live delay, preserves normal effects and cancels on destruction', (t) => {
  const f = fixture(t)
  resizeInit(f.art, f.registry)
  f.art.on('resize', () => f.calls.push('resize'))
  f.art.emit('window:resize', new Event('resize'))
  f.art.emit('window:orientationchange', new Event('orientationchange'))
  assert.equal(f.timers.size, 1)
  assert.equal([...f.timers.values()][0].delay, 10)
  f.art.constructor.RESIZE_TIME = 30
  f.art.emit('window:resize', new Event('resize'))
  assert.equal([...f.timers.values()][0].delay, 30)
  f.flushTimers()
  assert.deepEqual(f.calls, ['autoSize', 'resize'])
  assert.equal(f.art.aspectRatio, '16:9')
  assert.equal(f.art.notice.show, '')
  f.art.emit('window:resize', new Event('resize'))
  f.scope.dispose()
  assert.equal(f.timers.size, 0)
  f.art.emit('window:resize', new Event('resize'))
  assert.equal(f.timers.size, 0)
})

test('orientation event capability does not depend on onchange being assigned', (t) => {
  const f = fixture(t)
  resizeInit(f.art, f.registry)
  f.orientation.dispatchEvent(new Event('change'))
  assert.equal(f.timers.size, 1)
  f.flushTimers()
  assert.deepEqual(f.calls, ['autoSize'])
  f.scope.dispose()
  f.orientation.dispatchEvent(new Event('change'))
  assert.equal(f.timers.size, 0)
})

test('destroy inside auto-size prevents later ratio and notice writes', (t) => {
  const f = fixture(t)
  let ratioWrites = 0
  Object.defineProperty(f.art, 'aspectRatio', { get: () => '16:9', set: () => ratioWrites++ })
  f.art.autoSize = () => f.scope.dispose()
  resizeInit(f.art, f.registry)
  f.art.emit('resize')
  assert.equal(ratioWrites, 0)
  assert.equal(f.art.notice.show, 'before')
})

test('view preserves leading-only throttle, initial delay and live gap while cleaning its timer', (t) => {
  const f = fixture(t)
  const seen = []
  viewInit(f.art)
  f.art.on('view', value => seen.push(value))
  f.art.constructor.SCROLL_TIME = 99
  f.art.emit('window:scroll', new Event('scroll'))
  f.art.emit('window:scroll', new Event('scroll'))
  assert.deepEqual(seen, [true])
  assert.equal([...f.timers.values()][0].delay, 20)
  f.rect.top = 130
  f.flushTimers()
  assert.deepEqual(seen, [true])
  f.art.emit('window:scroll', new Event('scroll'))
  assert.deepEqual(seen, [true, false])
  assert.equal(f.art.mini, true)
  f.flushTimers()
  f.art.constructor.SCROLL_GAP = 50
  f.art.emit('window:scroll', new Event('scroll'))
  assert.deepEqual(seen, [true, false, true])
  f.scope.dispose()
  assert.equal(f.timers.size, 0)
  f.art.emit('window:scroll', new Event('scroll'))
  assert.deepEqual(seen, [true, false, true])
})

test('view callback failure remains synchronous and does not lock the throttle', (t) => {
  const f = fixture(t)
  viewInit(f.art)
  const error = new Error('view failed')
  f.art.once('view', () => {
    throw error
  })
  assert.throws(() => f.art.emit('window:scroll', new Event('scroll')), actual => actual === error)
  assert.equal(f.timers.size, 0)
  f.art.emit('window:scroll', new Event('scroll'))
  assert.equal(f.timers.size, 1)
  f.scope.dispose()
})

test('nested leading view dispatch keeps its timing and destroy prevents reset timers', (t) => {
  const f = fixture(t)
  viewInit(f.art)
  let views = 0
  f.art.on('view', () => views++)
  f.art.once('view', () => f.art.emit('window:scroll', new Event('scroll')))
  f.art.emit('window:scroll', new Event('scroll'))
  assert.equal(views, 2)
  assert.equal(f.timers.size, 2)
  f.flushTimers()
  f.art.once('view', () => f.scope.dispose())
  f.art.emit('window:scroll', new Event('scroll'))
  assert.equal(f.timers.size, 0)
})

test('RAF keeps the initial playing emission and one frame while cancelling reentrant destruction', (t) => {
  const f = fixture(t)
  let frames = 0
  f.art.playing = true
  f.art.on('raf', () => frames++)
  updateInit(f.art)
  assert.equal(frames, 1)
  assert.equal(f.frames.size, 1)
  f.art.playing = false
  f.frame()
  assert.equal(frames, 1)
  assert.equal(f.frames.size, 1)
  f.art.playing = true
  f.art.once('raf', () => f.scope.dispose())
  f.frame()
  assert.equal(frames, 2)
  assert.equal(f.frames.size, 0)
})

test('RAF remains opt-in and explicit destroy notification can cancel an idle frame', (t) => {
  const f = fixture(t)
  f.art.constructor.USE_RAF = false
  updateInit(f.art)
  assert.equal(f.frames.size, 0)
  f.art.constructor.USE_RAF = true
  updateInit(f.art)
  assert.equal(f.frames.size, 1)
  f.art.emit('destroy')
  assert.equal(f.frames.size, 0)
  f.scope.dispose()
})

test('viewport follows owner document changes and preserves edge/gap arithmetic', (t) => {
  const f = fixture(t)
  const container = f.art.template.$container
  f.rect.top = 150
  assert.equal(inViewport(container, 50), true)
  f.rect.top = 151
  assert.equal(inViewport(container, 50), false)
  container.ownerDocument = { defaultView: null, documentElement: { clientHeight: 200, clientWidth: 200 } }
  assert.equal(inViewport(container, 0), true)
  f.rect.left = 301
  assert.equal(inViewport(container, 50), false)
  f.rect.left = 300
  assert.equal(inViewport(container, 50), true)
  f.scope.dispose()
})
