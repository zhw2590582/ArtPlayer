import assert from 'node:assert/strict'
import fs from 'node:fs'
// eslint-disable-next-line test/no-import-node-test -- Accurate runtime contracts use the repository runner.
import test from 'node:test'
import { isPromise } from 'node:util/types'
import vm from 'node:vm'
import { jassubCandidate, jassubEnvironment, jassubHistorical } from './helpers/jassub.js'

const candidate = await jassubCandidate()
const frozen = (await jassubHistorical()).find(item => item.name === 'frozen-workspace-source')

function environment(implementation) {
  const code = `${implementation.code}\nObject.defineProperty(module.exports.default || module.exports, '__runtimePlatform', { value: { ErrorEvent, setGlobal: (name, value) => { globalThis[name] = value } } });`
  const env = jassubEnvironment({ ...implementation, code })
  env.platform = env.factory.__runtimePlatform
  return env
}

function requestListeners(worker) {
  const listeners = new Map()
  worker.addEventListener = (type, callback) => {
    if (!listeners.has(type))
      listeners.set(type, new Set())
    listeners.get(type).add(callback)
  }
  worker.removeEventListener = (type, callback) => listeners.get(type)?.delete(callback)
  return {
    size: () => [...listeners.values()].reduce((sum, entries) => sum + entries.size, 0),
    emit(type, event) {
      for (const callback of [...listeners.get(type) || []]) callback(event)
    },
  }
}

test('JASSUB accurate runtime resize uses width/height/top/left/force and lifecycle methods return synchronously', async () => {
  const env = environment(candidate)
  const { instance } = env.factory()(env.art)
  await env.ready()
  assert.equal(instance.resize(320, 180, 4, 7, false), undefined)
  assert.equal(instance._canvas.style.top, '4px')
  assert.equal(instance._canvas.style.left, '7px')
  await env.flush()
  const resize = env.workers[0].messages.at(-1)
  assert.equal(resize.target, 'canvas')
  assert.equal(resize.width, 320)
  assert.equal(resize.height, 180)
  assert.equal(resize.force, false)
  const video = env.createVideo()
  assert.equal(instance.setVideo(video), undefined)
  assert.equal(instance._video, video)
  assert.equal(instance.destroy(), undefined)
  assert.equal(env.workers[0].terminated, 1)
  assert.equal(env.parent.children.some(child => child.className === 'JASSUB'), false)
})

test('JASSUB accurate sendMessage returns a Promise waiting for ready and resolving after the actual post', async () => {
  const env = environment(candidate)
  const { instance } = env.factory()(env.art)
  const payload = { value: 42 }
  const pending = instance.sendMessage('runtime-probe', payload)
  assert(isPromise(pending))
  let settled = false
  pending.then(() => {
    settled = true
  })
  await env.flush()
  assert.equal(settled, false)
  assert.deepEqual(env.workers[0].messages.map(message => message.target), ['init'])
  await env.ready()
  assert.equal(await pending, undefined)
  assert.equal(settled, true)
  assert.equal(env.workers[0].messages.at(-1).target, 'runtime-probe')
  assert.equal(env.workers[0].messages.at(-1).value, 42)
  instance.destroy()
})

test('JASSUB accurate font options preserve mixed sources and font methods return synchronously', async () => {
  const env = environment(candidate)
  const bytes = new Uint8Array([1, 2, 3])
  const fonts = ['fixture.woff2', bytes]
  const availableFonts = { fixture: bytes, fallback: 'fallback.woff2' }
  const { instance } = env.factory({ fonts, availableFonts })(env.art)
  await env.ready()
  const init = env.workers[0].messages[0]
  assert.equal(init.fonts, fonts)
  assert.equal(init.fonts[1], bytes)
  assert.equal(init.availableFonts, availableFonts)
  assert.equal(instance.addFont(bytes), undefined)
  assert.equal(instance.setDefaultFont('fixture'), undefined)
  await env.flush()
  const added = env.workers[0].messages.find(message => message.target === 'addFont')
  assert.equal(added.font, bytes)
  assert.equal(env.workers[0].messages.at(-1).target, 'defaultFont')
  assert.equal(env.workers[0].messages.at(-1).font, 'fixture')
  instance.destroy()
})

const subtitles = `[Script Info]
ScriptType: v4.00+
PlayResX: 640
PlayResY: 360
[V4+ Styles]
Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding
Style: Default,Arial,24,&H00FFFFFF,&H000000FF,&H00000000,&H00000000,0,0,0,0,100,100,0,0,1,2,0,2,10,10,10,1
[Events]
Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text
Dialogue: 0,0:00:01.00,0:00:03.00,Default,,0,0,0,,Runtime fixture`

