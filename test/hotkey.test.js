import assert from 'node:assert/strict'
// eslint-disable-next-line test/no-import-node-test -- Use the repository Node test runner.
import { test } from 'node:test'
import { loadModules } from './helpers/load.js'

const { Hotkey, Emitter, beginLifecycle, getScope } = await loadModules({
  Hotkey: 'packages/artplayer/src/hotkey',
  Emitter: 'packages/artplayer/src/utils/emitter',
  beginLifecycle: { file: 'packages/artplayer/src/lifecycle/instance', name: 'beginLifecycle' },
  getScope: { file: 'packages/artplayer/src/lifecycle/instance', name: 'getScope' },
})

function fixture(enabled = true) {
  const document = { activeElement: { nodeType: 1, tagName: 'BODY', isContentEditable: false } }
  const art = Object.assign(new Emitter(), {
    template: { $player: { ownerDocument: document } },
    constructor: { SEEK_STEP: 5, VOLUME_STEP: 0.1 },
    option: { hotkey: enabled },
    isFocus: true,
    fullscreenWeb: true,
    volume: 0.5,
    toggle: () => undefined,
  })
  beginLifecycle(art)
  const hotkey = new Hotkey(art)
  function dispatch(code = 'KeyK', options = {}) {
    const event = Object.assign(new Event('keydown', { cancelable: true }), { code, ...options })
    art.emit('document:keydown', event)
    return event
  }
  return { art, hotkey, document, dispatch, dispose: () => getScope(art).dispose() }
}

test('hotkeys preserve own art/keys fields, public prototype and registration identity', () => {
  const f = fixture()
  assert.deepEqual(Object.keys(f.hotkey), ['art', 'keys'])
  assert.deepEqual(Object.getOwnPropertyNames(Hotkey.prototype), ['constructor', 'init', 'add', 'remove'])
  assert.equal(Object.getPrototypeOf(f.hotkey.keys), Object.prototype)
  for (const key of ['__proto__', 'constructor', 'toString']) {
    const callback = () => {}
    assert.equal(f.hotkey.add(key, callback), f.hotkey)
    const array = f.hotkey.keys[key]
    f.hotkey.add(key, callback)
    assert.equal(array.length, 1)
    assert.equal(f.hotkey.remove(key, callback), f.hotkey)
    assert.deepEqual(array, [])
    assert.equal(Object.hasOwn(f.hotkey.keys, key), false)
  }
  assert.equal(Object.getPrototypeOf(f.hotkey.keys), Object.prototype)
  f.dispose()
})

test('default hotkeys preserve live constants, operations and inactive focus behavior', () => {
  const f = fixture()
  f.dispatch('Escape')
  assert.equal(f.art.fullscreenWeb, false)
  f.art.constructor.SEEK_STEP = 9
  f.dispatch('ArrowLeft')
  f.dispatch('ArrowRight')
  assert.equal(f.art.backward, 9)
  assert.equal(f.art.forward, 9)
  f.dispatch('ArrowUp')
  assert.equal(f.art.volume, 0.6)
  f.art.isFocus = false
  assert.equal(f.dispatch('ArrowDown').defaultPrevented, false)
  assert.equal(f.art.volume, 0.6)
  f.dispose()
})

test('default disabling still permits custom keys and later initialization installs defaults once', () => {
  const f = fixture(false)
  assert.deepEqual(Object.keys(f.hotkey.keys), [])
  let hits = 0
  f.hotkey.add('KeyK', () => hits++)
  f.dispatch()
  f.art.option.hotkey = true
  f.hotkey.init()
  f.hotkey.init()
  f.dispatch()
  assert.equal(hits, 2)
  assert.equal(f.hotkey.keys.Space.length, 1)
  f.dispose()
})

test('explicit reinitialization restores removed defaults without adding duplicate callbacks', () => {
  const f = fixture()
  const callback = f.hotkey.keys.ArrowRight[0]
  f.hotkey.remove('ArrowRight', callback)
  assert.equal(f.hotkey.keys.ArrowRight, undefined)
  f.hotkey.init()
  f.hotkey.init()
  assert.deepEqual(f.hotkey.keys.ArrowRight, [callback])
  assert.equal(f.hotkey.keys.Space.length, 1)
  f.dispatch('ArrowRight')
  assert.equal(f.art.forward, 5)
  f.dispose()
})

test('key dispatch retains callback receiver, event order and live-array removal behavior', () => {
  const f = fixture()
  const calls = []
  function first(event) {
    calls.push(['first', this === f.art, event.defaultPrevented])
    f.hotkey.remove('KeyK', first)
  }
  f.hotkey.add('KeyK', first)
  f.hotkey.add('KeyK', () => calls.push('second'))
  f.art.on('hotkey', () => calls.push('hotkey'))
  f.art.on('keydown', () => calls.push('keydown'))
  f.dispatch()
  f.dispatch()
  assert.deepEqual(calls, [['first', true, true], 'hotkey', 'keydown', 'second', 'hotkey', 'keydown'])
  f.dispose()
})

test('destroy during a hotkey stops later callbacks and public notifications', () => {
  const f = fixture()
  const calls = []
  f.hotkey.add('KeyK', () => {
    calls.push('first')
    f.dispose()
  })
  f.hotkey.add('KeyK', () => calls.push('second'))
  f.art.on('hotkey', () => calls.push('hotkey'))
  f.art.on('keydown', () => calls.push('keydown'))
  f.dispatch()
  f.hotkey.init()
  f.dispatch()
  assert.deepEqual(calls, ['first'])
  assert.equal(f.art.e['document:keydown'], undefined)
})

test('synchronous hotkey errors retain identity and do not emit success notifications', () => {
  const f = fixture()
  const error = new Error('callback failed')
  f.hotkey.add('KeyK', () => {
    throw error
  })
  let downstream = 0
  f.art.on('hotkey', () => downstream++)
  f.art.on('keydown', () => downstream++)
  assert.throws(() => f.dispatch(), value => value === error)
  assert.equal(downstream, 0)
  f.dispose()
})

test('modifiers and composition suppress hotkeys but preserve generic keydown delivery', () => {
  const f = fixture()
  let keys = 0
  let generic = 0
  f.hotkey.add('KeyK', () => keys++)
  f.art.on('keydown', () => generic++)
  for (const options of [{ altKey: true }, { ctrlKey: true }, { metaKey: true }, { shiftKey: true }, { isComposing: true }, { keyCode: 229 }])
    assert.equal(f.dispatch('KeyK', options).defaultPrevented, false)
  assert.equal(keys, 0)
  assert.equal(generic, 6)
  f.dispose()
})

test('an absent active element still permits a focused player key without throwing', () => {
  const f = fixture()
  f.document.activeElement = null
  let hits = 0
  f.hotkey.add('KeyK', () => hits++)
  assert.equal(f.dispatch().defaultPrevented, true)
  assert.equal(hits, 1)
  f.dispose()
})
