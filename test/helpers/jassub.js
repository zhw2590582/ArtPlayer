import assert from 'node:assert/strict'
import fs from 'node:fs'
import process from 'node:process'
import vm from 'node:vm'
import { transform } from 'esbuild'
import { verifyJassubContract } from '../../refactor/scripts/jassub-contract.mjs'
import { readMember } from '../../refactor/scripts/releases.mjs'
import { compilePackage } from './load.js'

export async function jassubCandidate() {
  return { name: 'candidate', version: 'candidate', code: process.env.ARTPLAYER_JASSUB_ARTIFACT ? fs.readFileSync(process.env.ARTPLAYER_JASSUB_ARTIFACT, 'utf8') : await compilePackage('artplayer-plugin-jassub', 'umd') }
}
export async function jassubHistorical() {
  const { baseline, archives, sources } = await verifyJassubContract()
  const prefix = 'packages/artplayer-plugin-jassub'
  const implementations = []
  for (const release of [baseline.release, ...baseline.previous]) {
    for (const field of ['main', 'legacy'])
      implementations.push({ name: `published-${release.version}-${field}`, version: release.version, code: readMember(archives.get(release.version), `package/${release.manifest[field].replace(/^\.\//, '')}`).toString() })
  }
  const vendor = sources.get(`${prefix}/src/jassub.es.js`)
  const exported = vendor.match(/export\s*\{\s*(\w+) as default\s*\};?\s*$/)
  assert(exported, 'Frozen vendor must have one explicit default class export')
  const source = vendor.slice(0, exported.index) + sources.get(`${prefix}/src/index.js`).replace('import JASSUB from \'./jassub.es.js\'', `const JASSUB = ${exported[1]}`)
  implementations.push({ name: 'frozen-workspace-source', version: 'workspace', code: (await transform(source, { format: 'cjs', target: 'es2020' })).code, scriptCode: (await transform(source, { format: 'iife', globalName: 'artplayerPluginJassub', target: 'es2020' })).code })
  for (const suffix of ['js', 'legacy.js'])
    implementations.push({ name: `frozen-workspace-${suffix}`, version: 'workspace', code: sources.get(`${prefix}/dist/artplayer-plugin-jassub.${suffix}`) })
  return implementations
}
export function jassubEnvironment(implementation, { script = false, simd = false } = {}) {
  const workers = []
  const errors = []
  const listeners = new Map()
  class Element extends EventTarget {
    constructor() {
      super()
      this.style = {}
      this.children = []
    }

    appendChild(child) {
      this.children.push(child)
      child.parentNode = this
      return child
    }

    removeChild(child) {
      assert(this.children.includes(child))
      this.children.splice(this.children.indexOf(child), 1)
      child.parentNode = null
      return child
    }

    remove() { this.parentNode?.removeChild(this) }
    insertAdjacentElement(position, child) {
      assert.equal(position, 'afterend')
      this.parentNode.appendChild(child)
    }

    getBoundingClientRect() { return { x: 0, y: 0, top: 0, left: 0, width: 640, height: 360 } }
  }
  class Video extends Element {
    constructor() {
      super()
      this.videoWidth = 0
      this.videoHeight = 0
      this.paused = true
      this.currentTime = 0
      this.readyState = 0
      this.playbackRate = 1
    }
  }
  class Canvas extends Element {
    constructor() {
      super()
      this.width = 300
      this.height = 150
      this.context = { clearRect() { }, putImageData() { }, drawImage() { }, getImageData: () => ({ data: new Uint8ClampedArray(4) }) }
    }

    getContext(type) {
      assert.equal(type, '2d')
      return this.context
    }
  }
  class Worker {
    constructor(url) {
      this.url = url
      this.messages = []
      this.terminated = 0
      workers.push(this)
    }

    postMessage(message) { this.messages.push(message) }
    terminate() { this.terminated++ }
  }
  class ImageData {
    constructor(data, width, height) {
      this.data = data
      this.width = width
      this.height = height
    }
  }
  class ErrorEvent extends Event {
    constructor(type, options) {
      super(type)
      this.error = options.error
    }
  }
  const parent = new Element()
  const video = parent.appendChild(new Video())
  const module = { exports: {} }
  const context = {
    EventTarget,
    Event,
    CustomEvent,
    ErrorEvent,
    HTMLVideoElement: Video,
    HTMLCanvasElement: Canvas,
    ImageData,
    Worker,
    WebAssembly: { validate: () => simd },
    document: { createElement: name => name === 'canvas' ? new Canvas() : new Element() },
    console: {
      log() {},
      error(error) { errors.push(error) },
    },
    performance,
  }
  context.window = context
  context.self = context
  if (!script) {
    context.module = module
    context.exports = module.exports
  }
  vm.runInNewContext(script && implementation.scriptCode ? implementation.scriptCode : implementation.code, context, { timeout: 5000 })
  const exported = script ? context.artplayerPluginJassub : module.exports
  const factory = exported.default || exported
  const art = { video, on(name, callback) {
    if (!listeners.has(name))
      listeners.set(name, [])
    listeners.get(name).push(callback)
    return art
  } }
  const emit = name => listeners.get(name)?.forEach(callback => callback())
  const flush = async () => {
    for (let index = 0;
      index < 12;
      index++)
      await Promise.resolve()
  }
  const ready = async () => {
    await flush()
    workers.at(-1).onmessage({ data: { target: 'ready' } })
    await flush()
  }
  return { factory, exported, art, workers, parent, errors, listeners, emit, ready, flush, createVideo: () => parent.appendChild(new Video()) }
}
