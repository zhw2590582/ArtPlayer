import assert from 'node:assert/strict'
import { Buffer } from 'node:buffer'
import fs from 'node:fs'
import path from 'node:path'
import vm from 'node:vm'
import { build } from 'esbuild'
import { verifyDanmukuContract } from '../../refactor/scripts/danmuku-contract.mjs'
import { ensureArchive, readMember, refactorDir } from '../../refactor/scripts/releases.mjs'

export function deferred() {
  let resolve
  let reject
  const promise = new Promise((yes, no) => {
    resolve = yes
    reject = no
  })
  return { promise, resolve, reject }
}

export async function danmukuHistorical() {
  const { baseline, archives, sources } = await verifyDanmukuContract()
  const prefix = 'packages/artplayer-plugin-danmuku/'
  const compiled = await build({ entryPoints: [`${prefix}src/index.js`], bundle: true, write: false, format: 'cjs', platform: 'browser', plugins: [{ name: 'frozen-danmuku-failures', setup(build) {
    build.onResolve({ filter: /.*/ }, args => ({ path: path.posix.normalize(args.importer ? path.posix.join(path.posix.dirname(args.importer), args.path) : args.path), namespace: 'frozen' }))
    build.onLoad({ filter: /.*/, namespace: 'frozen' }, (args) => {
      if (args.path.includes('?worker'))
        return { contents: 'export default Worker', loader: 'js' }
      const file = args.path.split('?')[0]
      const found = sources.get(file) ?? sources.get(`${file}.js`)
      assert.notEqual(found, undefined, file)
      return { contents: args.path.includes('?') ? `export default ${JSON.stringify(found)}` : found, loader: 'js' }
    })
  } }] })
  const coreRelease = JSON.parse(fs.readFileSync(path.join(refactorDir, 'baselines/releases.json'), 'utf8')).releases.find(item => item.name === 'artplayer')
  const coreCode = readMember(await ensureArchive(coreRelease), 'package/dist/artplayer.js').toString()
  return [
    { name: 'frozen-source', code: compiled.outputFiles[0].text, coreCode },
    ...['main', 'legacy'].map(field => ({ name: `published-5.3.0-${field}`, code: readMember(archives.get('5.3.0'), `package/${baseline.release.manifest[field].replace(/^\.\//u, '')}`).toString(), coreCode })),
  ]
}

class Element {
  constructor() {
    this.style = {}
    this.dataset = {}
    this.children = []
    this.nodes = new Map()
    this.clientWidth = 640
    this.clientHeight = 360
    this.offsetWidth = 640
    this.offsetHeight = 100
    this.offsetTop = 0
    this.className = ''
    this.textContent = ''
    this.value = ''
  }

  get [Symbol.toStringTag]() { return 'HTMLDivElement' }
  appendChild(child) {
    child.parentElement = this
    this.children.push(child)
    return child
  }

  querySelector(selector) {
    if (!this.nodes.has(selector))
      this.nodes.set(selector, new Element())
    return this.nodes.get(selector)
  }

  getBoundingClientRect() { return { top: 0, left: 0, right: this.clientWidth, bottom: this.clientHeight, width: this.clientWidth, height: this.clientHeight } }
  setAttribute(key, value) { this[key] = value }
  addEventListener() {}
}

