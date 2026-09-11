import assert from 'node:assert/strict'
// eslint-disable-next-line test/no-import-node-test -- Use the repository Node test runner.
import { test } from 'node:test'
import { loadModules } from './helpers/load.js'

const { Storage } = await loadModules({ Storage: 'packages/artplayer/src/storage' })

function environment(t) {
  const descriptor = Object.getOwnPropertyDescriptor(globalThis, 'window')
  t.after(() => descriptor ? Object.defineProperty(globalThis, 'window', descriptor) : delete globalThis.window)
  const values = new Map()
  const native = {
    getItem: key => values.get(key) ?? null,
    setItem: (key, value) => values.set(key, value),
    removeItem: key => values.delete(key),
  }
  globalThis.window = { localStorage: native }
  return { values, native, storage: new Storage() }
}

test('storage preserves envelope, mutable name/settings fields and synchronous returns', (t) => {
  const { storage, values } = environment(t)
  assert.deepEqual(Object.keys(storage), ['name', 'settings'])
  assert.equal(storage.name, 'artplayer_settings')
  assert.deepEqual(storage.get(), {})
  assert.equal(storage.set('volume', 0.5), undefined)
  assert.equal(values.get('artplayer_settings'), '{"volume":0.5}')
  storage.set('times', { example: 7 })
  assert.deepEqual(storage.get(), { volume: 0.5, times: { example: 7 } })
  assert.equal(storage.del('volume'), undefined)
  assert.deepEqual(storage.get(), { times: { example: 7 } })
  storage.name = 'custom'
  storage.set('plugin', true)
  assert.equal(values.get('custom'), '{"plugin":true}')
  assert.equal(storage.clear(), undefined)
  assert.equal(values.has('custom'), false)
  assert.equal(values.has('artplayer_settings'), true)
})

test('storage retains truthy key selection and historical JSON payload shapes', (t) => {
  const { storage, values } = environment(t)
  for (const payload of [[], [1, 2], 'text', 4, true, null]) {
    values.set(storage.name, JSON.stringify(payload))
    const expected = payload || {}
    assert.deepEqual(storage.get(), expected)
    assert.deepEqual(storage.get(''), expected)
    assert.deepEqual(storage.get(0), expected)
  }
  storage.settings.fallback = 9
  values.set(storage.name, 'bad JSON')
  assert.equal(storage.get('fallback'), 9)
  assert.equal(storage.get(), storage.settings)
})

test('storage falls back on denied native access and retains in-memory references', (t) => {
  const { storage } = environment(t)
  Object.defineProperty(window, 'localStorage', { get() {
    throw new Error('denied')
  } })
  const value = { plugin: true }
  assert.equal(storage.set('value', value), undefined)
  assert.equal(storage.get('value'), value)
  storage.del('value')
  assert.equal(storage.get('value'), undefined)
  const previous = storage.settings
  storage.clear()
  assert.notEqual(storage.settings, previous)
  assert.deepEqual(storage.settings, {})
})

test('storage write failure does not merge fallback into successful native reads', (t) => {
  const { storage, native, values } = environment(t)
  values.set(storage.name, '{"volume":0.2}')
  native.setItem = () => {
    throw new Error('quota')
  }
  storage.set('volume', 0.7)
  assert.equal(storage.settings.volume, 0.7)
  assert.equal(storage.get('volume'), 0.2)
  native.getItem = () => {
    throw new Error('denied')
  }
  assert.equal(storage.get('volume'), 0.7)
})
