import assert from 'node:assert/strict'
// eslint-disable-next-line test/no-import-node-test -- Repository Node frame ownership regression runner.
import test from 'node:test'
import { autoThumbnailCandidate, autoThumbnailEnvironment } from './helpers/auto-thumbnail.js'

const implementation = await autoThumbnailCandidate()

async function setup({ readyState = 4, cancel = true } = {}) {
  const env = autoThumbnailEnvironment(implementation)
  const frames = new Map()
  const canceled = []
  let nextFrame = 0
  await env.factory({ width: 80, number: 2 })(env.art)
  env.art.emit('video:loadedmetadata')
  const video = env.videos[0]
  video.readyState = readyState
  video.requestVideoFrameCallback = (callback) => {
    const id = nextFrame++
    frames.set(id, callback)
    return id
  }
  if (cancel) {
    video.cancelVideoFrameCallback = (id) => {
      canceled.push(id)
      frames.delete(id)
    }
  }
  return Object.assign(env, { video, frames, canceled, present(id = frames.keys().next().value) {
    const callback = frames.get(id)
    frames.delete(id)
    callback(0, { mediaTime: video.currentTime })
  } })
}

function closed(env) {
  assert.equal(env.attached.size, 0)
  assert.equal(env.frames.size, 0)
  assert.equal(env.timers.size, 0)
  assert.equal(env.video.onloadeddata, null)
  assert.equal(env.video.onseeked, null)
  assert.equal(env.video.src, undefined)
}

test('Auto-thumbnail frames wait for loadeddata before starting presentation-aware seeking', async () => {
  const env = await setup({ readyState: 1 })
  env.metadata()
  assert.equal(env.frames.size, 0)
  assert.equal(env.operations.some(item => item.name === 'seek'), false)
  assert.equal(env.timers.size, 1)
  const loaded = env.video.onloadeddata
  env.video.readyState = 4
  loaded()
  loaded()
  assert.equal(env.frames.size, 1)
  assert.equal(env.operations.filter(item => item.name === 'seek').length, 1)
  env.art.emit('destroy')
  closed(env)
})

for (const order of ['seek-first', 'frame-first']) {
  test(`Auto-thumbnail frames need both seek completion and presentation: ${order}`, async () => {
    const env = await setup()
    env.metadata()
    const seeked = env.video.onseeked
    const frame = env.frames.get(0)
    if (order === 'seek-first')
      env.seeked()
    else env.present()
    assert.equal(env.blobs.length, 0)
    if (order === 'seek-first')
      env.present()
    else env.seeked()
    assert.equal(env.blobs.length, 1)
    assert.equal(env.timers.size, 0)
    seeked()
    frame()
    assert.equal(env.blobs.length, 1)
    env.finish()
    seeked()
    frame()
    assert.equal(env.blobs.length, 1, 'Old callbacks cannot complete the next frame')
    env.seeked()
    env.present()
    env.finish(1)
    closed(env)
    assert.equal(env.updates.length, 2)
    env.art.emit('destroy')
    assert.equal(env.urls.size, 0)
  })
}

for (const phase of ['data', 'seek', 'frame']) {
  test(`Auto-thumbnail frames release ${phase} waits and ignore callbacks after destroy`, async () => {
    const env = await setup({ readyState: phase === 'data' ? 1 : 4 })
    env.metadata()
    const loaded = env.video.onloadeddata
    const frame = env.frames.get(0)
    const seeked = env.video.onseeked
    const timer = [...env.timers.values()][0].callback
    if (phase === 'frame')
      env.seeked()
    env.art.emit('destroy')
    loaded?.()
    frame?.()
    seeked?.()
    timer()
    assert.equal(env.blobs.length, 0)
    assert.equal(env.warnings.length, 0)
    closed(env)
  })
}

test('Auto-thumbnail frames invalidate canceled presentation callbacks when retrying the same target', async () => {
  const env = await setup()
  env.metadata()
  const first = env.frames.get(0)
  env.video.timeOffset = 1
  env.seeked()
  assert.deepEqual(env.canceled, [0])
  first()
  env.video.timeOffset = 0
  env.seeked()
  assert.equal(env.blobs.length, 0)
  env.present(1)
  assert.equal(env.blobs.length, 1)
  env.art.emit('destroy')
  closed(env)
})

