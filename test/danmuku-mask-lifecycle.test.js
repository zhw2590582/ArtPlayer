import assert from 'node:assert/strict'
// eslint-disable-next-line test/no-import-node-test -- Candidate lifecycle probes share the historical Node runner.
import test from 'node:test'
import { environment, flush, maskCandidate } from './helpers/danmuku-mask-candidate.js'

const code = await maskCandidate()
const create = settings => environment(code, settings)

test('Mask candidate instances sharing SDK and RAF retain independent models, layers and cancellation', async () => {
  const env = create({ hold: ['segment'] })
  const listeners = new Map()
  const style = { maskImage: 'url(second-prior)' }
  const secondArt = {
    isDestroy: false,
    template: { $video: { ...env.video }, $danmuku: { style } },
    on(name, callback) { listeners.set(name, callback) },
    off(name, callback) {
      if (listeners.get(name) === callback)
        listeners.delete(name)
    },
  }
  const second = env.factory()(secondArt)
  await Promise.all([env.result.start(), second.start()])
  await flush()
  assert.equal(env.created.length, 2)
  assert.equal(env.inferences.length, 2)
  assert.notEqual(env.inferences[0].video, env.inferences[1].video)
  env.result.stop()
  env.gates.segment[0].resolve()
  await flush()
  assert.equal(env.created[0].disposed, 1)
  assert.equal(env.created[1].disposed, 0)
  assert.equal(style.maskImage, 'url(second-prior)')
  env.gates.segment[1].resolve()
  await flush()
  assert.equal(env.style.maskImage, 'none')
  assert.equal(style.maskImage, 'url(data:image/png;base64,candidate-mask)')
  assert.equal(env.frames.size, 1)
  env.destroy()
  await flush()
  assert.equal(env.frames.size, 1, 'Destroying the first player must preserve the other RAF')
  secondArt.isDestroy = true
  listeners.get('destroy')()
  await flush()
  assert.equal(env.frames.size, 0)
  assert.equal(listeners.size, 0)
  assert.equal(style.maskImage, 'none')
  assert.equal(env.created[1].disposed, 1)
})

async function ended(env) {
  env.destroy()
  await flush()
  assert.equal(env.frames.size, 0)
  assert.equal([...env.listeners.values()].reduce((sum, listeners) => sum + listeners.size, 0), 0)
}

test('Mask candidate retains synchronous registrar, optional options, exact public methods and Promise<void> start', async () => {
  const env = create()
  assert.deepEqual(Object.keys(env.result), ['name', 'start', 'stop'])
  assert.equal(env.result.name, 'artplayerPluginDanmukuMask')
  assert.equal(env.result.start.name, 'startSegmentation')
  assert.equal(env.result.stop.name, 'stopSegmentation')
  assert.equal(await env.result.start(), undefined)
  await flush()
  assert.equal(env.created.length, 1)
  assert.equal(env.inferences.length, 1)
  assert.equal(env.frames.size, 1)
  assert.equal(env.style.maskImage, 'url(data:image/png;base64,candidate-mask)')
  assert.deepEqual(env.canvases[0].pixels, [255, 255, 255, 0, 250, 255, 255, 255])
  assert.equal(env.result.stop(), undefined)
  await ended(env)
  assert.equal(env.created[0].disposed, 1)
})

test('Mask candidate preserves OR defaults, false smooth setting, snapshot and exact SDK interpretation', async () => {
  const option = { modelSelection: 0, smoothSegmentation: false, opacity: 0, maskBlurAmount: 0, foregroundThreshold: 0, solutionPath: '/models' }
  const env = create({ option })
  option.solutionPath = '/changed'
  await env.result.start()
  await flush()
  assert.deepEqual(env.backends, ['webgl'])
  assert.deepEqual(JSON.parse(JSON.stringify(env.created[0].config)), { runtime: 'mediapipe', modelType: 'general', solutionPath: '/models', modelSelection: 1, smoothSegmentation: false, minDetectionConfidence: 0.5, minTrackingConfidence: 0.5, selfieMode: false })
  assert.equal(env.masks[0][4], 0.5)
  assert.equal(env.draws[0][3], 1)
  assert.equal(env.draws[0][4], 3)
  await ended(env)
})

