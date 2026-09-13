import assert from 'node:assert/strict'
// eslint-disable-next-line test/no-import-node-test -- Frame clock regressions use the repository runner.
import test from 'node:test'
import vm from 'node:vm'
import { jassubCandidate } from './helpers/jassub.js'

const candidate = await jassubCandidate()
const interval = 1000 / 30

function environment({ native = false, quality = true } = {}) {
  let now = 0
  let nextFrame = 0
  const frames = new Map()
  const cancelled = []
  class Video {
    constructor() {
      this.currentTime = 0
      this.videoWidth = 640
      this.videoHeight = 360
      this.readyState = 4
      this.paused = false
      this.seeking = false
      this.quality = { totalVideoFrames: 0, droppedVideoFrames: 0, totalFrameDelay: 0 }
    }
  }
  if (quality) {
    Video.prototype.getVideoPlaybackQuality = function () {
      return { ...this.quality }
    }
  }
  const nativeRequest = () => 123
  const nativeCancel = () => undefined
  if (native) {
    Video.prototype.requestVideoFrameCallback = nativeRequest
    Video.prototype.cancelVideoFrameCallback = nativeCancel
  }
  const originalDescriptors = Object.getOwnPropertyDescriptors(Video.prototype)
  const module = { exports: {} }
  const context = {
    HTMLVideoElement: Video,
    EventTarget,
    Map,
    module,
    exports: module.exports,
    performance: { now: () => now },
    requestAnimationFrame(callback) {
      const id = nextFrame++
      frames.set(id, callback)
      return id
    },
    cancelAnimationFrame(id) {
      cancelled.push(id)
      frames.delete(id)
    },
  }
  context.window = context
  context.self = context
  // Only platform primitives are controlled. Execute the actual package bundle;
  // no vendor method is substituted or copied into this test.
  vm.runInNewContext(candidate.code, context, { timeout: 5000 })
  assert.equal(typeof (module.exports.default || module.exports), 'function')
  return {
    Video,
    frames,
    cancelled,
    nativeRequest,
    nativeCancel,
    originalDescriptors,
    frame(time) {
      assert(time >= now, 'The controlled wall clock is monotonic')
      now = time
      for (const [id, callback] of [...frames]) {
        if (!frames.delete(id))
          continue
        callback(time)
      }
    },
  }
}

function collect(video) {
  const calls = []
  const id = video.requestVideoFrameCallback((now, metadata) => calls.push({ now, metadata }))
  assert.equal(typeof id, 'number')
  return { id, calls }
}

function hasPending(video, id) {
  const pending = video._rvfcpolyfillmap
  assert(pending, 'The actual polyfill exposes its pending request map')
  return pending instanceof Map ? pending.has(id) : Object.hasOwn(pending, id)
}

test('JASSUB frame polyfill leaves native RVFC and cancellation untouched', () => {
  const env = environment({ native: true })
  assert.deepEqual(Object.getOwnPropertyDescriptors(env.Video.prototype), env.originalDescriptors)
  const video = new env.Video()
  assert.equal(video.requestVideoFrameCallback, env.nativeRequest)
  assert.equal(video.cancelVideoFrameCallback, env.nativeCancel)
  assert(!Object.hasOwn(video, '_rvfcpolyfillmap'))
  assert.equal(env.frames.size, 0)
})

test('JASSUB frame polyfill preserves the unsupported quality-API boundary', () => {
  const env = environment({ quality: false })
  assert.equal(env.Video.prototype.requestVideoFrameCallback, undefined)
  assert.equal(env.Video.prototype.cancelVideoFrameCallback, undefined)
  assert.equal(env.frames.size, 0)
})

test('JASSUB healthy frame counts retain metadata and bypass fallback throttling', () => {
  const env = environment()
  const video = new env.Video()
  video.quality = { totalVideoFrames: 20, droppedVideoFrames: 5, totalFrameDelay: 0.125 }
  const { calls } = collect(video)
  video.currentTime = 4
  video.quality = { totalVideoFrames: 21, droppedVideoFrames: 5, totalFrameDelay: 0.25 }
  // The new fallback conditions must not alter the original increasing-count path.
  video.readyState = 1
  video.seeking = true
  env.frame(16)
  assert.equal(calls.length, 1)
  const { now, metadata } = calls[0]
  assert.equal(now, 16)
  assert.equal(metadata.presentedFrames, 16)
  assert.equal(metadata.processingDuration, 0.125)
  assert.equal(metadata.presentationTime, 141)
  assert.equal(metadata.expectedDisplayTime, 32)
  assert.equal(metadata.mediaTime, 4.016)
  assert.equal(metadata.width, 640)
  assert.equal(metadata.height, 360)
  assert.equal(env.frames.size, 0)
})

