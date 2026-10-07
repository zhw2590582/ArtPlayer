import assert from 'node:assert/strict'
import { Buffer } from 'node:buffer'
// eslint-disable-next-line test/no-import-node-test -- Use the built-in runner without adding a test framework.
import { test } from 'node:test'
import { fileURLToPath } from 'node:url'
import { build } from 'esbuild'

// Regression tests for the danmuku engine fixes (todo: D1-D6).
// Why these tests exist: on master the rAF loop is duplicated per play event,
// the worker channel is a single overwritten onmessage slot (responses get
// dropped and awaits hang forever), one user-filter exception kills the whole
// loop, constructor load failures become unhandled rejections, destroy() misses
// its resize listener due to a typo, and config() silently ignores function
// options. Every assertion below fails on unfixed code and passes after.

// Stub the vite-only `?worker&inline` import so esbuild can bundle danmuku.js.
const viteQueryStub = {
  name: 'vite-query-stub',
  setup(build2) {
    build2.onResolve({ filter: /\?worker&inline$/ }, args => ({ path: args.path, namespace: 'stub' }))
    build2.onLoad({ filter: /.*/, namespace: 'stub' }, () => ({
      contents: `export default class FakeWorker { postMessage(m) { FakeWorker.sent.push(m) } terminate() {} } FakeWorker.sent = []`,
      loader: 'js',
    }))
  },
}

const { outputFiles } = await build({
  stdin: {
    contents: `
      export { default as Danmuku } from './packages/artplayer-plugin-danmuku/src/danmuku.js';
      export * as utils from './packages/artplayer/src/utils/index.js';
      export { default as validator } from 'option-validator';
    `,
    resolveDir: fileURLToPath(new URL('../', import.meta.url)),
  },
  bundle: true,
  write: false,
  platform: 'node',
  format: 'esm',
  plugins: [viteQueryStub],
})

globalThis.Element = class Element {}

const rafCbs = []
globalThis.window = {
  requestAnimationFrame(cb) {
    rafCbs.push(cb)
    return rafCbs.length
  },
  cancelAnimationFrame() {},
}
globalThis.document = {
  createElement() {
    return {
      style: {},
      classList: { add() {}, remove() {}, contains: () => false },
      dataset: {},
      textContent: '',
      appendChild() {},
      clientWidth: 0,
      clientHeight: 0,
    }
  },
}

const { Danmuku, utils, validator } = await import(
  `data:text/javascript;base64,${Buffer.from(outputFiles[0].contents).toString('base64')}`,
)

function flush() {
  return new Promise(resolve => setTimeout(resolve, 0))
}
function withTimeout(promise, ms) {
  return Promise.race([
    promise,
    new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), ms)),
  ])
}

function createArt() {
  const art = {
    i18n: { get: key => key },
    plugins: undefined,
    playing: false,
    currentTime: 5,
    constructor: { utils, validator },
    template: {
      $danmuku: { textContent: '', style: {}, appendChild() {} },
      $player: { clientHeight: 500, clientWidth: 800 },
      $controlsCenter: { style: {}, dataset: {} },
    },
    __ons: [],
    __offs: [],
    __emits: [],
    __handlers: {},
    on(name, fn) {
      art.__ons.push({ name, fn })
      ;(art.__handlers[name] ||= []).push(fn)
    },
    off(name, fn) {
      art.__offs.push({ name, fn })
    },
    emit(name, ...args) {
      art.__emits.push({ name, args })
      for (const fn of [...(art.__handlers[name] || [])]) fn(...args)
    },
    proxy: () => () => {},
  }
  return art
}

test('D1: play + playing must not spawn two rAF loops', () => {
  rafCbs.length = 0
  const art = createArt()
  const danmuku = new Danmuku(art, { danmuku: [] })
  void danmuku
  const before = rafCbs.length

  art.emit('video:play')
  art.emit('video:playing')

  // Master bug: both events call start() which always schedules another loop.
  assert.equal(rafCbs.length - before, 1, 'a single playback start must schedule exactly one rAF loop')
})

test('D2: concurrent worker messages must resolve independently (no single-slot onmessage)', async () => {
  rafCbs.length = 0
  const art = createArt()
  const danmuku = new Danmuku(art, { danmuku: [] })

  const payload = () => ({
    type: 'getDanmuTop',
    target: { mode: 0, height: 20, speed: 100 },
    visibles: [],
    antiOverlap: true,
    clientWidth: 800,
    clientHeight: 500,
    marginBottom: 10,
    marginTop: 10,
  })
  const p1 = danmuku.postMessage(payload())
  const p2 = danmuku.postMessage(payload())
  const sent = [...Danmuku && []]
  void sent

  // Respond in reverse order: master overwrote worker.onmessage, so the first
  // response was dropped and p1 hung forever.
  danmuku.worker.onmessage({ data: { id: 2, result: 222 } })
  danmuku.worker.onmessage({ data: { id: 1, result: 111 } })

  assert.deepEqual(await withTimeout(p1, 250), { id: 1, result: 111 })
  assert.deepEqual(await withTimeout(p2, 250), { id: 2, result: 222 })
})

test('D3: a throwing beforeVisible must not stop the update loop', async () => {
  rafCbs.length = 0
  const art = createArt()
  const danmuku = new Danmuku(art, { danmuku: [] })
  await danmuku.emit({ text: 'hi', time: 5 })

  danmuku.option.beforeVisible = () => {
    throw new Error('user filter boom')
  }
  art.playing = true
  art.emit('video:play')

  const callbacks = rafCbs.splice(0)
  const before = rafCbs.length
  for (const cb of callbacks) cb()
  await flush()

  // Master bug: the throw escaped the rAF callback and the loop never
  // rescheduled - danmuku stayed dead until the next play event.
  assert.ok(rafCbs.length > before, 'the update loop must reschedule after a filter error')
})

test('D4: constructor load failure must not become an unhandled rejection', async () => {
  const unhandled = []
  const onUnhandled = (error) => {
    unhandled.push(error)
  }
  process.on('unhandledRejection', onUnhandled)

  const art = createArt()
  const danmuku = new Danmuku(art, { danmuku: () => Promise.reject(new Error('source boom')) })
  void danmuku
  await flush()
  await flush()

  process.off('unhandledRejection', onUnhandled)
  // Master bug: load() rethrows after emitting the error event, and the
  // constructor fire-and-forgets it.
  assert.equal(unhandled.length, 0)
})

test('D5: destroy must unregister the resize listener it registered', () => {
  const art = createArt()
  const danmuku = new Danmuku(art, { danmuku: [] })

  const registered = art.__ons.filter(entry => entry.name === 'resize')
  danmuku.destroy()
  const unregistered = art.__offs.filter(entry => entry.name === 'resize')

  assert.equal(unregistered.length, 1)
  // Master bug: destroy passed this.reset while registration used this.resize.
  assert.equal(unregistered[0].fn, registered[0].fn)
})

test('D6: config must apply function-valued options', () => {
  const art = createArt()
  // mount as a string so the validator does not require a real div element.
  const danmuku = new Danmuku(art, { danmuku: [], mount: 'body' })

  const newFilter = () => false
  danmuku.config({ filter: newFilter })
  // Master bug: JSON.stringify(function) is undefined on both sides, so the
  // change was detected as "no change" and ignored.
  assert.equal(danmuku.option.filter, newFilter)
})
