import assert from 'node:assert/strict'
// eslint-disable-next-line test/no-import-node-test -- Repository Node lifecycle regression runner.
import test from 'node:test'
import { autoThumbnailCandidate, autoThumbnailEnvironment } from './helpers/auto-thumbnail.js'

const implementation = await autoThumbnailCandidate()
async function setup(option = { width: 80, number: 2 }) {
  const env = autoThumbnailEnvironment(implementation)
  const result = env.factory(option)(env.art)
  assert.equal(typeof result.then, 'function')
  assert.deepEqual({ ...await result }, { name: 'artplayerPluginAutoThumbnail' })
  env.art.emit('video:loadedmetadata')
  return env
}
function assertClosed(env, video = env.videos[0]) {
  assert.equal(env.attached.has(video), false)
  assert.equal(video.src, undefined)
  for (const key of ['onloadedmetadata', 'onseeked', 'onerror']) assert.equal(video[key], null)
  assert(env.operations.some(item => item.name === 'pause' && item.video === video))
  assert(env.operations.some(item => item.name === 'load' && item.video === video))
}

test('Auto-thumbnail candidate serializes valid JPEG updates and retains only the final URL until destroy', async () => {
  const env = await setup({ width: 80, number: 2, scale: 0.5, height: 999 })
  env.metadata()
  assert.equal(env.blobs.length, 0, 'No empty preview is encoded')
  assert.equal(env.operations.find(item => item.name === 'seek').handlerInstalled, true)
  env.seeked()
  assert.equal(env.blobs.length, 1)
  assert.equal(env.blobs[0].draws.length, 1)
  env.seeked()
  assert.equal(env.blobs.length, 1, 'No next frame starts while encoding is pending')
  env.finish()
  env.seeked()
  env.finish(1)
  assert.deepEqual(env.operations.filter(item => item.name === 'seek').map(item => item.value), [0, 60])
  assert.deepEqual(env.canvases[0].draws.map(args => args.slice(1)), [[0, 0, 80, 45], [80, 0, 80, 45]])
  assert.equal(env.updates.length, 2)
  assert.deepEqual({ ...env.updates[1] }, { url: 'blob:auto-thumbnail-2', height: 45, column: 10, number: 2, width: 80, scale: 0.5 })
  assert.equal(env.urls.size, 1)
  assertClosed(env)
  env.art.emit('destroy')
  assert.equal(env.urls.size, 0)
})

test('Auto-thumbnail candidate destroys pending metadata without creating later canvases', async () => {
  const env = await setup()
  const callback = env.videos[0].onloadedmetadata
  env.art.emit('destroy')
  callback()
  assert.equal(env.canvases.length, 0)
  assertClosed(env)
  assert([...env.listeners.values()].every(set => set.size === 0))
})

test('Auto-thumbnail candidate ignores Blob delivery after destroy and repeated destruction', async () => {
  const env = await setup()
  env.metadata()
  env.seeked()
  env.art.emit('destroy')
  env.finish()
  env.art.emit('destroy')
  assert.equal(env.updates.length, 0)
  assert.equal(env.urls.size, 0)
  assertClosed(env)
})

test('Auto-thumbnail candidate prevents old metadata from replacing the new source', async () => {
  const options = { width: 80, number: 1 }
  const env = await setup(options)
  const oldVideo = env.videos[0]
  const oldMetadata = oldVideo.onloadedmetadata
  env.art.option.url = 'new.mp4'
  options.width = 160
  env.art.emit('video:loadedmetadata')
  oldMetadata()
  assert.equal(env.canvases.length, 0)
  env.metadata()
  env.seeked()
  env.finish()
  assert.equal(env.updates.length, 1)
  assert.equal(env.updates[0].width, 160)
  assertClosed(env, oldVideo)
  env.art.emit('destroy')
  assert.equal(env.urls.size, 0)
})

test('Auto-thumbnail candidate restart cancels encoding before replacement metadata', async () => {
  const env = await setup()
  env.metadata()
  env.seeked()
  env.art.emit('restart')
  env.finish()
  assert.equal(env.updates.length, 0)
  assert.equal(env.urls.size, 0)
  assertClosed(env)
  env.art.emit('video:loadedmetadata')
  assert.equal(env.videos.length, 2)
  env.art.emit('destroy')
})

