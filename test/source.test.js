import assert from 'node:assert/strict'
// eslint-disable-next-line test/no-import-node-test -- Use the repository Node test runner.
import { mock, test } from 'node:test'
import { setImmediate } from 'node:timers/promises'
import { loadModules } from './helpers/load.js'

const { Emitter, urlMix, switchMix, playMix, beginLifecycle, getScope } = await loadModules({
  Emitter: 'packages/artplayer/src/utils/emitter',
  urlMix: 'packages/artplayer/src/player/urlMix',
  switchMix: 'packages/artplayer/src/player/switchMix',
  playMix: 'packages/artplayer/src/player/playMix',
  beginLifecycle: { file: 'packages/artplayer/src/lifecycle/instance', name: 'beginLifecycle' },
  getScope: { file: 'packages/artplayer/src/lifecycle/instance', name: 'getScope' },
})

function createArt(customType) {
  const art = Object.assign(new Emitter(), {
    template: { $video: { src: 'old.mp4' } },
    option: { url: 'old.mp4', type: customType ? 'custom' : '', customType: { custom: customType } },
    isReady: true,
    playing: false,
    currentTime: 37,
    playbackRate: 1.5,
    aspectRatio: '16:9',
    loading: { show: false },
    notice: { show: '' },
    pause: mock.fn(),
    play: mock.fn(() => Promise.resolve()),
  })
  beginLifecycle(art)
  urlMix(art)
  switchMix(art)
  return art
}

test('superseded switches settle before readiness and only the latest restores state/restarts', async () => {
  const art = createArt()
  const restarts = []
  art.on('restart', url => restarts.push(url))
  const first = art.switchQuality('first.mp4')
  art.currentTime = 9
  const second = art.switchQuality('second.mp4')
  assert.equal(await first, undefined)
  art.currentTime = 0
  art.emit('video:loadedmetadata')
  assert.equal(art.currentTime, 9)
  art.emit('video:canplay')
  assert.equal(await second, undefined)
  assert.deepEqual(restarts, ['second.mp4'])
  assert.deepEqual(Object.keys(art.e), ['restart'])
})

test('direct URL assignment cancels an outstanding switch and stale restart listeners', async () => {
  const art = createArt()
  const restarts = []
  art.on('restart', url => restarts.push(url))
  const switching = art.switchQuality('switch.mp4')
  art.url = 'direct.mp4'
  await switching
  art.currentTime = 4
  art.emit('video:loadedmetadata')
  art.emit('video:canplay')
  assert.equal(art.currentTime, 4)
  assert.deepEqual(restarts, ['direct.mp4'])
})

test('scope disposal settles a pending switch and prevents post-destroy work', async () => {
  const art = createArt()
  const switching = art.switchUrl('pending.mp4')
  getScope(art).dispose()
  assert.equal(await switching, undefined)
  assert.deepEqual(Object.keys(art.e), [])
  art.url = 'closed.mp4'
  await art.switchUrl('also-closed.mp4')
  assert.equal(art.url, 'pending.mp4')
  assert.equal(art.pause.mock.callCount(), 1)
})

test('same URL remains a no-op and switch setter retains the public function identity', async () => {
  const art = createArt()
  art.notice.show = 'keep'
  assert.equal(await art.switchUrl('old.mp4'), undefined)
  assert.equal(art.pause.mock.callCount(), 0)
  assert.equal(art.notice.show, 'keep')
  assert.equal(Object.getOwnPropertyDescriptor(art, 'switch').set, art.switchUrl)
  for (const name of ['url', 'switch', 'switchUrl', 'switchQuality']) {
    const descriptor = Object.getOwnPropertyDescriptor(art, name)
    assert.equal(descriptor.enumerable, false)
    assert.equal(descriptor.configurable, false)
  }
})

test('a reentrant pause cannot make its superseded switch overwrite the latest URL', async () => {
  const art = createArt()
  art.pause = () => {
    art.url = 'reentrant.mp4'
  }
  await art.switchUrl('stale.mp4')
  assert.equal(art.url, 'reentrant.mp4')
})

