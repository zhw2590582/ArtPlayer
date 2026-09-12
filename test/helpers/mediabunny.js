import vm from 'node:vm'
import { verifyMbContract } from '../../refactor/scripts/mb-contract.mjs'
import { readMember } from '../../refactor/scripts/releases.mjs'

export async function mbHistorical() {
  const { baseline, archives, sources } = await verifyMbContract()
  const name = baseline.release.name
  return [
    ...[baseline.release, ...baseline.previous].map(release => ({
      name: `published-${release.version}`,
      code: readMember(archives.get(release.version), `package/${release.manifest.main.replace(/^\.\//, '')}`).toString(),
    })),
    { name: 'frozen-workspace', code: sources.get(`packages/${name}/dist/${name}.js`) },
  ]
}

export function mbEnvironment({ code }, option = {}) {
  const emitted = []
  const handlers = new Map()
  const frames = new Map()
  const canvasListeners = new Map()
  let nextFrame = 0
  const nativeCalls = []
  const context = { clearRect() {}, drawImage() {} }
  const canvas = {
    width: 300,
    height: 150,
    style: {},
    getContext(type) {
      nativeCalls.push(['context', type, this === canvas])
      return context
    },
    addEventListener(type, fn) { canvasListeners.set(type, fn) },
    removeEventListener(type) { canvasListeners.delete(type) },
    getBoundingClientRect() { return { width: 300, height: 150 } },
    setAttribute(name, value) { nativeCalls.push(['attribute', name, value]) },
  }
  const eventNames = ['volumechange', 'ratechange', 'play', 'pause', 'loadedmetadata', 'error']
  const art = {
    constructor: { utils: { createElement: () => canvas }, config: { events: eventNames } },
    option: { url: '', autoSize: false },
    template: { $player: {} },
    on(name, fn) {
      const listeners = handlers.get(name) || []
      listeners.push(fn)
      handlers.set(name, listeners)
      return this
    },
    emit(name, ...args) {
      emitted.push({ name, args })
      for (const fn of handlers.get(name) || []) fn(...args)
      return this
    },
  }
  const module = { exports: {} }
  const globals = {
    module,
    exports: module.exports,
    window: {},
    TextDecoder,
    TextEncoder,
    ReadableStream,
    Blob,
    Event,
    URL,
    console,
    performance,
    setTimeout,
    clearTimeout,
    requestAnimationFrame(fn) {
      const id = nextFrame++
      frames.set(id, fn)
      return id
    },
    cancelAnimationFrame(id) { frames.delete(id) },
  }
  vm.runInNewContext(code, globals)
  const factory = module.exports.default || module.exports
  return { factory, exported: module.exports, art, canvas, context, option, frames, nativeCalls, eventNames, handlers, emitted, canvasListeners, globals }
}
