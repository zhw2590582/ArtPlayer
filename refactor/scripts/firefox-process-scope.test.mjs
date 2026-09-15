import assert from 'node:assert/strict'
// eslint-disable-next-line test/no-import-node-test -- Native debugger target selection must be checked independently of Windows attachment.
import { test } from 'node:test'
import { selectFirefoxProcesses } from './firefox-process-scope.mjs'

const executable = 'C:\\test\\firefox.exe'
const root = { pid: 1, parent: 0, created: '2026-09-15T00:00:00.000Z', executable: 'C:\\node.exe' }
const row = (pid, parent, extra = {}) => ({ pid, parent, created: '2026-09-15T00:00:01.000Z', executable, ...extra })

test('only the diagnostic runner own Firefox tree is selected', () => {
  const rows = [root, row(2, 1), row(3, 2), row(4, 99), row(5, 4), row(6, 1, { executable: 'C:\\user\\firefox.exe' }), row(7, 6), row(8, 2, { executable: 'c:/TEST/firefox.exe' })]
  assert.deepEqual(selectFirefoxProcesses(rows, root, executable).map(item => item.pid), [2, 3, 8])
})

test('missing and reused runner PIDs reject every target', () => {
  assert.deepEqual(selectFirefoxProcesses([row(2, 1)], root, executable), [])
  assert.deepEqual(selectFirefoxProcesses([{ ...root, created: '2026-09-15T00:00:02.000Z' }, row(2, 1)], root, executable), [])
  assert.deepEqual(selectFirefoxProcesses([{ ...root, executable: 'C:\\other.exe' }, row(2, 1)], root, executable), [])
})

test('reused ancestor PIDs, cycles, missing ancestry and invalid creation times fail closed', () => {
  const rows = [root, row(2, 1, { created: '2026-09-15T00:00:03.000Z' }), row(3, 2), row(4, 5), row(5, 4), row(6, 88), row(7, 1, { created: 'invalid' }), row(8, 1, { created: '2026-09-14T00:00:00.000Z' }), row(9, 7)]
  assert.deepEqual(selectFirefoxProcesses(rows, root, executable).map(item => item.pid), [2])
})
