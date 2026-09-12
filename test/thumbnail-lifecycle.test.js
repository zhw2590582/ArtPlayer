import assert from 'node:assert/strict'
// eslint-disable-next-line test/no-import-node-test -- Candidate regressions also run against frozen workspace main.
import test from 'node:test'
import { thumbnailCandidate, thumbnailEnvironment } from './helpers/thumbnail.js'

const implementation = await thumbnailCandidate()
const flush = () => new Promise(resolve => setImmediate(resolve))
function dispatch(video, name) {
  for (const callback of [...(video.handlers.get(name) || [])])
    callback({ target: video, type: name })
}
function observe(promise) {
  const state = { status: 'pending' }
  promise.then(value => Object.assign(state, { status: 'resolved', value }), error => Object.assign(state, { status: 'rejected', error }))
  return state
}
function setup(ready = true) {
  const env = thumbnailEnvironment(implementation)
  env.instance = new env.Factory({ fileInput: new env.Element('input'), number: 10, width: 40, column: 3 })
  env.instance.loadVideo({ name: 'first.mp4', type: 'video/mp4' })
  if (ready) {
    env.instance.video.duration = 100
    dispatch(env.instance.video, 'loadedmetadata')
  }
  return env
}
async function firstFrame(env) {
  await flush()
  assert.equal(typeof env.instance.video.oncanplay, 'function')
  env.instance.video.oncanplay()
  await flush()
}
async function complete(env, state, count = 10) {
  for (let index = 0; index < count; index++)
    await firstFrame(env)
  assert.equal(state.status, 'resolved')
  assert.equal(state.value, undefined)
}
function cancelled(state) {
  assert.equal(state.status, 'rejected')
  assert.equal(state.error.name, 'AbortError')
}

test('Thumbnail owned extraction preserves progress, event order, repeat runs and prior oncanplay', async () => {
  const env = setup()
  const previous = () => {}
  env.instance.video.oncanplay = previous
  const events = []
  for (const name of ['canvas', 'update', 'done'])
    env.instance.on(name, (value, progress) => events.push([name, progress, env.instance.processing]))
  const state = observe(env.instance.start())
  assert.deepEqual(events[0], ['canvas', undefined, false])
  await complete(env, state)
  assert.deepEqual(events.filter(item => item[0] === 'update').map(item => item.slice(1)), Array.from({ length: 10 }, (_, i) => [(i + 1) / 10, true]))
  assert.deepEqual(events.at(-1), ['done', undefined, false])
  assert.equal(env.instance.video.oncanplay, previous)
  assert.equal(env.instance.video.handlers.get('seeked')?.size || 0, 0)
  const second = observe(env.instance.start())
  await complete(env, second)
  env.instance.destroy()
  assert.deepEqual(env.operations.filter(item => item.name === 'createURL').map(item => item.url).sort(), env.operations.filter(item => item.name === 'revokeURL').map(item => item.url).sort())
})

test('Thumbnail cancellation owns both metadata polling and a not-yet-started frame', async () => {
  for (const ready of [false, true]) {
    const env = setup(ready)
    const state = observe(env.instance.start())
    env.instance.destroy()
    await flush()
    cancelled(state)
    assert.equal(env.timers.size, 0)
    assert.equal(env.instance.processing, false)
    assert.equal(env.operations.filter(item => item.name === 'drawImage').length, 0)
    for (const callbacks of env.instance.video.handlers.values())
      assert.equal(callbacks.size, 0)
  }
})

test('Thumbnail metadata event resumes extraction and duplicate pending start is rejected', async () => {
  const env = setup(false)
  const state = observe(env.instance.start())
  assert.throws(() => env.instance.start(), /task in progress/)
  env.instance.video.duration = 100
  dispatch(env.instance.video, 'loadedmetadata')
  assert.equal(env.timers.size, 0)
  await complete(env, state)
  env.instance.destroy()
})

test('Thumbnail native media errors settle waiting and active jobs once', async () => {
  for (const ready of [false, true]) {
    const env = setup(ready)
    const errors = []
    env.instance.on('error', message => errors.push(message))
    const state = observe(env.instance.start())
    await flush()
    env.instance.video.error = { code: 3 }
    dispatch(env.instance.video, 'error')
    await flush()
    assert.equal(state.status, 'rejected')
    assert.match(state.error.message, /media error 3/)
    assert.deepEqual(errors, ['Unable to load video: media error 3'])
    assert.equal(env.instance.processing, false)
    assert.equal(env.timers.size, 0)
    env.instance.destroy()
  }
})

