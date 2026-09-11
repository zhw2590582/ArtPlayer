import assert from 'node:assert/strict'
// eslint-disable-next-line test/no-import-node-test -- Verify focus modality ownership and document rebinding.
import { test } from 'node:test'
import { loadModules } from './helpers/load.js'

const { focusVisibility, captureMovedFocus, ResourceScope } = await loadModules({
  focusVisibility: { file: 'packages/artplayer/src/accessibility/focus', name: 'focusVisibility' },
  captureMovedFocus: { file: 'packages/artplayer/src/accessibility/moved-focus', name: 'captureMovedFocus' },
  ResourceScope: 'packages/artplayer/src/lifecycle/scope',
})

test('DOM moves restore the same connected descendant and preserve externally moved focus', () => {
  const body = {}
  const outside = {}
  const doc = { body, activeElement: null }
  let count = 0
  const child = { ownerDocument: doc, isConnected: true, focus(options) {
    assert.deepEqual(options, { preventScroll: true })
    count++
    doc.activeElement = this
  } }
  const root = { ownerDocument: doc, contains: target => target === child }
  doc.activeElement = child
  const restore = captureMovedFocus(root)
  doc.activeElement = body
  restore()
  assert.equal(doc.activeElement, child)
  restore()
  assert.equal(count, 1)
  doc.activeElement = outside
  restore()
  assert.equal(doc.activeElement, outside)
  doc.activeElement = body
  child.isConnected = false
  restore()
  assert.equal(count, 1)
  child.isConnected = true
  doc.activeElement = outside
  const unrelated = captureMovedFocus(root)
  doc.activeElement = body
  unrelated()
  assert.equal(count, 1)
})

function fixture() {
  const scope = new ResourceScope()
  const doc = Object.assign(new EventTarget(), { activeElement: null })
  const classes = new Set()
  const child = {}
  const root = Object.assign(new EventTarget(), {
    ownerDocument: doc,
    contains: value => value === child,
    classList: {
      contains: name => classes.has(name),
      remove: name => classes.delete(name),
      toggle: (name, active) => active ? classes.add(name) : classes.delete(name),
    },
  })
  let shows = 0
  const focused = focusVisibility(scope, root, () => shows++)
  const focus = () => {
    root.ownerDocument.activeElement = child
    root.dispatchEvent(new Event('focusin'))
  }
  return { scope, doc, root, child, classes, focused, focus, shows: () => shows }
}

test('keyboard visibility follows actual focus without making pointer focus sticky', () => {
  const f = fixture()
  assert.equal(f.focused(), false)
  f.focus()
  assert.equal(f.focused(), true)
  assert.equal(f.shows(), 1)
  f.doc.dispatchEvent(new Event('mousedown'))
  assert.equal(f.focused(), false)
  assert.equal(f.classes.size, 0)
  f.doc.dispatchEvent(new Event('keydown'))
  assert.equal(f.focused(), true)
  assert.equal(f.shows(), 2)
  f.doc.dispatchEvent(new Event('keydown'))
  assert.equal(f.shows(), 2)
  f.doc.activeElement = null
  f.root.dispatchEvent(new Event('focusout'))
  assert.equal(f.focused(), false)
  assert.equal(f.classes.size, 0)
  f.scope.dispose()
})

test('moving a focused player rebinds modality listeners and disposal releases both documents', () => {
  const f = fixture()
  f.focus()
  const next = Object.assign(new EventTarget(), { activeElement: null })
  f.root.ownerDocument = next
  f.focus()
  f.doc.dispatchEvent(new Event('mousedown'))
  assert.equal(f.focused(), true)
  next.dispatchEvent(new Event('touchstart'))
  assert.equal(f.focused(), false)
  next.dispatchEvent(new Event('keydown'))
  assert.equal(f.focused(), true)
  const shows = f.shows()
  f.scope.dispose()
  assert.equal(f.focused(), false)
  assert.equal(f.classes.size, 0)
  for (const target of [f.doc, next, f.root])
    target.dispatchEvent(new Event('keydown'))
  f.focus()
  assert.equal(f.shows(), shows)
  assert.equal(f.classes.size, 0)
})
