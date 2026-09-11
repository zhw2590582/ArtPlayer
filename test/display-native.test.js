import assert from 'node:assert/strict'
import { getEventListeners } from 'node:events'
// eslint-disable-next-line test/no-import-node-test -- Use the repository Node test runner.
import { test } from 'node:test'
import { setImmediate } from 'node:timers/promises'
import { loadModules } from './helpers/load.js'

const { ResourceScope, requestFullscreen, nativeFullscreen, beginLifecycle, getScope } = await loadModules({
  ResourceScope: 'packages/artplayer/src/lifecycle/scope',
  requestFullscreen: { file: 'packages/artplayer/src/display/fullscreen-request', name: 'requestFullscreen' },
  nativeFullscreen: { file: 'packages/artplayer/src/display/native-fullscreen', name: 'nativeFullscreen' },
  beginLifecycle: { file: 'packages/artplayer/src/lifecycle/instance', name: 'beginLifecycle' },
  getScope: { file: 'packages/artplayer/src/lifecycle/instance', name: 'getScope' },
})

function fixture() {
  const classes = new Set()
  const target = { classList: {
    remove: name => classes.delete(name),
    toggle: (name, value) => value ? classes.add(name) : classes.delete(name),
  } }
  const adapter = {
    document: new EventTarget(),
    target,
    element: null,
    elementProperty: 'fullscreenElement',
    changeEvent: 'fullscreenchange',
    errorEvent: 'fullscreenerror',
    request: () => Promise.resolve(),
    exit: () => Promise.resolve(),
  }
  Object.defineProperty(adapter.document, 'fullscreenElement', { get: () => adapter.element })
  const events = []
  const art = {
    template: { $player: target, $video: {} },
    notice: { show: '' },
    state: 'standard',
    emit: (...args) => events.push(args),
  }
  beginLifecycle(art)
  const descriptor = nativeFullscreen(art, adapter)
  const change = (element) => {
    adapter.element = element
    adapter.document.dispatchEvent(new Event(adapter.changeEvent))
  }
  const listeners = () => [adapter.changeEvent, adapter.errorEvent].map(name => getEventListeners(adapter.document, name).length)
  return { art, adapter, classes, descriptor, change, events, listeners }
}

test('fullscreen native invocation retains the caller stack and original rejection', async () => {
  const { adapter } = fixture()
  const parent = new ResourceScope()
  const failure = new Error('denied')
  let called = false
  adapter.request = () => {
    called = true
    return Promise.reject(failure)
  }
  const operation = requestFullscreen(adapter, parent, true, () => assert.fail('not cancelled'))
  assert.equal(called, true)
  await assert.rejects(operation.promise, error => error === failure)
  assert.equal(getEventListeners(adapter.document, adapter.changeEvent).length, 1)
  assert.equal(getEventListeners(adapter.document, adapter.errorEvent).length, 1)
  parent.dispose()
})

test('void fullscreen APIs wait for the actual change and remove operation listeners', async () => {
  const { adapter, change, listeners } = fixture()
  adapter.request = () => undefined
  const parent = new ResourceScope()
  const operation = requestFullscreen(adapter, parent, true, () => {})
  let settled = false
  void operation.promise.then(() => settled = true)
  await setImmediate()
  assert.equal(settled, false)
  assert.deepEqual(listeners(), [2, 2])
  change(adapter.target)
  await operation.promise
  assert.deepEqual(listeners(), [1, 1])
  parent.dispose()
})

test('void native exit waits while the instance video still owns fullscreen', async () => {
  const { art, adapter, descriptor, change, listeners } = fixture()
  change(art.template.$video)
  adapter.exit = () => undefined
  let settled = false
  const exit = descriptor.set(false).then(() => settled = true)
  await setImmediate()
  assert.equal(settled, false)
  assert.deepEqual(listeners(), [2, 2])
  change(null)
  await exit
  assert.equal(settled, true)
  assert.deepEqual(listeners(), [1, 1])
  getScope(art).dispose()
})