test('Thumbnail idle native errors report without creating a task and stale source errors are ignored', () => {
  const env = setup(false)
  const oldError = [...(env.instance.video.handlers.get('error') || [])][0]
  const errors = []
  env.instance.on('error', message => errors.push(message))
  env.instance.loadVideo({ name: 'second.mp4', type: 'video/mp4' })
  assert.equal(typeof oldError, 'function')
  oldError()
  assert.deepEqual(errors, [])
  env.instance.video.error = { code: 4 }
  dispatch(env.instance.video, 'error')
  dispatch(env.instance.video, 'error')
  assert.deepEqual(errors, ['Unable to load video: media error 4'])
  env.instance.destroy()
})

test('Thumbnail destroy during native encoding rejects immediately and ignores the late Blob', async () => {
  const env = setup()
  env.controls.deferBlobs = true
  const updates = []
  env.instance.on('update', value => updates.push(value))
  const state = observe(env.instance.start())
  await firstFrame(env)
  env.instance.destroy()
  await flush()
  cancelled(state)
  const count = env.operations.filter(item => item.name === 'createURL').length
  env.blobs.shift()({ kind: 'image/png' })
  await flush()
  assert.equal(env.operations.filter(item => item.name === 'createURL').length, count)
  assert.deepEqual(updates, [])
  assert.equal(env.instance.video.handlers.get('seeked')?.size || 0, 0)
})

test('Thumbnail switching source cancels the old encoding without cancelling the next job', async () => {
  const env = setup()
  env.controls.deferBlobs = true
  const oldUrl = env.instance.videoUrl
  const oldState = observe(env.instance.start())
  await firstFrame(env)
  const late = env.blobs.shift()
  env.instance.loadVideo({ name: 'second.mp4', type: 'video/mp4' })
  dispatch(env.instance.video, 'loadedmetadata')
  const next = observe(env.instance.start())
  await flush()
  cancelled(oldState)
  late({ kind: 'late-png' })
  assert.equal(env.instance.processing, true)
  assert.equal(env.instance.thumbnailUrl, undefined)
  assert(env.operations.some(item => item.name === 'revokeURL' && item.url === oldUrl))
  env.controls.deferBlobs = false
  await complete(env, next)
  env.instance.destroy()
})

for (const failure of ['null-blob', 'draw', 'toBlob', 'seek', 'update-listener']) {
  test(`Thumbnail ${failure} failure rejects instead of abandoning the extraction promise`, async () => {
    const env = setup()
    env.controls.deferBlobs = true
    const error = new Error(failure)
    const errors = []
    env.instance.on('error', message => errors.push(message))
    if (failure === 'draw')
      env.context2D.drawImage = () => { throw error }
    if (failure === 'toBlob')
      env.Element.prototype.toBlob = () => { throw error }
    if (failure === 'seek')
      Object.defineProperty(env.instance.video, 'currentTime', { get: () => 0, set() { throw error } })
    if (failure === 'update-listener')
      env.instance.on('update', () => { throw error })
    const state = observe(env.instance.start())
    if (failure === 'seek')
      await flush()
    else
      await firstFrame(env)
    if (failure === 'null-blob' || failure === 'update-listener')
      env.blobs.shift()(failure === 'null-blob' ? null : { kind: 'image/png' })
    await flush()
    assert.equal(state.status, 'rejected')
    if (failure === 'null-blob')
      assert.match(state.error.message, /Unable to create thumbnail/)
    else
      assert.equal(state.error, error)
    assert.equal(errors.length, 1)
    assert.equal(env.instance.processing, false)
    env.instance.destroy()
  })
}

test('Thumbnail duplicate readiness and duplicate Blob callback cannot duplicate a frame', async () => {
  const env = setup()
  env.controls.deferBlobs = true
  const state = observe(env.instance.start())
  await flush()
  const ready = env.instance.video.oncanplay
  ready()
  ready()
  assert.equal(env.blobs.length, 1)
  const blob = env.blobs.shift()
  const updates = []
  env.instance.on('update', (url, progress) => updates.push(progress))
  blob({ kind: 'image/png' })
  blob({ kind: 'image/png' })
  assert.deepEqual(updates, [0.1])
  env.controls.deferBlobs = false
  await complete(env, state, 9)
  env.instance.destroy()
})

