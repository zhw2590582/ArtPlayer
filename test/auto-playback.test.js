import assert from 'node:assert/strict'
// eslint-disable-next-line test/no-import-node-test -- Use the repository Node test runner.
import { test } from 'node:test'
import { loadModules } from './helpers/load.js'

const { autoPlayback, Emitter, beginLifecycle, getScope, beginSource, ownEntry, releaseEntry } = await loadModules({
  autoPlayback: 'packages/artplayer/src/plugins/autoPlayback',
  Emitter: 'packages/artplayer/src/utils/emitter',
  beginLifecycle: { file: 'packages/artplayer/src/lifecycle/instance', name: 'beginLifecycle' },
  getScope: { file: 'packages/artplayer/src/lifecycle/instance', name: 'getScope' },
  beginSource: { file: 'packages/artplayer/src/source/operation', name: 'beginSource' },
  ownEntry: { file: 'packages/artplayer/src/component/resources', name: 'ownEntry' },
  releaseEntry: { file: 'packages/artplayer/src/component/resources', name: 'releaseEntry' },
})

function fixture(t, stored = { first: 12 }) {
  class Element {
    style = {}
    textContent = ''
    children = new Map()
    querySelector(name) {
      if (!this.children.has(name))
        this.children.set(name, new Element())
      return this.children.get(name)
    }

    insertAdjacentHTML() {
      this.lastElementChild = new Element()
    }
  }
  const original = Object.getOwnPropertyDescriptor(globalThis, 'Element')
  Object.defineProperty(globalThis, 'Element', { configurable: true, value: Element })
  t.after(() => original ? Object.defineProperty(globalThis, 'Element', original) : Reflect.deleteProperty(globalThis, 'Element'))
  let id = 0
  const timers = new Map()
  t.mock.method(globalThis, 'setTimeout', (callback, delay) => {
    const key = ++id
    timers.set(key, { callback, delay })
    return key
  })
  t.mock.method(globalThis, 'clearTimeout', key => timers.delete(key))
  const listeners = new Set()
  const calls = []
  const layer = new Element()
  let records = stored
  const storage = {
    get(key) {
      assert.equal(key, 'times')
      return records
    },
    set(key, value) {
      assert.equal(key, 'times')
      records = value
      calls.push(['save', value])
    },
    del(key) {
      assert.equal(key, 'times')
      records = undefined
    },
  }
  const art = Object.assign(new Emitter(), {
    constructor: { AUTO_PLAYBACK_MAX: 2, AUTO_PLAYBACK_MIN: 5, AUTO_PLAYBACK_TIMEOUT: 100 },
    option: { id: 'first', url: 'first-url' },
    template: { $player: new Element(), $poster: new Element() },
    i18n: { get: key => key },
    icons: { close: '<svg></svg>' },
    storage,
    currentTime: 3,
    playing: false,
    play() {
      calls.push(['play'])
      return Promise.resolve()
    },
    layers: { add(option) {
      assert.equal(option.name, 'auto-playback')
      ownEntry(art, layer)
      return layer
    } },
  })
  Object.defineProperty(art, 'seek', {
    configurable: true,
    get: () => art.currentTime,
    set: value => calls.push(['seek', value]),
  })
  art.events = {
    proxy(target, name, callback) {
      const listener = { target, name, callback }
      listeners.add(listener)
      const cleanup = () => listeners.delete(listener)
      getScope(art).add(() => {
        cleanup()
      })
      return cleanup
    },
    remove: cleanup => cleanup(),
  }
  art.proxy = art.events.proxy
  beginLifecycle(art)
  beginSource(art)
  const plugin = autoPlayback(art)
  const jump = layer.querySelector('.art-auto-playback-jump')
  const close = layer.querySelector('.art-auto-playback-close')
  const last = layer.querySelector('.art-auto-playback-last')
  const click = (target = jump) => {
    for (const listener of [...listeners]) {
      if (listener.target === target && listener.name === 'click')
        listener.callback(new Event('click'))
    }
  }
  const flush = () => {
    const pending = [...timers.values()]
    timers.clear()
    for (const timer of pending)
      timer.callback()
  }
  return { art, plugin, storage, layer, last, jump, close, click, flush, timers, calls, listeners, scope: getScope(art) }
}