test('synchronous media setters cannot lose metadata, readiness or original errors', async () => {
  for (const fails of [false, true]) {
    const art = createArt()
    const error = new Error('synchronous source failure')
    let src = 'old.mp4'
    Object.defineProperty(art.template.$video, 'src', {
      get: () => src,
      set(value) {
        src = value
        if (fails) {
          art.emit('video:error', error)
        }
        else {
          art.currentTime = 0
          art.emit('video:loadedmetadata')
          art.emit('video:canplay')
        }
      },
    })
    const switching = art.switchQuality('sync.mp4')
    if (fails) {
      await assert.rejects(switching, actual => actual === error)
    }
    else {
      await switching
      assert.equal(art.currentTime, 37)
    }
    assert.deepEqual(Object.keys(art.e), [])
  }
})

test('late resume fulfillment or rejection cannot clear a newer operation notice', async () => {
  for (const rejects of [false, true]) {
    const art = createArt()
    art.playing = true
    let finish
    art.play = () => new Promise((resolve, reject) => {
      finish = rejects ? reject : resolve
    })
    const first = art.switchUrl('first.mp4')
    art.emit('video:canplay')
    art.playing = false
    const second = art.switchUrl('second.mp4')
    await first
    art.notice.show = 'new source notice'
    finish(new Error('late play'))
    await setImmediate()
    assert.equal(art.notice.show, 'new source notice')
    art.emit('video:canplay')
    await second
    assert.deepEqual(Object.keys(art.e), [])
  }
})

test('state restoration errors reject without leaking handlers or unhandled promises', async () => {
  for (const property of ['currentTime', 'playbackRate', 'aspectRatio']) {
    const art = createArt()
    const error = new Error(property)
    const switching = art.switchQuality('new.mp4')
    const previous = art[property]
    Object.defineProperty(art, property, {
      get: () => previous,
      set() {
        throw error
      },
    })
    const rejected = assert.rejects(switching, actual => actual === error)
    art.emit(property === 'currentTime' ? 'video:loadedmetadata' : 'video:canplay')
    await rejected
    assert.deepEqual(Object.keys(art.e), [])
  }
})

test('customType deferral ignores the old resource and preserves callback identities', async () => {
  let called
  const art = createArt(function (video, url, owner) {
    called = [this, video, url, owner, arguments.length]
    video.src = url
    owner.emit('video:loadedmetadata')
    owner.emit('video:canplay')
  })
  const switching = art.switchQuality('custom.mp4')
  art.currentTime = 0
  art.emit('video:canplay')
  assert.equal(called, undefined)
  await switching
  assert.deepEqual(called, [art, art.template.$video, 'custom.mp4', art, 3])
  assert.equal(art.currentTime, 37)
  assert.equal(art.option.url, 'custom.mp4')
})

test('customType failures reject switches with the original thrown/rejected value', async () => {
  for (const asynchronous of [false, true]) {
    const error = new Error('customType failed')
    const art = createArt(() => {
      if (asynchronous)
        return Promise.reject(error)
      throw error
    })
    await assert.rejects(art.switchUrl('failed.mp4'), actual => actual === error)
    assert.deepEqual(Object.keys(art.e), [])
  }
})

test('superseded customType callbacks never start and empty URL switches settle', async () => {
  const callback = mock.fn((video, url, art) => {
    video.src = url
    art.emit('video:canplay')
  })
  const art = createArt(callback)
  const first = art.switchUrl('first.mp4')
  const second = art.switchUrl('second.mp4')
  await Promise.all([first, second])
  assert.equal(callback.mock.callCount(), 1)
  assert.equal(callback.mock.calls[0].arguments[1], 'second.mp4')
  await art.switchUrl('')
  assert.equal(art.loading.show, true)
  assert.equal(art.url, 'second.mp4')
})

test('reentrant media listeners and property setters cannot restore stale state', async () => {
  for (const boundary of ['metadata', 'rate']) {
    const art = createArt()
    if (boundary === 'metadata') {
      art.once('video:loadedmetadata', () => {
        art.url = 'reentrant.mp4'
        art.currentTime = 6
      })
    }
    const switching = art.switchQuality('stale.mp4')
    art.currentTime = 0
    art.aspectRatio = 'default'
    if (boundary === 'rate') {
      Object.defineProperty(art, 'playbackRate', {
        get: () => 1,
        set() {
          art.url = 'reentrant.mp4'
        },
      })
    }
    art.emit(boundary === 'metadata' ? 'video:loadedmetadata' : 'video:canplay')
    await switching
    assert.equal(art.url, 'reentrant.mp4')
    assert.equal(art.aspectRatio, 'default')
    if (boundary === 'metadata')
      assert.equal(art.currentTime, 6)
    getScope(art).dispose()
    assert.deepEqual(Object.keys(art.e), [])
  }
})

