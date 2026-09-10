import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
// eslint-disable-next-line test/no-import-node-test -- Verify actual JS/TS loading used by module regressions.
import { test } from 'node:test'
import { loadModules, workspace } from './helpers/load.js'

test('Module fixtures load JS and TS without silently selecting an obsolete sibling', async () => {
  const parent = path.join(workspace, 'refactor/.cache')
  fs.mkdirSync(parent, { recursive: true })
  const directory = fs.mkdtempSync(path.join(parent, 'unit-loader-'))
  try {
    const ts = path.join(directory, 'double.ts')
    const js = path.join(directory, 'double.js')
    fs.writeFileSync(ts, 'export default (value: number): number => value * 2')
    assert.equal((await loadModules({ double: 'double' }, directory)).double(3), 6)
    fs.writeFileSync(js, 'export default value => value * 2')
    await assert.rejects(loadModules({ double: 'double' }, directory), /exactly one JS\/TS module/)
    fs.unlinkSync(ts)
    assert.equal((await loadModules({ double: 'double' }, directory)).double(3), 6)
    assert(!fs.existsSync(path.join(directory, 'dist')))
  }
  finally {
    const relative = path.relative(parent, directory)
    assert(relative.startsWith('unit-loader-') && !relative.includes(path.sep))
    fs.rmSync(directory, { recursive: true, force: true })
  }
})
