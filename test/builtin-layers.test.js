import assert from 'node:assert/strict'
// eslint-disable-next-line test/no-import-node-test -- Use the repository Node test runner.
import { test } from 'node:test'
import { loadModules } from './helpers/load.js'

const { lock, miniProgressBar, Emitter, beginLifecycle, getScope, ownEntry, releaseEntry } = await loadModules({
  lock: 'packages/artplayer/src/plugins/lock',
  miniProgressBar: 'packages/artplayer/src/plugins/miniProgressBar',
  Emitter: 'packages/artplayer/src/utils/emitter',
  beginLifecycle: { file: 'packages/artplayer/src/lifecycle/instance', name: 'beginLifecycle' },
  getScope: { file: 'packages/artplayer/src/lifecycle/instance', name: 'getScope' },
  ownEntry: { file: 'packages/artplayer/src/component/resources', name: 'ownEntry' },
  releaseEntry: { file: 'packages/artplayer/src/component/resources', name: 'releaseEntry' },
})

function fixture(t) {
  class Element {
    style = {}
    children = []
    appendChild(child) {
      this.children.push(child)
      this.lastElementChild = child
    }
  }
  const original = Object.getOwnPropertyDescriptor(globalThis, 'Element')
  Object.defineProperty(globalThis, 'Element', { configurable: true, value: Element })
  t.after(() => original ? Object.defineProperty(globalThis, 'Element', original) : Reflect.deleteProperty(globalThis, 'Element'))
  const classes = new Set()
  const classList = { add: value => classes.add(value), remove: value => classes.delete(value), contains: value => classes.has(value) }
  const element = new Element()
  let option
  const art = Object.assign(new Emitter(), {
    template: { $player: { classList } },
    isLock: false,
    icons: { lock: new Element(), unlock: new Element() },
    layers: { add(value) {
      option = value
      ownEntry(art, element)
      option.mounted(element)
      return element
    } },
  })
  beginLifecycle(art)
  const plugin = lock(art)
  return { art, plugin, classes, classList, element, click: () => option.click(), scope: getScope(art) }
}

test('lock preserves state/class/flag ordering, repeated notifications and icon visibility', (t) => {
  const f = fixture(t)
  assert.deepEqual(Object.keys(f.plugin), ['name', 'state'])
  const seen = []
  f.art.on('lock', state => seen.push([state, f.plugin.state, f.art.isLock]))
  f.plugin.state = true
  f.plugin.state = true
  assert.equal(f.art.icons.lock.style.display, 'inline-flex')
  assert.equal(f.art.icons.unlock.style.display, 'none')
  f.click()
  assert.equal(f.art.icons.lock.style.display, 'none')
  assert.equal(f.art.icons.unlock.style.display, 'inline-flex')
  assert.deepEqual(seen, [[true, true, true], [true, true, true], [false, false, false]])
  f.scope.dispose()
})

test('lock icon subscriptions are removed with the layer but the live state API remains usable', (t) => {
  const f = fixture(t)
  releaseEntry(f.element)
  f.plugin.state = true
  assert.equal(f.plugin.state, true)
  assert.equal(f.art.isLock, true)
  assert.equal(f.art.icons.lock.style.display, 'none')
  assert.equal(f.art.e.lock, undefined)
  f.scope.dispose()
})

test('destroyed lock does not emit or mutate state through retained setters and clicks', (t) => {
  const f = fixture(t)
  f.scope.dispose()
  let events = 0
  f.art.on('lock', () => events++)
  f.plugin.state = true
  f.click()
  assert.equal(f.plugin.state, false)
  assert.equal(f.art.isLock, false)
  assert.equal(events, 0)
})

test('destruction during lock class mutation stops the subsequent flag and event', (t) => {
  const f = fixture(t)
  const original = f.classList.add
  f.classList.add = (name) => {
    original(name)
    f.scope.dispose()
  }
  let events = 0
  f.art.on('lock', () => events++)
  f.plugin.state = true
  assert.equal(f.art.isLock, false)
  assert.equal(events, 0)
})

test('miniProgressBar preserves its control-state class and releases the subscription', (t) => {
  const f = fixture(t)
  assert.deepEqual(miniProgressBar(f.art), { name: 'mini-progress-bar' })
  f.art.emit('control', false)
  assert.equal(f.classes.has('art-mini-progress-bar'), true)
  f.art.emit('control', true)
  assert.equal(f.classes.has('art-mini-progress-bar'), false)
  f.scope.dispose()
  f.art.emit('control', false)
  assert.equal(f.classes.has('art-mini-progress-bar'), false)
  assert.equal(f.art.e.control, undefined)
})
