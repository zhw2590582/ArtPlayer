import assert from 'node:assert/strict'
// eslint-disable-next-line test/no-import-node-test -- Exercise actual proxy instances, including historical event semantics.
import test from 'node:test'
import { mbCandidate, mbEnvironment, mbHistorical } from './helpers/mediabunny.js'

const candidate = await mbCandidate()
const frozen = (await mbHistorical()).find(item => item.name === 'frozen-workspace')
function environment(implementation = candidate, option = {}) {
  const env = mbEnvironment(implementation)
  const canvas = env.factory(option)(env.art)
  return { ...env, canvas, shim: env.art.mediabunny, events: canvas.events }
}

test('MediaBunny candidate retains exact shim own/prototype surface, canvas descriptors and bound forwarding', () => {
  const old = environment(frozen)
  const next = environment()
  assert.deepEqual(Object.keys(next.canvas), Object.keys(old.canvas))
  assert.deepEqual(Object.getOwnPropertyNames(next.shim), Object.getOwnPropertyNames(old.shim))
  assert.deepEqual(Object.getOwnPropertyNames(Object.getPrototypeOf(next.shim)), Object.getOwnPropertyNames(Object.getPrototypeOf(old.shim)))
  for (const name of Object.keys(next.canvas)) {
    const a = Object.getOwnPropertyDescriptor(next.canvas, name)
    const b = Object.getOwnPropertyDescriptor(old.canvas, name)
    assert.deepEqual([a.enumerable, a.configurable, a.writable, typeof a.get, typeof a.set], [b.enumerable, b.configurable, b.writable, typeof b.get, typeof b.set], name)
  }
  assert.notEqual(next.canvas.play, next.canvas.play)
  assert.throws(() => Reflect.set(next.canvas, 'duration', 3), { name: 'TypeError' })
  assert.equal(next.canvas.getContext('2d'), next.context)
  next.canvas.setAttribute('src', 'native-only.mp4')
  assert.equal(next.canvas.src, null)
  assert.deepEqual(next.nativeCalls.at(-1), ['attribute', 'src', 'native-only.mp4'])
})

