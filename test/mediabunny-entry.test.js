import assert from 'node:assert/strict'
// eslint-disable-next-line test/no-import-node-test -- Actual entry bridge and lifecycle with controlled native-like Canvas descriptors.
import test from 'node:test'
import { mbCandidate, mbEnvironment } from './helpers/mediabunny.js'

const implementation = await mbCandidate()
function environment() {
  const env = mbEnvironment(implementation)
  env.art.off = (name, callback) => {
    env.handlers.set(name, (env.handlers.get(name) || []).filter(item => item !== callback))
  }
  return env
}

test('MediaBunny entry keeps a callable factory and a writable historical default alias', () => {
  const env = environment()
  assert.equal(typeof env.exported, 'function')
  assert.equal(env.exported.default, env.exported)
  assert.equal(typeof env.exported.default(), 'function')
  assert.deepEqual(Object.keys(env.exported), [])
  const replacement = () => {}
  env.exported.default = replacement
  assert.equal(env.exported.default, replacement)
  assert.equal(typeof env.exported(), 'function')
})

test('MediaBunny entry preserves canvas identity, native receiver and shim binding', async () => {
  const env = environment()
  const canvas = env.factory()(env.art)
  assert.equal(canvas, env.canvas)
  assert.equal(canvas.canvas, canvas)
  assert.equal(canvas.art, env.art)
  assert.equal(env.art.mediabunny.engine, canvas.engine)
  assert.notEqual(canvas.play, canvas.play)
  const pause = canvas.pause
  assert.equal(pause(), undefined)
  canvas.getContext('2d')
  assert.equal(env.nativeCalls.at(-1)[2], true)
  const pending = Promise.resolve()
  canvas.engine.play = () => pending
  assert.equal(canvas.play(), pending)
  env.art.emit('destroy')
})

test('MediaBunny entry preserves enumerable forwarding and readonly setter failure', () => {
  const env = environment()
  const canvas = env.factory()(env.art)
  const descriptor = Object.getOwnPropertyDescriptor(canvas, 'duration')
  assert.equal(descriptor.enumerable, true)
  assert.equal(descriptor.configurable, true)
  assert.equal(typeof descriptor.get, 'function')
  assert.equal(typeof descriptor.set, 'function')
  assert.throws(() => {
    canvas.duration = 4
  }, { name: 'TypeError' })
  env.art.emit('destroy')
})

test('MediaBunny entry preserves native collisions and direct-prototype forwarding boundary', () => {
  const env = environment()
  env.canvas.currentTime = 13
  const native = env.canvas.setAttribute
  const canvas = env.factory()(env.art)
  assert.equal(canvas.currentTime, 13)
  assert.notEqual(canvas.setAttribute, native)
  canvas.setAttribute('src', 'native-only.mp4')
  assert.equal(env.art.mediabunny.src, null)
  assert.equal(Object.hasOwn(canvas, 'toString'), false)
  assert.equal(Object.hasOwn(canvas, 'constructor'), false)
  env.art.emit('destroy')
})

test('MediaBunny resize preserves default styling and autoSize behavior', () => {
  const env = environment()
  const canvas = env.factory()(env.art)
  assert.deepEqual(canvas.style, {})
  env.art.emit('resize')
  assert.deepEqual(canvas.style, { width: '100%', height: '100%', objectFit: 'contain' })
  canvas.style.width = '42px'
  env.art.option.autoSize = true
  env.art.emit('video:loadedmetadata')
  assert.equal(canvas.style.width, '42px')
  env.art.emit('destroy')
})

test('MediaBunny entry destruction unregisters its resize and metadata callbacks', () => {
  const env = environment()
  const canvas = env.factory()(env.art)
  env.art.emit('destroy')
  assert.equal(env.handlers.get('resize')?.length || 0, 0)
  assert.equal(env.handlers.get('video:loadedmetadata')?.length || 0, 0)
  assert.equal(env.handlers.get('destroy')?.length || 0, 0)
  assert.equal(canvas.engine.destroyed, true)
})

test('MediaBunny saved resize callback cannot write after destruction', () => {
  const env = environment()
  const canvas = env.factory()(env.art)
  const callback = env.handlers.get('resize')[0]
  env.art.emit('destroy')
  canvas.style.width = '42px'
  callback()
  assert.equal(canvas.style.width, '42px')
})