for (const action of ['stop', 'destroy']) {
  for (const phase of ['webgl', 'init', 'segment', 'mask', 'draw']) {
    test(`Mask candidate ${action} during ${phase} prevents late output and RAF revival`, async () => {
      const env = create({ hold: [phase] })
      const starting = env.result.start()
      await flush()
      assert.equal(env.gates[phase].length, 1)
      if (action === 'stop')
        env.result.stop()
      else env.destroy()
      assert.equal(await starting, undefined, 'Cancellation settles the public start before SDK completion')
      assert.equal(env.style.maskImage, 'none')
      for (const model of env.created)
        assert.equal(model.disposed, 0, 'Do not dispose a model while its initialization or frame work is pending')
      assert.equal(env.frames.size, 0)
      env.gates[phase][0].resolve()
      await flush()
      assert.equal(env.frames.size, 0)
      assert(env.writes.every(value => value === 'none'))
      assert.equal(env.created.length, phase === 'webgl' ? 0 : 1)
      for (const model of env.created) {
        assert.equal(model.disposed, 1)
        assert.equal(model.disposedWhileBusy, false)
      }
      for (const canvas of env.canvases) assert.deepEqual([canvas.width, canvas.height], [0, 0])
      await ended(env)
    })
  }
}

test('Mask candidate concurrent and repeated starts keep one initialization and one inference chain', async () => {
  const env = create({ hold: ['init'] })
  const first = env.result.start()
  const second = env.result.start()
  await flush()
  assert.equal(env.created.length, 1)
  env.gates.init[0].resolve()
  await Promise.all([first, second])
  await flush()
  await env.result.start()
  assert.equal(env.created.length, 1)
  assert.equal(env.inferences.length, 1)
  assert.equal(env.frames.size, 1)
  await env.frame()
  assert.equal(env.inferences.length, 2)
  assert.equal(env.maximum, 1)
  await ended(env)
})

test('Mask candidate restart waits for old inference and model disposal without blocking stop settlement', async () => {
  const env = create({ hold: ['segment', 'dispose'] })
  await env.result.start()
  await flush()
  env.result.stop()
  const next = env.result.start()
  await flush()
  assert.equal(env.created.length, 1)
  env.gates.segment[0].resolve()
  await flush()
  assert.equal(env.gates.dispose.length, 1)
  assert.equal(env.created.length, 1)
  env.settings.hold = []
  env.gates.dispose[0].resolve()
  await next
  await flush()
  assert.equal(env.created.length, 2)
  assert.equal(env.maximum, 1)
  assert.equal(env.created[0].disposed, 1)
  assert.equal(env.created[0].disposedWhileBusy, false)
  assert.equal(env.frames.size, 1)
  await ended(env)
})

test('Mask candidate repeated stops cannot bypass a pending disposal when restarting', async () => {
  const env = create({ paused: true, hold: ['dispose'] })
  await env.result.start()
  env.result.stop()
  env.result.stop()
  const next = env.result.start()
  await flush()
  assert.equal(env.created.length, 1)
  assert.equal(env.gates.dispose.length, 1)
  assert.deepEqual([env.canvases[0].width, env.canvases[0].height], [0, 0], 'A pending model disposal must not retain an idle private canvas bitmap')
  env.settings.hold = []
  env.gates.dispose[0].resolve()
  await next
  assert.equal(env.created.length, 2)
  await ended(env)
})

test('Mask candidate synchronous SDK reentry does not overlap old and new runs', async () => {
  let restarted
  const env = create({ hold: ['segment'], onSegment(env) {
    env.settings.onSegment = null
    env.result.stop()
    restarted = env.result.start()
  } })
  await env.result.start()
  await flush()
  assert.equal(env.created.length, 1)
  env.settings.hold = []
  env.gates.segment[0].resolve()
  await restarted
  await flush()
  assert.equal(env.maximum, 1)
  assert.equal(env.created.length, 2)
  await ended(env)
})

