import assert from 'node:assert/strict'
// eslint-disable-next-line test/no-import-node-test -- Offscreen protocol ordering needs deterministic queue coverage.
import test from 'node:test'
import { jassubCandidate, jassubEnvironment } from './helpers/jassub.js'

const candidate = await jassubCandidate()
function environment(offscreen = true) {
  const code = `${candidate.code}\nObject.defineProperty(module.exports.default || module.exports, '__canvasClass', { value: HTMLCanvasElement });`
  const env = jassubEnvironment({ ...candidate, code })
  const transferred = []
  if (offscreen) {
    env.factory.__canvasClass.prototype.transferControlToOffscreen = function () {
      const canvas = { width: this.width, height: this.height }
      transferred.push(canvas)
      return canvas
    }
  }
  return { ...env, transferred }
}

test('JASSUB initializes offscreen ownership before queued resize, track and ready-listener messages', async () => {
  const env = environment()
  const { instance } = env.factory()(env.art)
  instance.resize(640, 360)
  instance.setTrack('[Script Info]')
  instance.addEventListener('ready', () => instance.resize(320, 180))
  await env.ready()
  const messages = env.workers[0].messages
  assert.deepEqual(messages.slice(0, 2).map(message => message.target), ['init', 'offscreenCanvas'])
  assert.equal(messages[1].transferable[0], env.transferred[0])
  assert(messages.slice(2).some(message => message.target === 'canvas'))
  assert(messages.slice(2).some(message => message.target === 'setTrack'))
  assert.equal(instance._ctx, false)
  instance.destroy()
})

test('JASSUB duplicate readiness does not transfer the initial offscreen canvas twice', async () => {
  const env = environment()
  const { instance } = env.factory()(env.art)
  await env.ready()
  await env.ready()
  assert.equal(env.workers[0].messages.filter(message => message.target === 'offscreenCanvas').length, 1)
  instance.destroy()
})

test('JASSUB destroy before readiness never transfers its offscreen canvas', async () => {
  const env = environment()
  const { instance } = env.factory()(env.art)
  instance.destroy()
  await env.flush()
  instance._ready()
  await env.flush()
  assert.equal(env.workers[0].messages.length, 0)
  assert.equal(env.workers[0].terminated, 1)
})

for (const option of [{ offscreenRender: false }, 'unsupported', 'custom']) {
  test(`JASSUB main-thread canvas has no initial transfer for ${JSON.stringify(option)}`, async () => {
    const env = environment(option !== 'unsupported')
    const options = option === 'custom' ? { canvas: env.createCanvas() } : typeof option === 'object' ? option : {}
    const { instance } = env.factory(options)(env.art)
    await env.ready()
    instance.resize(640, 360)
    await env.flush()
    assert.equal(env.workers[0].messages.some(message => message.target === 'offscreenCanvas'), false)
    assert.equal(instance._ctx, instance._canvas.context)
    instance.destroy()
  })
}

test('JASSUB late hybrid render releases transferred bitmaps without drawing or unlocking the new offscreen demand', async () => {
  const env = environment()
  const { instance } = env.factory()(env.art)
  await env.ready()
  instance._detachOffscreen()
  await env.flush()
  instance.setTrack('[Script Info]')
  instance.busy = true
  let closed = 0
  const image = { close() {
    closed++
  } }
  const frame = { target: 'render', images: [{ image, x: 0, y: 0 }], asyncRender: true, width: 640, height: 360 }
  assert.doesNotThrow(() => env.workers[0].onmessage({ data: frame }))
  assert.equal(closed, 1)
  assert.equal(instance.busy, true)
  assert.equal(instance._ctx, false)
  instance.destroy()
})

