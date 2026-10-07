import assert from 'node:assert/strict'
import { Buffer } from 'node:buffer'
// eslint-disable-next-line test/no-import-node-test -- Use the built-in runner without adding a test framework.
import { test } from 'node:test'
import { fileURLToPath } from 'node:url'
import { build } from 'esbuild'

// Regression tests for the teardown/lifecycle fixes (todo: P1-2, C1).
// Why these tests exist: screenfull listeners bypassed art.events cleanup (leak +
// cross-instance state), and the plugin contract (Promise rejection safety net +
// destroy() hook) was not enforced by core. Each assertion below fails on the
// unfixed code and passes after the fix.

const { outputFiles } = await build({
  stdin: {
    contents: `
      export { default as Plugins } from './packages/artplayer/src/plugins/index.js';
      export { default as fullscreenMix } from './packages/artplayer/src/player/fullscreenMix.js';
    `,
    resolveDir: fileURLToPath(new URL('../', import.meta.url)),
  },
  bundle: true,
  write: false,
  platform: 'node',
  format: 'esm',
})

function createDocument() {
  const listeners = {}
  return {
    __listeners: listeners,
    fullscreenEnabled: true,
    fullscreenElement: null,
    exitFullscreen: () => {},
    addEventListener(name, cb) {
      ;(listeners[name] ||= []).push(cb)
    },
    removeEventListener(name, cb) {
      const list = listeners[name] || []
      const index = list.indexOf(cb)
      if (index >= 0)
        list.splice(index, 1)
    },
  }
}

function createArt() {
  const proxied = []
  const art = {
    i18n: { get: key => key },
    notice: { show: '' },
    template: {
      $video: { webkitSupportsFullscreen: false },
      $player: { id: 'player-under-test' },
    },
    on() {},
    once(name, cb) {
      if (name === 'video:loadedmetadata')
        art.__loadedmeta = cb
    },
    emit() {},
    events: {
      proxy(target, name, cb) {
        ;(target.__listeners ||= {})[name] ||= []
        target.__listeners[name].push(cb)
        const remove = () => {
          const list = target.__listeners[name] || []
          const index = list.indexOf(cb)
          if (index >= 0)
            list.splice(index, 1)
        }
        proxied.push(remove)
        return remove
      },
      remove(fn) {
        const index = proxied.indexOf(fn)
        if (index >= 0)
          proxied.splice(index, 1)
        fn()
      },
      destroy() {
        proxied.splice(0).forEach(fn => fn())
      },
    },
  }
  return art
}

// document must exist before screenfull.js module evaluation (it probes the API at import time).
globalThis.document = createDocument()
const { Plugins, fullscreenMix } = await import(
  `data:text/javascript;base64,${Buffer.from(outputFiles[0].contents).toString('base64')}`,
)

test('fullscreenMix registers screenfull listeners through art.events so destroy removes them', () => {
  const doc = createDocument()
  globalThis.document = doc
  const art = createArt()

  fullscreenMix(art)
  art.__loadedmeta()

  assert.equal((doc.__listeners.fullscreenchange || []).length, 1)
  art.events.destroy()
  // Master bug: the listener was attached directly via screenfull.on and survived destroy.
  assert.equal(
    (doc.__listeners.fullscreenchange || []).length,
    0,
    'fullscreenchange listener must be removed when art.events is destroyed',
  )
})

test('fullscreen getter is instance-scoped, not document-global', () => {
  const doc = createDocument()
  globalThis.document = doc
  const art = createArt()

  fullscreenMix(art)
  art.__loadedmeta()

  doc.fullscreenElement = art.template.$player
  assert.equal(art.fullscreen, true)
  // Master bug: screenfull.isFullscreen is document-global, so another element
  // being fullscreen made every instance report true.
  doc.fullscreenElement = { id: 'some-other-player' }
  assert.equal(art.fullscreen, false)
})

test('Plugins.add survives a rejected async factory and surfaces it via notice', async () => {
  function createPluginArt() {
    return {
      notice: { show: '' },
      option: {
        miniProgressBar: false,
        lock: false,
        autoPlayback: false,
        autoOrientation: false,
        fastForward: false,
        plugins: [],
      },
    }
  }

  const plugins = new Plugins(createPluginArt())
  // Master bug: the rejection propagated and the plugin vanished silently.
  await plugins.add(async () => {
    throw new Error('boom')
  })
  assert.match(String(plugins.art.notice.show.message || plugins.art.notice.show), /boom/)
})

test('Plugins.destroy invokes every plugin destroy hook exactly once', () => {
  function createPluginArt() {
    return {
      notice: { show: '' },
      option: {
        miniProgressBar: false,
        lock: false,
        autoPlayback: false,
        autoOrientation: false,
        fastForward: false,
        plugins: [],
      },
    }
  }

  const plugins = new Plugins(createPluginArt())
  let destroyed = 0
  plugins.add(() => ({
    name: 'p1',
    destroy() {
      destroyed++
    },
  }))
  plugins.add(() => ({ name: 'p2' }))
  // Master bug: Plugins.destroy did not exist, so returned destroy hooks were never called.
  plugins.destroy()
  plugins.destroy()
  assert.equal(destroyed, 1)
})

test('Plugins.add still registers sync plugins and rejects duplicate names', () => {
  function createPluginArt() {
    return {
      notice: { show: '' },
      option: {
        miniProgressBar: false,
        lock: false,
        autoPlayback: false,
        autoOrientation: false,
        fastForward: false,
        plugins: [],
      },
    }
  }

  const plugins = new Plugins(createPluginArt())
  plugins.add(() => ({ name: 'p1' }))
  assert.ok(plugins.p1, 'sync plugin must be registered on the instance')
  assert.throws(() => plugins.add(() => ({ name: 'p1' })), /already has the same name/)
})