for (const counter of ['mozPresentedFrames', 'mozPaintedFrames']) {
  test(`JASSUB preserves the ${counter} increasing-count path`, () => {
    const env = environment()
    const video = new env.Video()
    video[counter] = 4
    const { calls } = collect(video)
    video[counter] = 5
    env.frame(1)
    assert.equal(calls.length, 1)
    assert.equal(calls[0].metadata.presentedFrames, 5)
  })
}

test('JASSUB zero-count fallback waits one 30Hz interval and reports actual media time with zero frames', () => {
  const env = environment()
  const video = new env.Video()
  const { calls } = collect(video)
  video.currentTime = 0.75
  env.frame(interval - 0.001)
  assert.equal(calls.length, 0)
  env.frame(interval)
  assert.equal(calls.length, 1)
  assert.equal(calls[0].now, interval)
  assert.equal(calls[0].metadata.mediaTime, 0.75)
  assert.equal(calls[0].metadata.presentedFrames, 0)
  assert.equal(calls[0].metadata.width, 640)
  assert.equal(calls[0].metadata.height, 360)
  env.frame(interval * 3)
  assert.equal(calls.length, 1, 'A fulfilled request is never delivered twice')
  assert.equal(env.frames.size, 0)
})

test('JASSUB zero-count fallback remains bounded on a 144Hz wall clock', () => {
  const env = environment()
  const video = new env.Video()
  const deliveries = []
  let pending
  const request = () => {
    pending = video.requestVideoFrameCallback((now, metadata) => {
      deliveries.push({ now, mediaTime: metadata.mediaTime })
      request()
    })
  }
  request()
  for (let frame = 1; frame <= 144; frame++) {
    const time = frame * 1000 / 144
    video.currentTime = time / 1000
    env.frame(time)
  }
  assert(deliveries.length > 20 && deliveries.length <= 30, `Expected bounded useful fallback, received ${deliveries.length} callbacks`)
  for (let index = 1; index < deliveries.length; index++)
    assert(deliveries[index].now - deliveries[index - 1].now >= interval - 1e-9)
  video.cancelVideoFrameCallback(pending)
  assert.equal(env.frames.size, 0)
})

test('JASSUB resumed real frame counts bypass the preceding fallback interval', () => {
  const env = environment()
  const video = new env.Video()
  const fallback = collect(video)
  video.currentTime = 0.5
  env.frame(interval)
  assert.equal(fallback.calls.length, 1)
  assert.equal(fallback.calls[0].metadata.presentedFrames, 0)
  const healthy = collect(video)
  video.quality.totalVideoFrames = 1
  video.currentTime = 1
  env.frame(interval + 1)
  assert.equal(healthy.calls.length, 1, 'Actual frame recovery must not wait for the fallback cap')
  assert.equal(healthy.calls[0].metadata.presentedFrames, 1)
  assert.equal(healthy.calls[0].metadata.mediaTime, 1.001)
  assert.equal(env.frames.size, 0)
})

for (const paused of [false, true]) {
  test(`JASSUB unchanged media time does not complete zero-count requests, paused=${paused}`, () => {
    const env = environment()
    const video = new env.Video()
    video.paused = paused
    video.currentTime = 5
    const { id, calls } = collect(video)
    env.frame(40)
    env.frame(1000)
    assert.equal(calls.length, 0)
    video.cancelVideoFrameCallback(id)
    assert.equal(env.frames.size, 0)
  })
}

for (const destination of [20, 3]) {
  test(`JASSUB paused seek to ${destination} waits for seeking completion then delivers the changed time`, () => {
    const env = environment()
    const video = new env.Video()
    video.paused = true
    video.currentTime = 10
    const { calls } = collect(video)
    video.seeking = true
    video.currentTime = destination
    env.frame(40)
    assert.equal(calls.length, 0)
    video.seeking = false
    env.frame(60)
    assert.equal(calls.length, 1)
    assert.equal(calls[0].metadata.mediaTime, destination)
    assert.equal(calls[0].metadata.presentedFrames, 0)
  })
}