test('direct customType rejection is reported once; obsolete returned failures are ignored', async (t) => {
  const warning = t.mock.method(console, 'warn', () => {})
  const error = new Error('direct custom source')
  let rejectLate
  let started
  const invoked = new Promise(resolve => started = resolve)
  const art = createArt(() => new Promise((resolve, reject) => {
    rejectLate = reject
    started()
  }))
  art.url = 'late.mp4'
  await invoked
  art.option.type = ''
  art.url = 'current.mp4'
  rejectLate(error)
  await setImmediate()
  assert.equal(warning.mock.callCount(), 0)
  art.option.type = 'custom'
  art.option.customType.custom = () => Promise.reject(error)
  await Object.getOwnPropertyDescriptor(art, 'url').set.call(art, 'failed.mp4')
  await setImmediate()
  assert.equal(warning.mock.callCount(), 1)
  assert.deepEqual(warning.mock.calls[0].arguments, ['Failed to initialize ArtPlayer source:', error])
  assert.deepEqual(Object.keys(art.e), [])
})

test('same-URL calls do not cancel the still-loading original operation', async () => {
  const art = createArt()
  let firstSettled = false
  const first = art.switchQuality('pending.mp4').then(() => firstSettled = true)
  await art.switchUrl('pending.mp4')
  assert.equal(firstSettled, false)
  art.currentTime = 0
  art.emit('video:loadedmetadata')
  art.emit('video:canplay')
  await first
  assert.equal(art.currentTime, 37)
  assert.equal(art.pause.mock.callCount(), 1)
})

test('synchronous readiness replay consumes metadata once and emits restart once', async () => {
  const art = createArt()
  const restarts = []
  art.on('restart', url => restarts.push(url))
  let src = 'old.mp4'
  Object.defineProperty(art.template.$video, 'src', {
    get: () => src,
    set(value) {
      src = value
      art.emit('video:loadedmetadata')
      art.emit('video:loadedmetadata')
    },
  })
  const switching = art.switchQuality('sync.mp4')
  assert.equal(art.currentTime, 37)
  art.currentTime = 4
  art.emit('video:loadedmetadata')
  assert.equal(art.currentTime, 4)
  art.emit('video:canplay')
  art.emit('video:canplay')
  await switching
  assert.deepEqual(restarts, ['sync.mp4'])
  assert.deepEqual(Object.keys(art.e), ['restart'])
})

test('the real play mixin cannot publish stale resume effects after source replacement', async () => {
  const art = createArt()
  art.i18n = { get: key => key }
  art.constructor = { instances: [] }
  let resolveNative
  art.template.$video.play = () => new Promise(resolve => resolveNative = resolve)
  playMix(art)
  art.playing = true
  const plays = []
  art.on('play', () => plays.push('play'))
  const switching = art.switchUrl('pending-resume.mp4')
  art.emit('video:canplay')
  art.url = 'latest.mp4'
  await switching
  art.notice.show = 'latest notice'
  resolveNative(42)
  await setImmediate()
  assert.equal(art.notice.show, 'latest notice')
  assert.deepEqual(plays, [])
})

test('public pending play preserves its result while obsolete notification/event/mutex work stops', async () => {
  for (const destroy of [false, true]) {
    const art = createArt()
    art.i18n = { get: key => key }
    const other = { pause: mock.fn() }
    art.constructor = { instances: [other] }
    art.option.mutex = true
    art.url = 'initial.mp4'
    let resolveNative
    art.template.$video.play = () => new Promise(resolve => resolveNative = resolve)
    playMix(art)
    const plays = mock.fn()
    art.on('play', plays)
    const playing = art.play()
    if (destroy)
      getScope(art).dispose()
    else
      art.url = 'replacement.mp4'
    art.notice.show = 'preserve'
    resolveNative(42)
    assert.equal(await playing, 42)
    assert.equal(art.notice.show, 'preserve')
    assert.equal(plays.mock.callCount(), 0)
    assert.equal(other.pause.mock.callCount(), 0)
  }
})
