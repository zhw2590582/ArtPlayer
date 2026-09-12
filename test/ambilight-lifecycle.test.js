import assert from 'node:assert/strict'
// eslint-disable-next-line test/no-import-node-test -- Candidate lifecycle assertions are also run against the frozen source to prove the fixes.
import test from 'node:test'
import { ambilightCandidate, ambilightEnvironment, ambilightHistorical } from './helpers/ambilight.js'

const implementation = await ambilightCandidate()

test('Ambilight candidate matches all historical normal grid, sample order, timing and public return observations', async () => {
  const observations = []
  for (const source of [...await ambilightHistorical(), implementation]) {
    const env = await ambilightEnvironment(source)
    const result = env.factory()(env.art)
    const grid = env.parent.children[0]
    env.art.emit('ready')
    env.art.playing = true
    env.frame(99)
    assert.equal(env.draws.length, 0)
    env.frame(100)
    assert.equal(env.draws.length, 9)
    env.frame(199)
    assert.equal(env.draws.length, 9)
    observations.push({ name: result.name, grid: { className: grid.className, style: grid.style }, items: grid.children.map(child => child.style), samples: env.draws.map(args => [...args.slice(1)]), start: result.start(), stop: result.stop(), pending: env.frames.size })
  }
  for (const observed of observations.slice(1))
    assert.deepEqual(observed, observations[0])
})

test('Ambilight candidate tracks RAF zero without duplicate work and cancels it', async () => {
  const env = await ambilightEnvironment(implementation, { firstFrame: 0 })
  const result = env.factory()(env.art)
  result.start()
  result.start()
  assert.equal(env.frames.size, 1)
  result.stop()
  assert.equal(env.frames.size, 0)
})

test('Ambilight candidate core destruction releases its view, canvas and listeners and makes escaped methods inert', async () => {
  const env = await ambilightEnvironment(implementation)
  const result = env.factory()(env.art)
  env.art.emit('ready')
  env.art.destroy()
  result.start()
  result.stop()
  env.art.emit('ready')
  env.art.destroy()
  assert.equal(env.frames.size, 0)
  assert.deepEqual(env.parent.children, [env.video])
  assert.equal(env.nodes.find(node => node.tag === 'canvas').width, 0)
  assert.equal(env.listeners.get('ready')?.size || 0, 0)
  assert.equal(env.listeners.get('destroy')?.size || 0, 0)
})

test('Ambilight candidate recovers from canvas read/draw failure without wedging its loop', async () => {
  for (const kind of ['read', 'draw']) {
    const env = await ambilightEnvironment(implementation)
    const result = env.factory()(env.art)
    result.start()
    env.art.playing = true
    const failure = Object.assign(new Error(kind), { name: kind === 'read' ? 'SecurityError' : 'InvalidStateError' })
    if (kind === 'read')
      env.setReadError(failure)
    else env.setDrawError(failure)
    assert.doesNotThrow(() => env.frame(100))
    assert.equal(env.frames.size, 1)
    env.setReadError(null)
    env.setDrawError(null)
    env.frame(200)
    assert.equal(env.draws.length, 10)
    assert.equal(env.parent.children[0].children[8].style.backgroundColor, 'rgb(10, 20, 30)')
    env.art.destroy()
  }
})

test('Ambilight candidate skips unavailable contexts and invalid dimensions while retaining a recoverable loop', async () => {
  const missing = await ambilightEnvironment(implementation, { noContext: true })
  missing.art.playing = true
  missing.time(100)
  assert.doesNotThrow(() => missing.factory()(missing.art).start())
  assert.equal(missing.frames.size, 1)
  missing.art.destroy()
  for (const width of [0, -1, Number.NaN, Infinity]) {
    const env = await ambilightEnvironment(implementation)
    env.video.videoWidth = width
    env.art.playing = true
    env.time(100)
    const result = env.factory()(env.art)
    result.start()
    assert.equal(env.draws.length, 0)
    env.video.videoWidth = 300
    env.frame(200)
    assert.equal(env.draws.length, 9)
    env.art.destroy()
  }
})

test('Ambilight candidate stops in-progress sampling after reentrant stop or core destruction', async () => {
  for (const operation of ['stop', 'destroy']) {
    let result
    const env = await ambilightEnvironment(implementation, { onDraw() {
      if (operation === 'stop')
        result.stop()
      else env.art.destroy()
    } })
    result = env.factory()(env.art)
    const grid = env.parent.children[0]
    result.start()
    env.art.playing = true
    env.frame(100)
    assert.equal(env.draws.length, 1)
    assert.equal(grid.children[0].style.backgroundColor, undefined)
    assert.equal(env.frames.size, 0)
    env.art.destroy()
  }
})

test('Ambilight candidate stop/start reentrancy defers the replacement frame and discards obsolete colors', async () => {
  let result
  let once = true
  const env = await ambilightEnvironment(implementation, { onDraw() {
    if (!once)
      return
    once = false
    result.stop()
    result.start()
  } })
  result = env.factory()(env.art)
  result.start()
  env.art.playing = true
  env.frame(100)
  assert.equal(env.draws.length, 1)
  assert.equal(env.frames.size, 1)
  assert.equal(env.parent.children[0].children[0].style.backgroundColor, undefined)
  env.frame(200)
  assert.equal(env.draws.length, 10)
  env.art.destroy()
})

test('Ambilight candidate rolls back inserted views when setup throws', async () => {
  const env = await ambilightEnvironment(implementation)
  const failure = new Error('style setup failed')
  env.art.constructor.utils.setStyles = () => {
    throw failure
  }
  assert.throws(() => env.factory()(env.art), error => error === failure)
  assert.deepEqual(env.parent.children, [env.video])
  assert.equal([...env.listeners.values()].reduce((count, set) => count + set.size, 0), 0)
})

