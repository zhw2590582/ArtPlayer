import assert from 'node:assert/strict'
// eslint-disable-next-line test/no-import-node-test -- Use the repository Node test runner.
import { test } from 'node:test'
import { loadModules } from './helpers/load.js'

const { containSize, proportionalHeight } = await loadModules({
  containSize: { file: 'packages/artplayer/src/display/sizing', name: 'containSize' },
  proportionalHeight: { file: 'packages/artplayer/src/display/sizing', name: 'proportionalHeight' },
})

test('contained media preserves its ratio, fits both bounds and fills one axis', () => {
  for (const container of [{ width: 640, height: 480 }, { width: 160, height: 900 }, { width: 0.5, height: 0.25 }]) {
    for (const ratio of [16 / 9, 9 / 16, 1, 4 / 3, 0.001, 1000]) {
      const size = containSize(container, ratio)
      assert.ok(size.width <= container.width && size.height <= container.height)
      assert.ok(Math.abs(size.width / size.height - ratio) <= ratio * 1e-12)
      assert.ok(size.width === container.width || size.height === container.height)
    }
  }
})

test('zero, negative and non-finite geometry cannot produce layout writes', () => {
  for (const invalid of [0, -1, Number.NaN, Infinity, -Infinity]) {
    assert.equal(containSize({ width: invalid, height: 480 }, 16 / 9), undefined)
    assert.equal(containSize({ width: 640, height: invalid }, 16 / 9), undefined)
    assert.equal(containSize({ width: 640, height: 480 }, invalid), undefined)
    assert.equal(proportionalHeight(invalid, { width: 1920, height: 1080 }), undefined)
    assert.equal(proportionalHeight(640, { width: invalid, height: 1080 }), undefined)
    assert.equal(proportionalHeight(640, { width: 1920, height: invalid }), undefined)
  }
})

test('auto height uses media proportions and recovers when dimensions become ready', () => {
  assert.equal(proportionalHeight(640, { width: 0, height: 0 }), undefined)
  assert.equal(proportionalHeight(640, { width: 1920, height: 1080 }), 360)
  assert.equal(proportionalHeight(360, { width: 1080, height: 1920 }), 640)
})

test('overflow and underflow never escape as infinite or zero layout measurements', () => {
  assert.equal(proportionalHeight(Number.MAX_VALUE, { width: Number.MIN_VALUE, height: 1 }), undefined)
  assert.equal(proportionalHeight(Number.MIN_VALUE, { width: Number.MAX_VALUE, height: 1 }), undefined)
  assert.equal(containSize({ width: Number.MIN_VALUE, height: Number.MIN_VALUE }, Number.MAX_VALUE), undefined)
})