test('fullscreen request disposal settles without waiting and handles late completion once', async () => {
  const { adapter, listeners } = fixture()
  let complete
  let late = 0
  adapter.request = () => new Promise(resolve => complete = resolve)
  const parent = new ResourceScope()
  const operation = requestFullscreen(adapter, parent, true, () => late++)
  parent.dispose()
  await operation.promise
  assert.deepEqual(listeners(), [1, 1])
  complete()
  await setImmediate()
  assert.equal(late, 1)
})

test('closed fullscreen request scopes never call the browser', async () => {
  const { adapter } = fixture()
  adapter.request = () => assert.fail('closed request invoked')
  const parent = new ResourceScope()
  parent.dispose()
  await requestFullscreen(adapter, parent, true, () => {}).promise
})

test('native promise rejection retains its error when fullscreenerror arrives first', async () => {
  const { adapter } = fixture()
  const failure = new Error('browser permission denied')
  adapter.request = () => {
    adapter.document.dispatchEvent(new Event(adapter.errorEvent))
    return Promise.reject(failure)
  }
  const parent = new ResourceScope()
  await assert.rejects(requestFullscreen(adapter, parent, true, () => {}).promise, error => error === failure)
  parent.dispose()
})

test('void fullscreen errors reject and release both temporary listeners', async () => {
  const { adapter, listeners } = fixture()
  adapter.request = () => undefined
  const parent = new ResourceScope()
  const operation = requestFullscreen(adapter, parent, true, () => {})
  adapter.document.dispatchEvent(new Event(adapter.errorEvent))
  await assert.rejects(operation.promise, /Fullscreen request failed/)
  assert.deepEqual(listeners(), [1, 1])
  parent.dispose()
})

test('synchronous void fullscreen errors reject without waiting for a second event', async () => {
  const { adapter, listeners } = fixture()
  adapter.request = () => {
    adapter.document.dispatchEvent(new Event(adapter.errorEvent))
  }
  const parent = new ResourceScope()
  await assert.rejects(requestFullscreen(adapter, parent, true, () => {}).promise, /Fullscreen request failed/)
  assert.deepEqual(listeners(), [1, 1])
  parent.dispose()
})

for (const close of ['exit', 'destroy']) {
  test(`pending fullscreen ${close} settles promptly and exits its late native entry`, async () => {
    const { art, adapter, descriptor, listeners } = fixture()
    let complete
    let exits = 0
    adapter.request = () => new Promise(resolve => complete = resolve)
    adapter.exit = () => {
      exits++
      adapter.element = null
      return Promise.resolve()
    }
    const entering = descriptor.set(true)
    if (close === 'destroy')
      getScope(art).dispose()
    else
      await descriptor.set(false)
    await entering
    assert.deepEqual(listeners(), close === 'destroy' ? [0, 0] : [1, 1])
    adapter.element = adapter.target
    complete()
    await setImmediate()
    assert.equal(exits, 1)
    assert.equal(descriptor.get(), false)
  })
}

test('late cancelled fullscreen completion cannot exit another player', async () => {
  const { art, adapter, descriptor } = fixture()
  let complete
  adapter.request = () => new Promise(resolve => complete = resolve)
  adapter.exit = () => assert.fail('exited another player')
  const entering = descriptor.set(true)
  getScope(art).dispose()
  await entering
  adapter.element = {}
  complete()
  await setImmediate()
})

test('cancelled void fullscreen requests retain no instance listeners and release late entry', async () => {
  const { art, adapter, descriptor, change, listeners, events } = fixture()
  let exits = 0
  adapter.request = () => undefined
  adapter.exit = () => {
    exits++
    adapter.element = null
  }
  const entering = descriptor.set(true)
  getScope(art).dispose()
  await entering
  // One shared document guard remains; both per-instance listeners are gone.
  assert.deepEqual(listeners(), [1, 0])
  change({})
  assert.equal(exits, 0)
  change(adapter.target)
  assert.equal(exits, 1)
  assert.equal(adapter.element, null)
  assert.deepEqual(events, [])
})

