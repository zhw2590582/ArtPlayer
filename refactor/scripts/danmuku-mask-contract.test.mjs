import assert from 'node:assert/strict'
import fs from 'node:fs'
// eslint-disable-next-line test/no-import-node-test -- Frozen package contract verification.
import test from 'node:test'
import vm from 'node:vm'
import { transform } from 'esbuild'
import { verifyDanmukuMaskContract } from './danmuku-mask-contract.mjs'
import { readMember } from './releases.mjs'

const contract = await verifyDanmukuMaskContract()
const source = contract.sources.get('packages/artplayer-plugin-danmuku-mask/src/index.js')

async function controlledSource(option) {
  const frames = new Map()
  const configs = []
  const calls = []
  const listeners = new Map()
  const style = {}
  const pixels = new Uint8ClampedArray([255, 255, 255, 255, 250, 255, 255, 255])
  let id = 0
  const canvas = {
    width: 0,
    height: 0,
    getContext: () => ({ getImageData: () => ({ data: pixels }), putImageData: value => calls.push(['pixels', [...value.data]]) }),
    toDataURL: () => 'data:image/png;base64,controlled',
  }
  const segmenter = { segmentPeople: async () => [{}] }
  const body = {
    SupportedModels: { MediaPipeSelfieSegmentation: 'selfie' },
    createSegmenter: async (model, config) => {
      configs.push({ model, config: { ...config } })
      return segmenter
    },
    toBinaryMask: async (...args) => {
      calls.push(['mask', ...args])
      return {}
    },
    drawMask: async (...args) => { calls.push(['draw', args[3], args[4]]) },
  }
  const tf = { setBackend: async value => calls.push(['backend', value]) }
  const module = { exports: {} }
  vm.runInNewContext((await transform(source, { format: 'cjs', target: 'es2020' })).code, {
    module,
    exports: module.exports,
    require(name) {
      if (name === '@tensorflow-models/body-segmentation')
        return body
      if (name === '@tensorflow/tfjs-core')
        return tf
      assert(['@tensorflow/tfjs-backend-webgl', '@tensorflow/tfjs-backend-cpu'].includes(name))
      return {}
    },
    document: { createElement: (tag) => {
      assert.equal(tag, 'canvas')
      return canvas
    } },
    requestAnimationFrame: (callback) => {
      frames.set(++id, callback)
      return id
    },
    cancelAnimationFrame: id => frames.delete(id),
    console,
  }, { timeout: 1000 })
  const art = { template: { $video: { paused: false, ended: false, videoWidth: 2, videoHeight: 1 }, $danmuku: { style } }, on: (name, callback) => listeners.set(name, callback) }
  const result = module.exports.default(option)(art)
  return { result, listeners, frames, configs, calls, style }
}

test('Danmuku Mask freezes all published stable archive members and their actual Git associations', () => {
  assert.deepEqual([...contract.archives.keys()].sort(), ['1.0.0', '1.1.0'])
  for (const release of [contract.baseline.release, ...contract.baseline.previous]) {
    assert.equal(Object.keys(release.files).length, 6)
    assert.deepEqual(release.missingEntrypoints, [])
  }
  assert.equal(contract.baseline.release.registrySourceManifest.version, '1.0.1')
  assert.equal(contract.baseline.release.registrySourceManifest.versionMatchesRelease, false)
  assert.equal(contract.baseline.observations.latestArchiveMatchesFrozenSourceFiles.length, 6)
})

test('Both published declarations retain optional options, synchronous registration, async start and void stop', () => {
  const declaration = contract.sources.get('packages/artplayer-plugin-danmuku-mask/types/artplayer-plugin-danmuku-mask.d.ts')
  for (const archive of contract.archives.values())
    assert.equal(readMember(archive, 'package/types/artplayer-plugin-danmuku-mask.d.ts').toString(), declaration)
  assert(declaration.includes('(option?: Option) => (art: Artplayer) => Result'))
  assert(declaration.includes('start: () => Promise<void>'))
  assert(declaration.includes('stop: () => void'))
  assert(declaration.includes('export default artplayerPluginDanmukuMask'))
})