export function danmukuEnvironment(implementation, settings = {}) {
  const coreModule = { exports: {} }
  vm.runInNewContext(implementation.coreCode, { module: coreModule, exports: coreModule.exports }, { timeout: 1000 })
  const events = []
  const listeners = new Map()
  const workers = []
  const frames = new Map()
  const timers = new Map()
  const proxies = []
  const controls = []
  const requests = []
  const urls = new Map()
  const revoked = []
  const consoleErrors = []
  let id = 0
  let now = 1000
  const host = {
    requestAnimationFrame(callback) {
      frames.set(++id, callback)
      return id
    },
    cancelAnimationFrame(id) { frames.delete(id) },
  }
  class Worker {
    constructor(url) {
      this.url = url
      this.messages = []
      this.listeners = new Map()
      this.terminated = false
      workers.push(this)
    }

    terminate() { this.terminated = true }
    postMessage(message) { this.messages.push({ message, afterTerminate: this.terminated }) }
    addEventListener(name, callback) { this.listeners.set(name, [...this.listeners.get(name) || [], callback]) }
    deliver(data) { this.onmessage?.({ data }) }
    async execute(message) {
      const blob = urls.get(this.url)
      assert(blob, 'Expected the parser actual Blob source')
      const workerContext = vm.createContext({ postMessage: data => this.deliver(data) })
      vm.runInContext(await blob.text(), workerContext, { timeout: 1000 })
      workerContext.input = message
      vm.runInContext('onmessage({ data: input })', workerContext, { timeout: 1000 })
    }

    fail(error) {
      this.onerror?.(error)
      for (const callback of this.listeners.get('error') || [])
        callback(error)
    }
  }
  class Clock extends Date {
    static now() { return now }
  }
  const module = { exports: {} }
  const context = vm.createContext({
    window: host,
    Worker,
    Blob,
    Date: Clock,
    URL: {
      createObjectURL(blob) {
        const url = `blob:danmuku-${++id}`
        urls.set(url, blob)
        return url
      },
      revokeObjectURL(url) { revoked.push(url) },
    },
    atob: value => Buffer.from(value, 'base64').toString('binary'),
    setTimeout(callback, delay) {
      timers.set(++id, { callback, delay })
      return id
    },
    clearTimeout(id) { timers.delete(id) },
    fetch: async (url) => {
      requests.push(url)
      if (settings.fetch)
        return settings.fetch(url)
      return { text: async () => '<i><d p="10,1,25,16777215,1,0,u,1">xml</d></i>' }
    },
    console: { error: (...args) => consoleErrors.push(args) },
    module,
    exports: module.exports,
  })
  vm.runInContext(implementation.code, context, { timeout: 1000 })
  const factory = typeof module.exports === 'function' ? module.exports : module.exports.default
  const body = new Element()
  context.document = { querySelector: selector => selector === '#external' ? body : null, createElement: () => new Element() }
  const utils = {
    clamp: (value, min, max) => Math.min(Math.max(value, min), max),
    setStyle: (element, key, value) => element.style[key] = value,
    setStyles: (element, style) => Object.assign(element.style, style),
    errorHandle: (value, message) => {
      if (!value)
        throw new Error(message)
      return value
    },
    createElement: () => new Element(),
    query: (selector, element) => element.querySelector(selector),
    append: (element, child) => element.appendChild(child),
    tooltip() {},
    inverseClass() {},
    addClass() {},
    removeClass() {},
  }
  const art = {
    constructor: { utils, validator: coreModule.exports.validator },
    template: { $danmuku: new Element(), $player: new Element(), $controlsCenter: new Element() },
    currentTime: 10,
    duration: 60,
    played: 0,
    option: { isLive: false },
    width: 640,
    playbackRate: 1,
    playing: false,
    plugins: {},
    controls: { add(option) {
      const element = new Element()
      element.offsetWidth = settings.heatmapWidth ?? 640
      controls.push({ option, element })
      option.mounted?.(element)
      return undefined
    } },
    on(name, callback) { listeners.set(name, [...listeners.get(name) || [], callback]) },
    off(name, callback) { listeners.set(name, (listeners.get(name) || []).filter(item => item !== callback)) },
    emit(name, ...args) {
      events.push({ name, args })
      for (const callback of listeners.get(name) || [])
        callback(...args)
    },
    proxy(target, name, callback) { proxies.push({ target, name, callback }) },
  }
  return {
    context,
    factory,
    art,
    workers,
    events,
    listeners,
    frames,
    timers,
    proxies,
    controls,
    requests,
    urls,
    revoked,
    consoleErrors,
    async flush() {
      for (let step = 0; step < 12; step++)
        await Promise.resolve()
    },
    frame(frameId = frames.keys().next().value) {
      const callback = frames.get(frameId)
      assert.equal(typeof callback, 'function', 'Expected one scheduled animation frame')
      frames.delete(frameId)
      return callback(now)
    },
    tick(milliseconds) { now += milliseconds },
    destroy() {
      art.isDestroy = true
      art.emit('destroy')
    },
  }
}