test('Thumbnail canvas listener destruction never starts a frame', async () => {
  const env = setup()
  const updates = []
  env.instance.on('canvas', () => env.instance.destroy())
  env.instance.on('update', () => updates.push('update'))
  const state = observe(env.instance.start())
  await flush()
  cancelled(state)
  assert.deepEqual(updates, [])
  assert.equal(env.instance.processing, false)
  assert.equal(env.operations.filter(item => item.name === 'drawImage').length, 0)
})

test('Thumbnail file callback destruction and nested load cannot overwrite the latest source', () => {
  for (const action of ['destroy', 'replace']) {
    const env = setup()
    const videos = []
    env.instance.on('video', () => videos.push(env.instance.file.name))
    env.instance.once('file', () => {
      if (action === 'destroy')
        env.instance.destroy()
      else
        env.instance.loadVideo({ name: 'latest.mp4', type: 'video/mp4' })
    })
    env.instance.loadVideo({ name: 'outer.mp4', type: 'video/mp4' })
    assert.deepEqual(videos, action === 'destroy' ? [] : ['latest.mp4'])
    if (action === 'replace')
      assert.equal(env.instance.video.src, env.instance.videoUrl)
    env.instance.destroy()
    const created = env.operations.filter(item => item.name === 'createURL').map(item => item.url)
    const revoked = new Set(env.operations.filter(item => item.name === 'revokeURL').map(item => item.url))
    assert(created.every(url => revoked.has(url)))
  }
})

test('Thumbnail file callback start waits for metadata of the new source', async () => {
  const env = setup()
  let state
  env.instance.once('file', () => {
    state = observe(env.instance.start())
  })
  env.instance.loadVideo({ name: 'second.mp4', type: 'video/mp4' })
  await flush()
  assert.equal(env.instance.processing, false)
  assert.equal(env.operations.filter(item => item.name === 'drawImage').length, 0)
  dispatch(env.instance.video, 'loadedmetadata')
  await complete(env, state)
  env.instance.destroy()
})

test('Thumbnail error listener failure rejects with its error after resources are detached', async () => {
  const env = setup()
  env.controls.deferBlobs = true
  const error = new Error('error listener failed')
  env.instance.on('error', () => {
    throw error
  })
  const state = observe(env.instance.start())
  await firstFrame(env)
  env.blobs.shift()(null)
  await flush()
  assert.equal(state.error, error)
  assert.equal(env.instance.processing, false)
  env.instance.destroy()
})

test('Thumbnail done listener may start a new task without old completion clearing it', async () => {
  const env = setup()
  let second
  env.instance.once('done', () => {
    second = observe(env.instance.start())
  })
  const first = observe(env.instance.start())
  await complete(env, first)
  assert.equal(env.instance.processing, true)
  await complete(env, second)
  env.instance.destroy()
})

test('Thumbnail private URL ownership survives public URL replacement and closed calls allocate nothing', async () => {
  const env = setup()
  const first = observe(env.instance.start())
  await complete(env, first)
  const owned = env.operations.filter(item => item.name === 'createURL').map(item => item.url)
  env.instance.videoUrl = 'blob:external-video'
  env.instance.thumbnailUrl = 'blob:external-sheet'
  env.instance.destroy()
  const revoked = new Set(env.operations.filter(item => item.name === 'revokeURL').map(item => item.url))
  assert(owned.every(url => revoked.has(url)))
  const after = observe(env.instance.start())
  assert.equal(env.instance.download(), env.instance)
  await flush()
  cancelled(after)
  assert.equal(env.timers.size, 0)
  assert.equal(env.body.children.length, 0)
})

test('Thumbnail input attachment reentrant destroy cannot publish new input resources', () => {
  const env = setup()
  const wrapper = new env.Element('div')
  const append = wrapper.appendChild
  wrapper.appendChild = function (child) {
    append.call(this, child)
    env.instance.destroy()
    return child
  }
  assert.throws(() => env.instance.setup({ fileInput: wrapper }), error => error.name === 'AbortError')
  assert.equal(wrapper.children.length, 0)
  assert.equal(env.body.children.length, 0)
})

