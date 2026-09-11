import assert from 'node:assert/strict'
// eslint-disable-next-line test/no-import-node-test -- Use the repository Node test runner.
import { test } from 'node:test'
import { loadModules } from './helpers/load.js'

const { globalInit, ownListeners, proxyListener, removeListener, destroyListeners, beginLifecycle, getScope } = await loadModules({
  globalInit: 'packages/artplayer/src/events/globalInit',
  ...Object.fromEntries(['ownListeners', 'proxyListener', 'removeListener', 'destroyListeners'].map(name => [name, { file: 'packages/artplayer/src/events/listener-registry', name }])),
  beginLifecycle: { file: 'packages/artplayer/src/lifecycle/instance', name: 'beginLifecycle' },
  getScope: { file: 'packages/artplayer/src/lifecycle/instance', name: 'getScope' },
})

function source() {
  const window = new EventTarget()
  const document = Object.assign(new EventTarget(), { defaultView: window })
  return { document, window }
}

function fixture() {
  const initial = source()
  const received = []
  const art = {
    template: { $player: { ownerDocument: initial.document } },
    emit: (...args) => received.push(args),
  }
  beginLifecycle(art)
  const registry = { destroyEvents: new Set() }
  ownListeners(registry, art)
  registry.proxy = (...args) => proxyListener(registry, ...args)
  registry.remove = dispose => removeListener(registry, dispose)
  const scope = getScope(art)
  scope.add(() => {
    destroyListeners(registry)
    return undefined
  })
  globalInit(art, registry)
  return { initial, art, registry, scope, received }
}

test('global rebinding selects current owner targets, keeps event identity and original window fallback', () => {
  const f = fixture()
  const next = source()
  const event = new Event('mouseup')
  const scroll = new Event('scroll')
  f.registry.bindGlobalEvents({ document: next.document })
  f.initial.document.dispatchEvent(new Event('mouseup'))
  next.document.dispatchEvent(event)
  next.window.dispatchEvent(new Event('scroll'))
  f.initial.window.dispatchEvent(scroll)
  assert.deepEqual(f.received, [['document:mouseup', event], ['window:scroll', scroll]])
  f.art.template.$player.ownerDocument = next.document
  f.registry.bindGlobalEvents()
  f.initial.window.dispatchEvent(new Event('scroll'))
  next.window.dispatchEvent(scroll)
  assert.equal(f.received.length, 3)
  f.scope.dispose()
  next.document.dispatchEvent(event)
  assert.equal(f.received.length, 3)
  assert.equal(f.registry.destroyEvents.size, 0)
})

test('window registration failure rolls back the staged document while old listeners keep working', () => {
  const f = fixture()
  const next = source()
  const failure = new Error('window failure')
  next.window.addEventListener = () => {
    throw failure
  }
  assert.throws(() => f.registry.bindGlobalEvents(next), error => error === failure)
  const event = new Event('mouseup')
  next.document.dispatchEvent(new Event('mouseup'))
  f.initial.document.dispatchEvent(event)
  assert.deepEqual(f.received, [['document:mouseup', event]])
  assert.equal(f.registry.destroyEvents.size, 15)
  f.scope.dispose()
})

test('staged listeners do not forward before commit while the previous binding remains active', () => {
  const f = fixture()
  const next = source()
  const original = next.window.addEventListener
  const oldEvent = new Event('mouseup')
  next.window.addEventListener = function (name, ...args) {
    if (name === 'resize') {
      next.document.dispatchEvent(new Event('mouseup'))
      f.initial.document.dispatchEvent(oldEvent)
    }
    return original.call(this, name, ...args)
  }
  f.registry.bindGlobalEvents(next)
  assert.deepEqual(f.received, [['document:mouseup', oldEvent]])
  const nextEvent = new Event('mouseup')
  next.document.dispatchEvent(nextEvent)
  f.initial.document.dispatchEvent(new Event('mouseup'))
  assert.deepEqual(f.received, [['document:mouseup', oldEvent], ['document:mouseup', nextEvent]])
  f.scope.dispose()
})

test('a newer reentrant global binding wins and the interrupted registration is released', () => {
  const f = fixture()
  const interrupted = source()
  const newest = source()
  const original = interrupted.document.addEventListener
  interrupted.document.addEventListener = function (name, ...args) {
    if (name === 'click')
      f.registry.bindGlobalEvents(newest)
    return original.call(this, name, ...args)
  }
  f.registry.bindGlobalEvents(interrupted)
  f.initial.document.dispatchEvent(new Event('mouseup'))
  interrupted.document.dispatchEvent(new Event('mouseup'))
  const event = new Event('mouseup')
  newest.document.dispatchEvent(event)
  assert.deepEqual(f.received, [['document:mouseup', event]])
  assert.equal(f.registry.destroyEvents.size, 15)
  f.scope.dispose()
})

test('destroy during rebinding clears staged and old listeners and later bind remains inert', () => {
  const f = fixture()
  const next = source()
  const original = next.document.addEventListener
  next.document.addEventListener = function (...args) {
    f.scope.dispose()
    return original.apply(this, args)
  }
  f.registry.bindGlobalEvents(next)
  assert.equal(f.registry.destroyEvents.size, 0)
  f.registry.bindGlobalEvents()
  f.initial.document.dispatchEvent(new Event('mouseup'))
  next.document.dispatchEvent(new Event('mouseup'))
  assert.deepEqual(f.received, [])
})
