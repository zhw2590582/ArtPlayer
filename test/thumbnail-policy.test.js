import assert from 'node:assert/strict'
// eslint-disable-next-line test/no-import-node-test -- Approved runtime policy compatibility.
import test from 'node:test'
import { thumbnailCandidate, thumbnailEnvironment, thumbnailHistorical } from './helpers/thumbnail.js'

const candidate = await thumbnailCandidate()
const flush = () => new Promise(resolve => setImmediate(resolve))
function create(option = {}) {
  const env = thumbnailEnvironment(candidate)
  env.input = new env.Element('input')
  env.tool = new env.Factory({ fileInput: env.input, number: 10, width: 40, height: 25, ...option })
  return env
}
function tick(env, delay) {
  const selected = [...env.timers].find(([, timer]) => Object.is(timer.delay, delay))
  assert(selected, `Expected owned timer for ${delay} ms`)
  env.timers.delete(selected[0])
  selected[1].callback()
}
function ready(env) {
  env.tool.video.duration = 100
  env.tool.video.readyState = 2
  env.tool.video.videoWidth = 160
  env.tool.video.videoHeight = 90
  env.tool.loadVideo({ name: 'sample.mp4', type: 'video/mp4' })
  for (const fn of env.tool.video.handlers.get('loadedmetadata'))
    fn()
}

test('Thumbnail root defaults match the recovered published profile, including key order', () => {
  const actual = create()
  const old = thumbnailEnvironment(thumbnailHistorical().find(item => item.legacy))
  assert.deepEqual(Object.keys(actual.Factory.DEFAULTS), Object.keys(old.Factory.DEFAULTS))
  for (const key of Object.keys(old.Factory.DEFAULTS))
    assert.equal(actual.Factory.DEFAULTS[key], old.Factory.DEFAULTS[key])
  actual.tool.destroy()
})

test('Thumbnail published policy validates and clamps delay/height while workspace preserves its inputs', () => {
  const published = create({ height: 2, delay: 4000 })
  assert.equal(published.tool.option.height, 10)
  assert.equal(published.tool.option.delay, 1000)
  assert.throws(() => published.tool.setup({ delay: 'bad' }), /delay.*number/)
  assert.throws(() => published.tool.setup({ height: 'bad' }), /height.*number/)
  assert.throws(() => published.tool.setup({ compatibility: 'unknown' }), /compatibility/)
  const workspace = create({ compatibility: 'workspace-4.4', height: 2, delay: 4000 })
  assert.equal(workspace.tool.option.height, 2)
  assert.equal(workspace.tool.option.delay, 4000)
  published.tool.destroy()
  workspace.tool.destroy()
})

for (const compatibility of [undefined, 'published-3.5', 'workspace-4.4']) {
  test(`Thumbnail ${compatibility || 'default'} preserves file/video timing and input reset policy`, () => {
    const env = create({ compatibility, delay: 25 })
    const seen = []
    env.input.files = [{ name: 'sample.mp4', type: 'video/mp4' }]
    env.input.value = 'selected'
    env.tool.on('file', () => seen.push(['file', env.tool.video.src]))
    env.tool.on('video', video => seen.push(['video', video.src]))
    env.tool.inputChange({ target: env.input })
    const workspace = compatibility === 'workspace-4.4'
    assert.deepEqual(seen, workspace ? [['file', undefined], ['video', env.tool.videoUrl]] : [['file', undefined]])
    assert.equal(env.input.value, workspace ? '' : 'selected')
    if (!workspace) {
      tick(env, 25)
      assert.deepEqual(seen[1], ['video', env.tool.videoUrl])
    }
    env.tool.destroy()
    assert.equal(env.timers.size, 0)
  })
}