for (const readyState of [0, 1]) {
  test(`JASSUB zero-count fallback waits for current frame data from readyState=${readyState}`, () => {
    const env = environment()
    const video = new env.Video()
    video.readyState = readyState
    const { calls } = collect(video)
    video.currentTime = 1
    env.frame(40)
    assert.equal(calls.length, 0)
    video.readyState = 2
    env.frame(60)
    assert.equal(calls.length, 1)
  })
}

for (const [label, quality] of [
  ['NaN total', { totalVideoFrames: Number.NaN, droppedVideoFrames: 0 }],
  ['missing total', { droppedVideoFrames: 0 }],
  ['NaN dropped', { totalVideoFrames: 0, droppedVideoFrames: Number.NaN }],
  ['missing dropped', { totalVideoFrames: 0 }],
  ['all frames dropped', { totalVideoFrames: 10, droppedVideoFrames: 10 }],
]) {
  test(`JASSUB does not infer zero-count fallback from ${label}`, () => {
    const env = environment()
    const video = new env.Video()
    video.quality = quality
    const { id, calls } = collect(video)
    video.currentTime = 1
    env.frame(40)
    video.currentTime = 2
    env.frame(100)
    assert.equal(calls.length, 0)
    video.cancelVideoFrameCallback(id)
    assert.equal(env.frames.size, 0)
  })
}

test('JASSUB same-video simultaneous requests have independent handles and cancellation', () => {
  const env = environment()
  const video = new env.Video()
  const first = collect(video)
  const second = collect(video)
  assert.notEqual(first.id, second.id)
  assert(second.id > first.id, 'Callback identifiers are monotonic even at the same performance.now')
  video.cancelVideoFrameCallback(first.id)
  video.quality.totalVideoFrames = 1
  env.frame(16)
  assert.equal(first.calls.length, 0)
  assert.equal(second.calls.length, 1)
  assert.equal(env.frames.size, 0)
})

test('JASSUB simultaneous requests on different videos cannot cancel each other', () => {
  const env = environment()
  const firstVideo = new env.Video()
  const secondVideo = new env.Video()
  const first = collect(firstVideo)
  const second = collect(secondVideo)
  assert(Object.hasOwn(firstVideo, '_rvfcpolyfillmap'))
  assert(Object.hasOwn(secondVideo, '_rvfcpolyfillmap'))
  assert.notEqual(firstVideo._rvfcpolyfillmap, secondVideo._rvfcpolyfillmap)
  firstVideo.cancelVideoFrameCallback(first.id)
  firstVideo.cancelVideoFrameCallback(first.id)
  firstVideo.quality.totalVideoFrames = 1
  secondVideo.quality.totalVideoFrames = 1
  env.frame(16)
  assert.equal(first.calls.length, 0)
  assert.equal(second.calls.length, 1)
  assert.equal(env.frames.size, 0)
})

test('JASSUB cancellation releases RAF id zero', () => {
  const env = environment()
  const video = new env.Video()
  const { id, calls } = collect(video)
  assert(env.frames.has(0))
  video.cancelVideoFrameCallback(id)
  assert.deepEqual(env.cancelled, [0])
  video.quality.totalVideoFrames = 1
  env.frame(40)
  assert.equal(calls.length, 0)
  assert.equal(env.frames.size, 0)
})

test('JASSUB removes a pending callback before invoking it even when it throws', () => {
  const env = environment()
  const video = new env.Video()
  const expected = new Error('frame consumer failure')
  const id = video.requestVideoFrameCallback(() => {
    assert.equal(hasPending(video, id), false)
    throw expected
  })
  video.quality.totalVideoFrames = 1
  assert.throws(() => env.frame(16), error => error === expected)
  assert.equal(hasPending(video, id), false)
  assert.equal(env.frames.size, 0)
  const next = collect(video)
  video.quality.totalVideoFrames = 2
  env.frame(17)
  assert.equal(next.calls.length, 1)
})

test('JASSUB callback reentry retains a newly registered request independently', () => {
  const env = environment()
  const video = new env.Video()
  let next
  const calls = []
  const first = video.requestVideoFrameCallback(() => {
    assert.equal(hasPending(video, first), false)
    calls.push('first')
    next = video.requestVideoFrameCallback(() => calls.push('next'))
    video.cancelVideoFrameCallback(first)
  })
  video.quality.totalVideoFrames = 1
  env.frame(16)
  assert.deepEqual(calls, ['first'])
  assert(hasPending(video, next))
  video.quality.totalVideoFrames = 2
  env.frame(17)
  assert.deepEqual(calls, ['first', 'next'])
  assert.equal(env.frames.size, 0)
})
