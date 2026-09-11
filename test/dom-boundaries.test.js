import assert from 'node:assert/strict'
// eslint-disable-next-line test/no-import-node-test -- Use the repository Node test runner.
import { test } from 'node:test'
import { getSafeAreaInsets as legacySafeArea } from './helpers/legacy-safe-area.js'
import { loadModules, loadPublishedCore } from './helpers/load.js'

const names = ['append', 'remove', 'replaceElement', 'getComposedPath', 'includeFromEvent', 'getSafeAreaInsets', 'setStyle', 'setStyles', 'getStyle']
const utils = await loadModules(Object.fromEntries(names.map(name => [name, { file: 'packages/artplayer/src/utils/dom', name }])))

function globalValue(t, name, value) {
  const descriptor = Object.getOwnPropertyDescriptor(globalThis, name)
  Object.defineProperty(globalThis, name, { value, configurable: true, writable: true })
  t.after(() => descriptor ? Object.defineProperty(globalThis, name, descriptor) : delete globalThis[name])
}

test('event paths preserve native receiver/array identity and work without a browser window', async () => {
  const old = await loadPublishedCore()
  assert.throws(() => old.Artplayer.utils.getComposedPath({ target: null }), error => error.name === 'ReferenceError')
  assert.deepEqual(utils.getComposedPath({ target: null }), [])
  const parent = new EventTarget()
  const child = Object.assign(new EventTarget(), { parentNode: parent })
  assert.deepEqual(utils.getComposedPath({ target: child }), [child, parent])
  const path = [child, parent]
  const event = { target: child, composedPath() {
    assert.equal(this, event)
    return path
  } }
  assert.equal(utils.getComposedPath(event), path)
  assert.equal(utils.includeFromEvent(event, undefined), false)
  assert.equal(utils.includeFromEvent(event, parent), true)
})

test('DOM append preserves string conversion and last-element precedence; detached removal still fails', (t) => {
  class Element {}
  globalValue(t, 'Element', Element)
  const existing = new Element()
  const text = { textContent: 'text' }
  const calls = []
  const parent = { lastElementChild: existing, lastChild: text, insertAdjacentHTML: (...args) => calls.push(args), appendChild: child => calls.push(child) }
  const data = { toString: () => '<b>converted</b>' }
  assert.equal(utils.append(parent, data), existing)
  assert.deepEqual(calls, [['beforeend', '<b>converted</b>']])
  assert.equal(utils.append(parent, existing), existing)
  assert.equal(calls[1], existing)
  assert.throws(() => utils.remove({ parentNode: null }), TypeError)
  const next = new Element()
  const child = { parentNode: { replaceChild: (...args) => calls.push(args) } }
  assert.equal(utils.replaceElement(next, child), next)
  assert.deepEqual(calls.at(-1), [next, child])
})

test('style helpers preserve inherited keys, raw setter values and numeric/string reads', (t) => {
  const writes = []
  const element = { style: new Proxy({}, { set(target, key, value) {
    writes.push([key, value])
    return Reflect.set(target, key, value)
  } }) }
  const raw = { toString: () => '1px' }
  assert.equal(utils.setStyle(element, 'width', raw), element)
  assert.equal(writes[0][1], raw)
  assert.equal(utils.setStyles(element, Object.assign(Object.create({ inherited: 1 }), { own: null })), element)
  assert.deepEqual(writes.slice(1), [['own', null], ['inherited', 1]])
  globalValue(t, 'window', { getComputedStyle: () => ({ getPropertyValue: key => key === 'width' ? '12.5px' : 'auto' }) })
  assert.equal(utils.getStyle(element, 'width'), 12.5)
  assert.equal(utils.getStyle(element, 'width', false), '12.5px')
  assert(Number.isNaN(utils.getStyle(element, 'height')))
})

test('safe-area measurement removes its owned probe after success and style/append failures', async (t) => {
  for (const boundary of ['success', 'style', 'append']) {
    const error = new Error(boundary)
    let attached = false
    let removed = 0
    const div = { style: {}, remove() {
      removed++
      attached = false
    } }
    const document = { createElement: () => div, body: { appendChild() {
      attached = true
      if (boundary === 'append')
        throw error
    } } }
    const getComputedStyle = () => {
      if (boundary === 'style')
        throw error
      return { top: '10px', right: 'auto', bottom: '2.5px', left: '0px' }
    }
    globalValue(t, 'document', document)
    globalValue(t, 'getComputedStyle', getComputedStyle)
    if (boundary === 'style') {
      const published = await loadPublishedCore()
      assert.equal(typeof published.Artplayer.utils.getSafeAreaInsets, 'undefined')
      assert.throws(() => legacySafeArea(), value => value === error)
      assert.equal(attached, true)
      assert.equal(removed, 0)
      attached = false
    }
    if (boundary === 'success')
      assert.deepEqual(utils.getSafeAreaInsets(), { top: 10, right: 0, bottom: 2.5, left: 0 })
    else
      assert.throws(() => utils.getSafeAreaInsets(), value => value === error)
    assert.equal(attached, false)
    assert.equal(removed, 1)
  }
})