test('MediaBunny destruction preserves a replacement art.mediabunny alias', () => {
  const env = environment()
  const canvas = env.factory()(env.art)
  const replacement = {}
  env.art.mediabunny = replacement
  env.art.emit('destroy')
  assert.equal(env.art.mediabunny, replacement)
  assert.equal(canvas.engine.destroyed, true)
})

test('MediaBunny entry attempts listener cleanup even when engine destroy throws', () => {
  const env = environment()
  const canvas = env.factory()(env.art)
  const failure = new Error('engine cleanup failed')
  canvas.engine.destroy = () => {
    throw failure
  }
  assert.throws(() => env.art.emit('destroy'), error => error === failure)
  assert.equal(env.art.mediabunny, undefined)
  assert.equal(env.handlers.get('resize')?.length || 0, 0)
  assert.equal(env.handlers.get('destroy')?.length || 0, 0)
  assert.doesNotThrow(() => env.art.emit('destroy'))
})

test('MediaBunny entry attempts all cleanup after one listener removal fails', () => {
  const env = environment()
  const canvas = env.factory()(env.art)
  const off = env.art.off
  const removed = []
  const failure = new Error('off failed')
  env.art.off = (name, callback) => {
    removed.push(name)
    off(name, callback)
    if (name === 'resize')
      throw failure
  }
  assert.throws(() => env.art.emit('destroy'), error => error === failure)
  assert.deepEqual(removed, ['resize', 'video:loadedmetadata', 'destroy'])
  assert.equal(canvas.engine.destroyed, true)
  assert.equal(env.art.mediabunny, undefined)
})

test('MediaBunny entry keeps legacy host adapters without off usable and callbacks inert after destroy', () => {
  const env = environment()
  delete env.art.off
  const canvas = env.factory()(env.art)
  env.art.emit('destroy')
  canvas.style.width = '42px'
  env.art.emit('resize')
  assert.equal(canvas.style.width, '42px')
})

test('MediaBunny bridge setup failure releases the assigned shim and preserves the original failure', () => {
  const env = environment()
  Object.preventExtensions(env.canvas)
  let captured
  Object.defineProperty(env.art, 'mediabunny', {
    configurable: true,
    get() { return captured },
    set(value) { captured = value },
  })
  assert.throws(() => env.factory()(env.art), { name: 'TypeError' })
  assert.equal(captured.engine.destroyed, true)
  assert.equal(env.art.mediabunny, undefined)
  assert.equal(env.handlers.get('resize')?.length || 0, 0)
})

test('MediaBunny entry calls createElement with the historical detached receiver', () => {
  const env = environment()
  let receiver = 'unset'
  env.art.constructor.utils.createElement = function () {
    receiver = this
    return env.canvas
  }
  env.factory()(env.art)
  assert.equal(receiver, undefined)
  env.art.emit('destroy')
})

test('MediaBunny bridge preserves the two native method getter reads and bound invocation', () => {
  const env = environment()
  let reads = 0
  const receivers = []
  Object.defineProperty(env.canvas, 'probe', {
    enumerable: true,
    configurable: true,
    get() {
      reads++
      return function () {
        receivers.push(this)
      }
    },
    set(value) {
      Object.defineProperty(env.canvas, 'probe', { value, configurable: true })
    },
  })
  env.factory()(env.art)
  assert.equal(reads, 2)
  const probe = env.canvas.probe
  probe()
  assert.equal(receivers[0], env.canvas)
  env.art.emit('destroy')
})

test('MediaBunny partial HLS registration failure cleans the entry, shim and installed callbacks', () => {
  const env = environment()
  const failure = new Error('registration failed')
  const on = env.art.on
  env.art.on = (name, callback) => {
    on(name, callback)
    if (name === 'restart')
      throw failure
  }
  let shim
  Object.defineProperty(env.art, 'mediabunny', {
    configurable: true,
    get() { return shim },
    set(value) { shim = value },
  })
  assert.throws(() => env.factory({ m3u8: {} })(env.art), error => error === failure)
  assert.equal(shim.engine.destroyed, true)
  assert.equal(env.art.mediabunny, undefined)
  assert.equal([...env.handlers.values()].flat().length, 0)
})
