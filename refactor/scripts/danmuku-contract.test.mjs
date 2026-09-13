import assert from 'node:assert/strict'
import { Buffer } from 'node:buffer'
import fs from 'node:fs'
import path from 'node:path'
// eslint-disable-next-line test/no-import-node-test -- Immutable Node contract runner.
import { test } from 'node:test'
import vm from 'node:vm'
import { build } from 'esbuild'
import { verifyDanmukuContract } from './danmuku-contract.mjs'
import { ensureArchive, readMember, refactorDir } from './releases.mjs'

const { baseline, archives, sources } = await verifyDanmukuContract()
const prefix = 'packages/artplayer-plugin-danmuku/'
const icons = ['$on', '$off', '$config', '$style', '$mode_0_off', '$mode_0_on', '$mode_1_off', '$mode_1_on', '$mode_2_off', '$mode_2_on', '$check_on', '$check_off']
const publicKeys = ['name', 'emit', 'load', 'config', 'hide', 'show', 'reset', 'mount', 'option', 'isHide', 'isStop']
const optionKeys = ['danmuku', 'speed', 'margin', 'opacity', 'color', 'mode', 'modes', 'fontSize', 'antiOverlap', 'synchronousPlayback', 'mount', 'heatmap', 'width', 'points', 'filter', 'beforeEmit', 'beforeVisible', 'visible', 'emitter', 'maxLength', 'lockTime', 'theme', 'OPACITY', 'FONT_SIZE', 'MARGIN', 'SPEED', 'COLOR']
const coreRelease = JSON.parse(fs.readFileSync(path.join(refactorDir, 'baselines/releases.json'), 'utf8')).releases.find(item => item.name === 'artplayer')
const coreModule = { exports: {} }
vm.runInNewContext(readMember(await ensureArchive(coreRelease), 'package/dist/artplayer.js').toString(), { module: coreModule, exports: coreModule.exports }, { timeout: 1000 })
const core = coreModule.exports

function exported(code, globals = {}) {
  const module = { exports: {} }
  const context = vm.createContext({ console, ...globals, module, exports: module.exports })
  vm.runInContext(code, context, { timeout: 1000 })
  const factory = typeof module.exports === 'function' ? module.exports : module.exports.default
  return { module: module.exports, factory, context }
}

for (const release of [baseline.release, ...baseline.previous]) {
  for (const field of ['main', 'legacy']) {
    if (!release.manifest[field])
      continue
    test(`danmuku published ${release.version} ${field}: actual CommonJS shape and static icons`, () => {
      const code = readMember(archives.get(release.version), `package/${release.manifest[field].replace(/^\.\//u, '')}`).toString()
      const result = exported(code)
      const direct = ['3.5.31', '5.3.0'].includes(release.version)
      assert.equal(typeof result.module, direct ? 'function' : 'object')
      assert.equal(typeof result.factory, 'function')
      const hasIcons = release.version.startsWith('5.') && !release.version.startsWith('5.0.')
      assert.deepEqual(Object.keys(result.factory.icons || {}), hasIcons ? icons : [])
      if (hasIcons) {
        const descriptor = Object.getOwnPropertyDescriptor(result.factory, 'icons')
        assert.equal(descriptor.writable, true)
        assert.equal(descriptor.enumerable, true)
        assert.equal(descriptor.configurable, true)
      }
    })
  }
  if (release.manifest.module) {
    test(`danmuku published ${release.version}: manifest ESM bytes expose a default factory`, async () => {
      const code = readMember(archives.get(release.version), `package/${release.manifest.module.replace(/^\.\//u, '')}`)
      const module = await import(`data:text/javascript;base64,${code.toString('base64')}`)
      assert.equal(typeof module.default, 'function')
      assert.deepEqual(Object.keys(module.default.icons), icons)
    })
  }
}

