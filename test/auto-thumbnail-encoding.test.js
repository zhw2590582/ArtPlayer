import assert from 'node:assert/strict'
// eslint-disable-next-line test/no-import-node-test -- Verify bounded encoding ownership with controlled native callbacks.
import test from 'node:test'
import { autoThumbnailCandidate, autoThumbnailEnvironment } from './helpers/auto-thumbnail.js'

const implementation = await autoThumbnailCandidate()
async function setup(number = 2) {
  const env = autoThumbnailEnvironment(implementation)
  await env.factory({ width: 80, number })(env.art)
  env.art.emit('video:loadedmetadata')
  env.metadata()
  env.seeked()
  return env
}

function closed(env) {
  assert.equal(env.timers.size, 0)
  assert.equal(env.attached.size, 0)
  assert.equal(env.videos[0].src, undefined)
  assert.equal(env.canvases[0].width, 0)
  assert.equal(env.canvases[0].height, 0)
}

test('Auto-thumbnail stalled encoding closes owned resources and ignores a later Blob', async () => {
  const env = await setup()
  const timeout = [...env.timers.values()][0]
  assert(timeout, 'Encoding must have an owned deadline after the frame wait finishes')
  assert.equal(timeout.delay, 30000)
  timeout.callback()
  closed(env)
  assert.equal(env.warnings.length, 1)
  assert.match(env.warnings[0][1].message, /encoding timed out/)
  env.finish()
  timeout.callback()
  assert.equal(env.updates.length, 0)
  assert.equal(env.urls.size, 0)
  assert.equal(env.warnings.length, 1)
  env.art.emit('destroy')
})

test('Auto-thumbnail later encoding timeout preserves the last published preview', async () => {
  const env = await setup()
  env.finish()
  const previous = env.art.thumbnails
  env.seeked()
  const timeout = [...env.timers.values()][0]
  assert(timeout, 'The second encode needs a new deadline')
  timeout.callback()
  closed(env)
  assert.equal(env.art.thumbnails, previous)
  assert.equal(env.urls.has(previous.url), true)
  env.finish(1)
  assert.equal(env.updates.length, 1)
  env.art.emit('destroy')
  assert.equal(env.urls.size, 0)
})

for (const action of ['finish', 'destroy', 'restart']) {
  test(`Auto-thumbnail ${action} invalidates an encoding deadline already queued for delivery`, async () => {
    const env = await setup(1)
    const timeout = [...env.timers.values()][0]
    assert(timeout, 'Capture a real registered encoding deadline')
    if (action === 'finish')
      env.finish()
    else env.art.emit(action)
    timeout.callback()
    env.finish()
    closed(env)
    assert.equal(env.warnings.length, 0)
    assert.equal(env.updates.length, action === 'finish' ? 1 : 0)
    env.art.emit('destroy')
    assert.equal(env.urls.size, 0)
  })
}

test('Auto-thumbnail completion clears only its own timeout before the next frame', async () => {
  const env = await setup()
  const timeout = [...env.timers.values()][0]
  assert(timeout)
  env.finish()
  timeout.callback()
  assert.equal(env.timers.size, 1, 'The next seek still owns its frame deadline')
  env.seeked()
  assert.equal(env.timers.size, 1, 'One encoding deadline replaces that frame deadline')
  env.finish(1)
  closed(env)
  assert.equal(env.updates.length, 2)
  assert.equal(env.warnings.length, 0)
  env.art.emit('destroy')
})

test('Auto-thumbnail synchronous Blob delivery cancels its timeout and publishes once', async () => {
  const env = autoThumbnailEnvironment(implementation)
  await env.factory({ width: 80, number: 1 })(env.art)
  env.art.emit('video:loadedmetadata')
  env.metadata()
  env.canvases[0].toBlob = (callback) => {
    callback({ type: 'image/jpeg' })
    callback({ type: 'image/jpeg' })
  }
  env.seeked()
  closed(env)
  assert.equal(env.updates.length, 1)
  assert.equal(env.warnings.length, 0)
  env.art.emit('destroy')
})

test('Auto-thumbnail deadline registration cannot start encoding across synchronous destruction', async () => {
  const env = autoThumbnailEnvironment(implementation)
  await env.factory({ width: 80, number: 1 })(env.art)
  env.art.emit('video:loadedmetadata')
  env.metadata()
  const schedule = env.box.setTimeout
  env.box.setTimeout = (...args) => {
    env.art.emit('destroy')
    return schedule(...args)
  }
  env.seeked()
  closed(env)
  assert.equal(env.blobs.length, 0)
  assert.equal(env.warnings.length, 0)
})

test('Auto-thumbnail failed encoding deadline cleanup still releases canvas and decoder', async () => {
  const env = await setup()
  const clear = env.box.clearTimeout
  const failure = new Error('Encoding timeout cleanup failed')
  env.box.clearTimeout = (id) => {
    clear(id)
    throw failure
  }
  env.finish()
  closed(env)
  assert.equal(env.updates.length, 0)
  assert.equal(env.warnings.length, 1)
  assert.equal(env.warnings[0][1], failure)
  env.art.emit('destroy')
})
