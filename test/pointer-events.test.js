import assert from 'node:assert/strict'
// eslint-disable-next-line test/no-import-node-test -- Use the repository Node test runner.
import { test } from 'node:test'
import { setImmediate } from 'node:timers/promises'
import { loadModules } from './helpers/load.js'

const { clickInit, hoverInit, moveInit, Emitter, beginLifecycle, getScope } = await loadModules({
  clickInit: 'packages/artplayer/src/events/clickInit',
  hoverInit: 'packages/artplayer/src/events/hoverInit',
  moveInit: 'packages/artplayer/src/events/moveInit',
  Emitter: 'packages/artplayer/src/utils/emitter',
  beginLifecycle: { file: 'packages/artplayer/src/lifecycle/instance', name: 'beginLifecycle' },
  getScope: { file: 'packages/artplayer/src/lifecycle/instance', name: 'getScope' },
})

function fixture() {
  const classes = new Set()
  const $player = { classList: { add: name => classes.add(name), remove: name => classes.delete(name) } }
  const $video = {}
  const calls = []
  const callbacks = new Map()
  const art = Object.assign(new Emitter(), {
    template: { $player, $video },
    constructor: { DBCLICK_TIME: 300, DBCLICK_FULLSCREEN: true, MOBILE_CLICK_PLAY: false, MOBILE_DBCLICK_PLAY: true },
    isFocus: false,
    isInput: false,
    isLock: false,
    fullscreen: false,
    toggle: () => calls.push('toggle'),
  })
  beginLifecycle(art)
  const events = {
    proxy(target, name, callback) {
      callbacks.set(name, callback)
      return () => callbacks.delete(name)
    },
    hover(target, enter, leave) {
      callbacks.set('mouseenter', enter)
      callbacks.set('mouseleave', leave)
    },
  }
  clickInit(art, events)
  hoverInit(art, events)
  moveInit(art, events)
  return { art, classes, calls, callbacks, dispose: () => getScope(art).dispose() }
}

test('click grouping keeps the inclusive threshold, third-click reset and live settings', (t) => {
  const f = fixture()
  let now = 0
  t.mock.method(Date, 'now', () => now)
  f.art.on('click', () => f.calls.push('click'))
  f.art.on('dblclick', () => f.calls.push('dblclick'))
  const click = f.callbacks.get('click')
  click(new Event('click'))
  now = 300
  click(new Event('click'))
  assert.equal(f.art.fullscreen, true)
  now = 301
  click(new Event('click'))
  now = 602
  click(new Event('click'))
  f.art.constructor.DBCLICK_FULLSCREEN = false
  click(new Event('click'))
  assert.equal(f.art.fullscreen, true)
  assert.deepEqual(f.calls, ['click', 'toggle', 'dblclick', 'click', 'toggle', 'click', 'toggle', 'dblclick'])
  f.dispose()
})

for (const name of ['click', 'dblclick']) {
  test(`destruction during ${name} stops the remaining playback or fullscreen action`, () => {
    const f = fixture()
    f.art.constructor.DBCLICK_TIME = 60000
    f.art.on(name, f.dispose)
    f.callbacks.get('click')(new Event('click'))
    if (name === 'dblclick')
      f.callbacks.get('click')(new Event('click'))
    assert.equal(f.art.fullscreen, false)
    assert.deepEqual(f.calls, name === 'click' ? [] : ['toggle'])
    f.callbacks.get('click')(new Event('click'))
    assert.deepEqual(f.calls, name === 'click' ? [] : ['toggle'])
  })
}

test('click callback errors retain identity and stop the default action', () => {
  const f = fixture()
  const failure = new Error('caller failed')
  const callback = () => {
    throw failure
  }
  f.art.on('click', callback)
  assert.throws(() => f.callbacks.get('click')(new Event('click')), error => error === failure)
  assert.deepEqual(f.calls, [])
  f.dispose()
})

test('click-triggered playback rejection remains handled internally', async () => {
  const f = fixture()
  f.art.toggle = () => Promise.reject(new DOMException('interrupted', 'AbortError'))
  f.callbacks.get('click')(new Event('click'))
  await setImmediate()
  f.dispose()
})

test('nested clicks preserve the historical synchronous grouping and event identity', (t) => {
  const f = fixture()
  t.mock.method(Date, 'now', () => 100)
  const first = new Event('click')
  const nested = new Event('click')
  f.art.on('click', (event) => {
    assert.equal(event, first)
    f.calls.push('click')
    f.callbacks.get('click')(nested)
  })
  f.art.on('dblclick', event => f.calls.push(event === nested ? 'nested' : 'next'))
  f.callbacks.get('click')(first)
  assert.equal(f.art.fullscreen, true)
  f.callbacks.get('click')(new Event('click'))
  assert.equal(f.art.fullscreen, false)
  assert.deepEqual(f.calls, ['click', 'nested', 'toggle', 'next'])
  f.dispose()
})

test('focus flags retain input-only semantics and disposal removes only owned subscriptions', () => {
  const f = fixture()
  const events = []
  f.art.on('focus', event => events.push(event))
  const input = { tagName: 'INPUT' }
  const event = { target: input, composedPath: () => [input, f.art.template.$player] }
  f.art.emit('document:click', event)
  assert.equal(f.art.isInput, true)
  assert.equal(f.art.isFocus, true)
  assert.equal(events[0], event)
  input.tagName = 'TEXTAREA'
  f.art.emit('document:contextmenu', event)
  assert.equal(f.art.isInput, false)
  let external = 0
  f.art.on('document:click', () => external++)
  f.dispose()
  f.art.emit('document:click', { target: null, composedPath: () => [] })
  assert.equal(f.art.isFocus, true)
  assert.equal(external, 1)
  assert.equal(events.length, 2)
})

test('hover and move preserve class-before-event ordering and reject stale callbacks', () => {
  const f = fixture()
  const states = []
  const event = new Event('mousemove')
  f.art.on('hover', (state, original) => states.push([state, original, f.classes.has('art-hover')]))
  f.art.on('mousemove', original => states.push(['move', original]))
  f.callbacks.get('mouseenter')(event)
  f.callbacks.get('mousemove')(event)
  f.callbacks.get('mouseleave')(event)
  assert.deepEqual(states, [[true, event, true], ['move', event], [false, event, false]])
  f.dispose()
  f.callbacks.get('mouseenter')(event)
  f.callbacks.get('mousemove')(event)
  assert.equal(f.classes.size, 0)
  assert.equal(states.length, 3)
})
