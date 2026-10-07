import assert from 'node:assert/strict'
import { Buffer } from 'node:buffer'
// eslint-disable-next-line test/no-import-node-test -- Use the built-in runner without adding a test framework.
import { test } from 'node:test'
import { fileURLToPath } from 'node:url'
import { build } from 'esbuild'

// Regression tests for the ads plugin fixes (todo: A1, A2, A3) and the core
// hotkey lock guard (todo A3).
// Why these tests exist: on master, skip() left the countdown timer running
// (double skip events, forced replay), destroy() left the timer firing against
// a dead player, ad/main playback promises were unhandled, and Space kept
// controlling the main video under the ad overlay.

const viteQueryStub = {
  name: 'vite-query-stub',
  setup(build2) {
    build2.onResolve({ filter: /\?(raw|inline)$/ }, args => ({ path: args.path, namespace: 'stub' }))
    build2.onLoad({ filter: /.*/, namespace: 'stub' }, () => ({ contents: 'export default ""', loader: 'js' }))
  },
}

const { outputFiles } = await build({
  stdin: {
    contents: `
      export { default as artplayerPluginAds } from './packages/artplayer-plugin-ads/src/index.js';
      export { default as Hotkey } from './packages/artplayer/src/hotkey.js';
      export { default as Emitter } from './packages/artplayer/src/utils/emitter.js';
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

function createElement(tag) {
  return {
    tag,
    style: {},
    classSet: new Set(),
    classList: {
      add: (...names) => names.forEach(name => this.classSet.add(name)),
      remove: (...names) => names.forEach(name => this.classSet.delete(name)),
      contains: name => this.classSet.has(name),
    },
    dataset: {},
    textContent: '',
    innerHTML: '',
    __children: {},
    get lastElementChild() {
      this.__last ||= createElement(`${tag}-child`)
      return this.__last
    },
    insertAdjacentHTML(_pos, html) {
      this.__children[html] = createElement('div')
    },
    insertAdjacentElement(_pos, el) {
      return el
    },
    appendChild(el) {
      return el
    },
    querySelector(sel) {
      this.__children[sel] ||= createElement(sel)
      return this.__children[sel]
    },
    getAttribute: () => null,
    parentNode: { removeChild() {} },
  }
}

const { artplayerPluginAds, Hotkey, Emitter } = await import(
  `data:text/javascript;base64,${Buffer.from(outputFiles[0].contents).toString('base64')}`,
)

function createArt() {
  const handlers = {}
  const timers = { scheduled: [], cleared: [] }
  const fakeTimers = {
    setTimeout(fn) {
      const id = timers.scheduled.length + 1
      timers.scheduled.push({ id, fn })
      return id
    },
    clearTimeout(id) {
      timers.cleared.push(id)
    },
  }
  globalThis.setTimeout = fakeTimers.setTimeout
  globalThis.clearTimeout = fakeTimers.clearTimeout

  const $player = createElement('div')
  const art = Object.assign(new Emitter(), {
    isLock: false,
    isFocus: false,
    isInput: false,
    option: {
      html: '',
      video: '',
      url: '',
      playDuration: 5,
      totalDuration: 10,
      muted: false,
      i18n: {
        close: '关闭广告',
        countdown: '%s秒',
        detail: '查看详情',
        canBeClosed: '%s秒后可关闭广告',
      },
    },
    template: { $player },
    icons: { volume: {}, volumeClose: {}, fullscreenOn: {}, fullscreenOff: {}, loading: {} },
    fullscreen: false,
    play: () => Promise.resolve(),
    pause() {},
    emitParent(name, ...args) {
      for (const fn of [...(handlers[name] || [])]) fn(...args)
    },
    proxy: () => () => {},
    constructor: {
      version: '5.4.1',
      validator: option => option,
      utils: {
        errorHandle: (condition, msg) => {
          if (!condition)
            throw new Error(msg)
          return condition
        },
        query: (sel, parent) => parent.querySelector(sel),
        append: (parent, child) => {
          parent.insertAdjacentHTML('beforeend', String(child))
          return parent.lastElementChild
        },
        setStyle: (el, key, value) => {
          el.style[key] = value
          return el
        },
        silencePromise: (value) => {
          if (value && typeof value.catch === 'function')
            value.catch(() => {})
          return value
        },
      },
    },
  })
  art.on = (name, fn) => {
    ;(handlers[name] ||= []).push(fn)
  }
  art.once = (name, fn) => {
    ;(handlers[name] ||= []).push(function onceWrapper(...args) {
      const list = handlers[name]
      const index = list.indexOf(onceWrapper)
      if (index >= 0)
        list.splice(index, 1)
      fn(...args)
    })
  }
  art.emit = (name, ...args) => {
    if (name === 'play' || name === 'pause' || name === 'destroy' || name === 'ready')
      art.emitParent(name, ...args)
    else
      art.emitParent(name, ...args)
  }
  art.__handlers = handlers
  art.__timers = timers
  art.template.$player.querySelector = sel => $player.querySelector(sel)
  return art
}

function initAds(art) {
  const plugin = artplayerPluginAds({})
  const instance = plugin(art)
  art.emit('ready')
  art.emit('play')
  return instance
}

test('A1: skip() clears the pending countdown tick and is idempotent', async () => {
  const art = createArt()
  const instance = initAds(art)

  const pending = art.__timers.scheduled.length
  assert.ok(pending >= 1, 'init must schedule the countdown timer')

  const skipEmitSpy = []
  art.emit = (original => (name, ...args) => {
    if (name === 'artplayerPluginAds:skip')
      skipEmitSpy.push(name)
    return original(name, ...args)
  })(art.emit)

  instance.skip()
  instance.skip()

  // Master bug: the scheduled tick was never cleared, so it fired after the
  // skip and could re-skip (second event + forced art.play()).
  assert.ok(art.__timers.cleared.length >= 1, 'skip must clear the pending countdown timer')
  assert.equal(skipEmitSpy.length, 1, 'skip must emit the skip event exactly once')
  assert.equal(art.isLock, false, 'skip must unlock the player (A3)')
})

test('A2: destroy must clear the countdown timer', async () => {
  const art = createArt()
  initAds(art)

  assert.ok(art.__timers.scheduled.length >= 1)
  art.emit('destroy')

  // Master bug: no destroy hook existed; the timer kept firing on a dead player.
  assert.ok(art.__timers.cleared.length >= 1, 'destroy must clear the countdown timer')
})

test('A3: init locks the player and hotkeys respect the lock', async () => {
  const art = createArt()
  art.template.$video = { paused: true, play: () => Promise.resolve() }
  art.hotkeyToggled = 0
  initAds(art)

  assert.equal(art.isLock, true, 'init must lock the player so hotkeys cannot drive the main video')

  // Core hotkey must respect isLock now.
  const hotkeyArt = Object.assign(new Emitter(), {
    isFocus: true,
    isLock: true,
    hotkeyToggled: 0,
    option: { hotkey: true },
    backward: 0,
    fullscreenWeb: false,
    toggle() {
      this.hotkeyToggled++
    },
    template: { $video: { paused: true } },
    constructor: { SEEK_STEP: 5, VOLUME_STEP: 0.1 },
  })
  hotkeyArt.volume = 0
  const _hotkey = new Hotkey(hotkeyArt)
  void _hotkey
  // The unlocked keydown path reads document.activeElement.
  globalThis.document = { activeElement: { tagName: 'BODY', getAttribute: () => null } }
  hotkeyArt.emit('document:keydown', {
    code: 'Space',
    altKey: false,
    ctrlKey: false,
    metaKey: false,
    shiftKey: false,
    preventDefault() {},
  })
  assert.equal(hotkeyArt.hotkeyToggled, 0, 'hotkeys must not toggle a locked player')
  hotkeyArt.isLock = false
  hotkeyArt.emit('document:keydown', {
    code: 'Space',
    altKey: false,
    ctrlKey: false,
    metaKey: false,
    shiftKey: false,
    preventDefault() {},
  })
  assert.equal(hotkeyArt.hotkeyToggled, 1, 'unlocked players keep hotkey behavior')
  delete globalThis.document
})
