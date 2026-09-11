import assert from 'node:assert/strict'
import { getEventListeners } from 'node:events'
// eslint-disable-next-line test/no-import-node-test -- Use the repository Node test runner.
import { test } from 'node:test'
import { setImmediate } from 'node:timers/promises'
import { loadModules } from './helpers/load.js'

const { Emitter, nativePip, webkitPip, beginLifecycle, getScope } = await loadModules({
  Emitter: 'packages/artplayer/src/utils/emitter',
  nativePip: { file: 'packages/artplayer/src/display/native-pip', name: 'nativePip' },
  webkitPip: { file: 'packages/artplayer/src/display/webkit-pip', name: 'webkitPip' },
  beginLifecycle: { file: 'packages/artplayer/src/lifecycle/instance', name: 'beginLifecycle' },
  getScope: { file: 'packages/artplayer/src/lifecycle/instance', name: 'getScope' },
})

function fixture(kind = 'native') {
  const video = new EventTarget()
  video.ownerDocument = {
    pictureInPictureElement: null,
    exitPictureInPicture() {
      const previous = this.pictureInPictureElement
      this.pictureInPictureElement = null
      previous?.dispatchEvent(new Event('leavepictureinpicture'))
      return Promise.resolve()
    },
  }
  video.requestPictureInPicture = () => {
    video.ownerDocument.pictureInPictureElement = video
    video.dispatchEvent(new Event('enterpictureinpicture'))
    return Promise.resolve({ width: 320, height: 180 })
  }
  video.webkitPresentationMode = 'inline'
  video.webkitSetPresentationMode = (mode) => {
    video.webkitPresentationMode = mode
    video.dispatchEvent(new Event('webkitpresentationmodechanged'))
    video.dispatchEvent(new Event(mode === 'picture-in-picture' ? 'enterpictureinpicture' : 'leavepictureinpicture'))
  }
  const art = Object.assign(new Emitter(), { template: { $video: video }, state: 'standard', notice: { show: '' }, i18n: { get: key => key } })
  beginLifecycle(art)
  Object.defineProperty(art, 'pip', kind === 'native' ? nativePip(art) : webkitPip(art))
  const events = []
  art.on('pip', value => events.push(value))
  return { art, video, document: video.ownerDocument, events }
}

test('native PiP invokes immediately, retains element identity and void setter', () => {
  const { art, video, events } = fixture()
  assert.equal(Object.getOwnPropertyDescriptor(art, 'pip').set(true), undefined)
  assert.equal(art.pip, video)
  assert.deepEqual(events, [true])
  art.pip = false
  assert.equal(art.pip, null)
  assert.deepEqual(events, [true, false])
  getScope(art).dispose()
})

test('native PiP ignores a queued leave from an older session while the video still owns PiP', () => {
  const { art, video, events } = fixture()
  art.pip = true
  video.dispatchEvent(new Event('leavepictureinpicture'))
  assert.equal(art.pip, video)
  assert.deepEqual(events, [true])
  art.pip = false
  assert.deepEqual(events, [true, false])
  getScope(art).dispose()
})

test('native PiP rejection preserves the notice error without unhandled rejection', async () => {
  const { art, video, events } = fixture()
  const failure = new Error('denied')
  video.requestPictureInPicture = () => Promise.reject(failure)
  art.pip = true
  await setImmediate()
  assert.equal(art.notice.show, failure)
  assert.equal(art.pip, null)
  assert.deepEqual(events, [])
  getScope(art).dispose()
})

test('native PiP synchronous errors remain synchronous and retain identity', () => {
  const { art, video } = fixture()
  const failure = new Error('sync denial')
  video.requestPictureInPicture = () => {
    throw failure
  }
  assert.throws(() => {
    art.pip = true
  }, error => error === failure)
  getScope(art).dispose()
})

test('obsolete native PiP failure does not replace the latest notice', async () => {
  const { art, video } = fixture()
  let reject
  video.requestPictureInPicture = () => new Promise((resolve, fail) => reject = fail)
  art.pip = true
  art.pip = false
  art.notice.show = 'current notice'
  reject(new Error('old request'))
  await setImmediate()
  assert.equal(art.notice.show, 'current notice')
  getScope(art).dispose()
})

