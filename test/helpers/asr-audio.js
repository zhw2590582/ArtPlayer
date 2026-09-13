import assert from 'node:assert/strict'
import vm from 'node:vm'
import { asrEnvironment } from './asr.js'

export function deferredAudio() {
  let resolve
  let reject
  const promise = new Promise((yes, no) => {
    resolve = yes
    reject = no
  })
  return { promise, resolve, reject }
}

export function asrAudioEnvironment(implementation, option = {}, capabilities = {}) {
  const environment = asrEnvironment(implementation)
  const intervals = new Map()
  const contexts = []
  const recorders = []
  const nodes = []
  const modules = []
  const blobs = new Map()
  const revoked = []
  const warnings = []
  const errors = []
  const tracks = [{
    stops: 0,
    stop() { this.stops++ },
  }]
  const stream = { getTracks: () => tracks }
  const attachedElements = new WeakSet()
  let nextTimer = 0
  let nextUrl = 0
  let captures = 0

  function node(kind) {
    const value = {
      kind,
      connections: [],
      disconnects: 0,
      connect(target) { this.connections.push(target) },
      disconnect() {
        this.disconnects++
        this.connections = []
      },
    }
    nodes.push(value)
    return value
  }

  class ControlledAudioContext {
    constructor(options) {
      this.options = options
      this.state = capabilities.suspended ? 'suspended' : 'running'
      this.destination = node('destination')
      this.resumes = 0
      this.closes = 0
      this.audioWorklet = {
        addModule: async (url) => {
          const blob = blobs.get(url)
          assert.ok(blob, 'The actual plugin worklet must have an object URL')
          modules.push({ url, blob })
          capabilities.moduleEntered?.resolve()
          if (capabilities.moduleGate)
            await capabilities.moduleGate.promise
          if (capabilities.moduleError)
            throw capabilities.moduleError
        },
      }
      contexts.push(this)
    }

    async resume() {
      this.resumes++
      this.state = 'running'
    }

    async close() {
      this.closes++
      this.state = 'closed'
    }

    createMediaElementSource(video) {
      assert.equal(video, environment.art.video)
      if (capabilities.directError)
        throw capabilities.directError
      if (attachedElements.has(video))
        throw new Error('HTMLMediaElement already connected to a MediaElementSourceNode')
      attachedElements.add(video)
      return node('element')
    }

    createMediaStreamSource(value) {
      assert.equal(value, stream)
      return node('stream')
    }

    createGain() {
      return Object.assign(node('gain'), { gain: { value: 0 } })
    }
  }

  class ControlledAudioWorkletNode {
    constructor(context, name) {
      assert.ok(contexts.includes(context))
      assert.equal(context.state, 'running')
      assert.equal(name, 'recorder-processor')
      Object.assign(this, node('recorder'), { port: { onmessage: null } })
      recorders.push(this)
    }
  }

  Object.assign(environment.context, {
    Blob,
    URL: {
      createObjectURL(blob) {
        const url = `blob:controlled-asr-${++nextUrl}`
        blobs.set(url, blob)
        return url
      },
      revokeObjectURL(url) {
        assert.ok(blobs.has(url))
        revoked.push(url)
        blobs.delete(url)
      },
    },
    AudioWorkletNode: ControlledAudioWorkletNode,
    console: { warn: (...args) => warnings.push(args), error: (...args) => errors.push(args) },
    setInterval(callback, delay) {
      intervals.set(++nextTimer, { callback, delay })
      return nextTimer
    },
    clearInterval(timer) { intervals.delete(timer) },
  })
  environment.context[capabilities.webkit ? 'webkitAudioContext' : 'AudioContext'] = ControlledAudioContext
  if (capabilities.capture !== false) {
    environment.art.video[capabilities.moz ? 'mozCaptureStream' : 'captureStream'] = () => {
      captures++
      return stream
    }
  }
  const plugin = environment.factory(option)(environment.art)
  return {
    ...environment,
    plugin,
    intervals,
    contexts,
    recorders,
    nodes,
    modules,
    blobs,
    revoked,
    tracks,
    warnings,
    errors,
    captures: () => captures,
    send(samples, recorder = recorders.at(-1)) {
      assert.equal(typeof recorder?.port.onmessage, 'function')
      recorder.port.onmessage({ data: Float32Array.from(samples) })
    },
    tick(timer = [...intervals.keys()][0]) {
      assert.ok(intervals.has(timer), 'No live capture interval')
      return intervals.get(timer).callback()
    },
  }
}

export async function runAsrWorklet(blob) {
  const messages = []
  let Processor
  const context = vm.createContext({
    AudioWorkletProcessor: class {
      port = { postMessage: value => messages.push(value) }
    },
    registerProcessor(name, implementation) {
      assert.equal(name, 'recorder-processor')
      Processor = implementation
    },
  })
  vm.runInContext(await blob.text(), context, { timeout: 1000 })
  assert.equal(typeof Processor, 'function')
  return { processor: new Processor(), messages }
}