test('JASSUB current hybrid render still draws and releases its actual bitmap', async () => {
  const env = environment()
  const { instance } = env.factory()(env.art)
  await env.ready()
  instance._detachOffscreen()
  await env.flush()
  const drawn = []
  let closed = 0
  const image = { close() {
    closed++
  } }
  instance._ctx.drawImage = (...args) => drawn.push(args)
  instance.busy = true
  env.workers[0].onmessage({ data: { target: 'render', images: [{ image, x: 4, y: 5 }], asyncRender: true, width: 640, height: 360 } })
  assert.deepEqual(drawn, [[image, 4, 5]])
  assert.equal(closed, 1)
  assert.equal(instance.busy, false)
  instance.destroy()
})

test('JASSUB reattachment replaces a pending hybrid demand with a forced current offscreen draw', async () => {
  const env = environment()
  const { instance } = env.factory()(env.art)
  await env.ready()
  instance._detachOffscreen()
  await env.flush()
  instance.busy = true
  instance._lastDemandTime = { mediaTime: 1, width: 640, height: 360 }
  instance.setTrack('[Script Info]')
  assert.equal(instance._lastDemandTime, null)
  assert.equal(instance.busy, true)
  await env.flush()
  assert.equal(env.workers[0].messages.at(-1).target, 'canvas')
  assert.equal(env.workers[0].messages.at(-1).force, true)
  env.workers[0].onmessage({ data: { target: 'unbusy' } })
  assert.equal(instance.busy, false)
  instance.destroy()
})

for (const method of ['setTrack', 'setTrackByUrl']) {
  test(`JASSUB ${method} after hybrid destruction does not recreate or transfer a canvas`, async () => {
    const env = environment()
    const { instance } = env.factory()(env.art)
    await env.ready()
    instance._detachOffscreen()
    await env.flush()
    instance.destroy()
    const transferred = env.transferred.length
    const canvas = instance._canvas
    assert.equal(instance[method](method === 'setTrack' ? '[Script Info]' : '/next.ass'), undefined)
    await env.flush()
    assert.equal(env.transferred.length, transferred)
    assert.equal(instance._canvas, canvas)
    assert.equal(env.workers[0].terminated, 1)
  })
}

for (const phase of ['clear', 'first-image', 'second-image', 'resize']) {
  test(`JASSUB releases every received bitmap when rendering fails during ${phase}`, async () => {
    const env = environment(false)
    const { instance } = env.factory({ offscreenRender: false })(env.art)
    await env.ready()
    const failure = new Error(`render ${phase}`)
    const closed = [0, 0, 0]
    const images = closed.map((_, index) => ({
      image: { close() { closed[index]++ } },
      x: index,
      y: 0,
    }))
    let draws = 0
    instance._ctx.drawImage = () => {
      draws++
      if (draws === (phase === 'first-image' ? 1 : phase === 'second-image' ? 2 : 0))
        throw failure
    }
    if (phase === 'clear')
      instance._ctx.clearRect = () => { throw failure }
    if (phase === 'resize') {
      Object.defineProperty(instance._canvasctrl, 'width', {
        configurable: true,
        get() { return 300 },
        set() { throw failure },
      })
    }
    try {
      assert.throws(() => env.workers[0].onmessage({ data: { target: 'render', images, asyncRender: true, width: 640, height: 360 } }), error => error === failure)
      assert.deepEqual(closed, [1, 1, 1])
      assert.equal(draws, phase === 'first-image' ? 1 : phase === 'second-image' ? 2 : 0)
    }
    finally {
      instance.destroy()
    }
  })
}

test('JASSUB synchronous pixel buffers are drawn without bitmap disposal', async () => {
  const env = environment(false)
  const { instance } = env.factory({ offscreenRender: false })(env.art)
  await env.ready()
  const image = new Uint8ClampedArray([0, 255, 0, 255]).buffer
  image.close = () => assert.fail('Synchronous buffers are not owned ImageBitmaps')
  const draws = []
  instance._ctx.drawImage = (...args) => draws.push(args)
  env.workers[0].onmessage({ data: { target: 'render', images: [{ image, x: 2, y: 3, w: 1, h: 1 }], asyncRender: false, width: 640, height: 360 } })
  assert.deepEqual(draws, [[instance._bufferCanvas, 2, 3]])
  instance.destroy()
})