test('Auto-thumbnail candidate delivers each Blob callback once', async () => {
  const env = await setup()
  env.metadata()
  env.seeked()
  env.finish()
  env.finish()
  assert.equal(env.updates.length, 1)
  assert.equal(env.operations.filter(item => item.name === 'seek').length, 2)
  env.art.emit('destroy')
  assert.equal(env.urls.size, 0)
})

test('Auto-thumbnail candidate null Blob preserves the previous valid preview and closes the decoder', async () => {
  const env = await setup()
  env.metadata()
  env.seeked()
  env.finish()
  const previous = env.art.thumbnails
  env.seeked()
  assert.doesNotThrow(() => env.finish(1, null))
  assert.equal(env.urls.has(previous.url), true)
  assert.equal(env.art.thumbnails, previous)
  assert.equal(env.warnings.length, 1)
  assertClosed(env)
  env.art.emit('destroy')
  assert.equal(env.urls.size, 0)
})

for (const phase of ['draw', 'encode', 'context', 'media', 'setter']) {
  test(`Auto-thumbnail candidate ${phase} failure has an owner and releases decoder resources`, async () => {
    const env = await setup()
    const failure = new Error(`${phase} failed`)
    if (phase === 'context')
      env.controls.nullContext = true
    if (phase === 'draw')
      env.controls.drawError = failure
    if (phase === 'encode')
      env.controls.encodeError = failure
    if (phase === 'setter')
      env.controls.updateError = failure
    if (phase === 'media') {
      env.videos[0].error = failure
      assert.doesNotThrow(() => env.videos[0].onerror?.())
    }
    else {
      assert.doesNotThrow(() => env.metadata())
      assert.doesNotThrow(() => env.seeked())
      if (phase === 'setter')
        assert.doesNotThrow(() => env.finish())
    }
    assert.equal(env.warnings.length, 1)
    if (phase !== 'context')
      assert.equal(env.warnings[0][1], failure)
    assert.equal(env.urls.size, 0)
    assertClosed(env)
  })
}

test('Auto-thumbnail candidate cleanup continues after pause throws', async () => {
  const env = await setup()
  const failure = new Error('pause failed')
  env.videos[0].pause = () => {
    throw failure
  }
  env.art.emit('destroy')
  assert.equal(env.videos[0].src, undefined)
  assert.equal(env.videos[0].onloadedmetadata, null)
  assert(env.operations.some(item => item.name === 'load'))
  assert([...env.listeners.values()].every(set => set.size === 0))
  assert.equal(env.warnings[0][1], failure)
})

test('Auto-thumbnail candidate returns registration failures and rolls back listeners', async () => {
  const env = autoThumbnailEnvironment(implementation)
  const on = env.art.on
  const failure = new Error('listen failed')
  env.art.on = function (name, callback) {
    on.call(this, name, callback)
    if (name === 'video:loadedmetadata')
      throw failure
    return this
  }
  await assert.rejects(env.factory({})(env.art), error => error === failure)
  assert([...env.listeners.values()].every(set => set.size === 0))
})

test('Auto-thumbnail candidate rejects nonfinite input and live durations without creating a canvas', async () => {
  for (const option of [{ width: Infinity }, { number: Infinity }, { width: -1 }, { number: -2 }]) {
    const env = await setup(option)
    assert.equal(env.videos.length, 0)
    assert.equal(env.warnings.length, 1)
    env.art.emit('destroy')
  }
  const env = await setup()
  env.videos[0].duration = Infinity
  env.metadata()
  assert.equal(env.canvases.length, 0)
  assertClosed(env)
})

test('Auto-thumbnail candidate does not revoke a foreign public URL on destroy', async () => {
  const env = await setup({ number: 1 })
  env.metadata()
  env.seeked()
  env.finish()
  env.art.thumbnails = { url: 'blob:foreign' }
  env.art.emit('destroy')
  assert.equal(env.operations.some(item => item.name === 'revokeURL' && item.url === 'blob:foreign'), false)
  assert.equal(env.urls.size, 0)
})

test('Auto-thumbnail candidate recovers a URL created across reentrant destroy', async () => {
  const env = await setup()
  env.metadata()
  env.seeked()
  const create = env.box.URL.createObjectURL
  env.box.URL.createObjectURL = (blob) => {
    env.art.emit('destroy')
    return create(blob)
  }
  env.finish()
  assert.equal(env.updates.length, 0)
  assert.equal(env.urls.size, 0)
  assertClosed(env)
})

