import assert from 'node:assert/strict'
import { Buffer } from 'node:buffer'
// eslint-disable-next-line test/no-import-node-test -- Use the built-in runner without adding a test framework.
import { mock, test } from 'node:test'
import { setImmediate } from 'node:timers/promises'
import { fileURLToPath } from 'node:url'
import { build } from 'esbuild'

// Bundle the source modules so tests also work with Node 20's ESM resolution.
const { outputFiles } = await build({
  stdin: {
    contents: `
      export { silencePromise } from './packages/artplayer/src/utils/error.js';
      export { default as Emitter } from './packages/artplayer/src/utils/emitter.js';
      export { default as Hotkey } from './packages/artplayer/src/hotkey.js';
      export { default as playMix } from './packages/artplayer/src/player/playMix.js';
      export { default as pauseMix } from './packages/artplayer/src/player/pauseMix.js';
      export { default as toggleMix } from './packages/artplayer/src/player/toggleMix.js';
      export { default as switchMix } from './packages/artplayer/src/player/switchMix.js';
    `,
    resolveDir: fileURLToPath(new URL('../', import.meta.url)),
  },
  bundle: true,
  write: false,
  platform: 'node',
  format: 'esm',
})
const { silencePromise, Emitter, Hotkey, playMix, pauseMix, toggleMix, switchMix } = await import(
  `data:text/javascript;base64,${Buffer.from(outputFiles[0].contents).toString('base64')}`,
)

function createArt(play = () => Promise.resolve(), playing = false) {
  const art = Object.assign(new Emitter(), {
    url: 'old.mp4',
    currentTime: 37,
    aspectRatio: '16:9',
    playbackRate: 1.5,
    notice: { show: '' },
    i18n: { get: key => key },
    option: { hotkey: true, mutex: false },
    constructor: { instances: [] },
    template: {
      $video: {
        paused: !playing,
        play: mock.fn(play),
        pause() { this.paused = true },
      },
    },
  })
  Object.defineProperty(art, 'playing', { get: () => !art.template.$video.paused })
  for (const mix of [playMix, pauseMix, toggleMix, switchMix]) {
    mix(art)
  }
  return art
}

test('silencePromise preserves fulfilled values and handles rejected promises', async () => {
  assert.equal(await silencePromise(Promise.resolve(42)), 42)
  assert.equal(await silencePromise(Promise.reject(new Error('interrupted'))), undefined)
})

test('silencePromise passes through synchronous values and catch-less thenables', () => {
  const thenable = { then: (resolve, reject) => Promise.resolve(42).then(resolve, reject) }
  for (const value of [undefined, null, false, 42, thenable]) {
    assert.equal(silencePromise(value), value)
  }
  assert.equal(createArt(undefined, true).toggle(), undefined)
})

for (const name of ['AbortError', 'NotAllowedError', 'NotSupportedError']) {
  test(`public play/toggle still reject with ${name}`, async () => {
    const error = new DOMException('Playback failed', name)
    const art = createArt(() => Promise.reject(error))
    const onPlay = mock.fn()
    art.on('play', onPlay)
    await assert.rejects(art.play(), actual => actual === error)
    await assert.rejects(art.toggle(), actual => actual === error)
    assert.equal(onPlay.mock.callCount(), 0)
  })

  for (const method of ['switchUrl', 'switchQuality']) {
    test(`${method} settles when resume rejects with ${name}`, { timeout: 1000 }, async () => {
      const art = createArt(() => Promise.reject(new DOMException('Playback failed', name)), true)
      const switching = art[method]('new.mp4')
      art.currentTime = 0
      art.playbackRate = 1
      art.aspectRatio = 'default'
      art.emit('video:loadedmetadata')
      art.emit('video:canplay')
      await switching
      assert.equal(art.currentTime, method === 'switchQuality' ? 37 : 0)
      assert.equal(art.playbackRate, 1.5)
      assert.equal(art.aspectRatio, '16:9')
      assert.equal(art.notice.show, '')
      assert.equal(art.template.$video.play.mock.callCount(), 1)
      assert.deepEqual(Object.keys(art.e), [])
    })
  }
}

test('Space handles an interrupted pending play without an unhandled rejection', async () => {
  let rejectPlay
  const art = createArt(() => new Promise((resolve, reject) => {
    rejectPlay = reject
  }))
  const hotkey = new Hotkey(art)
  hotkey.keys.Space[0]()
  art.pause()
  rejectPlay(new DOMException('Interrupted by pause', 'AbortError'))
  // node:test fails on unhandled rejections, including those from event callbacks.
  await setImmediate()
  assert.equal(art.playing, false)
})

test('switch resumes successfully and remains paused when previously paused', async () => {
  for (const playing of [true, false]) {
    const art = createArt(undefined, playing)
    const switching = art.switchUrl('new.mp4')
    art.emit('video:loadedmetadata')
    art.emit('video:canplay')
    await switching
    assert.equal(art.template.$video.play.mock.callCount(), playing ? 1 : 0)
  }
})

test('source errors still reject switches and clean up listeners', async () => {
  const art = createArt()
  const error = new Error('Source failed to load')
  const rejected = assert.rejects(art.switchUrl('bad.mp4'), actual => actual === error)
  art.emit('video:error', error)
  await rejected
  assert.deepEqual(Object.keys(art.e), [])
  assert.equal(art.template.$video.play.mock.callCount(), 0)
})