test('new native entry supersedes an abandoned void request for the same target', async () => {
  const { art, adapter, descriptor, change } = fixture()
  adapter.request = () => undefined
  adapter.exit = () => assert.fail('new entry was mistaken for cancellation')
  const first = descriptor.set(true)
  await descriptor.set(false)
  await first
  const second = descriptor.set(true)
  change(adapter.target)
  await second
  assert.equal(descriptor.get(), true)
  adapter.element = null
  getScope(art).dispose()
})

test('cancelled void entry never emits a stale true event or sets its fullscreen class', async () => {
  const { art, adapter, descriptor, change, events, classes } = fixture()
  adapter.request = () => undefined
  adapter.exit = () => change(null)
  const entering = descriptor.set(true)
  await descriptor.set(false)
  await entering
  change(adapter.target)
  assert.deepEqual(events, [])
  assert.equal(classes.has('art-fullscreen'), false)
  assert.equal(descriptor.get(), false)
  getScope(art).dispose()
})

test('cancelled promise entry rejects a late change before its native promise resolves', async () => {
  const { art, adapter, descriptor, change, events, classes } = fixture()
  let complete
  adapter.request = () => new Promise(resolve => complete = resolve)
  adapter.exit = () => {
    change(null)
    return Promise.resolve()
  }
  const entering = descriptor.set(true)
  await descriptor.set(false)
  await entering
  change(adapter.target)
  complete()
  await setImmediate()
  assert.deepEqual(events, [])
  assert.equal(classes.has('art-fullscreen'), false)
  assert.equal(descriptor.get(), false)
  getScope(art).dispose()
})

test('fullscreen rejection stays observable through the descriptor and reports notice', async () => {
  const { art, adapter, descriptor, listeners } = fixture()
  const failure = new Error('denied')
  adapter.request = () => Promise.reject(failure)
  await assert.rejects(descriptor.set(true), error => error === failure)
  assert.equal(art.notice.show, failure)
  assert.deepEqual(listeners(), [1, 1])
  getScope(art).dispose()
})

test('fullscreen event precedes the class update and resize', async () => {
  const { art, adapter, descriptor, classes, change } = fixture()
  const observations = []
  art.emit = (name, value) => observations.push([name, value, classes.has('art-fullscreen')])
  adapter.request = () => {
    change(adapter.target)
    return Promise.resolve()
  }
  await descriptor.set(true)
  assert.deepEqual(observations, [['fullscreen', true, false], ['resize', undefined, true]])
  getScope(art).dispose()
})

test('reentrant true during fullscreen entry still updates its class and resize', async () => {
  const { art, adapter, descriptor, classes, change, events } = fixture()
  art.emit = (...args) => {
    events.push(args)
    if (args[0] === 'fullscreen' && args[1])
      void descriptor.set(true)
  }
  adapter.request = () => {
    change(adapter.target)
    return Promise.resolve()
  }
  await descriptor.set(true)
  assert.equal(classes.has('art-fullscreen'), true)
  assert.deepEqual(events, [['fullscreen', true], ['resize']])
  getScope(art).dispose()
})

test('reentrant exit during fullscreen entry prevents stale class and resize', async () => {
  const { art, adapter, descriptor, classes, change, events } = fixture()
  art.emit = (...args) => {
    events.push(args)
    if (args[0] === 'fullscreen' && args[1])
      void descriptor.set(false)
  }
  adapter.request = () => {
    change(adapter.target)
    return Promise.resolve()
  }
  adapter.exit = () => {
    change(null)
    return Promise.resolve()
  }
  await descriptor.set(true)
  assert.equal(classes.has('art-fullscreen'), false)
  assert.deepEqual(events, [['fullscreen', true], ['fullscreen', false], ['resize']])
  getScope(art).dispose()
})
