import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
// eslint-disable-next-line test/no-import-node-test -- Compare exact actual SDK compiler diagnostics.
import test from 'node:test'
import { checkDashSDKTypes } from './dash-sdk-types.mjs'
import { refactorDir } from './releases.mjs'

test('actual DASH SDK types retain upstream diagnostics while candidate options add none', async () => {
  const baseline = JSON.parse(fs.readFileSync(path.join(refactorDir, 'baselines/dash-sdk-type-diagnostics.json')))
  const results = await checkDashSDKTypes()
  assert.equal(results.length, 10)
  assert.equal(baseline.matrix.length, results.length)
  for (const row of results) {
    const expected = baseline.matrix.find(item => item.sdk === row.sdk && item.compiler === row.compiler && item.mode === row.mode)
    assert(expected, `Missing frozen SDK row ${row.sdk}/${row.compiler}/${row.mode}`)
    assert.deepEqual(row.sdkOnly, expected.sdkOnly, 'Upstream SDK declaration diagnostics or resolved files changed')
    assert.deepEqual(row.candidate, row.sdkOnly, 'Candidate plugin added errors to an actual SDK consumer')
    const errors = row.invalid.diagnostics.filter(item => item.file === 'consumer.ts')
    assert.deepEqual(errors.map(item => item.code), [2769, 2339], 'Invalid formatter return and missing SDK field must both be rejected')
    assert.deepEqual(row.invalid.diagnostics.filter(item => item.file !== 'consumer.ts'), row.sdkOnly.diagnostics)
  }
})