test('autoPlayback retains result names, storage key, ID precedence, pruning and management methods', (t) => {
  const f = fixture(t, { a: 1, b: 2, c: 3 })
  assert.deepEqual(Object.keys(f.plugin), ['name', 'times', 'clear', 'delete'])
  assert.equal(f.plugin.name, 'auto-playback')
  f.art.playing = true
  f.art.emit('video:timeupdate')
  assert.deepEqual(f.plugin.times, { b: 2, c: 3, first: 3 })
  f.art.option.id = ''
  f.art.currentTime = 9
  f.art.emit('video:timeupdate')
  assert.deepEqual(f.plugin.times, { 'c': 3, 'first': 3, 'first-url': 9 })
  assert.deepEqual(f.plugin.delete('first'), { 'c': 3, 'first-url': 9 })
  assert.equal(f.plugin.clear(), undefined)
  assert.deepEqual(f.plugin.times, {})
  f.scope.dispose()
})

test('resume prompt preserves threshold, text, seek/play order and first-update timeout', (t) => {
  const f = fixture(t, { first: 4 })
  f.art.emit('ready')
  assert.equal(f.layer.style.display, 'none')
  f.storage.set('times', { first: 5 })
  f.art.emit('restart')
  assert.equal(f.layer.style.display, 'flex')
  assert.equal(f.last.textContent, 'Last Seen 00:05')
  assert.equal(f.jump.textContent, 'Jump Play')
  assert.equal(f.timers.size, 0)
  f.click()
  assert.deepEqual(f.calls.slice(-2), [['seek', 5], ['play']])
  assert.equal(f.art.template.$poster.style.display, 'none')
  assert.equal(f.layer.style.display, 'none')
  f.art.emit('video:timeupdate')
  assert.equal(f.timers.size, 1)
  assert.equal([...f.timers.values()][0].delay, 100)
  f.flush()
  assert.equal(f.layer.style.display, 'none')
  f.scope.dispose()
})

test('restarts replace click targets and only the latest resume time is played', (t) => {
  const f = fixture(t)
  f.art.emit('ready')
  f.storage.set('times', { first: 18 })
  f.art.emit('restart')
  f.storage.set('times', { first: 24 })
  f.art.emit('restart')
  f.click()
  assert.deepEqual(f.calls.filter(call => call[0] === 'seek' || call[0] === 'play'), [['seek', 24], ['play']])
  assert.equal(f.listeners.size, 2)
  f.art.emit('video:timeupdate')
  assert.equal(f.timers.size, 1)
  f.scope.dispose()
  assert.equal(f.timers.size, 0)
})

test('restarting below threshold cancels old clicks and pending first-update subscription', (t) => {
  const f = fixture(t)
  f.art.emit('ready')
  f.storage.set('times', { first: 1 })
  f.art.emit('restart')
  f.click()
  assert.equal(f.calls.some(call => call[0] === 'seek'), false)
  f.art.emit('video:timeupdate')
  assert.equal(f.timers.size, 0)
  f.scope.dispose()
})

test('removing the layer releases prompt resources but keeps playing-time storage', (t) => {
  const f = fixture(t)
  f.art.emit('ready')
  f.art.emit('video:timeupdate')
  releaseEntry(f.layer)
  f.click()
  f.art.emit('restart')
  assert.equal(f.calls.some(call => call[0] === 'seek'), false)
  assert.equal(f.timers.size, 0)
  assert.equal(f.listeners.size, 0)
  f.art.playing = true
  f.art.emit('video:timeupdate')
  assert.deepEqual(f.plugin.times, { first: 3 })
  f.scope.dispose()
})

