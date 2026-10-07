import assert from 'node:assert/strict'
import { Buffer } from 'node:buffer'
// eslint-disable-next-line test/no-import-node-test -- Use the built-in runner without adding a test framework.
import { test } from 'node:test'
import { fileURLToPath } from 'node:url'
import { build } from 'esbuild'

// Regression tests for hot-path fixes (todo: C5, C7, C10).
// Why these tests exist: on master, high-frequency events (mousemove/timeupdate)
// re-applied unchanged state and re-emitted events 4x per second; autoPlayback
// wrote localStorage on every timeupdate and re-registered click handlers on
// every restart; the PIP getter leaked across player instances.

const { outputFiles } = await build({
  stdin: {
    contents: `
      export { default as Component } from './packages/artplayer/src/utils/component.js';
      export { default as autoPlayback } from './packages/artplayer/src/plugins/autoPlayback.js';
      export { default as Storage } from './packages/artplayer/src/storage.js';
      export { default as pipMix } from './packages/artplayer/src/player/pipMix.js';
      export { default as Emitter } from './packages/artplayer/src/utils/emitter.js';
    `,
    resolveDir: fileURLToPath(new URL('../', import.meta.url)),
  },
  bundle: true,
  write: false,
  platform: 'node',
  format: 'esm',
})

const { Component, autoPlayback, Storage, pipMix } = await import(
  `data:text/javascript;base64,${Buffer.from(outputFiles[0].contents).toString('base64')}`,
)

// `append()` probes `child instanceof Element`; provide the global so runtime
// code paths do not throw under Node.
globalThis.Element = class Element {}

function createElement(tag) {
  return {
    tag,
    style: {},
    className: '',
    classSet: new Set(),
    classList: {
      add(...names) {
        names.forEach(name => this.__set.add(name))
      },
      remove(...names) {
        names.forEach(name => this.__set.delete(name))
      },
      contains(name) {
        return this.__set.has(name)
      },
      __set: new Set(),
    },
    dataset: {},
    insertAdjacentHTML() {},
    insertAdjacentElement() {},
    appendChild() {},
    querySelector(sel) {
      this.__children ||= {}
      this.__children[sel] ||= createElement('div')
      return this.__children[sel]
    },
    parentNode: { removeChild() {} },
  }
}

test('C5: assigning an unchanged show state must not re-emit or re-write classes', () => {
  const emits = []
  const $player = createElement('div')
  const component = new Component({ template: { $player }, emit: (...args) => emits.push(args) })
  component.name = 'mask'

  component.show = true
  assert.equal(component.show, true)
  assert.equal(emits.length, 1)

  // Master bug: every assignment re-emitted and re-wrote classes even when the
  // state did not change (mask.show fires ~4x per second from timeupdate).
  component.show = true
  component.show = true
  assert.equal(emits.length, 1, 'unchanged show assignments must not emit again')

  component.show = false
  assert.equal(emits.length, 2)
  assert.equal(component.show, false)
})

test('C7: autoPlayback throttles storage writes and registers click handlers once', async () => {
  let setCalls = 0
  const originalSet = Storage.prototype.set
  Storage.prototype.set = function set(...args) {
    setCalls++
    return originalSet.apply(this, args)
  }

  const proxies = []
  const handlers = {}
  const $autoPlayback = createElement('div')
  const layers = { add: () => $autoPlayback }
  const art = {
    i18n: { get: key => key },
    icons: { close: {} },
    storage: new Storage(),
    constructor: { AUTO_PLAYBACK_MAX: 10, AUTO_PLAYBACK_MIN: 5, AUTO_PLAYBACK_TIMEOUT: 3000 },
    proxy: (target, name) => {
      proxies.push({ target, name })
      return () => {}
    },
    on(name, cb) {
      ;(handlers[name] ||= []).push(cb)
    },
    once() {},
    emit(name) {
      for (const cb of [...(handlers[name] || [])]) cb()
    },
    layers,
    playing: true,
    currentTime: 42,
    option: { id: 'video-1', url: 'video.mp4' },
    template: { $poster: createElement('div') },
  }
  art.art = art

  try {
    autoPlayback(art)

    // Emit ready (initial init) and then 10 rapid timeupdates.
    art.emit('ready')
    for (let index = 0; index < 10; index++) art.emit('video:timeupdate')

    // Master bug: one full localStorage read+write per timeupdate.
    assert.equal(setCalls, 1, 'storage.set must be throttled on the timeupdate hot path')

    // Master bug: every restart re-registered the close/jump click handlers.
    for (let index = 0; index < 5; index++) art.emit('restart')
    const closeClicks = proxies.filter(
      entry => entry.name === 'click' && entry.target === $autoPlayback.__children['.art-auto-playback-close'],
    ).length
    assert.equal(closeClicks, 1, 'click handlers must be registered once, not per restart')
  }
  finally {
    Storage.prototype.set = originalSet
  }
})

test('TIP-1: autoPlayback popup must appear on first load when a last-seen time is stored', () => {
  const originalGet = Storage.prototype.get
  Storage.prototype.get = function get(key) {
    if (!key)
      return { times: { 'video-1': 42 } }
    if (key === 'times')
      return { 'video-1': 42 }
    return undefined
  }

  const $autoPlayback = createElement('div')
  const handlers = {}
  const art = {
    i18n: { get: key => key },
    icons: { close: {} },
    storage: new Storage(),
    constructor: { AUTO_PLAYBACK_MAX: 10, AUTO_PLAYBACK_MIN: 5, AUTO_PLAYBACK_TIMEOUT: 3000 },
    proxy: () => () => {},
    on(name, cb) {
      ;(handlers[name] ||= []).push(cb)
    },
    once() {},
    emit(name) {
      for (const cb of [...(handlers[name] || [])]) cb()
    },
    layers: { add: () => $autoPlayback },
    playing: true,
    currentTime: 0,
    option: { id: 'video-1', url: 'video.mp4' },
    template: { $poster: createElement('div') },
  }
  art.art = art

  try {
    autoPlayback(art)
    art.emit('ready')

    // Regression guard for the TIP-1 fix: the popup visibility check reads the
    // stored last-seen position, not the live playhead (which is 0 on first
    // load). The broken intermediate version never showed the popup.
    assert.equal($autoPlayback.style.display, 'flex', 'popup must be visible when a last-seen position exists')
    assert.match($autoPlayback.__children['.art-auto-playback-last'].textContent, /42/)
  }
  finally {
    Storage.prototype.get = originalGet
  }
})

test('C10: the pip getter must only report this player\'s video', () => {
  const pipElements = { value: null }
  globalThis.document = {
    pictureInPictureEnabled: true,
    get pictureInPictureElement() {
      return pipElements.value
    },
    set pictureInPictureElement(value) {
      pipElements.value = value
    },
    exitPictureInPicture: () => Promise.resolve(),
  }
  const $video = createElement('video')
  const art = {
    template: { $video },
    notice: { show: '' },
    proxy: () => () => {},
    on() {},
    emit() {},
    state: null,
  }
  Object.defineProperty(art, 'state', {
    set() {},
    get() {
      return 'standard'
    },
  })

  pipMix(art)

  // Master bug: the getter returned document.pictureInPictureElement, so any
  // other player's PIP session made this instance report pip === truthy.
  pipElements.value = createElement('video')
  assert.equal(art.pip, false, 'another player\'s pip element must not be reported as ours')
  pipElements.value = $video
  assert.equal(art.pip, true)
  delete globalThis.document
})
