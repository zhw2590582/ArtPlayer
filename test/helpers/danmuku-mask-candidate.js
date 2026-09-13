import assert from 'node:assert/strict'
import vm from 'node:vm'
import { build } from 'esbuild'

export const flush = () => new Promise(resolve => setImmediate(resolve))
export async function maskCandidate() {
  const result = await build({ entryPoints: ['packages/artplayer-plugin-danmuku-mask/src/index.js'], bundle: true, write: false, format: 'cjs', platform: 'browser', external: ['@tensorflow-models/body-segmentation', '@tensorflow/tfjs-core', '@tensorflow/tfjs-backend-webgl', '@tensorflow/tfjs-backend-cpu'] })
  return result.outputFiles[0].text
}

export function environment(code, settings = {}) {
  const env = { settings, frames: new Map(), listeners: new Map(), logs: [], writes: [], backends: [], created: [], canvases: [], inferences: [], masks: [], draws: [], gates: {}, cancelled: [], inflight: 0, maximum: 0 }
  let nextFrame = settings.firstFrame ?? 1
  async function phase(name, value) {
    if (settings.reject?.[name])
      throw settings.reject[name]
    if (settings.hold?.includes(name)) {
      let resolve
      let reject
      const promise = new Promise((yes, no) => {
        resolve = yes
        reject = no
      })
      ;(env.gates[name] ||= []).push({ resolve, reject })
      await promise
    }
    return value
  }
  const style = { maskMode: 'luminance' }
  Object.defineProperty(style, 'maskImage', { get: () => env.writes.at(-1) ?? 'url(prior-mask)', set: value => env.writes.push(value) })
  env.video = { paused: settings.paused ?? false, ended: false, videoWidth: 2, videoHeight: 1 }
  env.style = style
  const probe = {
    SupportedModels: { MediaPipeSelfieSegmentation: 'selfie' },
    async setBackend(name) {
      env.backends.push(name)
      return phase(name, settings.backendResult?.[name] ?? true)
    },
    async createSegmenter(model, config) {
      const segmenter = {
        model,
        config,
        disposed: 0,
        disposedWhileBusy: false,
        async dispose() {
          this.disposed++
          this.disposedWhileBusy = env.inflight > 0
          await phase('dispose')
        },
        async segmentPeople(video) {
          env.inferences.push({ segmenter, video })
          env.inflight++
          env.maximum = Math.max(env.maximum, env.inflight)
          settings.onSegment?.(env)
          try {
            return await phase('segment', settings.empty ? [] : [{}])
          }
          finally { env.inflight-- }
        },
      }
      env.created.push(segmenter)
      return phase('init', segmenter)
    },
    async toBinaryMask(...args) {
      env.masks.push(args)
      return phase('mask', {})
    },
    async drawMask(...args) {
      env.draws.push(args)
      await phase('draw')
    },
  }
  const module = { exports: {} }
  const context = {
    module,
    exports: module.exports,
    require(name) {
      assert(['@tensorflow-models/body-segmentation', '@tensorflow/tfjs-core', '@tensorflow/tfjs-backend-webgl', '@tensorflow/tfjs-backend-cpu'].includes(name))
      return probe
    },
    console: { log() {}, warn: (...args) => env.logs.push(['warn', ...args]), error: (...args) => env.logs.push(['error', ...args]) },
    document: { createElement(tag) {
      assert.equal(tag, 'canvas')
      if (settings.canvasError)
        throw settings.canvasError
      const canvas = {
        width: 300,
        height: 150,
        pixels: null,
        getContext: () => settings.noContext
          ? null
          : {
              getImageData() {
                if (settings.readError)
                  throw settings.readError
                return { data: new Uint8ClampedArray([255, 255, 255, 255, 250, 255, 255, 255]) }
              },
              putImageData(image) { canvas.pixels = [...image.data] },
            },
        toDataURL: () => 'data:image/png;base64,candidate-mask',
      }
      env.canvases.push(canvas)
      return canvas
    } },
    requestAnimationFrame(callback) {
      const id = nextFrame++
      env.frames.set(id, callback)
      return id
    },
    cancelAnimationFrame(id) {
      env.cancelled.push(id)
      env.frames.delete(id)
    },
  }
  vm.runInNewContext(code, context)
  const factory = module.exports.default
  env.factory = factory
  env.art = {
    isDestroy: settings.destroyed ?? false,
    template: { $video: settings.noVideo ? null : env.video, $danmuku: settings.noLayer ? null : { style } },
    on(name, callback) {
      if (!env.listeners.has(name))
        env.listeners.set(name, new Set())
      env.listeners.get(name).add(callback)
      if (settings.subscriptionError === name)
        throw settings.subscriptionFailure
    },
    off(name, callback) { env.listeners.get(name)?.delete(callback) },
  }
  settings.onEnvironment?.(env)
  env.result = factory(settings.option)(env.art)
  env.emit = name => [...(env.listeners.get(name) || [])].forEach(callback => callback())
  env.destroy = () => {
    env.art.isDestroy = true
    env.emit('destroy')
  }
  env.frame = async () => {
    const frames = [...env.frames.values()]
    env.frames.clear()
    for (const callback of frames) callback()
    await flush()
  }
  return env
}
