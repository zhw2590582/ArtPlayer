import assert from 'node:assert/strict'
// eslint-disable-next-line test/no-import-node-test -- Verify metadata wait ownership and cancellation.
import test from 'node:test'
import { autoThumbnailCandidate, autoThumbnailEnvironment } from './helpers/auto-thumbnail.js'

const implementation = await autoThumbnailCandidate()
async function setup() {
  const env = autoThumbnailEnvironment(implementation)
  const result = await env.factory({ width: 80, number: 1 })(env.art)
  assert.equal(result.name, 'artplayerPluginAutoThumbnail')
  env.art.emit('video:loadedmetadata')
  return env
}

function released(env, video = env.videos[0]) {
  assert.equal(env.attached.has(video), false)
  assert.equal(video.src, undefined)
  assert.equal(video.onloadedmetadata, null)
  assert.equal(video.onerror, null)
}

test('Auto-thumbnail metadata timeout releases a stalled decoder and ignores late metadata', async () => {
  const env = await setup()
  const metadata = env.videos[0].onloadedmetadata
  const deadline = [...env.timers.values()][0]
  assert(deadline, 'Metadata loading must have an owned deadline')
  assert.equal(deadline.delay, 30000)
  deadline.callback()
  released(env)
  assert.equal(env.timers.size, 0)
  assert.equal(env.warnings.length, 1)
  assert.match(env.warnings[0][1].message, /metadata timed out/)
  metadata()
  deadline.callback()
  assert.equal(env.canvases.length, 0)
  assert.equal(env.updates.length, 0)
  assert.equal(env.warnings.length, 1)
  env.art.emit('destroy')
})

for (const scenario of ['destroy', 'restart', 'error', 'metadata']) {
  test(`Auto-thumbnail metadata deadline becomes inert after ${scenario}`, async () => {
    const env = await setup()
    const deadline = [...env.timers.values()][0]
    assert(deadline, 'Metadata loading must have an owned deadline')
    if (scenario === 'metadata') {
      env.metadata()
      const frameDeadline = [...env.timers.values()][0]
      assert.notEqual(frameDeadline, deadline)
      deadline.callback()
      assert.equal(env.timers.size, 1, 'A queued metadata timeout cannot cancel the new frame wait')
      env.seeked()
      env.finish()
      assert.equal(env.updates.length, 1)
    }
    else if (scenario === 'error') {
      env.videos[0].error = new Error('Media failed')
      env.videos[0].onerror()
    }
    else {
      env.art.emit(scenario)
    }
    deadline.callback()
    released(env)
    assert.equal(env.timers.size, 0)
    assert.equal(env.warnings.length, scenario === 'error' ? 1 : 0)
    env.art.emit('destroy')
  })
}

test('Auto-thumbnail stalled replacement retains the previous usable sheet', async () => {
  const env = await setup()
  env.metadata()
  env.seeked()
  env.finish()
  const sheet = env.art.thumbnails
  env.art.emit('restart')
  env.art.emit('video:loadedmetadata')
  const deadline = [...env.timers.values()][0]
  assert(deadline, 'Replacement metadata loading must have a deadline')
  deadline.callback()
  released(env, env.videos[1])
  assert.equal(env.art.thumbnails, sheet)
  assert.equal(env.urls.has(sheet.url), true)
  assert.equal(env.updates.length, 1)
  env.art.emit('destroy')
  assert.equal(env.urls.size, 0)
})

test('Auto-thumbnail metadata timer registration cannot start loading after destruction', async () => {
  const env = autoThumbnailEnvironment(implementation)
  await env.factory({ width: 80, number: 1 })(env.art)
  const schedule = env.box.setTimeout
  env.box.setTimeout = (...args) => {
    env.art.emit('destroy')
    return schedule(...args)
  }
  env.art.emit('video:loadedmetadata')
  released(env)
  assert.equal(env.timers.size, 0)
  assert.equal(env.canvases.length, 0)
})
