import assert from 'node:assert/strict'
// eslint-disable-next-line test/no-import-node-test -- Use the repository Node test runner.
import { test } from 'node:test'
import { loadModules } from './helpers/load.js'

const { miniPosition, clampMini } = await loadModules({
  miniPosition: { file: 'packages/artplayer/src/display/mini-layout', name: 'miniPosition' },
  clampMini: { file: 'packages/artplayer/src/display/mini-layout', name: 'clampMini' },
})
const geometry = { width: 320, height: 180, viewportWidth: 960, viewportHeight: 720 }

test('mini preserves finite visible stored coordinates including zero', () => {
  assert.deepEqual(miniPosition(0, 0, geometry), { left: 0, top: 0, reset: false })
  assert.deepEqual(miniPosition(640, 540, geometry), { left: 640, top: 540, reset: false })
})

test('mini replaces missing, non-finite and offscreen storage with the legacy 50px inset', () => {
  for (const [left, top] of [[undefined, null], [Number.NaN, 20], [20, Infinity], ['20', 20], [-1, 50], [800, 400], [200, 700]])
    assert.deepEqual(miniPosition(left, top, geometry), { left: 590, top: 490, reset: true })
})

test('mini default position remains reachable on small viewports', () => {
  assert.deepEqual(miniPosition(null, null, { width: 280, height: 160, viewportWidth: 280, viewportHeight: 160 }), { left: 0, top: 0, reset: true })
})

test('mini drag clamps both boundaries without changing positions inside the viewport', () => {
  assert.deepEqual(clampMini(-100, 900, geometry), { left: 0, top: 540 })
  assert.deepEqual(clampMini(600, 400, geometry), { left: 600, top: 400 })
  assert.deepEqual(clampMini(900, -2, geometry), { left: 640, top: 0 })
})