// Build only immutable Git modules in memory. Inline worker transport and CSS are
// controlled dependencies here; real Worker/layout/visual behavior belongs to 02.
const frozenSource = await build({ entryPoints: [`${prefix}src/index.js`], bundle: true, write: false, format: 'cjs', platform: 'browser', plugins: [{ name: 'frozen-danmuku', setup(build) {
  build.onResolve({ filter: /.*/ }, args => ({ path: path.posix.normalize(args.importer ? path.posix.join(path.posix.dirname(args.importer), args.path) : args.path), namespace: 'frozen' }))
  build.onLoad({ filter: /.*/, namespace: 'frozen' }, (args) => {
    if (args.path.includes('?worker'))
      return { contents: 'export default Worker', loader: 'js' }
    const file = args.path.split('?')[0]
    const found = sources.get(file) ?? sources.get(`${file}.js`)
    assert.notEqual(found, undefined, file)
    if (args.path.includes('?'))
      return { contents: `export default ${JSON.stringify(found)}`, loader: 'js' }
    return { contents: found, loader: 'js' }
  })
} }] })

class Element {
  constructor() {
    this.style = {}
    this.dataset = {}
    this.children = []
    this.nodes = new Map()
    this.clientWidth = 640
    this.clientHeight = 360
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

  getBoundingClientRect() { return { top: 0, left: 0, right: 640, bottom: 360, width: 640, height: 360 } }
  setAttribute(key, value) { this[key] = value }
  addEventListener() {}
}

function environment(code) {
  const events = []
  const listeners = new Map()
  const workers = []
  const frames = new Map()
  const timers = new Map()
  const proxies = []
  const host = {
    requestAnimationFrame(callback) {
      frames.set(frames.size + 1, callback)
      return frames.size
    },
    cancelAnimationFrame(id) { frames.delete(id) },
  }
  class Worker {
    constructor() { workers.push(this) }
    terminate() { this.terminated = true }
    postMessage() {}
    addEventListener() {}
  }
  const loaded = exported(code, {
    window: host,
    Worker,
    Blob,
    URL: { createObjectURL: () => 'blob:controlled-worker', revokeObjectURL() {} },
    atob: value => Buffer.from(value, 'base64').toString('binary'),
    setTimeout(callback) {
      timers.set(timers.size + 1, callback)
      return timers.size
    },
    clearTimeout(id) { timers.delete(id) },
  })
  const body = new Element()
  loaded.context.document = { querySelector: selector => selector === '#external' ? body : null, createElement: () => new Element() }
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
    constructor: { utils, validator: core.validator },
    template: { $danmuku: new Element(), $player: new Element(), $controlsCenter: new Element() },
    currentTime: 10,
    width: 640,
    playbackRate: 1,
    playing: false,
    plugins: {},
    on(name, callback) { listeners.set(name, [...listeners.get(name) || [], callback]) },
    off(name, callback) { listeners.set(name, (listeners.get(name) || []).filter(item => item !== callback)) },
    emit(name, ...args) {
      events.push({ name, args })
      for (const callback of listeners.get(name) || [])
        callback(...args)
    },
    proxy(target, name, callback) { proxies.push({ target, name, callback }) },
  }
  return { ...loaded, art, workers, events, listeners, frames, timers, proxies, external: body }
}

const implementations = [
  { name: 'frozen-source', code: frozenSource.outputFiles[0].text },
  ...['main', 'legacy'].map(field => ({ name: `published-5.3.0-${field}`, code: readMember(archives.get('5.3.0'), `package/${baseline.release.manifest[field].replace(/^\.\//u, '')}`).toString() })),
]

