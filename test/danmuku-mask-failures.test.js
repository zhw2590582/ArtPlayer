import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import fs from 'node:fs'
import process from 'node:process'
// eslint-disable-next-line test/no-import-node-test -- Historical runner includes fatal isolated Node rejection probes.
import test from 'node:test'
import { danmukuMaskEnvironment, danmukuMaskHistorical, flushMask } from './helpers/danmuku-mask.js'

// These assertions describe frozen historical defects, never candidate acceptance.
const implementations = await danmukuMaskHistorical()
const detailed = implementations.filter(item => ['frozen-source', 'published-1.1.0-main'].includes(item.name))

test('Historical SDK probes replace exactly five call sites and retain verified input identities', () => {
  const expected = JSON.parse(fs.readFileSync('refactor/baselines/danmuku-mask-failures-validation.json', 'utf8'))
  const actual = implementations.map(({ code: _code, ...identity }) => identity)
  assert.deepEqual(actual, expected.inputs, 'SDK seam transformations must remain exactly reproducible')
  assert.equal(implementations.length, 7)
  for (const item of implementations) {
    assert.match(item.inputSha256, /^[a-f0-9]{64}$/u)
    assert.match(item.transformedSha256, /^[a-f0-9]{64}$/u)
    if (!item.source) {
      assert.match(item.archiveSha256, /^[a-f0-9]{64}$/u)
      assert.match(item.probeSha256, /^[a-f0-9]{64}$/u)
      assert.deepEqual(item.counts, { setBackend: 2, createSegmenter: 1, toBinaryMask: 1, drawMask: 1 })
      assert.equal(item.replacements.length, 5)
    }
  }
})

for (const implementation of implementations) {
  test(`${implementation.name}: historical stop during initialization is undone by late initialization`, async () => {
    const env = danmukuMaskEnvironment(implementation, { pendingInit: true })
    const pending = env.result.start()
    await flushMask()
    assert.equal(env.initGates.length, 1)
    env.result.stop()
    assert.equal(env.style.maskImage, 'none')
    env.initGates[0].resolve()
    await pending
    await flushMask()
    assert.equal(env.draws.length, 1)
    assert.equal(env.style.maskImage, 'url(data:image/png;base64,historical-mask)')
    assert.equal(env.frames.size, 1)
    env.result.stop()
  })

  test(`${implementation.name}: historical inference completion after destroy writes a mask and revives RAF`, async () => {
    const env = danmukuMaskEnvironment(implementation, { pendingSegment: true })
    await env.result.start()
    await flushMask()
    assert.equal(env.segmentGates.length, 1)
    env.destroy()
    env.segmentGates[0].resolve([{}])
    await flushMask()
    assert.equal(env.draws.length, 1)
    assert.equal(env.style.maskImage, 'url(data:image/png;base64,historical-mask)')
    assert.equal(env.frames.size, 1)
    assert.equal(env.created[0].disposed, 0)
    assert.deepEqual([...env.listeners].map(([name, callbacks]) => [name, callbacks.size]), [['ready', 1], ['destroy', 1]])
    env.result.stop()
  })

  test(`${implementation.name}: historical repeated start leaves a second RAF chain after stop`, async () => {
    const env = danmukuMaskEnvironment(implementation)
    await env.result.start()
    await flushMask()
    await env.result.start()
    await flushMask()
    assert.equal(env.created.length, 1)
    assert.equal(env.frames.size, 2)
    env.result.stop()
    assert.equal(env.frames.size, 1)
    await env.frame()
    assert.equal(env.frames.size, 1)
    assert.equal(env.style.maskImage, 'url(data:image/png;base64,historical-mask)')
    env.result.stop()
  })
}

