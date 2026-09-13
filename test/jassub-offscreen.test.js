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
