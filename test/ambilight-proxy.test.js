import assert from 'node:assert/strict'
// eslint-disable-next-line test/no-import-node-test -- Node runtime contract runner.
import test from 'node:test'
import { ambilightCandidate, ambilightEnvironment } from './helpers/ambilight.js'

const implementation = await ambilightCandidate()

test('Ambilight canvas proxy sampling follows output pixels and subsequent output resize', async () => {
  const env = await ambilightEnvironment(implementation)
  env.video.nodeName = 'CANVAS'
  env.video.width = 600
  env.video.height = 300
  env.art.playing = true
  env.time(100)
  const result = env.factory()(env.art)
  result.start()
  assert.equal(env.draws.length, 9)
  assert.deepEqual(env.draws[0].slice(1), [0, 0, 200, 100, 0, 0, 1, 1])
  assert.deepEqual(env.draws[8].slice(1), [400, 200, 200, 100, 0, 0, 1, 1])
  env.video.width = 300
  env.video.height = 600
  env.frame(200)
  assert.deepEqual(env.draws[17].slice(1), [200, 400, 100, 200, 0, 0, 1, 1])
  env.art.destroy()
})

test('Ambilight native video uses intrinsic pixels regardless of its display width and height', async () => {
  const env = await ambilightEnvironment(implementation)
  env.video.nodeName = 'VIDEO'
  env.video.width = 600
  env.video.height = 300
  env.art.playing = true
  env.time(100)
  env.factory()(env.art).start()
  assert.deepEqual(env.draws[8].slice(1), [200, 100, 100, 50, 0, 0, 1, 1])
  env.art.destroy()
})

test('Ambilight zero-sized canvas output skips sampling despite nonzero proxy media dimensions and recovers on resize', async () => {
  const env = await ambilightEnvironment(implementation)
  env.video.nodeName = 'CANVAS'
  env.video.width = 0
  env.video.height = 300
  env.art.playing = true
  env.time(100)
  env.factory()(env.art).start()
  assert.equal(env.draws.length, 0)
  env.video.width = 600
  env.frame(200)
  assert.equal(env.draws.length, 9)
  env.art.destroy()
  assert.equal(env.frames.size, 0)
})