for (const implementation of detailed) {
  for (const action of ['stop', 'destroy']) {
    test(`${implementation.name}: historical ${action} during initialization does not dispose the late model`, async () => {
      const env = danmukuMaskEnvironment(implementation, { pendingInit: true })
      const pending = env.result.start()
      await flushMask()
      if (action === 'stop')
        env.result.stop()
      else env.destroy()
      env.initGates[0].resolve()
      await pending
      await flushMask()
      assert.equal(env.created[0].disposed, 0)
      assert.equal(env.frames.size, 1)
      assert.equal(env.style.maskMode, 'alpha')
      env.result.stop()
    })
  }

  test(`${implementation.name}: historical stop during inference cannot prevent its pending write`, async () => {
    const env = danmukuMaskEnvironment(implementation, { pendingSegment: true })
    await env.result.start()
    env.result.stop()
    assert.deepEqual(env.writes, ['none'])
    env.segmentGates[0].resolve([{}])
    await flushMask()
    assert.deepEqual(env.writes, ['none', 'url(data:image/png;base64,historical-mask)'])
    assert.equal(env.frames.size, 1)
    env.result.stop()
  })

  test(`${implementation.name}: historical concurrent starts initialize two models and lose disposal ownership`, async () => {
    const env = danmukuMaskEnvironment(implementation, { pendingInit: true })
    const first = env.result.start()
    const second = env.result.start()
    await flushMask()
    assert.equal(env.created.length, 2)
    for (const gate of env.initGates) gate.resolve()
    await Promise.all([first, second])
    await flushMask()
    assert.equal(env.frames.size, 2)
    env.destroy()
    assert.equal(env.frames.size, 1)
    assert.deepEqual(env.created.map(instance => instance.disposed), [0, 0])
  })

  test(`${implementation.name}: historical inference rejection logs once per frame and keeps retrying`, async () => {
    const error = new Error('controlled inference failure')
    const env = danmukuMaskEnvironment(implementation, { segmentError: error })
    await env.result.start()
    await flushMask()
    assert.equal(env.frames.size, 1)
    assert.equal(env.logs.length, 1)
    assert.deepEqual(env.logs[0], ['error', 'Error in segmentBody:', error])
    assert.equal(env.draws.length, 0)
    await env.frame()
    assert.equal(env.logs.length, 2)
    assert.equal(env.frames.size, 1)
    env.settings.segmentError = null
    await env.frame()
    assert.equal(env.draws.length, 1)
    env.result.stop()
  })

  test(`${implementation.name}: historical fulfilled false WebGL selection does not trigger CPU fallback`, async () => {
    const env = danmukuMaskEnvironment(implementation, { backendResult: { webgl: false } })
    await env.result.start()
    await flushMask()
    assert.deepEqual(env.backends, ['webgl'])
    assert.equal(env.created.length, 1)
    assert.equal(env.logs.length, 0)
    env.result.stop()
  })

  test(`${implementation.name}: historical rejected WebGL selection tries CPU and ignores its fulfilled boolean`, async () => {
    for (const cpu of [true, false]) {
      const env = danmukuMaskEnvironment(implementation, { backendError: { webgl: new Error('no WebGL') }, backendResult: { cpu } })
      await env.result.start()
      await flushMask()
      assert.deepEqual(env.backends, ['webgl', 'cpu'])
      assert.deepEqual(env.logs, [['warn', 'WebGL backend not available, falling back to CPU', 'no WebGL']])
      assert.equal(env.created.length, 1)
      env.result.stop()
    }
  })

  test(`${implementation.name}: historical CPU rejection rejects explicit start before creating a model`, async () => {
    const error = new Error('controlled CPU failure')
    const env = danmukuMaskEnvironment(implementation, { backendError: { webgl: new Error('no WebGL'), cpu: error } })
    await assert.rejects(env.result.start(), failure => failure === error)
    assert.deepEqual(env.backends, ['webgl', 'cpu'])
    assert.equal(env.created.length, 0)
    assert.equal(env.frames.size, 0)
  })

  test(`${implementation.name}: historical model initialization rejection resolves start and polls without a model`, async () => {
    const error = new Error('controlled model init failure')
    const env = danmukuMaskEnvironment(implementation, { initError: error })
    assert.equal(await env.result.start(), undefined)
    assert.deepEqual(env.logs, [['error', 'Error initializing segmenter:', error]])
    assert.equal(env.frames.size, 1)
    await env.frame()
    assert.equal(env.created.length, 1)
    assert.equal(env.inferences.length, 0)
    env.result.stop()
  })

  test(`${implementation.name}: historical missing danmuku rejects start after allocating the model and makes stop throw`, async () => {
    const env = danmukuMaskEnvironment(implementation, { noDanmuku: true })
    await assert.rejects(env.result.start(), error => error.name === 'TypeError' && error.message.includes('style'))
    assert.throws(() => env.result.stop(), error => error.name === 'TypeError' && error.message.includes('style'))
    assert.equal(env.created.length, 1)
    assert.equal(env.created[0].disposed, 0)
  })

  test(`${implementation.name}: historical unavailable 2D context logs read failures and keeps the frame loop`, async () => {
    const env = danmukuMaskEnvironment(implementation, { noContext: true })
    await env.result.start()
    await flushMask()
    assert.equal(env.logs.length, 1)
    assert.equal(env.logs[0][2].name, 'TypeError')
    assert.match(env.logs[0][2].message, /getImageData/u)
    assert.equal(env.frames.size, 1)
    assert.equal(env.writes.length, 0)
    env.result.stop()
  })

  test(`${implementation.name}: historical canvas allocation failure rejects start but leaves the initialized model owned`, async () => {
    const error = new Error('controlled canvas allocation failure')
    const env = danmukuMaskEnvironment(implementation, { canvasError: error })
    await assert.rejects(env.result.start(), failure => failure === error)
    assert.equal(env.created.length, 1)
    assert.equal(env.created[0].disposed, 0)
    assert.equal(env.frames.size, 0)
    env.destroy()
    assert.equal(env.created[0].disposed, 0)
  })

  test(`${implementation.name}: historical canvas read security failure is logged and retried without clearing the previous mask`, async () => {
    const error = new Error('controlled canvas taint')
    error.name = 'SecurityError'
    const env = danmukuMaskEnvironment(implementation, { readError: error })
    await env.result.start()
    await flushMask()
    assert.equal(env.logs[0][2], error)
    assert.equal(env.style.maskImage, 'url(prior-mask)')
    await env.frame()
    assert.equal(env.logs.length, 2)
    env.result.stop()
  })

  test(`${implementation.name}: historical zero RAF id survives stop and retained ready listeners restart after destroy`, async () => {
    const env = danmukuMaskEnvironment(implementation, { firstFrame: 0, paused: true })
    await env.result.start()
    assert.deepEqual([...env.frames.keys()], [0])
    env.destroy()
    assert.deepEqual([...env.frames.keys()], [0])
    assert.deepEqual(env.cancelled, [])
    env.emit('ready')
    await flushMask()
    assert.equal(env.frames.size, 2)
    assert.equal(env.created[0].disposed, 0)
  })

  for (const scenario of ['ready-backend', 'missing-video']) {
    test(`${implementation.name}: historical ${scenario} unhandled rejection is observed only in a fatal isolated child`, () => {
      const script = `import { danmukuMaskHistorical, danmukuMaskEnvironment, flushMask } from './test/helpers/danmuku-mask.js';
const implementation = (await danmukuMaskHistorical()).find(item => item.name === ${JSON.stringify(implementation.name)});
const settings = ${scenario === 'ready-backend' ? '{backendError: {webgl: new Error("no WebGL"), cpu: new Error("MASK02_READY_BACKEND_REJECTION")}}' : '{noVideo: true}'};
const env = danmukuMaskEnvironment(implementation, settings);
${scenario === 'ready-backend' ? 'env.emit("ready");' : 'await env.result.start();'}
await flushMask();`
      const child = spawnSync(process.execPath, ['--unhandled-rejections=strict', '--input-type=module', '-e', script], { encoding: 'utf8', timeout: 15000 })
      assert.equal(child.error, undefined)
      assert.equal(child.status, 1)
      assert.match(child.stderr, scenario === 'ready-backend' ? /MASK02_READY_BACKEND_REJECTION/u : /Cannot read properties of undefined \(reading 'paused'\)/u)
      assert.doesNotMatch(child.stderr, /AssertionError|Model network access is forbidden/u)
    })
  }
}
