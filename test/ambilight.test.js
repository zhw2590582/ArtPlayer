import assert from 'node:assert/strict'
// eslint-disable-next-line test/no-import-node-test -- Preserve historical RAF/canvas behavior separately from candidate fixes.
import test from 'node:test'
import { ambilightEnvironment, ambilightHistorical } from './helpers/ambilight.js'

for (const implementation of await ambilightHistorical()) {
  const label = implementation.name

  test(`Ambilight ${label}: frequency throttles samples and pause/stop preserve last colors`, async () => {
    const env = await ambilightEnvironment(implementation)
    const result = env.factory({ frequency: 2 })(env.art)
    env.art.emit('ready')
    env.art.playing = true
    env.frame(499)
    assert.equal(env.draws.length, 0)
    env.frame(500)
    assert.equal(env.draws.length, 9)
    const colors = env.parent.children[0].children.map(child => child.style.backgroundColor)
    env.art.playing = false
    env.frame(1000)
    assert.equal(env.draws.length, 9)
    assert.equal(env.frames.size, 1)
    result.stop()
    assert.deepEqual(env.parent.children[0].children.map(child => child.style.backgroundColor), colors)
    env.art.playing = true
    result.start()
    assert.equal(env.draws.length, 18)
    assert.equal(env.frames.size, 1)
    result.stop()
  })

  test(`Ambilight ${label}: ordinary start/stop is repeatable and ready can restart an earlier stop`, async () => {
    const env = await ambilightEnvironment(implementation)
    const result = env.factory()(env.art)
    result.stop()
    env.art.emit('ready')
    result.start()
    result.start()
    assert.equal(env.frames.size, 1)
    result.stop()
    result.stop()
    assert.equal(env.frames.size, 0)
    result.start()
    assert.equal(env.frames.size, 1)
    result.stop()
  })

  test(`Ambilight ${label}: special frequency values preserve historical JavaScript division semantics`, async () => {
    for (const [frequency, samples] of [[0, 0], [-1, 9], [Infinity, 9], [Number.NaN, 9], ['2', 0]]) {
      const env = await ambilightEnvironment(implementation)
      const result = env.factory({ frequency })(env.art)
      env.art.playing = true
      env.time(100)
      result.start()
      assert.equal(env.draws.length, samples, String(frequency))
      assert.equal(env.frames.size, 1)
      result.stop()
    }
  })

  test(`Ambilight ${label}: historical RAF id zero creates duplicate work and escapes stop`, async () => {
    const env = await ambilightEnvironment(implementation, { firstFrame: 0 })
    const result = env.factory()(env.art)
    result.start()
    result.start()
    assert.equal(env.frames.size, 2)
    result.stop()
    assert.deepEqual([...env.frames.keys()], [0])
  })

  test(`Ambilight ${label}: historical destroy leaves its view and escaped start can restart frames`, async () => {
    const env = await ambilightEnvironment(implementation)
    const result = env.factory()(env.art)
    env.art.emit('ready')
    env.art.destroy()
    assert.equal(env.frames.size, 0)
    assert.equal(env.parent.children.length, 2)
    result.start()
    assert.equal(env.frames.size, 1)
    result.stop()
  })

  test(`Ambilight ${label}: historical frame exceptions wedge start until an explicit stop`, async () => {
    for (const errorType of ['draw', 'read']) {
      const env = await ambilightEnvironment(implementation)
      const result = env.factory()(env.art)
      const error = Object.assign(new Error(errorType), { name: errorType === 'read' ? 'SecurityError' : 'InvalidStateError' })
      result.start()
      env.art.playing = true
      if (errorType === 'read')
        env.setReadError(error)
      else env.setDrawError(error)
      assert.throws(() => env.frame(100), value => value === error)
      assert.equal(env.frames.size, 0)
      env.setReadError(null)
      env.setDrawError(null)
      result.start()
      assert.equal(env.frames.size, 0, 'Stale nonzero handle still blocks restart')
      result.stop()
      env.time(200)
      result.start()
      assert.equal(env.frames.size, 1)
      result.stop()
    }
  })

  test(`Ambilight ${label}: historical null contexts and zero dimensions reach unguarded sampling`, async () => {
    const missing = await ambilightEnvironment(implementation, { noContext: true })
    const result = missing.factory()(missing.art)
    missing.art.playing = true
    missing.time(100)
    assert.throws(result.start, error => error.name === 'TypeError')
    assert.equal(missing.parent.children.length, 2)
    const zero = await ambilightEnvironment(implementation)
    zero.video.videoWidth = zero.video.videoHeight = 0
    zero.art.playing = true
    zero.time(100)
    const zeroResult = zero.factory()(zero.art)
    zeroResult.start()
    assert.equal(zero.draws.length, 9, 'Recorder accepts zero area; this proves missing guard, not browser acceptance')
    assert.equal(zero.draws[0][3], 0)
    assert.equal(zero.draws[0][4], 0)
    zeroResult.stop()
  })

  test(`Ambilight ${label}: historical stop/destroy during sampling queues a new frame after cleanup`, async () => {
    for (const operation of ['stop', 'destroy']) {
      let result
      let first = true
      const env = await ambilightEnvironment(implementation, { onDraw() {
        if (!first)
          return
        first = false
        if (operation === 'stop')
          result.stop()
        else env.art.destroy()
      } })
      result = env.factory()(env.art)
      result.start()
      env.art.playing = true
      env.frame(100)
      assert.equal(env.draws.length, 9)
      assert.equal(env.frames.size, 1)
      result.stop()
    }
  })

  test(`Ambilight ${label}: historical setup failure retains an inserted view without a cleanup handle`, async () => {
    const env = await ambilightEnvironment(implementation)
    const failure = new Error('style setup failed')
    env.art.constructor.utils.setStyles = () => {
      throw failure
    }
    assert.throws(() => env.factory()(env.art), error => error === failure)
    assert.equal(env.parent.children.length, 2)
    assert.equal(env.listeners.size, 0)
  })

  test(`Ambilight ${label}: historical late attachment to a destroyed host still allocates and starts`, async () => {
    const env = await ambilightEnvironment(implementation)
    env.art.destroy()
    const result = env.factory()(env.art)
    assert.equal(env.parent.children.length, 2)
    result.start()
    assert.equal(env.frames.size, 1)
    result.stop()
  })
}
