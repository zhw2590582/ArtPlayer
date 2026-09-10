import assert from 'node:assert/strict'
// eslint-disable-next-line test/no-import-node-test -- Use the repository Node test runner.
import { test } from 'node:test'
import { loadModules } from './helpers/load.js'

const names = ['currentTimeMix', 'durationMix', 'seekMix', 'volumeMix', 'playbackRateMix', 'playedMix', 'loadedMix', 'stateMix', 'toggleMix']
const mixins = await loadModules(Object.fromEntries(names.map(name => [name, `packages/artplayer/src/player/${name}`])))

function createArt() {
  const stored = []
  const emitted = []
  const video = { currentTime: 0, duration: 100, volume: 0.5, muted: false, playbackRate: 1, buffered: { length: 0, end() {
    throw new Error('empty')
  } } }
  const art = {
    template: { $video: video },
    notice: { show: '' },
    i18n: { get: key => key },
    storage: { set: (...args) => stored.push(args) },
    emit: (...args) => emitted.push(args),
    mini: false,
    pip: false,
    fullscreen: false,
    fullscreenWeb: false,
  }
  for (const name of names.filter(name => name !== 'toggleMix'))
    mixins[name](art)
  return { art, video, stored, emitted }
}

test('currentTime keeps parseFloat coercion, clamps and ignores NaN', () => {
  const { art, video } = createArt()
  for (const [input, expected] of [['12.5 seconds', 12.5], [-2, 0], [200, 100], [Infinity, 100], [-Infinity, 0]]) {
    art.currentTime = input
    assert.equal(video.currentTime, expected)
  }
  art.currentTime = 7
  for (const input of [Number.NaN, undefined, null, '', 'invalid']) {
    art.currentTime = input
    assert.equal(art.currentTime, 7)
  }
  let coerced = 0
  art.currentTime = { toString() {
    coerced++
    return '22s'
  } }
  assert.equal(art.currentTime, 22)
  assert.equal(coerced, 1)
  assert.throws(() => art.currentTime = Symbol('time'), TypeError)
})

test('seek preserves original payload, notification order and forward/backward coercion', () => {
  const { art, emitted } = createArt()
  art.seek = '12.5 seconds'
  assert.equal(art.currentTime, 12.5)
  assert.equal(art.notice.show, '00:12 / 01:40')
  assert.deepEqual(emitted.at(-1), ['seek', 12.5, '12.5 seconds'])
  art.currentTime = 10
  art.forward = '2'
  assert.deepEqual(emitted.at(-1), ['seek', 100, '102'])
  art.backward = '2'
  assert.deepEqual(emitted.at(-1), ['seek', 98, 98])
  for (const name of ['seek', 'forward', 'backward']) {
    assert.equal(art[name], undefined)
    const descriptor = Object.getOwnPropertyDescriptor(art, name)
    assert.equal(descriptor.get, undefined)
    assert.equal(descriptor.enumerable, false)
    assert.equal(descriptor.configurable, false)
  }
})

test('volume uses actual assigned media volume, historical percentage formatting and nonzero persistence', () => {
  const { art, video, stored, emitted } = createArt()
  art.volume = 2
  assert.equal(video.volume, 1)
  assert.equal(art.notice.show, 'Volume: 100')
  art.volume = -1
  assert.equal(video.volume, 0)
  assert.deepEqual(stored, [['volume', 1]])
  art.volume = 1e-9
  assert.equal(art.notice.show, 'Volume: 1')
  assert.deepEqual(stored.at(-1), ['volume', 1e-9])
  art.muted = 'legacy-truthy'
  assert.equal(video.muted, 'legacy-truthy')
  assert.deepEqual(emitted.at(-1), ['muted', 'legacy-truthy'])
})

test('playbackRate preserves equal-value no-op, falsy normalization and native errors', () => {
  const { art, video } = createArt()
  art.notice.show = 'keep'
  art.playbackRate = 1
  assert.equal(art.notice.show, 'keep')
  art.playbackRate = 1.5
  assert.equal(art.notice.show, 'Rate: 1.5x')
  art.playbackRate = 0
  assert.equal(video.playbackRate, 1)
  assert.equal(art.notice.show, 'Rate: Normal')
  art.notice.show = 'keep again'
  art.playbackRate = Number.NaN
  assert.equal(art.notice.show, 'keep again')
  const error = new Error('native rate rejected')
  Object.defineProperty(video, 'playbackRate', { get: () => 1, set() {
    throw error
  } })
  assert.throws(() => art.playbackRate = -1, actual => actual === error)
})

test('progress getters keep raw ratios and the last buffered range', () => {
  const { art, video } = createArt()
  assert.equal(art.loadedTime, 0)
  video.buffered = { length: 2, end: index => [3, 40][index] }
  assert.equal(art.loadedTime, 40)
  assert.equal(art.loaded, 0.4)
  art.currentTime = 25
  assert.equal(art.played, 0.25)
  video.duration = Infinity
  assert.equal(art.duration, 0)
  assert.equal(art.played, Infinity)
  assert.equal(art.loaded, 0)
  video.currentTime = 0
  video.duration = 0
  video.buffered = { length: 0 }
  assert(Number.isNaN(art.played))
  assert(Number.isNaN(art.loaded))
})

test('state prioritizes mini/pip/fullscreen/web and only disables other states', () => {
  const { art } = createArt()
  assert.equal(art.state, 'standard')
  art.mini = art.pip = art.fullscreen = art.fullscreenWeb = true
  assert.equal(art.state, 'mini')
  art.state = 'fullscreen'
  assert.deepEqual([art.mini, art.pip, art.fullscreen, art.fullscreenWeb], [false, false, true, false])
  assert.equal(art.state, 'fullscreen')
  art.state = 'unknown'
  assert.equal(art.state, 'standard')
  art.state = 'pip'
  assert.equal(art.pip, false)
})

test('captured media attributes remain captured while duration follows the current template', () => {
  const { art, video } = createArt()
  art.template.$video = { currentTime: 88, duration: 200, volume: 0.7, muted: true, playbackRate: 2, buffered: { length: 0 } }
  assert.equal(art.duration, 200)
  art.currentTime = 150
  assert.equal(video.currentTime, 150)
  assert.equal(art.template.$video.currentTime, 88)
  assert.equal(art.volume, 0.5)
  assert.equal(art.muted, false)
  assert.equal(art.playbackRate, 1)
  video.buffered = { length: 1, end: () => 50 }
  assert.equal(art.loaded, 0.5)
  assert.equal(art.played, 0.75)
})

test('toggle returns exact dynamic branch results and preserves extracted function binding', async () => {
  const pending = Promise.resolve(42)
  const calls = []
  const art = { playing: false, play() {
    calls.push(this)
    return pending
  }, pause() {
    calls.push(this)
    return 'paused'
  } }
  mixins.toggleMix(art)
  const toggle = art.toggle
  assert.equal(toggle(), pending)
  art.playing = true
  assert.equal(toggle.call({}), 'paused')
  assert.deepEqual(calls, [art, art])
  assert.equal(await pending, 42)
  const descriptor = Object.getOwnPropertyDescriptor(art, 'toggle')
  assert.deepEqual([descriptor.writable, descriptor.configurable, descriptor.enumerable], [false, false, false])
})