test('Thumbnail default extraction keeps configured height and requires delay plus frame readiness', async () => {
  const env = create({ delay: 25 })
  ready(env)
  tick(env, 25)
  env.tool.video.seeking = true
  const work = env.tool.start()
  await flush()
  assert.equal(env.tool.option.height, 25)
  tick(env, 25)
  assert.equal(env.operations.filter(op => op.name === 'drawImage').length, 0)
  env.tool.video.seeking = false
  env.tool.video.oncanplay()
  await flush()
  assert.equal(env.operations.filter(op => op.name === 'drawImage').length, 1)
  env.tool.destroy()
  await assert.rejects(work, { name: 'AbortError' })
  assert.equal(env.timers.size, 0)
})

test('Thumbnail delayed video notifications are cancelled by replacement, failure and destroy', () => {
  for (const action of ['replace', 'error', 'destroy']) {
    const env = create({ delay: 25 })
    const seen = []
    env.tool.on('video', () => seen.push(env.tool.file.name)).on('error', () => {})
    env.tool.loadVideo({ name: 'old.mp4', type: 'video/mp4' })
    const stale = [...env.timers.values()].find(timer => timer.delay === 25)
    assert(stale)
    if (action === 'replace') {
      env.tool.loadVideo({ name: 'new.mp4', type: 'video/mp4' })
    }
    else if (action === 'error') {
      for (const fn of env.tool.video.handlers.get('error'))
        fn()
    }
    else {
      env.tool.destroy()
    }
    stale.callback()
    assert.deepEqual(seen, [])
    if (action === 'replace') {
      tick(env, 25)
      assert.deepEqual(seen, ['new.mp4'])
    }
    env.tool.destroy()
    assert.equal(env.timers.size, 0)
  }
})

test('Thumbnail numeric NaN delay keeps the historical asynchronous timer boundary', () => {
  const env = create({ delay: Number.NaN })
  let events = 0
  env.tool.on('video', () => events++)
  env.tool.loadVideo({ name: 'sample.mp4', type: 'video/mp4' })
  assert.equal(events, 0)
  tick(env, Number.NaN)
  assert.equal(events, 1)
  env.tool.destroy()
})

for (const finish of ['complete', 'destroy', 'replace', 'error']) {
  test(`Thumbnail default final delay owns completion and ${finish} settlement`, async () => {
    const env = create({ delay: 25 })
    ready(env)
    tick(env, 25)
    let done = 0
    const updates = []
    env.tool.on('done', () => done++).on('update', (_, progress) => updates.push(progress))
    const work = env.tool.start()
    await flush()
    for (let frame = 0; frame < 10; frame++) {
      tick(env, 25)
      await flush()
    }
    assert.deepEqual(updates, Array.from({ length: 10 }, (_, index) => (index + 1) / 10))
    assert.equal(done, 0)
    assert.equal(env.tool.processing, true)
    const final = [...env.timers.values()].find(timer => timer.delay === 50)
    assert(final)
    if (finish === 'complete') {
      tick(env, 50)
      await work
      assert.equal(done, 1)
    }
    else {
      if (finish === 'destroy') {
        env.tool.destroy()
      }
      else if (finish === 'replace') {
        env.tool.loadVideo({ name: 'next.mp4', type: 'video/mp4' })
      }
      else {
        env.tool.on('error', () => {})
        for (const fn of [...env.tool.video.handlers.get('error')])
          fn()
      }
      await assert.rejects(work, finish === 'error' ? /Unable to load video/ : { name: 'AbortError' })
      final.callback()
      assert.equal(done, 0)
    }
    assert.equal(env.tool.processing, false)
    env.tool.destroy()
    assert.equal(env.timers.size, 0)
  })
}

test('Thumbnail explicit workspace extraction retains aspect height with no policy timers', async () => {
  const env = create({ compatibility: 'workspace-4.4', delay: 25 })
  ready(env)
  const work = env.tool.start()
  await work
  assert.equal(env.tool.option.height, 22.5)
  assert.equal(env.operations.filter(op => op.name === 'drawImage').length, 10)
  assert.equal(env.timers.size, 0)
  env.tool.destroy()
})