test('Auto-thumbnail candidate replacement during URL creation cannot resume the old decoder', async () => {
  const env = await setup()
  env.metadata()
  env.seeked()
  const create = env.box.URL.createObjectURL
  env.box.URL.createObjectURL = (blob) => {
    const url = create(blob)
    env.art.emit('video:loadedmetadata')
    return url
  }
  env.finish()
  assert.equal(env.videos.length, 2)
  assert.equal(env.updates.length, 0)
  assert.equal(env.urls.size, 0)
  assertClosed(env, env.videos[0])
  env.art.emit('destroy')
})

test('Auto-thumbnail candidate replacement from the host setter preserves the new job and its preview', async () => {
  const env = await setup({ number: 1 })
  env.metadata()
  env.seeked()
  env.controls.onUpdate = () => {
    env.controls.onUpdate = null
    env.art.emit('video:loadedmetadata')
  }
  env.finish()
  assert.equal(env.videos.length, 2)
  assert.equal(env.urls.size, 1)
  assertClosed(env, env.videos[0])
  env.metadata()
  env.seeked()
  env.finish(1)
  assert.equal(env.updates.length, 2)
  assert.equal(env.urls.size, 1)
  assert.equal(env.urls.has(env.updates[0].url), false)
  env.art.emit('destroy')
  assert.equal(env.urls.size, 0)
})

test('Auto-thumbnail candidate retains coercible numeric strings and fractional frame-count behavior', async () => {
  for (const option of [{ width: '80', number: '2', scale: '0.5' }, { width: 20.5, number: 2.5, scale: 1 }]) {
    const env = await setup(option)
    env.metadata()
    for (let index = 0; index < Math.ceil(Number(option.number)); index++) {
      env.seeked()
      env.finish(index)
    }
    assert.equal(env.updates.length, Math.ceil(Number(option.number)))
    assert.equal(env.updates[0].width, option.width)
    assert.equal(env.updates[0].number, option.number)
    assert.equal(env.updates[0].scale, option.scale)
    assert.equal(env.canvases[0].width, Math.trunc(Number(option.width) * 10))
    assertClosed(env)
    env.art.emit('destroy')
    assert.equal(env.urls.size, 0)
  }
})

test('Auto-thumbnail candidate parameter getters cannot start extraction after destroying the host', async () => {
  const env = autoThumbnailEnvironment(implementation)
  const option = { get width() {
    env.art.emit('destroy')
    return 80
  } }
  await env.factory(option)(env.art)
  env.art.emit('video:loadedmetadata')
  assert.equal(env.videos.length, 0)
  assert.equal(env.canvases.length, 0)
  assert([...env.listeners.values()].every(set => set.size === 0))
})

test('Auto-thumbnail candidate media dimension getters cannot allocate after cancellation', async () => {
  const env = await setup()
  Object.defineProperty(env.videos[0], 'videoWidth', { get() {
    env.art.emit('destroy')
    return 1920
  } })
  env.metadata()
  assert.equal(env.canvases.length, 0)
  assertClosed(env)
})

test('Auto-thumbnail candidate explicit URL does not read the fallback options getter', async () => {
  const env = autoThumbnailEnvironment(implementation)
  Object.defineProperty(env.art, 'option', { get() {
    throw new Error('Explicit URL must not read fallback options')
  } })
  await env.factory({ url: 'explicit.mp4', number: 1 })(env.art)
  env.art.emit('video:loadedmetadata')
  assert.equal(env.videos.length, 1)
  assert.equal(env.videos[0].src, 'explicit.mp4')
  assert.equal(env.warnings.length, 0)
  env.art.emit('destroy')
})

test('Auto-thumbnail candidate keeps the metadata duration snapshot for frame times', async () => {
  const env = await setup({ width: 80, number: 2 })
  env.metadata()
  env.videos[0].duration = 240
  env.seeked()
  env.finish()
  assert.deepEqual(env.operations.filter(item => item.name === 'seek').map(item => item.value), [0, 60])
  env.art.emit('destroy')
})