test('source replacement hides stale prompts before restart and cancels their pending work', (t) => {
  const f = fixture(t)
  f.art.emit('ready')
  beginSource(f.art)
  assert.equal(f.layer.style.display, 'none')
  f.click()
  f.art.emit('video:timeupdate')
  assert.equal(f.calls.some(call => call[0] === 'play'), false)
  assert.equal(f.timers.size, 0)
  f.scope.dispose()
})

test('destroy during seek stops play and subsequent DOM writes', (t) => {
  const f = fixture(t)
  f.art.emit('ready')
  Object.defineProperty(f.art, 'seek', {
    get: () => 0,
    set() {
      f.scope.dispose()
    },
  })
  f.click()
  assert.equal(f.calls.some(call => call[0] === 'play'), false)
  assert.equal(f.art.template.$poster.style.display, undefined)
  assert.equal(f.timers.size, 0)
})

test('destruction stops recording and first-update scheduling', (t) => {
  const f = fixture(t)
  f.art.emit('ready')
  f.scope.dispose()
  f.art.playing = true
  f.art.emit('video:timeupdate')
  f.art.emit('restart')
  assert.equal(f.calls.length, 0)
  assert.equal(f.timers.size, 0)
})

test('old timeout cannot hide a newer prompt and live timeout constants remain effective', (t) => {
  const f = fixture(t)
  f.art.emit('ready')
  f.art.emit('video:timeupdate')
  const stale = [...f.timers.values()][0].callback
  f.storage.set('times', { first: 18 })
  f.art.emit('restart')
  stale()
  assert.equal(f.layer.style.display, 'flex')
  f.art.constructor.AUTO_PLAYBACK_TIMEOUT = 200
  f.art.emit('video:timeupdate')
  assert.equal(f.timers.size, 1)
  assert.equal([...f.timers.values()][0].delay, 200)
  f.scope.dispose()
})

test('a restart inside seek retains the new prompt and stops the old play continuation', (t) => {
  const f = fixture(t)
  f.art.emit('ready')
  Object.defineProperty(f.art, 'seek', {
    get: () => 0,
    set() {
      f.storage.set('times', { first: 25 })
      f.art.emit('restart')
    },
  })
  f.click()
  assert.equal(f.calls.some(call => call[0] === 'play'), false)
  assert.equal(f.last.textContent, 'Last Seen 00:25')
  assert.equal(f.layer.style.display, 'flex')
  assert.equal(f.listeners.size, 2)
  f.scope.dispose()
})

test('destroying in localization callbacks prevents later DOM writes', (t) => {
  const f = fixture(t)
  f.art.i18n.get = () => {
    f.scope.dispose()
    return 'late'
  }
  f.art.emit('ready')
  assert.equal(f.last.textContent, '')
  assert.equal(f.jump.textContent, '')
  assert.equal(f.listeners.size, 0)
})

test('destroying in storage callbacks prevents later record writes', (t) => {
  const f = fixture(t)
  f.storage.get = () => {
    f.scope.dispose()
    return { first: 12 }
  }
  f.art.playing = true
  f.art.emit('video:timeupdate')
  assert.equal(f.calls.length, 0)
})

test('invalid minimum retains the original comparison rather than showing a prompt', (t) => {
  const f = fixture(t)
  f.art.constructor.AUTO_PLAYBACK_MIN = Number.NaN
  f.art.emit('ready')
  assert.equal(f.layer.style.display, 'none')
  assert.equal(f.listeners.size, 0)
  f.scope.dispose()
})

test('resume close and internally rejected playback preserve the existing UI contract', async (t) => {
  const f = fixture(t)
  f.art.emit('ready')
  f.click(f.close)
  assert.equal(f.layer.style.display, 'none')
  assert.equal(f.calls.length, 0)
  f.art.emit('restart')
  f.art.play = () => Promise.reject(new Error('play refused'))
  f.click()
  await Promise.resolve()
  assert.equal(f.layer.style.display, 'none')
  assert.equal(f.art.template.$poster.style.display, 'none')
  f.scope.dispose()
})