test('Thumbnail nested input setup wins without outer cleanup overwriting its option', () => {
  const env = setup()
  const target = env.instance.option.fileInput
  const second = new env.Element('input')
  const latest = new env.Element('input')
  const remove = target.removeEventListener
  let nested = false
  target.removeEventListener = function (name, callback) {
    remove.call(this, name, callback)
    if (!nested) {
      nested = true
      env.instance.setup({ fileInput: latest })
    }
  }
  env.instance.setup({ fileInput: second })
  assert.equal(env.instance.option.fileInput, latest)
  for (const callbacks of second.handlers.values())
    assert.equal(callbacks.size, 0)
  assert.equal(latest.handlers.get('change').size, 1)
  env.instance.destroy()
})

test('Thumbnail source and job listener registration cannot revive resources after reentrant destroy', async () => {
  for (const stage of ['source', 'job']) {
    const env = setup(false)
    const add = env.instance.video.addEventListener
    let once = false
    env.instance.video.addEventListener = function (name, callback) {
      if (!once) {
        once = true
        env.instance.destroy()
      }
      add.call(this, name, callback)
    }
    if (stage === 'source') {
      env.instance.loadVideo({ name: 'second.mp4', type: 'video/mp4' })
    }
    else {
      const state = observe(env.instance.start())
      await flush()
      cancelled(state)
    }
    for (const callbacks of env.instance.video.handlers.values())
      assert.equal(callbacks.size, 0)
    assert.equal(env.body.children.length, 0)
  }
})

test('Thumbnail timer creation reentrant destroy clears the newly returned timer handle', async () => {
  const env = setup(false)
  const schedule = env.box.setTimeout
  env.box.setTimeout = (callback, delay) => {
    env.instance.destroy()
    return schedule(callback, delay)
  }
  const state = observe(env.instance.start())
  await flush()
  cancelled(state)
  assert.equal(env.timers.size, 0)
})

test('Thumbnail URL creation reentrant load preserves the newer source and revokes the superseded URL', () => {
  const env = setup()
  const create = env.box.URL.createObjectURL
  let once = false
  env.box.URL.createObjectURL = (file) => {
    if (!once) {
      once = true
      env.instance.loadVideo({ name: 'latest.mp4', type: 'video/mp4' })
    }
    return create(file)
  }
  env.instance.loadVideo({ name: 'outer.mp4', type: 'video/mp4' })
  assert.equal(env.instance.file.name, 'latest.mp4')
  assert.equal(env.instance.video.src, env.instance.videoUrl)
  env.instance.destroy()
  const created = env.operations.filter(item => item.name === 'createURL').map(item => item.url)
  const revoked = new Set(env.operations.filter(item => item.name === 'revokeURL').map(item => item.url))
  assert(created.every(url => revoked.has(url)))
})

test('Thumbnail start before the first file retains its legacy wait-for-selection behavior', async () => {
  const env = thumbnailEnvironment(implementation)
  env.instance = new env.Factory({ fileInput: new env.Element('input'), number: 10 })
  const state = observe(env.instance.start())
  env.instance.loadVideo({ name: 'first.mp4', type: 'video/mp4' })
  env.instance.video.duration = 100
  dispatch(env.instance.video, 'loadedmetadata')
  await complete(env, state)
  env.instance.destroy()
})

test('Thumbnail destroy clears the media source and resets the decoder even when pause throws', () => {
  const env = setup()
  const failure = new Error('pause failed')
  const events = []
  env.instance.video.pause = () => {
    events.push('pause')
    throw failure
  }
  env.instance.video.removeAttribute = (name) => {
    events.push(`remove:${name}`)
    delete env.instance.video[name]
  }
  env.instance.video.load = () => events.push('load')
  assert.throws(() => env.instance.destroy(), error => error === failure)
  assert.deepEqual(events, ['pause', 'remove:src', 'load'])
  assert.equal(env.instance.video.src, undefined)
  assert.equal(env.instance.video.parentNode, null)
  assert.equal(env.operations.filter(item => item.name === 'revokeURL').length, 1)
})