test('Auto-thumbnail candidate hides an attached decoder at intrinsic dimensions without playback', async () => {
  const env = await setup()
  const video = env.videos[0]
  assert.equal(env.attached.has(video), true)
  assert.equal(video['aria-hidden'], 'true')
  assert.equal(video.tabIndex, -1)
  assert.equal(video.muted, true)
  assert.match(video.style.cssText, /visibility:hidden/)
  assert.doesNotMatch(video.style.cssText, /display:none|width:1px|height:1px/)
  env.metadata()
  assert.equal(video.width, 1920)
  assert.equal(video.height, 1080)
  assert.equal(video.style.width, '1920px')
  assert.equal(video.style.height, '1080px')
  env.art.emit('destroy')
  assertClosed(env)
})

for (const phase of ['beforeAppend', 'afterAppend']) {
  test(`Auto-thumbnail candidate ${phase} reentry cannot leave an attached decoder`, async () => {
    const env = autoThumbnailEnvironment(implementation)
    await env.factory({})(env.art)
    env.controls[phase] = () => env.art.emit('destroy')
    env.art.emit('video:loadedmetadata')
    assert.equal(env.attached.size, 0)
    assert.equal(env.videos[0].src, undefined)
    assertClosed(env)
    assert.equal(env.warnings.length, 0)
  })
}

test('Auto-thumbnail candidate failed insertion removes a partially attached decoder', async () => {
  const env = autoThumbnailEnvironment(implementation)
  const failure = new Error('Insertion observer failed')
  env.controls.afterAppend = () => {
    throw failure
  }
  await env.factory({})(env.art)
  env.art.emit('video:loadedmetadata')
  assert.equal(env.attached.size, 0)
  assert.equal(env.videos[0].src, undefined)
  assert.equal(env.warnings[0][1], failure)
  assertClosed(env)
  env.art.emit('destroy')
})

test('Auto-thumbnail candidate decoder removal still runs after load throws', async () => {
  const env = await setup()
  const failure = new Error('Decoder reset failed')
  env.videos[0].load = () => {
    throw failure
  }
  env.art.emit('destroy')
  assert.equal(env.attached.size, 0)
  assert.equal(env.videos[0].src, undefined)
  assert.equal(env.warnings[0][1], failure)
  assert([...env.listeners.values()].every(set => set.size === 0))
})

test('Auto-thumbnail candidate ignores a stale seeked event while a new seek is in progress', async () => {
  const env = await setup()
  env.metadata()
  env.videos[0].seeking = true
  env.seeked()
  assert.equal(env.blobs.length, 0)
  env.videos[0].seeking = false
  env.seeked()
  assert.equal(env.blobs.length, 1)
  env.art.emit('destroy')
  assertClosed(env)
})

test('Auto-thumbnail candidate retries a completed seek at the wrong time before drawing', async () => {
  const env = await setup()
  env.metadata()
  env.videos[0].timeOffset = 1
  env.seeked()
  assert.equal(env.blobs.length, 0)
  assert.deepEqual(env.operations.filter(item => item.name === 'seek').map(item => item.value), [0, 0])
  env.videos[0].timeOffset = 0
  env.seeked()
  assert.equal(env.blobs.length, 1)
  env.art.emit('destroy')
  assertClosed(env)
})

test('Auto-thumbnail candidate bounds incorrect seek retries and preserves its last usable preview', async () => {
  const env = await setup()
  env.metadata()
  env.seeked()
  env.finish()
  const previous = env.art.thumbnails
  env.videos[0].timeOffset = -60
  for (let index = 0; index < 5; index++) env.seeked()
  assert.equal(env.blobs.length, 1)
  assert.equal(env.art.thumbnails, previous)
  assert.equal(env.urls.size, 1)
  assert.equal(env.operations.filter(item => item.name === 'seek').length, 5)
  assert.equal(env.warnings.length, 1)
  assertClosed(env)
  env.art.emit('destroy')
  assert.equal(env.urls.size, 0)
})

test('Auto-thumbnail candidate seek-time getters cannot draw after synchronous destruction', async () => {
  const env = await setup()
  env.metadata()
  Object.defineProperty(env.videos[0], 'timeOffset', { get() {
    env.art.emit('destroy')
    return 0
  } })
  env.seeked()
  assert.equal(env.blobs.length, 0)
  assertClosed(env)
})