test('Mask candidate cancels RAF id zero, detaches exact listeners and ignores start after destroy', async () => {
  const env = create({ firstFrame: 0, paused: true })
  await env.result.start()
  assert.deepEqual([...env.frames.keys()], [0])
  await ended(env)
  assert.deepEqual(env.cancelled, [0])
  env.emit('ready')
  await env.result.start()
  assert.equal(env.created.length, 1)
  assert.equal(env.frames.size, 0)
})

test('Mask candidate no readable dimensions waits without invoking inference', async () => {
  const env = create()
  env.video.videoWidth = 0
  await env.result.start()
  await flush()
  assert.equal(env.inferences.length, 0)
  assert.equal(env.frames.size, 1)
  env.video.videoWidth = 2
  await env.frame()
  assert.equal(env.inferences.length, 1)
  await ended(env)
})

test('Mask candidate backend false keeps old interpretation while rejection tries CPU', async () => {
  const fulfilled = create({ backendResult: { webgl: false } })
  await fulfilled.result.start()
  assert.deepEqual(fulfilled.backends, ['webgl'])
  await ended(fulfilled)
  const rejected = create({ reject: { webgl: new Error('no WebGL') }, backendResult: { cpu: false } })
  await rejected.result.start()
  assert.deepEqual(rejected.backends, ['webgl', 'cpu'])
  assert.equal(rejected.created.length, 1)
  await ended(rejected)
})

test('Mask candidate rejects explicit backend failure and observes automatic ready failure', async () => {
  const error = new Error('no CPU')
  const env = create({ reject: { webgl: new Error('no WebGL'), cpu: error } })
  await assert.rejects(env.result.start(), failure => failure === error)
  env.emit('ready')
  await flush()
  assert(env.logs.some(entry => entry[1] === 'Failed to start danmuku mask:' && entry[2] === error))
  assert.equal(env.frames.size, 0)
  await ended(env)
})

test('Mask candidate model rejection retains resolved start and logged error without idle retry loop', async () => {
  const error = new Error('bad model')
  const env = create({ reject: { init: error } })
  assert.equal(await env.result.start(), undefined)
  assert.deepEqual(env.logs, [['error', 'Error initializing segmenter:', error]])
  assert.equal(env.frames.size, 0)
  env.settings.reject = {}
  await env.result.start()
  await flush()
  assert.equal(env.frames.size, 1)
  await ended(env)
})

for (const setting of ['noLayer', 'noVideo', 'noContext', 'canvasError']) {
  test(`Mask candidate ${setting} initialization fails without retaining resources`, async () => {
    const env = create({ [setting]: setting === 'canvasError' ? new Error('canvas allocation') : true })
    await assert.rejects(env.result.start())
    await flush()
    assert.equal(env.frames.size, 0)
    for (const model of env.created) assert.equal(model.disposed, 1)
    for (const canvas of env.canvases) assert.deepEqual([canvas.width, canvas.height], [0, 0])
    assert.doesNotThrow(() => env.result.stop())
    await ended(env)
  })
}

test('Mask candidate inference and canvas-read errors keep the old active retry outlet', async () => {
  for (const settings of [{ reject: { segment: new Error('inference') } }, { readError: new Error('taint') }]) {
    const env = create(settings)
    await env.result.start()
    await flush()
    assert.equal(env.logs[0][1], 'Error in segmentBody:')
    assert.equal(env.style.maskImage, 'url(prior-mask)')
    await env.frame()
    assert.equal(env.logs.length, 2)
    assert.equal(env.frames.size, 1)
    await ended(env)
  }
})

test('Mask candidate late SDK rejection after cancellation remains observed and silent', async () => {
  const env = create({ hold: ['segment'] })
  await env.result.start()
  await flush()
  env.destroy()
  env.gates.segment[0].reject(new Error('late inference'))
  await flush()
  assert.equal(env.logs.length, 0)
  assert.equal(env.frames.size, 0)
  assert.equal(env.created[0].disposed, 1)
})

