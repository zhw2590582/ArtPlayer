import assert from 'node:assert/strict'
import process from 'node:process'
// eslint-disable-next-line test/no-import-node-test -- Frozen JASSUB consumer contracts use the repository runner.
import test from 'node:test'
import { jassubCandidate, jassubEnvironment, jassubHistorical } from './helpers/jassub.js'

const implementations = process.env.ARTPLAYER_JASSUB_CANDIDATE === '1' || process.env.ARTPLAYER_JASSUB_ARTIFACT ? [await jassubCandidate()] : await jassubHistorical()
for (const implementation of implementations) {
  for (const script of [false, true]) {
    test(`JASSUB ${implementation.name}: ${script ? 'global' : 'CJS'} factory is lazy and registration synchronously exposes the actual instance`, async () => {
      const env = jassubEnvironment(implementation, { script })
      const register = env.factory({ workerUrl: 'worker.js', subContent: '[Script Info]' })
      assert.equal(env.workers.length, 0)
      const result = register(env.art)
      assert.deepEqual(Object.keys(result), ['name', 'instance'])
      assert.equal(result.name, 'artplayerPluginJassub')
      assert.equal(result.then, undefined)
      assert.equal(result.instance._video, env.art.video)
      assert.equal(String(result.instance._canvasParent.style.zIndex), '20')
      assert.equal(env.listeners.get('destroy').length, 1)
      assert.equal(env.workers[0].url, 'worker.js')
      await env.ready()
      assert.equal(env.workers[0].messages[0].subContent, '[Script Info]')
      env.emit('destroy')
      assert.equal(env.workers[0].terminated, 1)
      assert.equal(env.parent.children.length, 1)
    })
  }
  for (const simd of [false, true]) {
    test(`JASSUB ${implementation.name}: resource URLs and vendor options retain selection semantics SIMD=${simd}`, async () => {
      const env = jassubEnvironment(implementation, { simd })
      const fonts = ['a.ttf']
      const availableFonts = { test: 'test.woff2' }
      const result = env.factory({ workerUrl: '/worker.js', wasmUrl: '/base.wasm', modernWasmUrl: '/simd.wasm', subUrl: '/sub.ass', fonts, availableFonts, fallbackFont: 'test', timeOffset: -0.041, targetFps: 30, libassMemoryLimit: 64 })(env.art)
      await env.ready()
      const init = env.workers[0].messages[0]
      assert.equal(init.target, 'init')
      assert.equal(init.wasmUrl, simd ? '/simd.wasm' : '/base.wasm')
      assert.equal(init.fonts, fonts)
      assert.equal(init.availableFonts, availableFonts)
      assert.equal(init.subUrl, '/sub.ass')
      assert.equal(init.fallbackFont, 'test')
      assert.equal(init.targetFps, 30)
      assert.equal(init.libassMemoryLimit, 64)
      assert.equal(result.instance.timeOffset, -0.041)
      env.emit('destroy')
    })
  }
  test(`JASSUB ${implementation.name}: mutable options override video and historical instance methods return synchronously`, async () => {
    const env = jassubEnvironment(implementation)
    const option = { workerUrl: 'old.js' }
    const register = env.factory(option)
    option.workerUrl = 'new.js'
    option.video = env.createVideo()
    const result = register(env.art)
    assert.equal(result.instance._video, option.video)
    assert.equal(env.workers[0].url, 'new.js')
    await env.ready()
    assert.equal(result.instance.resize(640, 360, 4, 5, false), undefined)
    assert.equal(result.instance.setVideo(option.video), undefined)
    assert.equal(result.instance.setTrack('[Script Info]'), undefined)
    assert.equal(result.instance.destroy(), undefined)
    await env.flush()
    assert.equal(env.workers[0].terminated, 1)
    const resize = env.workers[0].messages.find(message => message.target === 'canvas')
    assert.equal(resize.width, 640)
    assert.equal(resize.height, 360)
  })
  test(`JASSUB ${implementation.name}: omitted options retain worker and font defaults`, async () => {
    const env = jassubEnvironment(implementation)
    const result = env.factory()(env.art)
    assert.equal(env.workers[0].url, 'jassub-worker.js')
    await env.ready()
    const init = env.workers[0].messages[0]
    assert.equal(init.wasmUrl, 'jassub-worker.wasm')
    assert.equal(init.availableFonts['liberation sans'], './default.woff2')
    result.instance.destroy()
  })
}
