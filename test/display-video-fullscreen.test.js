import assert from 'node:assert/strict'
import { getEventListeners } from 'node:events'
// eslint-disable-next-line test/no-import-node-test -- Use the repository Node test runner.
import { test } from 'node:test'
import { loadModules } from './helpers/load.js'

const { Emitter, videoFullscreen, beginLifecycle, getScope } = await loadModules({
  Emitter: 'packages/artplayer/src/utils/emitter',
  videoFullscreen: { file: 'packages/artplayer/src/display/video-fullscreen', name: 'videoFullscreen' },
  beginLifecycle: { file: 'packages/artplayer/src/lifecycle/instance', name: 'beginLifecycle' },
  getScope: { file: 'packages/artplayer/src/lifecycle/instance', name: 'getScope' },
})

function fixture() {
  const video = new EventTarget()
  video.ownerDocument = { fullscreenElement: null }
  video.webkitDisplayingFullscreen = false
  video.webkitEnterFullscreen = function () {
    this.webkitDisplayingFullscreen = true
    this.dispatchEvent(new Event('webkitbeginfullscreen'))
  }
  video.webkitExitFullscreen = function () {
    this.webkitDisplayingFullscreen = false
    this.dispatchEvent(new Event('webkitendfullscreen'))
  }
  const art = Object.assign(new Emitter(), { template: { $video: video }, state: 'standard' })
  beginLifecycle(art)
  Object.defineProperty(art, 'fullscreen', videoFullscreen(art))
  const events = []
  art.on('fullscreen', value => events.push(['fullscreen', value]))
  art.on('resize', () => events.push(['resize']))
  return { art, video, events }
}

test('video-only native callbacks preserve boolean state and normal event/resize order', () => {
  const { art, video, events } = fixture()
  art.fullscreen = true
  art.emit('document:webkitfullscreenchange')
  video.dispatchEvent(new Event('webkitpresentationmodechanged'))
  assert.equal(art.fullscreen, true)
  art.fullscreen = false
  assert.equal(art.fullscreen, false)
  assert.deepEqual(events, [['fullscreen', true], ['resize'], ['fullscreen', false], ['resize']])
  getScope(art).dispose()
  assert.equal(getEventListeners(video, 'webkitbeginfullscreen').length, 0)
  assert.equal(getEventListeners(video, 'webkitendfullscreen').length, 0)
  assert.equal(getEventListeners(video, 'webkitpresentationmodechanged').length, 0)
})

test('video presentation PiP is distinct from fullscreen even if displayingFullscreen is true', () => {
  const { art, video, events } = fixture()
  video.webkitPresentationMode = 'picture-in-picture'
  video.webkitDisplayingFullscreen = true
  video.dispatchEvent(new Event('webkitpresentationmodechanged'))
  assert.equal(art.fullscreen, false)
  assert.deepEqual(events, [])
  getScope(art).dispose()
})

test('video fullscreen falls back to native events if a shim has no state property', () => {
  const { art, video } = fixture()
  delete video.webkitDisplayingFullscreen
  video.dispatchEvent(new Event('webkitbeginfullscreen'))
  assert.equal(art.fullscreen, true)
  video.dispatchEvent(new Event('webkitendfullscreen'))
  assert.equal(art.fullscreen, false)
  getScope(art).dispose()
})

test('video fullscreen destruction during its entry event stops stale resize and exits', () => {
  const { art, video, events } = fixture()
  art.on('fullscreen', (value) => {
    if (value)
      getScope(art).dispose()
  })
  art.fullscreen = true
  assert.equal(video.webkitDisplayingFullscreen, false)
  assert.equal(art.fullscreen, false)
  assert.deepEqual(events, [['fullscreen', true]])
})

test('video fullscreen same-state reentry preserves the one resize', () => {
  const { art, events } = fixture()
  art.on('fullscreen', (value) => {
    if (value)
      art.fullscreen = true
  })
  art.fullscreen = true
  assert.equal(art.fullscreen, true)
  assert.deepEqual(events, [['fullscreen', true], ['resize']])
  getScope(art).dispose()
})

test('video fullscreen synchronous request errors keep their identity and allow retry', () => {
  const { art, video } = fixture()
  const enter = video.webkitEnterFullscreen
  const error = new Error('denied')
  video.webkitEnterFullscreen = () => {
    throw error
  }
  assert.throws(() => {
    art.fullscreen = true
  }, actual => actual === error)
  video.webkitEnterFullscreen = enter
  art.fullscreen = true
  assert.equal(art.fullscreen, true)
  getScope(art).dispose()
})

test('cancelled video fullscreen entry is released without stale player events', () => {
  const { art, video, events } = fixture()
  const enter = video.webkitEnterFullscreen
  video.webkitEnterFullscreen = () => {}
  art.fullscreen = true
  art.fullscreen = false
  enter.call(video)
  assert.equal(video.webkitDisplayingFullscreen, false)
  assert.equal(art.fullscreen, false)
  assert.deepEqual(events, [])
  getScope(art).dispose()
})

test('new video fullscreen entry supersedes the previous cancellation', () => {
  const { art, video, events } = fixture()
  const enter = video.webkitEnterFullscreen
  video.webkitEnterFullscreen = () => {}
  art.fullscreen = true
  art.fullscreen = false
  video.webkitEnterFullscreen = enter
  art.fullscreen = true
  assert.equal(art.fullscreen, true)
  assert.deepEqual(events, [['fullscreen', true], ['resize']])
  getScope(art).dispose()
})

test('late entry on a video shim without state properties is released after destroy', () => {
  const { art, video, events } = fixture()
  delete video.webkitDisplayingFullscreen
  let exits = 0
  video.webkitEnterFullscreen = () => {}
  video.webkitExitFullscreen = () => {
    exits++
    video.dispatchEvent(new Event('webkitendfullscreen'))
  }
  art.fullscreen = true
  getScope(art).dispose()
  video.dispatchEvent(new Event('webkitbeginfullscreen'))
  assert.equal(exits, 1)
  assert.deepEqual(events, [])
  assert.equal(getEventListeners(video, 'webkitbeginfullscreen').length, 0)
})