test('Mask candidate already-destroyed registration does not install listeners or allocate resources', async () => {
  const env = create({ destroyed: true })
  await env.result.start()
  assert.equal(env.listeners.size, 0)
  assert.equal(env.created.length, 0)
})

test('Mask candidate subscription rollback preserves original failure and prior host styles', () => {
  for (const event of ['ready', 'destroy']) {
    let env
    const failure = new Error('subscription failed')
    assert.throws(() => create({
      subscriptionError: event,
      subscriptionFailure: failure,
      onEnvironment(value) { env = value },
    }), error => error === failure)
    assert.equal([...env.listeners.values()].reduce((sum, callbacks) => sum + callbacks.size, 0), 0)
    assert.equal(env.style.maskImage, 'url(prior-mask)')
    assert.equal(env.created.length, 0)
  }
})

test('Mask candidate immediate stop skips backend/model startup and public start settles', async () => {
  const env = create()
  const pending = env.result.start()
  env.result.stop()
  await pending
  await flush()
  assert.deepEqual(env.backends, [])
  assert.equal(env.created.length, 0)
  await ended(env)
})

test('Mask candidate cancelled backend/model rejection is observed without retry or late log', async () => {
  for (const phase of ['webgl', 'init']) {
    const env = create({ hold: [phase] })
    const pending = env.result.start()
    await flush()
    env.result.stop()
    await pending
    env.gates[phase][0].reject(new Error('late SDK rejection'))
    await flush()
    assert.equal(env.logs.length, 0)
    assert.equal(env.frames.size, 0)
    assert.deepEqual(env.backends, ['webgl'])
    await ended(env)
  }
})

test('Mask candidate disposal rejection is observed, clears canvas and allows independent restart', async () => {
  const failure = new Error('dispose failed')
  const env = create({ reject: { dispose: failure } })
  await env.result.start()
  await flush()
  env.result.stop()
  await flush()
  assert.deepEqual(env.logs, [['warn', 'Failed to dispose danmuku mask segmenter:', failure]])
  assert.deepEqual([env.canvases[0].width, env.canvases[0].height], [0, 0])
  env.settings.reject = {}
  await env.result.start()
  assert.equal(env.created.length, 2)
  await ended(env)
})

test('Mask candidate empty segmentation retains existing mask and a single active loop', async () => {
  const env = create({ empty: true })
  await env.result.start()
  await flush()
  assert.equal(env.style.maskImage, 'url(prior-mask)')
  assert.equal(env.masks.length, 0)
  assert.equal(env.draws.length, 0)
  assert.equal(env.frames.size, 1)
  await env.frame()
  assert.equal(env.maximum, 1)
  assert.equal(env.frames.size, 1)
  await ended(env)
})

test('Mask candidate cancelled inference cannot overwrite a subsequent external mask write', async () => {
  const env = create({ hold: ['segment'] })
  await env.result.start()
  await flush()
  env.result.stop()
  env.style.maskImage = 'url(user-mask)'
  env.gates.segment[0].resolve()
  await flush()
  assert.equal(env.style.maskImage, 'url(user-mask)')
  assert.equal(env.frames.size, 0)
  assert.equal(env.created[0].disposed, 1)
  await ended(env)
})

test('Mask candidate retains template capture before evaluating option getters', async () => {
  let captured
  const option = {
    get solutionPath() {
      captured.art.template.$video = { paused: true, ended: false, videoWidth: 0, videoHeight: 0 }
      captured.art.template.$danmuku = { style: {} }
      return '/models'
    },
  }
  const env = create({
    option,
    onEnvironment(value) { captured = value },
  })
  await env.result.start()
  await flush()
  assert.equal(env.inferences[0].video, env.video)
  assert.equal(env.style.maskImage, 'url(data:image/png;base64,candidate-mask)')
  await ended(env)
})
