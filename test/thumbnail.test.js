import assert from 'node:assert/strict'
// eslint-disable-next-line test/no-import-node-test -- Historical extraction and resource baseline.
import test from 'node:test'
import { thumbnailEnvironment, thumbnailHistorical } from './helpers/thumbnail.js'

const flush = () => new Promise(resolve => setImmediate(resolve))
function observe(promise) {
  const state = { status: 'pending' }
  promise.then(value => Object.assign(state, { status: 'resolved', value }), error => Object.assign(state, { status: 'rejected', error }))
  return state
}
async function tick(env) {
  const next = env.timers.entries().next().value
  assert(next, 'Expected a scheduled timer')
  env.timers.delete(next[0])
  next[1].callback()
  await flush()
  return next[1].delay
}
async function frame(env, legacy) {
  await flush()
  if (legacy) {
    await tick(env)
  }
  else {
    assert.equal(typeof env.instance.video.oncanplay, 'function')
    env.instance.video.oncanplay()
    await flush()
  }
}

for (const implementation of thumbnailHistorical()) {
  async function setup(options = {}) {
    const env = thumbnailEnvironment(implementation)
    env.instance = new env.Factory({ fileInput: new env.Element('input'), number: 10, width: 40, height: 30, column: 3, ...options })
    env.instance.loadVideo({ name: 'first.mp4', type: 'video/mp4' })
    if (implementation.legacy)
      await tick(env)
    env.instance.video.duration = 100
    return env
  }
  async function complete(env, state, count = 10) {
    for (let index = 0; index < count; index++)
      await frame(env, implementation.legacy)
    if (implementation.legacy) {
      assert.equal(state.status, 'pending')
      assert.equal(await tick(env), env.instance.option.delay * 2)
    }
    await flush()
    assert.equal(state.status, 'resolved')
    assert.equal(state.value, undefined)
  }

  test(`Thumbnail ${implementation.name}: sequential extraction, progress, done and rerun`, async () => {
    const env = await setup({ begin: 10, end: 90 })
    const seen = []
    env.instance.on('canvas', canvas => seen.push(['canvas', canvas.width, canvas.height, env.instance.processing]))
    env.instance.on('update', (url, progress) => seen.push(['update', url, progress, env.instance.processing]))
    env.instance.on('done', () => seen.push(['done', env.instance.processing]))
    const state = observe(env.instance.start())
    assert.equal(env.instance.duration, 80)
    assert.equal(env.instance.density, 0.125)
    const height = implementation.legacy ? 30 : 22.5
    assert.deepEqual(seen, [['canvas', 120, height * 4 + 30, false]])
    await complete(env, state)
    assert.deepEqual(seen.filter(item => item[0] === 'update').map(item => [item[2], item[3]]), Array.from({ length: 10 }, (_, i) => [(i + 1) / 10, true]))
    assert.deepEqual(seen.at(-1), ['done', false])
    const draws = env.operations.filter(item => item.name === 'drawImage')
    assert.equal(draws.length, 10)
    assert.deepEqual(draws.map(item => item.args.slice(1)), Array.from({ length: 10 }, (_, i) => [i % 3 * 40, Math.floor(i / 3) * height, 40, height]))
    assert.equal(env.instance.video.currentTime, 86)
    assert.equal(env.operations.filter(item => item.name === 'revokeURL').length, 9)
    const second = observe(env.instance.start())
    await complete(env, second)
    assert.equal(seen.filter(item => item[0] === 'done').length, 2)
    env.instance.destroy()
    assert.equal(env.operations.filter(item => item.name === 'revokeURL').length, 21)
  })

  test(`Thumbnail ${implementation.name}: range and density guards emit before throwing`, async () => {
    for (const [options, pattern] of [[{ begin: 50, end: 20 }, /End time/], [{ begin: 1000 }, /End time/], [{ begin: 0, end: 5 }, /density/]]) {
      const env = await setup(options)
      const errors = []
      env.instance.on('error', message => errors.push(message))
      assert.throws(() => env.instance.start(), pattern)
      assert.equal(errors.length, 1)
      assert.equal(env.instance.processing, false)
      assert.equal(env.operations.filter(item => item.name === 'drawImage').length, 0)
      env.instance.destroy()
    }
    const env = await setup({ begin: -20, end: 200 })
    const state = observe(env.instance.start())
    assert.equal(env.instance.option.begin, 0)
    assert.equal(env.instance.option.end, 100)
    await complete(env, state)
  })

  test(`Thumbnail ${implementation.name}: active duplicate start/download reject without replacing extraction`, async () => {
    const env = await setup()
    const state = observe(env.instance.start())
    await frame(env, implementation.legacy)
    assert.throws(() => env.instance.start(), /task in progress/)
    assert.throws(() => env.instance.download(), /task in progress/)
    await complete(env, state, 9)
  })

  test(`Thumbnail ${implementation.name}: blob callback gates subsequent frames`, async () => {
    const env = await setup()
    env.controls.deferBlobs = true
    const state = observe(env.instance.start())
    await frame(env, implementation.legacy)
    assert.equal(env.blobs.length, 1)
    assert.equal(env.operations.filter(item => item.name === 'drawImage').length, 1)
    assert.equal(env.instance.video.currentTime, 5)
    assert.equal(state.status, 'pending')
    env.controls.deferBlobs = false
    env.blobs.shift()({ kind: 'image/png' })
    await flush()
    await complete(env, state, 9)
  })

  test(`Thumbnail ${implementation.name}: null blob callback throws outside the unsettled extraction promise`, async () => {
    const env = await setup()
    env.controls.deferBlobs = true
    const state = observe(env.instance.start())
    await frame(env, implementation.legacy)
    assert.throws(() => env.blobs.shift()(null), /Blob required/)
    await flush()
    assert.equal(state.status, 'pending')
    assert.equal(env.instance.processing, true)
    env.instance.destroy()
    await flush()
    assert.equal(state.status, 'pending')
  })

  test(`Thumbnail ${implementation.name}: late blob after destroy creates an unowned URL and continues work`, async () => {
    const env = await setup()
    env.controls.deferBlobs = true
    const events = []
    env.instance.on('destroy', () => events.push('destroy'))
    env.instance.on('update', () => events.push('update'))
    const state = observe(env.instance.start())
    await frame(env, implementation.legacy)
    env.instance.destroy()
    env.blobs.shift()({ kind: 'image/png' })
    await flush()
    assert.deepEqual(events, ['destroy', 'update'])
    assert.equal(state.status, 'pending')
    assert.equal(env.instance.video.parentNode, null)
    assert.equal(env.instance.processing, true)
    const last = env.operations.filter(item => item.name === 'createURL').at(-1).url
    assert.equal(env.operations.some(item => item.name === 'revokeURL' && item.url === last), false)
    assert(implementation.legacy ? env.timers.size > 0 : typeof env.instance.video.oncanplay === 'function')
  })

  test(`Thumbnail ${implementation.name}: file replacement leaks old URL and preserves the running task`, async () => {
    const env = await setup()
    const first = env.instance.videoUrl
    const state = observe(env.instance.start())
    await frame(env, implementation.legacy)
    const next = { name: 'second.mp4', type: 'video/mp4' }
    env.instance.loadVideo(next)
    assert.notEqual(env.instance.videoUrl, first)
    assert.equal(env.instance.file, next)
    assert.equal(env.instance.processing, true)
    assert.equal(state.status, 'pending')
    env.instance.destroy()
    assert.equal(env.operations.some(item => item.name === 'revokeURL' && item.url === first), false)
    assert.equal(env.instance.processing, true)
  })

  test(`Thumbnail ${implementation.name}: missing metadata start and destruction do not have owned cancellation`, async () => {
    const env = await setup()
    env.instance.video.duration = 0
    const state = observe(env.instance.start())
    assert.equal(env.timers.size, 1)
    env.instance.destroy()
    assert.equal(env.timers.size, 1)
    assert.equal(await tick(env), 1000)
    assert.equal(state.status, implementation.legacy ? 'rejected' : 'pending')
    if (implementation.legacy)
      assert.equal(state.error.name, 'TypeError')
    else
      assert.equal(env.timers.size, 1)
  })

  test(`Thumbnail ${implementation.name}: changed input and generated wrapper remain unowned`, async () => {
    const env = await setup()
    const first = env.instance.option.fileInput
    const wrapper = new env.Element('div')
    env.instance.setup({ fileInput: wrapper })
    assert.equal(wrapper.children.length, 1)
    assert.equal(env.instance.option.fileInput.handlers.size, 0)
    assert.equal(first.handlers.get('change').size, 1)
    env.instance.destroy()
    assert.equal(first.handlers.get('change').size, 1)
    assert.equal(wrapper.children.length, 1)
    assert.equal(wrapper.style.position, 'relative')
  })

  test(`Thumbnail ${implementation.name}: currentTime setter failure rejects and releases processing`, async () => {
    const env = await setup()
    const failure = new Error('seek assignment failed')
    const errors = []
    env.instance.on('error', message => errors.push(message))
    Object.defineProperty(env.instance.video, 'currentTime', {
      get() { return 0 },
      set() {
        throw failure
      },
    })
    const state = observe(env.instance.start())
    await flush()
    assert.equal(state.status, 'rejected')
    assert.equal(state.error, failure)
    assert.equal(env.instance.processing, false)
    assert.deepEqual(errors, ['seek assignment failed'])
    env.instance.destroy()
  })

  test(`Thumbnail ${implementation.name}: throwing done listener rejects with historical error multiplicity`, async () => {
    const env = await setup()
    const failure = new Error('done listener failed')
    const errors = []
    env.instance.on('error', message => errors.push(message))
    env.instance.on('done', () => {
      throw failure
    })
    const state = observe(env.instance.start())
    for (let index = 0; index < 10; index++)
      await frame(env, implementation.legacy)
    if (implementation.legacy)
      await tick(env)
    await flush()
    assert.equal(state.status, 'rejected')
    assert.equal(state.error, failure)
    assert.equal(env.instance.processing, false)
    assert.deepEqual(errors, Array.from({ length: implementation.legacy ? 2 : 1 }).fill('done listener failed'))
    env.instance.destroy()
  })

  test(`Thumbnail ${implementation.name}: update listener failure in deferred callback leaves work pending`, async () => {
    const env = await setup()
    env.controls.deferBlobs = true
    const failure = new Error('update listener failed')
    env.instance.on('update', () => {
      throw failure
    })
    const state = observe(env.instance.start())
    await frame(env, implementation.legacy)
    assert.throws(() => env.blobs.shift()({ kind: 'image/png' }), error => error === failure)
    await flush()
    assert.equal(state.status, 'pending')
    assert.equal(env.instance.processing, true)
    assert.equal(typeof env.instance.thumbnailUrl, 'string')
    env.instance.destroy()
    assert.equal(state.status, 'pending')
  })
}
