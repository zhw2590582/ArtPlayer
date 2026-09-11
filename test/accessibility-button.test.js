import assert from 'node:assert/strict'
// eslint-disable-next-line test/no-import-node-test -- Exercise owned keyboard interactions with the repository runner.
import { test } from 'node:test'
import { loadModules } from './helpers/load.js'

const { keyboardButton, isClaimedKey, acceptsHotkey, ResourceScope } = await loadModules({
  keyboardButton: { file: 'packages/artplayer/src/accessibility/button', name: 'keyboardButton' },
  isClaimedKey: { file: 'packages/artplayer/src/accessibility/keyboard', name: 'isClaimedKey' },
  acceptsHotkey: { file: 'packages/artplayer/src/input/keyboard-focus', name: 'acceptsHotkey' },
  ResourceScope: 'packages/artplayer/src/lifecycle/scope',
})

class Button extends EventTarget {
  attributes = new Map()
  ownerDocument = { activeElement: this }
  nodeType = 1
  tagName = 'DIV'
  isContentEditable = false
  hits = 0
  getAttribute(key) { return this.attributes.get(key) ?? null }
  hasAttribute(key) { return this.attributes.has(key) }
  setAttribute(key, value) { this.attributes.set(key, String(value)) }
  click() { this.hits++ }
}

function fixture() {
  const scope = new ResourceScope()
  const button = new Button()
  keyboardButton(scope, button)
  const key = (type, value, options = {}) => {
    const event = Object.assign(new Event(type, { cancelable: true }), { key: value, ...options })
    button.dispatchEvent(event)
    return event
  }
  return { scope, button, key }
}

test('buttons activate Enter on press and Space on release without key-repeat duplicates', () => {
  const { scope, button, key } = fixture()
  assert.equal(button.getAttribute('role'), 'button')
  assert.equal(button.tabIndex, 0)
  assert.equal(key('keydown', 'Enter').defaultPrevented, true)
  key('keydown', 'Enter', { repeat: true })
  key('keyup', 'Enter')
  assert.equal(button.hits, 1)
  key('keydown', ' ')
  key('keydown', ' ', { repeat: true })
  assert.equal(button.hits, 1)
  key('keyup', ' ')
  key('keyup', ' ')
  assert.equal(button.hits, 2)
  scope.dispose()
})

test('owned button keys avoid hotkeys while unrelated prevented events keep the legacy policy', () => {
  const { scope, button, key } = fixture()
  const owned = key('keydown', ' ')
  assert.equal(isClaimedKey(owned), true)
  assert.equal(acceptsHotkey(owned, button.ownerDocument), false)
  const external = new Event('keydown', { cancelable: true })
  external.preventDefault()
  assert.equal(isClaimedKey(external), false)
  assert.equal(acceptsHotkey(external, button.ownerDocument), true)
  scope.dispose()
})

test('blur, modifiers, composition and disabled state cancel button activation', () => {
  const { scope, button, key } = fixture()
  key('keydown', ' ')
  button.dispatchEvent(new Event('blur'))
  key('keyup', ' ')
  for (const options of [{ ctrlKey: true }, { altKey: true }, { metaKey: true }, { isComposing: true }]) {
    key('keydown', 'Enter', options)
    key('keydown', ' ', options)
    key('keyup', ' ', options)
  }
  button.setAttribute('aria-disabled', 'true')
  assert.equal(isClaimedKey(key('keydown', 'Enter')), true)
  key('keydown', ' ')
  key('keyup', ' ')
  assert.equal(button.hits, 0)
  scope.dispose()
})

test('disposal removes button listeners and invalidates an armed Space action', () => {
  const { scope, button, key } = fixture()
  key('keydown', ' ')
  scope.dispose()
  assert.equal(key('keyup', ' ').defaultPrevented, false)
  assert.equal(key('keydown', 'Enter').defaultPrevented, false)
  assert.equal(button.hits, 0)
})

test('suspended button scopes cannot activate or arm Space until resumed', () => {
  const scope = new ResourceScope()
  const button = new Button()
  let active = false
  keyboardButton(scope, button, () => button.click(), () => active)
  const key = (type, value) => button.dispatchEvent(Object.assign(new Event(type, { cancelable: true }), { key: value }))
  key('keydown', 'Enter')
  key('keydown', ' ')
  active = true
  key('keyup', ' ')
  assert.equal(button.hits, 0)
  key('keydown', ' ')
  active = false
  key('keyup', ' ')
  active = true
  key('keyup', ' ')
  assert.equal(button.hits, 0)
  key('keydown', 'Enter')
  assert.equal(button.hits, 1)
  scope.dispose()
})

test('button setup preserves caller role and tab order and ignores descendant key events', () => {
  const scope = new ResourceScope()
  const button = new Button()
  button.setAttribute('role', 'switch')
  button.setAttribute('tabindex', '-1')
  keyboardButton(scope, button)
  assert.equal(button.getAttribute('role'), 'switch')
  assert.equal(button.getAttribute('tabindex'), '-1')
  const event = Object.assign(new Event('keydown', { cancelable: true }), { key: 'Enter', composedPath: () => [new Button(), button] })
  button.dispatchEvent(event)
  assert.equal(event.defaultPrevented, false)
  assert.equal(button.hits, 0)
  scope.dispose()
})
