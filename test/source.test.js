import assert from 'node:assert/strict'
// eslint-disable-next-line test/no-import-node-test -- Use the repository Node test runner.
import { mock, test } from 'node:test'
import { setImmediate } from 'node:timers/promises'
import { loadModules } from './helpers/load.js'

const { Emitter, urlMix, switchMix, playMix, beginLifecycle, getScope, positionRestoration, currentTimeMix } = await loadModules({
  Emitter: 'packages/artplayer/src/utils/emitter',
  urlMix: 'packages/artplayer/src/player/urlMix',
  switchMix: 'packages/artplayer/src/player/switchMix',
  playMix: 'packages/artplayer/src/player/playMix',
  beginLifecycle: { file: 'packages/artplayer/src/lifecycle/instance', name: 'beginLifecycle' },
  getScope: { file: 'packages/artplayer/src/lifecycle/instance', name: 'getScope' },
  positionRestoration: { file: 'packages/artplayer/src/source/restore-position', name: 'positionRestoration' },
  currentTimeMix: 'packages/artplayer/src/player/currentTimeMix',
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

test('source assignment does not revoke a caller-owned Blob URL still used elsewhere', async (t) => {
  const art = createArt()
  const blob = new Blob(['shared media'], { type: 'video/mp4' })
  const url = URL.createObjectURL(blob)
  t.after(() => URL.revokeObjectURL(url))
  art.url = url
  art.url = 'next.mp4'
  assert.equal(await (await fetch(url)).text(), 'shared media')
  getScope(art).dispose()
  assert.equal(await (await fetch(url)).text(), 'shared media')
})

test('quality restoration waits for a pending native seek before restoring playback rate', async () => {
  const art = createArt()
  let settled = false
  const switching = art.switchQuality('next.mp4').then(() => {
    settled = true
  })
  art.playbackRate = 1
  art.template.$video.seeking = true
  art.emit('video:loadedmetadata')
  art.emit('video:canplay')
  await Promise.resolve()
  assert.equal(settled, false)
  assert.equal(art.playbackRate, 1)
  assert.equal(art.currentTime, 37)
  art.template.$video.seeking = false
  art.emit('video:seeked')
  await switching
  assert.equal(settled, true)
  assert.equal(art.playbackRate, 1.5)
  assert.deepEqual(Object.keys(art.e), [])
})

test('a switch waiting for seeked settles on cancellation and ignores the late seek', async () => {
  const art = createArt()
  const switching = art.switchQuality('next.mp4')
  art.playbackRate = 1
  art.template.$video.seeking = true
  art.emit('video:canplay')
  getScope(art).dispose()
  await switching
  art.template.$video.seeking = false
  art.emit('video:seeked')
  assert.equal(art.playbackRate, 1)
  assert.deepEqual(Object.keys(art.e), [])
})

test('a missed native quality seek is corrected once and settles after the second seeked', async () => {
  const art = createArt()
  let time = 37
  const writes = []
  Object.defineProperty(art, 'currentTime', {
    get: () => time,
    set(value) {
      writes.push(value)
      time = value
      art.template.$video.seeking = true
    },
  })
  let settled = false
  const switching = art.switchQuality('next.mp4').then(() => {
    settled = true
  })
  art.emit('video:loadedmetadata')
  art.emit('video:canplay')
  time = 0
  art.template.$video.seeking = false
  art.emit('video:seeked')
  await Promise.resolve()
  assert.equal(settled, false)
  assert.deepEqual(writes, [37, 37])
  assert.equal(art.playbackRate, 1.5)
  // Even a second native miss must not start an unbounded correction loop.
  time = 0
  art.template.$video.seeking = false
  art.emit('video:seeked')
  await switching
  assert.deepEqual(writes, [37, 37])
  assert.deepEqual(Object.keys(art.e), [])
})

test('public seek during quality loading wins over metadata restoration and native correction', async () => {
  for (const beforeMetadata of [false, true]) {
    const art = createArt()
    const switching = art.switchQuality('next.mp4')
    art.template.$video.seeking = true
    if (!beforeMetadata)
      art.emit('video:loadedmetadata')
    art.currentTime = 6
    art.emit('seek', 6)
    if (beforeMetadata)
      art.emit('video:loadedmetadata')
    art.template.$video.seeking = false
    art.emit('video:canplay')
    await switching
    assert.equal(art.currentTime, 6)
    assert.deepEqual(Object.keys(art.e), [])
  }
})

test('direct public currentTime writes during quality loading supersede automatic restoration', async () => {
  for (const beforeMetadata of [false, true]) {
    const art = createArt()
    art.duration = 100
    art.template.$video.currentTime = 37
    currentTimeMix(art)
    const switching = art.switchQuality('next.mp4')
    art.template.$video.seeking = true
    if (!beforeMetadata)
      art.emit('video:loadedmetadata')
    art.currentTime = 6
    if (beforeMetadata)
      art.emit('video:loadedmetadata')
    art.template.$video.seeking = false
    art.emit('video:canplay')
    await switching
    assert.equal(art.currentTime, 6)
    assert.deepEqual(Object.keys(art.e), [])
  }
})

test('position restoration preserves clamping and native frame rounding', () => {
  let time = 0
  const video = { seeking: false }
  const writes = []
  const art = {
    template: { $video: video },
    get currentTime() { return time },
    set currentTime(value) {
      writes.push(value)
      time = Math.min(10, value)
      video.seeking = true
    },
  }
  const restoration = positionRestoration(art, 37, () => true)
  restoration.restore()
  time = 9.99
  video.seeking = false
  assert.equal(restoration.ready(), true)
  assert.deepEqual(writes, [37])
  time = 0
  assert.equal(restoration.ready(), false)
  assert.deepEqual(writes, [37, 10])
})

test('a reentrant position read cannot correct a cancelled or manually superseded seek', () => {
  for (const boundary of ['cancel', 'manual']) {
    let active = true
    let reenter = false
    let time = 0
    let restoration
    const writes = []
    const art = {
      template: { $video: { seeking: true } },
      get currentTime() {
        if (reenter) {
          if (boundary === 'cancel')
            active = false
          else
            restoration.manual()
        }
        return time
      },
      set currentTime(value) {
        writes.push(value)
        time = value
      },
    }
    restoration = positionRestoration(art, 37, () => active)
    restoration.restore()
    art.template.$video.seeking = false
    time = 6
    reenter = true
    assert.equal(restoration.ready(), boundary === 'manual')
    assert.deepEqual(writes, [37])
  }
})

test('synchronous correction seeked reentry resumes a source only once', async () => {
  const art = createArt()
  art.playing = true
  let time = 37
  let correcting = false
  Object.defineProperty(art, 'currentTime', {
    get: () => time,
    set(value) {
      time = value
      art.template.$video.seeking = !correcting
      if (correcting)
        art.emit('video:seeked')
    },
  })
  const switching = art.switchQuality('next.mp4')
  art.emit('video:loadedmetadata')
  art.emit('video:canplay')
  time = 0
  correcting = true
  art.template.$video.seeking = false
  art.emit('video:seeked')
  await switching
  assert.equal(time, 37)
  assert.equal(art.play.mock.callCount(), 1)
  assert.deepEqual(Object.keys(art.e), [])
})

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
