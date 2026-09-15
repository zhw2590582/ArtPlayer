import assert from 'node:assert/strict'
// eslint-disable-next-line test/no-import-node-test -- Verify late asynchronous installation ownership.
import test from 'node:test'
import { autoThumbnailCandidate, autoThumbnailEnvironment } from './helpers/auto-thumbnail.js'

const implementation = await autoThumbnailCandidate()

for (const mode of ['retained-host', 'unavailable-host-members']) {
  test(`Auto-thumbnail registration after destroy is inert: ${mode}`, async () => {
    const env = autoThumbnailEnvironment(implementation)
    env.art.isDestroy = true
    if (mode === 'unavailable-host-members') {
      for (const key of ['on', 'off', 'option']) {
        Object.defineProperty(env.art, key, { get() {
          throw new Error(`Destroyed host ${key} must not be read`)
        } })
      }
    }
    const pending = env.factory({ width: 80, number: 1 })(env.art)
    assert.equal(typeof pending.then, 'function', 'Late registration retains the asynchronous public shape')
    assert.deepEqual({ ...await pending }, { name: 'artplayerPluginAutoThumbnail' })
    assert.equal([...env.listeners.values()].reduce((count, set) => count + set.size, 0), 0)
    env.art.emit('video:loadedmetadata')
    assert.equal(env.videos.length, 0)
    assert.equal(env.canvases.length, 0)
    assert.equal(env.timers.size, 0)
    assert.equal(env.updates.length, 0)
    assert.equal(env.urls.size, 0)
  })
}

for (const marker of [false, undefined]) {
  test(`Auto-thumbnail live registration remains compatible with isDestroy=${marker}`, async () => {
    const env = autoThumbnailEnvironment(implementation)
    if (marker !== undefined)
      env.art.isDestroy = marker
    await env.factory({ width: 80, number: 1 })(env.art)
    env.art.emit('video:loadedmetadata')
    assert.equal(env.videos.length, 1)
    env.metadata()
    env.seeked()
    env.finish()
    assert.equal(env.updates.length, 1)
    assert.equal(env.urls.size, 1)
    env.art.emit('destroy')
    assert.equal(env.urls.size, 0)
    assert.equal(env.timers.size, 0)
    assert.equal(env.attached.size, 0)
  })
}
