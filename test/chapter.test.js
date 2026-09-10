import assert from 'node:assert/strict'
// eslint-disable-next-line test/no-import-node-test -- Pure chapter logic uses the repository Node runner.
import { test } from 'node:test'
import { loadModules } from './helpers/load.js'

const { normalize } = await loadModules({ normalize: { file: 'packages/artplayer-plugin-chapter/src/chapters', name: 'normalizeChapters' } })

test('Chapter normalization preserves caller array and objects while filling every gap', () => {
  const first = { start: 1, end: 2, title: ' First ' }
  const last = { start: 4, end: 6, title: 'Last' }
  const input = [last, first]
  assert.equal(normalize(input, 8), input)
  assert.equal(input[1], first)
  assert.equal(input[3], last)
  assert.deepEqual(input, [
    { start: 0, end: 1, title: '' },
    first,
    { start: 2, end: 4, title: '' },
    last,
    { start: 6, end: 8, title: '' },
  ])
  assert.equal(normalize(input, 8), input)
  assert.equal(input.length, 5, 'Repeated updates must not duplicate gaps')
})

test('Chapter endpoints, adjacency and Infinity normalization retain historical behavior', () => {
  const input = [{ start: 0, end: 2, title: 'A' }, { start: 2, end: Infinity, title: 'B' }]
  assert.equal(normalize(input, 8), input)
  assert.equal(input[1].end, 8)
  assert.equal(input.length, 2)
})

test('No usable timeline leaves input untouched and produces no chapters', () => {
  for (const duration of [0, -1, Infinity, Number.NaN]) {
    const input = [{ start: 3, end: Infinity, title: 'Pending' }]
    assert.deepEqual(normalize(input, duration), [])
    assert.equal(input[0].end, Infinity)
  }
  for (const input of [undefined, null, false, {}, []])
    assert.deepEqual(normalize(input, 8), [])
})

test('Invalid chapter types and times are rejected including non-finite values', () => {
  for (const input of [[null], [{ start: '0', end: 8, title: 'Bad' }], [{ start: 0, end: 8, title: 42 }]])
    assert.throws(() => normalize(input, 8), TypeError)
  for (const [start, end] of [[Number.NaN, 3], [0, Number.NaN], [-Infinity, 2], [Infinity, Infinity], [0, -Infinity], [-1, 2], [2, 2], [3, 2], [0, 9]])
    assert.throws(() => normalize([{ start, end, title: 'Bad' }], 8), { name: 'Error', message: 'Illegal chapter time point' })
  assert.throws(() => normalize([{ start: 0, end: 4, title: 'A' }, { start: 3, end: 6, title: 'B' }], 8), /Illegal chapter time point/)
})
