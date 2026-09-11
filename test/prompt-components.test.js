import assert from 'node:assert/strict'
// eslint-disable-next-line test/no-import-node-test -- Use the repository Node test runner.
import { test } from 'node:test'
import { loadModules } from './helpers/load.js'

const { Info, Loading, Mask, Emitter, beginLifecycle, getScope, destroyInstance } = await loadModules({
  Info: 'packages/artplayer/src/info',
  Loading: 'packages/artplayer/src/loading',
  Mask: 'packages/artplayer/src/mask',
  Emitter: 'packages/artplayer/src/utils/emitter',
  beginLifecycle: { file: 'packages/artplayer/src/lifecycle/instance', name: 'beginLifecycle' },
  getScope: { file: 'packages/artplayer/src/lifecycle/instance', name: 'getScope' },
  destroyInstance: { file: 'packages/artplayer/src/lifecycle/instance', name: 'destroyInstance' },
})

function fixture(t) {
  const document = { activeElement: null, body: null }
  class Element extends EventTarget {
    ownerDocument = document
    attributes = new Map()
    setAttribute(key, value) { this.attributes.set(key, String(value)) }
    getAttribute(key) { return this.attributes.get(key) }
    hasAttribute(key) { return this.attributes.has(key) }
    contains(node) { return node === this || this.children.some(child => child.contains(node)) }
    style = {}
    children = []
    textContent = ''
    dataset = {}
    appendChild(child) {
      this.children.push(child)
      this.lastElementChild = child
    }

    querySelectorAll() {
      return this.children
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
  const classes = new Set()
  const player = new Element()
  player.classList = { add: value => classes.add(value), remove: value => classes.delete(value), contains: value => classes.has(value) }
  const panel = new Element()
  const time = new Element()
  time.dataset.video = 'currentTime'
  const source = new Element()
  source.dataset.video = 'src'
  panel.children.push(time, source)
  const listeners = new Set()
  const art = Object.assign(new Emitter(), {
    constructor: { INFO_LOOP_TIME: 100 },
    template: { $player: player, $info: new Element(), $infoPanel: panel, $infoClose: new Element(), $video: { currentTime: 1.234, src: 'first' }, $loading: new Element(), $state: new Element() },
    i18n: { get: key => key },
    icons: { loading: new Element(), state: new Element(), error: new Element() },
    play: () => Promise.resolve(),
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
  const click = (target) => {
    for (const listener of [...listeners]) {
      if (listener.target === target)
        listener.callback(new Event('click'))
    }
  }
  const flush = () => {
    const pending = [...timers.values()]
    timers.clear()
    for (const timer of pending)
      timer.callback()
  }
  return { art, time, source, timers, listeners, click, flush, scope: getScope(art), Element }
}

test('info retains component fields, immediate numeric formatting, live delay and close behavior', (t) => {
  const f = fixture(t)
  const info = new Info(f.art)
  assert.deepEqual(Object.keys(info), ['id', 'art', 'cache', 'add', 'remove', 'update', 'name'])
  assert.deepEqual(Object.getOwnPropertyNames(Object.getPrototypeOf(info)), ['constructor', 'init'])
  assert.equal(f.time.textContent, '1.23')
  assert.equal(f.source.textContent, 'first')
  assert.equal(f.timers.size, 1)
  f.art.template.$video.currentTime = 3
  f.art.constructor.INFO_LOOP_TIME = 200
  f.flush()
  assert.equal(f.time.textContent, '3.00')
  assert.equal([...f.timers.values()][0].delay, 200)
  info.show = true
  f.click(f.art.template.$infoClose)
  assert.equal(info.show, false)
  f.scope.dispose()
  assert.equal(f.timers.size, 0)
})

test('info reinitialization replaces its poll and listener rather than multiplying work', (t) => {
  const f = fixture(t)
  const info = new Info(f.art)
  const stale = [...f.timers.values()][0].callback
  info.init()
  info.init()
  assert.equal(f.timers.size, 1)
  assert.equal(f.listeners.size, 1)
  f.art.template.$video.currentTime = 5
  stale()
  assert.equal(f.time.textContent, '1.23')
  f.flush()
  assert.equal(f.time.textContent, '5.00')
  f.scope.dispose()
})

test('closed info init cannot attach listeners or write media values', (t) => {
  const f = fixture(t)
  const info = new Info(f.art)
  f.scope.dispose()
  f.art.template.$video.currentTime = 9
  info.init()
  assert.equal(f.time.textContent, '1.23')
  assert.equal(f.listeners.size, 0)
  assert.equal(f.timers.size, 0)
})

test('destruction during info media reads stops all subsequent DOM writes and scheduling', (t) => {
  const f = fixture(t)
  const info = new Info(f.art)
  Object.defineProperty(f.art.template.$video, 'currentTime', {
    get() {
      f.scope.dispose()
      return 20
    },
  })
  info.init()
  assert.equal(f.time.textContent, '1.23')
  assert.equal(f.timers.size, 0)
})

test('manual destroy emission stops info work, while a live manual init may restart it', (t) => {
  const f = fixture(t)
  const info = new Info(f.art)
  f.art.emit('destroy')
  assert.equal(f.timers.size, 0)
  info.init()
  assert.equal(f.timers.size, 1)
  assert.equal(f.listeners.size, 1)
  f.scope.dispose()
})

test('failed info reads propagate the original error and release the failed initialization', (t) => {
  const f = fixture(t)
  const info = new Info(f.art)
  const failure = new Error('media getter failed')
  Object.defineProperty(f.art.template.$video, 'currentTime', {
    get() {
      throw failure
    },
  })
  assert.throws(() => info.init(), error => error === failure)
  assert.equal(f.timers.size, 0)
  assert.equal(f.listeners.size, 0)
  f.scope.dispose()
})

test('loading and mask preserve component visibility and actual icon identity', async (t) => {
  const f = fixture(t)
  const loading = new Loading(f.art)
  const mask = new Mask(f.art)
  assert.equal(f.art.template.$loading.children[0], f.art.icons.loading)
  assert.deepEqual(f.art.template.$state.children, [f.art.icons.state, f.art.icons.error])
  assert.equal(f.art.icons.error.style.display, 'none')
  loading.show = true
  mask.show = true
  assert.equal(loading.show, true)
  assert.equal(mask.show, true)
  let plays = 0
  f.art.play = () => {
    plays++
    return Promise.reject(new Error('play refused'))
  }
  f.click(f.art.template.$state)
  await Promise.resolve()
  assert.equal(plays, 1)
  f.art.emit('destroy')
  assert.equal(f.art.icons.state.style.display, 'none')
  assert.equal(f.art.icons.error.style.display, null)
  f.scope.dispose()
})

test('mask root cleanup shows its terminal icon even when no destroy event is emitted', (t) => {
  const f = fixture(t)
  const mask = new Mask(f.art)
  assert.equal(mask.name, 'mask')
  const retained = [...f.listeners][0].callback
  let plays = 0
  f.art.play = () => {
    plays++
  }
  f.scope.dispose()
  retained(new Event('click'))
  assert.equal(plays, 0)
  assert.equal(f.art.icons.state.style.display, 'none')
  assert.equal(f.art.icons.error.style.display, null)
  assert.equal(f.art.e.destroy, undefined)
})

test('info reinitialization captures replacement panel and close nodes without retaining the old ones', (t) => {
  const f = fixture(t)
  const info = new Info(f.art)
  const oldClose = f.art.template.$infoClose
  const panel = new f.Element()
  const item = new f.Element()
  item.dataset.video = 'src'
  panel.children.push(item)
  f.art.template.$infoPanel = panel
  f.art.template.$infoClose = new f.Element()
  info.init()
  assert.equal(item.textContent, 'first')
  info.show = true
  f.click(oldClose)
  assert.equal(info.show, true)
  f.click(f.art.template.$infoClose)
  assert.equal(info.show, false)
  assert.equal(f.listeners.size, 1)
  f.scope.dispose()
})

test('info getter reentry leaves only the newer poll alive', (t) => {
  const f = fixture(t)
  const info = new Info(f.art)
  let nested = false
  Object.defineProperty(f.art.template.$video, 'currentTime', {
    get() {
      if (!nested) {
        nested = true
        info.init()
        return 20
      }
      return 30
    },
  })
  info.init()
  assert.equal(f.time.textContent, '30.00')
  assert.equal(f.timers.size, 1)
  assert.equal(f.listeners.size, 1)
  f.scope.dispose()
})

test('mask retains destroy observer order while still finalizing after an earlier observer throws', (t) => {
  const f = fixture(t)
  f.art.reset = () => {}
  f.art.template.destroy = () => {}
  const seen = []
  f.art.on('destroy', () => seen.push(['before', f.art.icons.error.style.display]))
  const mask = new Mask(f.art)
  assert.equal(mask.name, 'mask')
  f.art.on('destroy', () => seen.push(['after', f.art.icons.error.style.display]))
  destroyInstance(f.art, [f.art], false, false)
  assert.deepEqual(seen, [['before', 'none'], ['after', null]])
})

test('mask final cleanup survives a throwing earlier destroy observer', (t) => {
  const f = fixture(t)
  f.art.reset = () => {}
  f.art.template.destroy = () => {}
  const failure = new Error('early destroy observer')
  f.art.on('destroy', () => {
    throw failure
  })
  const mask = new Mask(f.art)
  assert.equal(mask.name, 'mask')
  assert.throws(() => destroyInstance(f.art, [f.art], false, false), error => error === failure)
  assert.equal(f.art.icons.error.style.display, null)
  assert.equal(f.art.e.destroy.length, 1)
})
