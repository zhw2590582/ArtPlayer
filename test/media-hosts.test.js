import assert from 'node:assert/strict'
// eslint-disable-next-line test/no-import-node-test -- Use the repository Node runner.
import { test } from 'node:test'
import { loadModules } from './helpers/load.js'

const { playMix, pauseMix, playingMix, durationMix, rectMix } = await loadModules(Object.fromEntries(['playMix', 'pauseMix', 'playingMix', 'durationMix', 'rectMix'].map(name => [name, `packages/artplayer/src/player/${name}`])))

test('structural playback hosts retain synchronous proxy values, async play order and receivers', async () => {
  const calls = []
  const media = {
    play() {
      assert.equal(this, media)
      calls.push('media:play')
      return 'proxy-result'
    },
    pause() {
      assert.equal(this, media)
      calls.push('media:pause')
      return 42
    },
  }
  const art = {
    template: { $video: media },
    option: { mutex: true },
    i18n: { get: key => key },
    notice: {
      get show() {
        return false
      },
      set show(message) {
        calls.push(`notice:${message}`)
      },
    },
    emit: name => calls.push(`event:${name}`),
    constructor: { instances: [] },
  }
  playMix(art)
  pauseMix(art)
  art.constructor.instances.push(art, {
    pause: () => calls.push('mutex'),
  })
  const play = art.play
  const pause = art.pause
  const result = play()
  assert(result instanceof Promise)
  assert.deepEqual(calls, ['media:play'])
  assert.equal(await result, 'proxy-result')
  assert.deepEqual(calls, ['media:play', 'notice:Play', 'event:play', 'mutex'])
  assert.equal(pause(), 42)
  assert.deepEqual(calls.slice(-3), ['media:pause', 'notice:Pause', 'event:pause'])
  for (const name of ['play', 'pause']) {
    const descriptor = Object.getOwnPropertyDescriptor(art, name)
    assert.equal(descriptor.enumerable, false)
    assert.equal(descriptor.configurable, false)
    assert.equal(descriptor.writable, false)
  }
})

test('playing uses a shim boolean when present and otherwise keeps native fallback', () => {
  const video = { currentTime: 1, paused: false, ended: false, readyState: 3 }
  const art = { template: { $video: video } }
  playingMix(art)
  assert.equal(art.playing, true)
  video.playing = false
  assert.equal(art.playing, false)
  video.currentTime = 0
  video.playing = true
  assert.equal(art.playing, true)
  delete video.playing
  assert.equal(art.playing, false)
  video.currentTime = 1
  video.readyState = 2
  assert.equal(art.playing, false)
  video.readyState = 3
  video.ended = true
  assert.equal(art.playing, false)
})

test('duration normalization reads the current media reference and keeps legacy infinity rules', () => {
  const art = { template: { $video: { duration: Infinity } } }
  durationMix(art)
  assert.equal(art.duration, 0)
  for (const [value, expected] of [[Number.NaN, 0], [0, 0], [-Infinity, -Infinity], [12.5, 12.5]]) {
    art.template.$video = { duration: value }
    assert.equal(art.duration, expected)
  }
})

test('layout host getters stay live, preserve descriptor order and read scroll offsets', (context) => {
  const previous = Object.getOwnPropertyDescriptor(globalThis, 'window')
  Object.defineProperty(globalThis, 'window', { configurable: true, value: { pageXOffset: 4, pageYOffset: 8 } })
  context.after(() => {
    if (previous)
      Object.defineProperty(globalThis, 'window', previous)
    else
      delete globalThis.window
  })
  let rectangle = { bottom: 40, height: 30, left: 10, right: 50, top: 10, width: 40 }
  const player = { getBoundingClientRect() {
    assert.equal(this, player)
    return rectangle
  } }
  const art = { template: { $player: player } }
  rectMix(art)
  assert.equal(art.rect, rectangle)
  assert.equal(art.x, 14)
  assert.equal(art.y, 18)
  rectangle = { ...rectangle, width: 80, left: 20 }
  assert.equal(art.width, 80)
  assert.equal(art.x, 24)
  assert.deepEqual(Object.getOwnPropertyNames(art), ['template', 'rect', 'bottom', 'height', 'left', 'right', 'top', 'width', 'x', 'y'])
  const descriptor = Object.getOwnPropertyDescriptor(art, 'width')
  assert.equal(descriptor.enumerable, false)
  assert.equal(descriptor.configurable, false)
  assert.equal(descriptor.set, undefined)
})
