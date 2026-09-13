import assert from 'node:assert/strict'
// eslint-disable-next-line test/no-import-node-test -- Native export compatibility regression runner.
import test from 'node:test'
import { autoThumbnailCandidate, autoThumbnailEnvironment } from './helpers/auto-thumbnail.js'

const implementation = await autoThumbnailCandidate()

for (const script of [false, true]) {
  test(`Auto-thumbnail ${script ? 'script global' : 'CommonJS'} keeps direct and historical default calls on one factory`, async () => {
    const env = autoThumbnailEnvironment(implementation, { script })
    const factory = env.factory
    assert.equal(typeof factory, 'function')
    assert.equal(factory.default, factory)
    assert.equal(factory.default.default, factory)
    assert.equal(env.videos.length, 0)
    const original = Object.getOwnPropertyDescriptor(factory, 'default')
    assert.deepEqual(original, { value: factory, writable: true, enumerable: true, configurable: true })
    const registrar = factory.default({ width: 80, number: 2 })
    const pending = registrar(env.art)
    assert.equal(pending.name, undefined)
    assert.equal(typeof pending.then, 'function')
    assert.deepEqual({ ...await pending }, { name: 'artplayerPluginAutoThumbnail' })
    assert.equal(env.videos.length, 0, 'Alias registration must not start extraction')
    env.art.emit('video:loadedmetadata')
    env.metadata()
    env.seeked()
    env.finish()
    assert.equal(env.updates.length, 1)
    assert.equal(env.updates[0].width, 80)
    env.art.emit('destroy')
    assert.equal(env.attached.size, 0)
    assert.equal(env.urls.size, 0)
    assert([...env.listeners.values()].every(callbacks => callbacks.size === 0))
  })
}