test('JASSUB real Worker JS/WASM queries return numeric style indices and full event/style data through controlled transport', { timeout: 10000 }, async (context) => {
  const env = environment(candidate)
  env.platform.setGlobal('setTimeout', setTimeout)
  env.platform.setGlobal('clearTimeout', clearTimeout)
  const { instance } = env.factory({ subContent: subtitles, availableFonts: {}, fallbackFont: 'fixture', wasmUrl: '/runtime-fixture.wasm', onDemandRender: false, offscreenRender: false, asyncRender: false })(env.art)
  const worker = env.workers[0]
  const listeners = requestListeners(worker)
  const wasm = fs.readFileSync('packages/artplayer-plugin-jassub/worker/jassub-worker.wasm')
  const source = fs.readFileSync('packages/artplayer-plugin-jassub/worker/jassub-worker.js', 'utf8')
  const requests = []
  const messages = []
  let initialized = false
  let stopped = false
  const workerContext = {
    WebAssembly,
    TextDecoder,
    TextEncoder,
    console,
    onmessage: null,
    async fetch(url) {
      assert.equal(url, '/runtime-fixture.wasm')
      requests.push(url)
      return new Response(wasm, { headers: { 'Content-Type': 'application/wasm' } })
    },
    postMessage(message) {
      const data = structuredClone(message)
      messages.push(data)
      if (data.target === 'ready')
        initialized = true
      queueMicrotask(() => {
        if (stopped)
          return
        worker.onmessage({ data })
        listeners.emit('message', { data })
      })
    },
  }
  workerContext.self = workerContext
  vm.createContext(workerContext)
  // Execute complete production Worker JS and actual WASM. Only transport and fetch are controlled.
  vm.runInContext(source, workerContext, { timeout: 5000 })
  const post = worker.postMessage
  worker.postMessage = function (message) {
    post.call(this, message)
    if (!stopped)
      workerContext.onmessage({ data: structuredClone(message) })
  }
  const terminate = worker.terminate
  worker.terminate = function () {
    if (initialized && !stopped)
      workerContext.onmessage({ data: { target: 'destroy' } })
    stopped = true
    terminate.call(this)
  }
  context.after(() => instance.destroy())
  let readyEvents = 0
  instance.addEventListener('ready', (event) => {
    readyEvents++
    assert.equal(event.detail, null)
    assert.equal(event.target, instance)
  })
  assert(instance instanceof EventTarget)
  await new Promise(resolve => instance.addEventListener('ready', resolve, { once: true }))
  assert.equal(readyEvents, 1)
  assert.deepEqual(requests, ['/runtime-fixture.wasm'])
  const query = method => new Promise((resolve, reject) => {
    assert.equal(instance[method]((error, rows) => {
      if (error !== null) {
        reject(error ?? new Error('Successful queries must pass null as their error argument'))
        return
      }
      resolve(rows)
    }), undefined)
  })
  const events = await query('getEvents')
  const styles = await query('getStyles')
  assert.equal(events.length, 1)
  assert.equal(events[0].Start, 1000)
  assert.equal(events[0].Duration, 2000)
  assert.equal(events[0].Text, 'Runtime fixture')
  assert.equal(typeof events[0].Style, 'number')
  assert.equal(Object.hasOwn(events[0], '_index'), false)
  assert.equal(styles[events[0].Style].FontName, 'Arial')
  assert.equal(styles[events[0].Style].FontSize, 24)
  assert.equal(typeof styles[events[0].Style].PrimaryColour, 'number')
  assert.equal(listeners.size(), 0)
  assert.deepEqual(messages.find(message => message.target === 'getEvents').events, events)
  assert.deepEqual(messages.find(message => message.target === 'getStyles').styles, styles)
  assert.equal(instance.setEvent({ Text: 'Updated through Worker', Style: events[0].Style }, 0), undefined)
  await env.flush()
  assert.equal((await query('getEvents'))[0].Text, 'Updated through Worker')
  assert.equal(instance.setStyle({ FontSize: 32 }, events[0].Style), undefined)
  await env.flush()
  assert.equal((await query('getStyles'))[events[0].Style].FontSize, 32)
})

for (const method of ['getEvents', 'getStyles']) {
  for (const mode of ['timeout', 'worker-error']) {
    test(`JASSUB frozen PKG-JASSUB-07 defect: ${method} ${mode} throws before the public error callback`, async () => {
      const env = environment(frozen)
      const timers = new Map()
      let next = 0
      env.platform.setGlobal('setTimeout', (callback) => {
        timers.set(++next, callback)
        return next
      })
      env.platform.setGlobal('clearTimeout', id => timers.delete(id))
      const { instance } = env.factory()(env.art)
      await env.ready()
      const listeners = requestListeners(env.workers[0])
      let calls = 0
      instance[method](() => calls++)
      assert.equal(listeners.size(), 2)
      const trigger = mode === 'timeout'
        ? () => {
            const [id, callback] = [...timers][0]
            timers.delete(id)
            callback()
          }
        : () => listeners.emit('error', new env.platform.ErrorEvent('error', { error: new Error('controlled Worker error') }))
      assert.throws(trigger, { name: 'TypeError', message: /Cannot destructure property/ })
      assert.equal(calls, 0)
      assert.equal(listeners.size(), 2)
      assert.equal(timers.size, mode === 'timeout' ? 0 : 1)
      instance.destroy()
    })
  }
}
