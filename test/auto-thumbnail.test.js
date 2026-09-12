import assert from 'node:assert/strict'
// eslint-disable-next-line test/no-import-node-test -- Frozen historical regressions use the repository Node runner.
import test from 'node:test'
import { autoThumbnailEnvironment, autoThumbnailHistorical } from './helpers/auto-thumbnail.js'

for (const implementation of await autoThumbnailHistorical()) {
  test(`Auto-thumbnail ${implementation.name} historical: destroy leaves pending encode and final URL alive`, async () => {
    const env = autoThumbnailEnvironment(implementation)
    await env.factory({ number: 2 })(env.art)
    env.art.emit('video:loadedmetadata')
    env.metadata()
    const video = env.videos[0]
    env.art.emit('destroy')
    env.finish()
    assert.equal(env.updates.length, 1)
    assert.equal(env.urls.size, 1)
    assert.equal(env.listeners.get('video:loadedmetadata').size, 1)
    assert.equal(typeof video.onloadedmetadata, 'function')
    assert.equal(typeof video.onseeked, 'function')
    assert.equal(video.src, 'original.mp4')
    assert.equal(env.operations.filter(item => item.name === 'pause' || item.name === 'load').length, 0)
    env.art.emit('destroy')
    assert.equal(env.urls.size, 1)
  })

  test(`Auto-thumbnail ${implementation.name} historical: delayed old metadata overwrites a newer source sheet`, async () => {
    const env = autoThumbnailEnvironment(implementation)
    const options = { number: 2, width: 80 }
    await env.factory(options)(env.art)
    env.art.emit('video:loadedmetadata')
    const oldVideo = env.videos[0]
    env.art.option.url = 'replacement.mp4'
    options.width = 160
    env.art.emit('restart')
    env.art.emit('video:loadedmetadata')
    env.metadata(env.videos[1])
    env.finish(0, { source: 'new' })
    assert.equal(env.updates.at(-1).width, 160)
    env.metadata(oldVideo)
    env.finish(1, { source: 'old' })
    assert.equal(env.updates.at(-1).width, 80)
    assert.equal(env.urls.get(env.updates.at(-1).url).source, 'old')
    assert.equal(env.urls.size, 2, 'Separate jobs never revoke each other or release the latest stale sheet')
  })

  test(`Auto-thumbnail ${implementation.name} historical: repeated metadata opens independent decoders without closing previous jobs`, async () => {
    const env = autoThumbnailEnvironment(implementation)
    await env.factory({ number: 1 })(env.art)
    for (let index = 0; index < 3; index++) {
      env.art.emit('video:loadedmetadata')
      env.metadata()
      env.finish(index)
    }
    assert.equal(env.videos.length, 3)
    assert.equal(env.urls.size, 3)
    assert.equal(env.operations.some(item => item.name === 'pause' || item.name === 'load'), false)
    assert.equal(env.videos.every(video => typeof video.onseeked === 'function'), true)
  })

  test(`Auto-thumbnail ${implementation.name} historical: reverse Blob delivery replaces a complete sheet with its initial blank snapshot`, async () => {
    const env = autoThumbnailEnvironment(implementation)
    await env.factory({ number: 2 })(env.art)
    env.art.emit('video:loadedmetadata')
    env.metadata()
    env.seeked()
    env.seeked()
    assert.equal(env.blobs.length, 3, 'All native encodes can be pending together')
    env.finish(2, { frames: 2 })
    const completed = env.updates.at(-1).url
    env.finish(0, { frames: 0 })
    assert.equal(env.urls.has(completed), false)
    assert.equal(env.urls.get(env.updates.at(-1).url).frames, 0)
    env.finish(1, { frames: 1 })
    assert.equal(env.urls.get(env.updates.at(-1).url).frames, 1)
  })

  test(`Auto-thumbnail ${implementation.name} historical: null Blob revokes the previous usable URL before throwing`, async () => {
    const env = autoThumbnailEnvironment(implementation)
    await env.factory({ number: 2 })(env.art)
    env.art.emit('video:loadedmetadata')
    env.metadata()
    env.finish()
    const sheet = env.art.thumbnails
    env.seeked()
    assert.throws(() => env.finish(1, null), /Blob required/)
    assert.equal(env.urls.has(sheet.url), false)
    assert.equal(env.art.thumbnails, sheet, 'Public state still references the revoked URL')
    assert.equal(typeof env.videos[0].onseeked, 'function')
  })

  test(`Auto-thumbnail ${implementation.name} historical: draw and encode exceptions escape and retain decoder callbacks`, async () => {
    for (const phase of ['draw', 'encode']) {
      const env = autoThumbnailEnvironment(implementation)
      const failure = new Error(`${phase} failed`)
      await env.factory({ number: 2 })(env.art)
      env.art.emit('video:loadedmetadata')
      if (phase === 'draw') {
        env.metadata()
        env.controls.drawError = failure
        assert.throws(() => env.seeked(), error => error === failure)
      }
      else {
        env.controls.encodeError = failure
        assert.throws(() => env.metadata(), error => error === failure)
      }
      assert.equal(typeof env.videos[0].onloadedmetadata, 'function')
      assert.equal(env.videos[0].src, 'original.mp4')
      assert.equal(env.operations.some(item => item.name === 'pause' || item.name === 'load'), false)
    }
  })

  test(`Auto-thumbnail ${implementation.name} historical: missing context and native media errors have no failure owner`, async () => {
    const env = autoThumbnailEnvironment(implementation)
    await env.factory({ number: 2 })(env.art)
    env.art.emit('video:loadedmetadata')
    env.controls.nullContext = true
    env.metadata()
    assert.throws(() => env.seeked(), /drawImage/)
    assert.equal(env.videos[0].onerror, null)
    assert.equal(env.operations.some(item => item.name === 'pause' || item.name === 'load'), false)
  })

  test(`Auto-thumbnail ${implementation.name} historical: thumbnail setter failure leaks the new URL and does not cancel later work`, async () => {
    const env = autoThumbnailEnvironment(implementation)
    const failure = new Error('thumbnail setter failed')
    await env.factory({ number: 2 })(env.art)
    env.art.emit('video:loadedmetadata')
    env.metadata()
    env.controls.updateError = failure
    assert.throws(() => env.finish(), error => error === failure)
    assert.equal(env.urls.size, 1)
    assert.equal(env.updates.length, 0)
    env.controls.updateError = null
    env.seeked()
    env.finish(1)
    assert.equal(env.updates.length, 1)
    env.art.emit('destroy')
    assert.equal(env.urls.size, 1)
  })
}
