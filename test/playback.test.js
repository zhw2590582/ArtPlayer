import assert from 'node:assert/strict'
// eslint-disable-next-line test/no-import-node-test -- Use the built-in runner without adding a test framework.
import { mock, test } from 'node:test'
import { setImmediate } from 'node:timers/promises'
import { loadModules } from './helpers/load.js'
import { playbackFactory } from './helpers/playback.js'

const modules = await loadModules({
  silencePromise: { file: 'packages/artplayer/src/utils/error', name: 'silencePromise' },
  Emitter: 'packages/artplayer/src/utils/emitter',
  Hotkey: 'packages/artplayer/src/hotkey',
  playMix: 'packages/artplayer/src/player/playMix',
  pauseMix: 'packages/artplayer/src/player/pauseMix',
  toggleMix: 'packages/artplayer/src/player/toggleMix',
  switchMix: 'packages/artplayer/src/player/switchMix',
  beginLifecycle: { file: 'packages/artplayer/src/lifecycle/instance', name: 'beginLifecycle' },
  getScope: { file: 'packages/artplayer/src/lifecycle/instance', name: 'getScope' },
})
const { silencePromise, Hotkey } = modules
const createArt = playbackFactory(modules)

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