for (const phase of ['data', 'seek', 'frame']) {
  test(`Auto-thumbnail frames time out a stalled ${phase} wait without leaking callbacks`, async () => {
    const env = await setup({ readyState: phase === 'data' ? 1 : 4 })
    env.metadata()
    if (phase === 'frame')
      env.seeked()
    const timer = [...env.timers.values()][0]
    assert.equal(timer.delay, 30000)
    timer.callback()
    assert.equal(env.warnings.length, 1)
    assert.match(env.warnings[0][1].message, /frame readiness timed out/)
    assert.equal(env.blobs.length, 0)
    closed(env)
    env.art.emit('destroy')
  })
}

test('Auto-thumbnail frames clean up the decoder even if native callback cancellation throws', async () => {
  const env = await setup()
  env.metadata()
  const cancel = env.video.cancelVideoFrameCallback
  const failure = new Error('Frame cancellation failed')
  env.video.cancelVideoFrameCallback = (id) => {
    cancel(id)
    throw failure
  }
  env.art.emit('destroy')
  closed(env)
  assert.equal(env.warnings[0][1], failure)
})

test('Auto-thumbnail frames recover a callback handle registered across synchronous destruction', async () => {
  const env = await setup()
  const request = env.video.requestVideoFrameCallback
  env.video.requestVideoFrameCallback = (callback) => {
    env.art.emit('destroy')
    return request(callback)
  }
  env.metadata()
  closed(env)
  assert.deepEqual(env.canceled, [0])
  assert.equal(env.operations.some(item => item.name === 'seek'), false)
})

test('Auto-thumbnail frames recover a timer handle created across synchronous destruction', async () => {
  const env = await setup()
  const schedule = env.box.setTimeout
  env.box.setTimeout = (...args) => {
    env.art.emit('destroy')
    return schedule(...args)
  }
  env.metadata()
  closed(env)
  assert.equal(env.operations.some(item => item.name === 'seek'), false)
})

test('Auto-thumbnail frames preserve fallback seeking when native callback cancellation is absent', async () => {
  const env = await setup({ cancel: false })
  env.metadata()
  assert.equal(env.frames.size, 0)
  env.seeked()
  assert.equal(env.blobs.length, 1)
  env.art.emit('destroy')
  closed(env)
})

test('Auto-thumbnail frames preserve an earlier preview if subsequent presentation times out', async () => {
  const env = await setup()
  env.metadata()
  env.seeked()
  env.present()
  env.finish()
  const previous = env.art.thumbnails
  env.seeked()
  const timer = [...env.timers.values()][0]
  timer.callback()
  assert.equal(env.art.thumbnails, previous)
  assert.equal(env.urls.has(previous.url), true)
  closed(env)
  env.art.emit('destroy')
  assert.equal(env.urls.size, 0)
})

test('Auto-thumbnail frames accept synchronous presentation without leaking its returned handle', async () => {
  const env = await setup()
  const request = env.video.requestVideoFrameCallback
  env.video.requestVideoFrameCallback = (callback) => {
    const id = request(callback)
    callback()
    return id
  }
  env.metadata()
  assert.equal(env.frames.size, 0)
  assert.equal(env.blobs.length, 0)
  env.seeked()
  assert.equal(env.blobs.length, 1)
  env.art.emit('destroy')
  closed(env)
})

test('Auto-thumbnail frames release callbacks and the decoder when clearing its timer throws', async () => {
  const env = await setup()
  env.metadata()
  const clear = env.box.clearTimeout
  const failure = new Error('Timer cleanup failed')
  env.box.clearTimeout = (id) => {
    clear(id)
    throw failure
  }
  env.art.emit('destroy')
  closed(env)
  assert.equal(env.warnings[0][1], failure)
})

test('Auto-thumbnail frames own native registration errors and clear the deadline', async () => {
  const env = await setup()
  const failure = new Error('Frame registration failed')
  env.video.requestVideoFrameCallback = () => {
    throw failure
  }
  env.metadata()
  closed(env)
  assert.equal(env.warnings[0][1], failure)
})

test('Auto-thumbnail frames cannot restore a loadeddata handler after readiness getter destruction', async () => {
  const env = await setup()
  Object.defineProperty(env.video, 'readyState', { get() {
    env.art.emit('destroy')
    return 1
  } })
  env.metadata()
  closed(env)
  assert.equal(env.operations.some(item => item.name === 'seek'), false)
})