for (const implementation of implementations) {
  test(`danmuku ${implementation.name}: synchronous facade, defaults, descriptors and actual method return identity`, async () => {
    const env = environment(implementation.code)
    const factory = env.factory({ danmuku: [] })
    const result = factory(env.art)
    assert.equal(typeof result.then, 'undefined')
    assert.deepEqual(Object.keys(result), publicKeys)
    assert.deepEqual(Object.keys(result.option), optionKeys)
    for (const key of ['option', 'isHide', 'isStop']) {
      const descriptor = Object.getOwnPropertyDescriptor(result, key)
      assert.equal(typeof descriptor.get, 'function')
      assert.equal(descriptor.set, undefined)
      assert.equal(descriptor.enumerable, true)
    }
    assert.equal(result.option.speed, 5)
    assert.deepEqual(Array.from(result.option.margin), [10, '25%'])
    assert.equal(result.option.mount, env.art.template.$controlsCenter)
    assert.equal(result.isStop, false)
    const internal = result.hide()
    assert.notEqual(internal, result, 'Historical methods return the internal Danmuku, not the public facade')
    assert.equal(internal.name, undefined)
    assert.equal(result.isHide, true)
    assert.equal(result.show(), internal)
    assert.equal(result.reset(), internal)
    assert.equal(result.config({ opacity: 0.6 }), internal)
    assert.equal(result.option.opacity, 0.6)
    const emitted = result.emit({ id: 'row', text: 'hello', time: 15 })
    assert.equal(typeof emitted.then, 'function', 'The old declaration incorrectly promises a synchronous Result')
    assert.equal(await emitted, internal)
    assert.equal(await result.load([{ text: 'appended', time: 16 }]), internal)
    assert.equal(internal.queue.length, 2)
    assert.equal(internal.queue[0].id, 'row')
    assert.equal(result.mount('#external'), undefined)
    assert.equal(env.external.children.length, 1)
    assert.throws(() => result.mount(), /Can not find the mount point/u)
    env.art.emit('destroy')
    assert(env.workers.every(worker => worker.terminated))
  })

  test(`danmuku ${implementation.name}: load replacement/append, filters, input mutation and event argument identity`, async () => {
    const env = environment(implementation.code)
    let beforeEmit = 0
    let filterReceiver
    const result = env.factory({
      danmuku: [],
      beforeEmit() {
        beforeEmit++
        return true
      },
      filter(danmu) {
        filterReceiver = this
        return danmu.text !== 'filtered'
      },
    })(env.art)
    const initial = await result.load()
    const input = { text: 'zero', time: 0 }
    await result.emit(input)
    assert.equal(input.time, 10.5, 'Historical time:0 uses currentTime + 0.5')
    assert.equal(input.mode, 0)
    assert.equal(input.color, '#FFFFFF')
    assert.equal(filterReceiver, result.option)
    assert.equal(beforeEmit, 0, 'Public emit bypasses the setting beforeEmit callback')
    const originalFilter = result.option.filter
    result.config({ filter: () => false })
    assert.equal(result.option.filter, originalFilter, 'Historical JSON comparison ignores a function-only config change')
    await result.load([{ text: 'filtered' }, { text: 'two', time: 12 }])
    assert.equal(initial.queue.length, 2)
    const loaded = env.events.filter(event => event.name === 'artplayerPluginDanmuku:loaded').at(-1)
    assert.equal(loaded.args[0], initial.queue)
    await result.load()
    assert.equal(initial.queue.length, 0)
    await result.load(() => Promise.resolve([{ text: 'function' }]))
    assert.equal(initial.queue.length, 1)
    const promisedInput = vm.runInContext('Promise.resolve([{text:"promise"}])', env.context)
    await result.load(promisedInput)
    assert.equal(initial.queue.length, 2)
    const failure = new Error('controlled input failure')
    await assert.rejects(result.load(() => Promise.reject(failure)), error => error === failure)
    assert.equal(env.events.at(-1).name, 'artplayerPluginDanmuku:error')
    assert.equal(env.events.at(-1).args[0], failure)
    env.art.emit('destroy')
  })

  test(`danmuku ${implementation.name}: initial Promise validation and resize cleanup historical discrepancies`, async () => {
    const env = environment(implementation.code)
    const promise = vm.runInContext('Promise.resolve([])', env.context)
    assert.throws(() => env.factory({ danmuku: promise })(env.art), /danmuku/iu)
    const result = env.factory({ danmuku: [] })(env.art)
    await result.load()
    const before = env.listeners.get('resize').length
    env.art.emit('destroy')
    assert.equal(env.listeners.get('resize').length, before, 'Historical destroy removes this.reset instead of registered this.resize; Setting listener also remains')
  })

  test(`danmuku ${implementation.name}: synchronous initial events, video hooks and settings beforeEmit path`, async () => {
    const env = environment(implementation.code)
    const seen = []
    const result = env.factory({
      danmuku: [],
      beforeEmit(danmu) {
        seen.push({ danmu: { ...danmu }, receiver: this })
        return Promise.resolve(true)
      },
    })(env.art)
    assert.deepEqual(env.events.map(event => event.name), ['artplayerPluginDanmuku:show', 'artplayerPluginDanmuku:config', 'artplayerPluginDanmuku:reset', 'artplayerPluginDanmuku:loaded'])
    env.art.emit('video:play')
    assert.equal(result.isStop, false)
    env.art.emit('video:pause')
    assert.equal(result.isStop, true)
    const root = env.art.template.$controlsCenter.children[0]
    const input = root.querySelector('.apd-input')
    const send = root.querySelector('.apd-send')
    input.value = '  via settings  '
    await env.proxies.find(proxy => proxy.target === send && proxy.name === 'click').callback()
    assert.equal(seen.length, 1)
    assert.equal(seen[0].receiver, result.option)
    assert.equal(seen[0].danmu.text, 'via settings')
    assert.equal(seen[0].danmu.time, 10)
    const internal = result.show()
    assert.equal(internal.queue[0].border, true)
    assert.equal(internal.queue[0].time, 10.5)
    assert.equal(input.value, '')
    assert.equal(env.timers.size, 1)
    env.art.emit('destroy')
    assert.equal(env.events.at(-1).name, 'artplayerPluginDanmuku:destroy')
    assert.equal(env.timers.size, 1, 'Historical settings lock timer is not cleared by destroy')
  })
}