test('Ambilight candidate late attachment to a destroyed host allocates no view or canvas', async () => {
  const env = await ambilightEnvironment(implementation)
  env.art.destroy()
  const count = env.nodes.length
  const result = env.factory()(env.art)
  result.start()
  assert.equal(env.nodes.length, count)
  assert.equal(env.frames.size, 0)
  assert.equal(env.listeners.size, 0)
})

test('Ambilight candidate releases canvas and view when context acquisition throws', async () => {
  const failure = new Error('context acquisition failed')
  const env = await ambilightEnvironment(implementation, { onContext() {
    throw failure
  } })
  assert.throws(() => env.factory()(env.art), error => error === failure)
  assert.deepEqual(env.parent.children, [env.video])
  const canvas = env.nodes.find(node => node.tag === 'canvas')
  assert.equal(canvas.width, 0)
  assert.equal(canvas.height, 0)
  assert.equal([...env.listeners.values()].reduce((count, set) => count + set.size, 0), 0)
})

test('Ambilight candidate rolls back partial subscription while preserving the setup error', async () => {
  const env = await ambilightEnvironment(implementation)
  const failure = new Error('ready subscription failed')
  const on = env.art.on
  env.art.on = (name, callback) => {
    on(name, callback)
    if (name === 'ready')
      throw failure
    return env.art
  }
  assert.throws(() => env.factory()(env.art), error => error === failure)
  assert.deepEqual(env.parent.children, [env.video])
  assert.equal(env.nodes.find(node => node.tag === 'canvas').width, 0)
  assert.equal([...env.listeners.values()].reduce((count, set) => count + set.size, 0), 0)
})

test('Ambilight candidate attempts every release even when host listener cleanup throws', async () => {
  const env = await ambilightEnvironment(implementation)
  const result = env.factory()(env.art)
  result.start()
  const failure = new Error('host off failed')
  const off = env.art.off
  env.art.off = (...args) => {
    off(...args)
    throw failure
  }
  assert.throws(() => env.art.destroy(), error => error === failure)
  result.start()
  assert.equal(env.frames.size, 0)
  assert.deepEqual(env.parent.children, [env.video])
  assert.equal(env.nodes.find(node => node.tag === 'canvas').width, 0)
  assert.equal([...env.listeners.values()].reduce((count, set) => count + set.size, 0), 0)
})

test('Ambilight candidate ignores a cancelled stale callback without losing its replacement frame', async () => {
  const env = await ambilightEnvironment(implementation)
  const result = env.factory()(env.art)
  result.start()
  const stale = [...env.frames.values()][0]
  result.stop()
  result.start()
  const replacement = [...env.frames.keys()][0]
  stale(100)
  assert.deepEqual([...env.frames.keys()], [replacement])
  result.stop()
  assert.equal(env.frames.size, 0)
  env.art.destroy()
})

test('Ambilight candidate construction-time destruction releases partially initialized resources', async () => {
  for (const boundary of ['style', 'context', 'element', 'subscription']) {
    const env = await ambilightEnvironment(implementation, { onContext() {
      if (boundary === 'context')
        env.art.destroy()
    } })
    if (boundary === 'style') {
      const original = env.art.constructor.utils.setStyles
      env.art.constructor.utils.setStyles = (...args) => {
        env.art.destroy()
        return original(...args)
      }
    }
    if (boundary === 'element') {
      const original = env.art.constructor.utils.createElement
      env.art.constructor.utils.createElement = (...args) => {
        env.art.destroy()
        return original(...args)
      }
    }
    if (boundary === 'subscription') {
      const original = env.art.on
      env.art.on = (...args) => {
        const result = original(...args)
        env.art.destroy()
        return result
      }
    }
    const result = env.factory()(env.art)
    result.start()
    assert.deepEqual(env.parent.children, [env.video], boundary)
    assert.equal(env.frames.size, 0, boundary)
    assert.equal([...env.listeners.values()].reduce((count, set) => count + set.size, 0), 0, boundary)
    for (const canvas of env.nodes.filter(node => node.tag === 'canvas')) assert.equal(canvas.width, 0)
  }
})

test('Ambilight candidate observes destruction from option getters before allocating resources', async () => {
  const env = await ambilightEnvironment(implementation)
  const count = env.nodes.length
  const result = env.factory({ get blur() {
    env.art.destroy()
    return '50px'
  } })(env.art)
  result.start()
  assert.equal(env.nodes.length, count)
  assert.equal(env.frames.size, 0)
  assert.equal([...env.listeners.values()].reduce((count, set) => count + set.size, 0), 0)
})

test('Ambilight candidate keeps normal styles, special frequency values, stop colors and synchronous return shape', async () => {
  for (const [frequency, draws] of [[0, 0], [-1, 9], [Infinity, 9], [Number.NaN, 9], ['2', 0]]) {
    const env = await ambilightEnvironment(implementation)
    const option = { frequency, zIndex: -10 }
    const attach = env.factory(option)
    option.opacity = 0.8
    const result = attach(env.art)
    env.art.playing = true
    env.time(100)
    assert.equal(result.start(), undefined)
    assert.equal(env.draws.length, draws)
    const grid = env.parent.children[0]
    assert.equal(grid.style.zIndex, 9)
    assert.equal(grid.children[0].style.opacity, 0.8)
    assert.equal(grid.children[0].style.filter, 'blur(50px)')
    const colors = grid.children.map(child => child.style.backgroundColor)
    assert.equal(result.stop(), undefined)
    assert.deepEqual(grid.children.map(child => child.style.backgroundColor), colors)
    assert.deepEqual(Object.keys(result), ['name', 'start', 'stop'])
    env.art.destroy()
  }
})
