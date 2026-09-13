import assert from 'node:assert/strict'
import { execFileSync } from 'node:child_process'
import fs from 'node:fs'
// eslint-disable-next-line test/no-import-node-test -- Vendor patch provenance is part of the baseline runner.
import test from 'node:test'
import { hash } from './releases.mjs'

test('JASSUB local vendor patch retains its exact original, changed source and reversible patch identity', () => {
  const records = ['vendor', 'offscreen', 'hybrid'].map(name => JSON.parse(fs.readFileSync(`refactor/baselines/jassub-${name}-patch.json`, 'utf8')))
  for (const [index, record] of records.entries()) {
    const next = records[index + 1]
    const original = execFileSync('git', ['show', `${record.baselineCommit}:${record.file}`], { encoding: 'utf8' }).replaceAll('\r\n', '\n')
    const current = (next ? execFileSync('git', ['show', `${next.baselineCommit}:${record.file}`], { encoding: 'utf8' }) : fs.readFileSync(record.file, 'utf8')).replaceAll('\r\n', '\n')
    assert.equal(hash(original), record.originalSha256LF)
    assert.equal(hash(current), record.patchedSha256LF)
    assert.equal(hash(fs.readFileSync(record.patchFile, 'utf8').replaceAll('\r\n', '\n')), record.patchSha256LF)
    assert.notEqual(record.originalSha256LF, record.patchedSha256LF)
    if (next) {
      assert.equal(next.originalSha256LF, record.patchedSha256LF)
      const committedPatch = execFileSync('git', ['diff', '--no-ext-diff', record.baselineCommit, next.baselineCommit, '--', record.file], { encoding: 'utf8' }).replaceAll('\r\n', '\n')
      assert.equal(hash(committedPatch), record.patchSha256LF)
    }
    else {
      execFileSync('git', ['apply', '--check', '--reverse', '--ignore-space-change', record.patchFile], { stdio: 'pipe' })
    }
  }
  const registry = JSON.parse(fs.readFileSync('refactor/third-party.json', 'utf8'))
  const group = registry.vendored.find(item => item.id === 'jassub-code-and-workers')
  assert.equal(group.localPatch.originalSha256LF, records[0].originalSha256LF)
  assert.equal(group.fingerprints.find(item => item.path === records[0].file).sha256, records.at(-1).patchedSha256LF)
})