test('destroyed native PiP ignores late completion when another video owns PiP', async () => {
  const { art, video, document } = fixture()
  let complete
  video.requestPictureInPicture = () => new Promise(resolve => complete = resolve)
  art.pip = true
  getScope(art).dispose()
  document.pictureInPictureElement = {}
  document.exitPictureInPicture = () => assert.fail('exited another video')
  complete({})
  await setImmediate()
  assert.equal(getEventListeners(video, 'enterpictureinpicture').length, 0)
  assert.equal(getEventListeners(video, 'leavepictureinpicture').length, 0)
})

test('native PiP exit rejection keeps real state and permits retry', async () => {
  const { art, document, video, events } = fixture()
  art.pip = true
  await setImmediate()
  const exit = document.exitPictureInPicture
  const failure = new Error('exit denied')
  document.exitPictureInPicture = () => Promise.reject(failure)
  art.pip = false
  await setImmediate()
  assert.equal(art.pip, video)
  assert.equal(art.notice.show, failure)
  document.exitPictureInPicture = exit
  art.pip = false
  await setImmediate()
  assert.equal(art.pip, null)
  assert.deepEqual(events, [true, false])
  getScope(art).dispose()
})

test('WebKit PiP retains boolean getter and repeated synchronous setter events', () => {
  const { art, events } = fixture('webkit')
  art.pip = true
  art.pip = true
  assert.equal(art.pip, true)
  art.pip = false
  assert.equal(art.pip, false)
  assert.deepEqual(events, [true, true, false])
  getScope(art).dispose()
})

test('WebKit PiP observes external presentation transitions without duplicate native signals', () => {
  const { art, video, events } = fixture('webkit')
  video.webkitSetPresentationMode('picture-in-picture')
  video.webkitSetPresentationMode('inline')
  assert.deepEqual(events, [true, false])
  getScope(art).dispose()
})

test('WebKit PiP false does not exit a different fullscreen presentation', () => {
  const { art, video } = fixture('webkit')
  video.webkitPresentationMode = 'fullscreen'
  art.pip = false
  assert.equal(video.webkitPresentationMode, 'fullscreen')
  getScope(art).dispose()
})

test('destroyed WebKit PiP releases delayed entry without retaining instance listeners', () => {
  const { art, video, events } = fixture('webkit')
  const setMode = video.webkitSetPresentationMode
  video.webkitSetPresentationMode = () => {}
  art.pip = true
  getScope(art).dispose()
  video.webkitSetPresentationMode = setMode
  setMode('picture-in-picture')
  assert.equal(video.webkitPresentationMode, 'inline')
  assert.deepEqual(events, [])
  assert.equal(getEventListeners(video, 'webkitpresentationmodechanged').length, 0)
})

test('WebKit PiP destruction inside entry callback stops stale notifications', () => {
  const { art, video, events } = fixture('webkit')
  art.on('pip', () => getScope(art).dispose())
  art.pip = true
  assert.equal(video.webkitPresentationMode, 'inline')
  assert.deepEqual(events, [true])
})

for (const kind of ['native', 'webkit']) {
  test(`${kind} PiP reentrant cancellation retains its branch-specific setter event contract`, async () => {
    const { art, video, events } = fixture(kind)
    // eslint-disable-next-line accessor-pairs -- Intercept mode synchronization without implementing the unrelated state getter.
    Object.defineProperty(art, 'state', { set(value) {
      if (value === 'pip')
        art.pip = false
    } })
    if (kind === 'native')
      await video.requestPictureInPicture()
    else
      video.webkitSetPresentationMode('picture-in-picture')
    assert.deepEqual(events, kind === 'native' ? [] : [false])
    getScope(art).dispose()
  })
}

test('WebKit PiP checks current support and can retry after media becomes eligible', () => {
  const { art, video, events } = fixture('webkit')
  video.webkitSupportsPresentationMode = () => false
  art.pip = true
  assert.equal(art.pip, false)
  assert.equal(art.notice.show, 'PIP Not Supported')
  assert.deepEqual(events, [])
  video.webkitSupportsPresentationMode = () => true
  art.pip = true
  assert.equal(art.pip, true)
  assert.deepEqual(events, [true])
  getScope(art).dispose()
})
