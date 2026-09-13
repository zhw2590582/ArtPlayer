import assert from 'node:assert/strict'
// eslint-disable-next-line test/no-import-node-test -- Repository canvas resource ownership regressions.
import test from 'node:test'
import { autoThumbnailCandidate, autoThumbnailEnvironment } from './helpers/auto-thumbnail.js'

const implementation = await autoThumbnailCandidate()
async function setup(number = 2) {
  const env = autoThumbnailEnvironment(implementation)
  await env.factory({ width: 80, number })(env.art)
  env.art.emit('video:loadedmetadata')
  return env
}

for (const event of ['destroy', 'restart']) {
  test(`Auto-thumbnail clears a retained canvas when ${event} cancels an encoding`, async () => {
    const env = await setup()
    env.metadata()
    env.seeked()
    const canvas = env.canvases[0]
    assert.equal(canvas.width * canvas.height, 36000)
    env.art.emit(event)
    assert.deepEqual([canvas.width, canvas.height], [0, 0])
    env.finish()
    assert.equal(env.updates.length, 0)
    assert.equal(env.urls.size, 0)
    assert.equal(env.attached.size, 0)
    if (event === 'restart') {
      env.art.emit('video:loadedmetadata')
      env.metadata()
      assert.deepEqual([env.canvases[1].width, env.canvases[1].height], [800, 45])
      assert.deepEqual([canvas.width, canvas.height], [0, 0])
    }
    env.art.emit('destroy')
  })
}

test('Auto-thumbnail clears completed canvas storage while retaining the encoded preview', async () => {
  const env = await setup(1)
  env.metadata()
  env.seeked()
  const blob = { type: 'image/jpeg', content: 'encoded image owns its bytes' }
  env.finish(0, blob)
  assert.deepEqual([env.canvases[0].width, env.canvases[0].height], [0, 0])
  assert.equal(env.urls.get(env.art.thumbnails.url), blob)
  assert.equal(env.attached.size, 0)
  env.art.emit('destroy')
  assert.equal(env.urls.size, 0)
})

test('Auto-thumbnail clears allocated dimensions if context creation fails', async () => {
  const env = await setup()
  env.controls.nullContext = true
  env.metadata()
  assert.deepEqual([env.canvases[0].width, env.canvases[0].height], [0, 0])
  assert.equal(env.warnings.length, 1)
  assert.equal(env.attached.size, 0)
  env.art.emit('destroy')
})

test('Auto-thumbnail still clears height and decoder if the width reset throws', async () => {
  const env = await setup()
  env.metadata()
  const canvas = env.canvases[0]
  const failure = new Error('Width reset failed')
  Object.defineProperty(canvas, 'width', {
    get: () => 800,
    set() {
      throw failure
    },
  })
  env.art.emit('destroy')
  assert.equal(canvas.height, 0)
  assert.equal(env.attached.size, 0)
  assert.equal(env.videos[0].src, undefined)
  assert.equal(env.timers.size, 0)
  assert.equal(env.warnings.length, 1)
  assert.equal(env.warnings[0][1], failure)
})

test('Auto-thumbnail does not allocate height after a width setter closes the job', async () => {
  const env = await setup()
  const createElement = env.box.document.createElement
  env.box.document.createElement = function (name) {
    const element = createElement.call(this, name)
    if (name === 'canvas') {
      let width = 0
      Object.defineProperty(element, 'width', {
        get: () => width,
        set(value) {
          width = value
          if (value > 0)
            env.art.emit('destroy')
        },
      })
    }
    return element
  }
  env.metadata()
  assert.deepEqual([env.canvases[0].width, env.canvases[0].height], [0, 0])
  assert.equal(env.attached.size, 0)
  assert.equal(env.blobs.length, 0)
})