test('Actual main and legacy exports preserve historical CommonJS and browser global forms without starting a model', () => {
  for (const [version, archive] of contract.archives) {
    for (const suffix of ['js', 'legacy.js']) {
      const bytes = readMember(archive, `package/dist/artplayer-plugin-danmuku-mask.${suffix}`).toString()
      for (const form of ['cjs', 'global']) {
        const module = { exports: {} }
        const environment = {
          console,
          fetch() { throw new Error('Network is forbidden in this export probe') },
        }
        environment.global = environment
        environment.self = environment
        if (form === 'cjs')
          Object.assign(environment, { module, exports: module.exports })
        else environment.window = environment
        vm.runInNewContext(bytes, environment, { timeout: 5000 })
        const value = form === 'cjs' ? module.exports : environment.artplayerPluginDanmukuMask
        const oldCommonJs = version === '1.0.0' && form === 'cjs'
        assert.equal(typeof value, oldCommonJs ? 'object' : 'function')
        assert.equal(typeof value.default, oldCommonJs ? 'function' : 'undefined')
        const factory = oldCommonJs ? value.default : value
        const events = []
        const style = {}
        const result = factory()({
          template: { $video: {}, $danmuku: { style } },
          on: name => events.push(name),
        })
        assert.equal(result.name, 'artplayerPluginDanmukuMask')
        assert.equal(typeof result.start, 'function')
        assert.equal(typeof result.stop, 'function')
        assert.equal(result.stop(), undefined)
        assert.equal(style.maskImage, 'none')
        assert.deepEqual(events, ['ready', 'destroy'])
      }
    }
  }
})

test('Frozen owned source keeps its defaults, ready/destroy hooks and alpha mask pixel boundary without a real SDK', async () => {
  const env = await controlledSource()
  assert.equal(env.result.name, 'artplayerPluginDanmukuMask')
  assert.deepEqual([...env.listeners.keys()], ['ready', 'destroy'])
  const pending = env.result.start()
  assert.equal(typeof pending.then, 'function')
  await pending
  await new Promise(resolve => setImmediate(resolve))
  assert.deepEqual(env.configs, [{ model: 'selfie', config: { runtime: 'mediapipe', modelType: 'general', solutionPath: contract.baseline.sdk.defaultSolutionPath, modelSelection: 1, smoothSegmentation: true, minDetectionConfidence: 0.5, minTrackingConfidence: 0.5, selfieMode: false } }])
  assert.deepEqual(env.style, { maskMode: 'alpha', maskSize: 'contain', maskRepeat: 'no-repeat', backgroundSize: 'contain', backgroundRepeat: 'no-repeat', maskImage: 'url(data:image/png;base64,controlled)' })
  assert.deepEqual(env.calls.find(call => call[0] === 'draw'), ['draw', 1, 3])
  assert.deepEqual(env.calls.find(call => call[0] === 'pixels'), ['pixels', [255, 255, 255, 0, 250, 255, 255, 255]])
  assert.equal(env.frames.size, 1)
  assert.equal(env.result.stop(), undefined)
  assert.equal(env.frames.size, 0)
  assert.equal(env.style.maskImage, 'none')
})

test('Frozen zero numeric options use historical OR defaults while false smoothSegmentation is retained', async () => {
  const env = await controlledSource({ solutionPath: '/local-model', modelSelection: 0, smoothSegmentation: false, minDetectionConfidence: 0, minTrackingConfidence: 0, foregroundThreshold: 0, opacity: 0, maskBlurAmount: 0, drawContour: true, selfieMode: true })
  await env.result.start()
  await new Promise(resolve => setImmediate(resolve))
  assert.deepEqual(env.configs[0].config, { runtime: 'mediapipe', modelType: 'general', solutionPath: '/local-model', modelSelection: 1, smoothSegmentation: false, minDetectionConfidence: 0.5, minTrackingConfidence: 0.5, selfieMode: true })
  assert.deepEqual(env.calls.find(call => call[0] === 'draw'), ['draw', 1, 3])
  const mask = env.calls.find(call => call[0] === 'mask')
  assert.equal(mask[4], true)
  assert.equal(mask[5], 0.5)
  env.result.stop()
})

test('SDK-08 distinguishes the frozen Yarn adapter and local resource bytes from unversioned CDN resolution', () => {
  assert.deepEqual(contract.baseline.sdk.dependencies.map(item => item.version), ['0.1.1675465747', '1.0.2', '4.22.0', '4.22.0', '4.22.0', '4.22.0'])
  assert.equal(contract.baseline.sdk.assets.length, 12)
  assert(contract.baseline.sdk.assets.every(asset => asset.matchesInstalled))
  const adapter = fs.readFileSync('node_modules/@tensorflow-models/body-segmentation/dist/selfie_segmentation_mediapipe/segmenter.js', 'utf8')
  assert.match(adapter, /switch \(config\.modelType\)/u)
  assert.match(adapter, /case 'general':[\s\S]*?modelSelection = 0;/u)
  for (const ignored of ['modelSelection', 'smoothSegmentation', 'minDetectionConfidence', 'minTrackingConfidence', 'selfieMode'])
    assert.equal(adapter.includes(`config.${ignored}`), false, `Do not claim ${ignored} is consumed by this adapter`)
  assert(adapter.includes('return solutionPath + "/" + path;'))
  assert(adapter.includes('this.selfieSegmentationSolution.close();'))
  assert.equal(source.includes('.dispose('), false, 'The historical plugin does not dispose its segmenter')
})
