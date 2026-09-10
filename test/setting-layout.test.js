import assert from 'node:assert/strict'
// eslint-disable-next-line test/no-import-node-test -- Use the repository Node test runner.
import { test } from 'node:test'
import { loadModules } from './helpers/load.js'

const { calculateSettingLayout } = await loadModules({ calculateSettingLayout: { file: 'packages/artplayer/src/setting/layout', name: 'calculateSettingLayout' } })
const standard = { containerWidth: 640, containerHeight: 360, requestedWidth: 200, rows: 4, rowHeight: 35, controlCenter: 600, bottom: 46, padding: 10 }

test('settings retain requested dimensions where they fit and anchor inside both edges', () => {
  assert.deepEqual(calculateSettingLayout(standard), { width: 200, height: 140, left: 430 })
  assert.deepEqual(calculateSettingLayout({ ...standard, controlCenter: 250 }), { width: 200, height: 140, left: 150 })
  assert.deepEqual(calculateSettingLayout({ ...standard, controlCenter: 20 }), { width: 200, height: 140, left: 10 })
})

test('oversized nested panels fit a narrow 16:9 player above multiple control rows', () => {
  assert.deepEqual(calculateSettingLayout({ ...standard, containerWidth: 320, containerHeight: 180, requestedWidth: 420, rows: 13, bottom: 92 }), { width: 300, height: 78, left: 10 })
})

test('hidden or undersized hosts never produce negative layout dimensions', () => {
  assert.deepEqual(calculateSettingLayout({ ...standard, containerWidth: 0, containerHeight: 0 }), { width: 0, height: 0, left: 0 })
  assert.deepEqual(calculateSettingLayout({ ...standard, containerWidth: 12, containerHeight: 30, requestedWidth: -5 }), { width: 0, height: 0, left: 6 })
})