test('danmuku frozen Bilibili parser: mapped modes, entities, malformed attributes and URL fallback', async () => {
  const source = sources.get(`${prefix}src/bilibili.js`).replace('export function bilibiliDanmuParseFromUrl', 'function bilibiliDanmuParseFromUrl')
  const requests = []
  const errors = []
  const xml = '<i><d p="1,1,25,255,100,0,user,9"> &lt;hi&gt; &amp; &quot;x&quot; </d><d p="2,4,24,16777215,101,1,u,10">bottom</d><d p="3,5,23,0,102,0,u,11">top</d><d p="4,7,22,10,103,0,u,12">special</d><d p="1,2">invalid</d></i>'
  const context = vm.createContext({
    fetch: async (url) => {
      requests.push(url)
      return { text: async () => xml }
    },
    console: { error: (...args) => errors.push(args) },
  })
  vm.runInContext(`${source}\nglobalThis.parse=bilibiliDanmuParseFromXml;globalThis.load=bilibiliDanmuParseFromUrl`, context)
  const data = await context.load('/fixture.xml')
  assert.deepEqual(requests, ['/fixture.xml'])
  assert.deepEqual(Array.from(data, item => item.mode), [0, 2, 1, 0])
  assert.equal(data[0].text, '<hi> & "x"')
  assert.equal(data[0].color, '#ff', 'Historical parser does not left-pad RGB')
  assert.deepEqual(Object.keys(data[0]), ['text', 'time', 'mode', 'fontSize', 'color', 'timestamp', 'pool', 'userID', 'rowID'])
  assert.equal(context.parse(null).length, 0)
  assert.equal(context.parse('<d p="1,2">x</d>').length, 0)
  assert.equal(errors.length, 1, 'Unavailable Worker falls back to the real parser')
})