for (const implementation of [frozen, candidate]) {
  test(`MediaBunny ${implementation.name}: event dispatch retains duplicates, first removal, detail identity and live-array mutation`, () => {
    const env = environment(implementation)
    const calls = []
    const detail = { value: 7 }
    const duplicate = (event) => {
      assert(event instanceof Event)
      assert.equal(event.detail, detail)
      calls.push('duplicate')
    }
    env.events.addEventListener('custom', duplicate)
    env.events.addEventListener('custom', duplicate)
    assert.equal(env.events.removeEventListener('custom', duplicate), undefined)
    env.events.addEventListener('custom', () => {
      calls.push('mutate')
      env.events.removeEventListener('custom', duplicate)
      env.events.addEventListener('custom', () => calls.push('new'))
    })
    env.events.addEventListener('custom', () => calls.push('last'))
    assert.equal(env.events.emit('custom', detail), undefined)
    assert.deepEqual(calls, ['duplicate', 'mutate', 'new'])
  })

  test(`MediaBunny ${implementation.name}: event errors propagate and explicit nested emits preserve ordering`, () => {
    const env = environment(implementation)
    const calls = []
    env.events.addEventListener('outer', () => {
      calls.push('outer')
      env.events.emit('inner')
    })
    env.events.addEventListener('inner', () => calls.push('inner'))
    env.events.addEventListener('outer', () => calls.push('tail'))
    env.events.emit('outer')
    assert.deepEqual(calls, ['outer', 'inner', 'tail'])
    const error = new Error('user callback')
    env.events.addEventListener('failure', () => {
      throw error
    })
    env.events.addEventListener('failure', () => calls.push('unreachable'))
    assert.throws(() => env.events.emit('failure'), item => item === error)
    assert.equal(calls.includes('unreachable'), false)
  })

  test(`MediaBunny ${implementation.name}: coercion, no-op setters and pseudo ranges keep normal behavior`, () => {
    const option = { volume: 2, autoplay: true, loop: true, crossOrigin: 'anonymous', poster: 'first.png' }
    const env = environment(implementation, option)
    assert.equal(env.canvas.option, option)
    assert.equal(env.canvas.volume, 2)
    env.canvas.volume = '0.4'
    assert.equal(env.canvas.volume, 0.4)
    assert.equal(env.canvas.muted, false)
    env.canvas.muted = 'yes'
    assert.equal(env.canvas.muted, true)
    env.canvas.playbackRate = '2'
    env.canvas.playbackRate = 0
    assert.equal(env.canvas.playbackRate, 2)
    env.canvas.autoplay = false
    env.canvas.loop = false
    env.canvas.crossOrigin = 'use-credentials'
    assert.deepEqual([env.canvas.autoplay, env.canvas.loop, env.canvas.crossOrigin], [true, true, 'anonymous'])
    env.canvas.poster = 'next.png'
    assert.equal(option.poster, 'next.png')
    Object.defineProperty(env.canvas.engine, 'duration', { value: 12 })
    Object.defineProperty(env.canvas.engine, 'currentTime', { value: 3 })
    assert.equal(env.canvas.buffered.end(99), 12)
    assert.equal(env.canvas.played.end(-1), 3)
    assert.equal(env.canvas.seekable.start(99), 0)
    assert.equal(env.canvas.canPlayType('invalid/media'), 'maybe')
  })

  test(`MediaBunny ${implementation.name}: public forwarding retains exact Promise identity and synchronous void methods`, async () => {
    const env = environment(implementation)
    const calls = []
    const result = Promise.resolve()
    env.canvas.engine.play = () => result
    env.canvas.engine.pause = () => calls.push('pause')
    env.canvas.engine.load = source => calls.push(['load', source])
    env.canvas.engine.seek = time => calls.push(['seek', time])
    assert.equal(env.canvas.play(), result)
    assert.equal(env.canvas.pause(), undefined)
    env.canvas.src = 'movie.mp4'
    assert.equal(env.canvas.load(), undefined)
    env.canvas.currentTime = '3.5'
    assert.deepEqual(calls, ['pause', ['load', 'movie.mp4'], ['load', 'movie.mp4'], ['seek', 3.5]])
    await result
  })
}

test('MediaBunny candidate destroy cancels synthetic frame callbacks including handle zero', () => {
  const env = environment()
  let calls = 0
  const id = env.canvas.requestVideoFrameCallback(() => calls++)
  assert.equal(id, 0)
  const queued = env.frames.get(id)
  env.art.emit('destroy')
  assert.equal(env.frames.size, 0)
  queued(100)
  assert.equal(calls, 0)
  env.canvas.requestVideoFrameCallback(() => calls++)
  assert.equal(env.frames.size, 0)
})

test('MediaBunny candidate teardown stops the current dispatch after a listener destroys the shim', () => {
  const env = environment()
  const calls = []
  env.events.addEventListener('custom', () => {
    calls.push('destroy')
    env.shim.destroy()
  })
  env.events.addEventListener('custom', () => calls.push('obsolete'))
  env.events.emit('custom')
  assert.deepEqual(calls, ['destroy'])
  assert.equal(env.events.listeners.size, 0)
  const cursor = env.emitted.length
  env.events.emit('volumechange')
  assert.equal(env.emitted.length, cursor)
})

test('MediaBunny candidate teardown releases event and frame resources even when engine cleanup throws', () => {
  const env = environment()
  const failure = new Error('cleanup failed')
  env.canvas.requestVideoFrameCallback(() => {})
  env.canvas.engine.destroy = () => {
    throw failure
  }
  assert.throws(() => env.shim.destroy(), error => error === failure)
  assert.equal(env.events.listeners.size, 0)
  assert.equal(env.frames.size, 0)
  assert.doesNotThrow(() => env.shim.destroy())
})
