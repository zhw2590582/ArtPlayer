import assert from 'node:assert/strict'
import { execFileSync } from 'node:child_process'
import fs from 'node:fs'
// eslint-disable-next-line test/no-import-node-test -- Vendor patch provenance is part of the baseline runner.
import test from 'node:test'
import { hash } from './releases.mjs'

test('JASSUB local vendor patch retains its exact original, changed source and reversible patch identity', () => {
  const record = JSON.parse(fs.readFileSync('refactor/baselines/jassub-vendor-patch.json', 'utf8'))
  const original = execFileSync('git', ['show', `${record.baselineCommit}:${record.file}`], { encoding: 'utf8' }).replaceAll('\r\n', '\n')
  const followUp = JSON.parse(fs.readFileSync('refactor/baselines/jassub-offscreen-patch.json', 'utf8'))
  const current = execFileSync('git', ['show', `${followUp.baselineCommit}:${record.file}`], { encoding: 'utf8' }).replaceAll('\r\n', '\n')
  const patch = fs.readFileSync(record.patchFile, 'utf8').replaceAll('\r\n', '\n')
  assert.equal(hash(original), record.originalSha256LF)
  assert.equal(hash(current), record.patchedSha256LF)
  assert.equal(hash(patch), record.patchSha256LF)
  assert.notEqual(record.originalSha256LF, record.patchedSha256LF)
  const committedPatch = execFileSync('git', ['diff', '--no-ext-diff', record.baselineCommit, followUp.baselineCommit, '--', record.file], { encoding: 'utf8' }).replaceAll('\r\n', '\n')
  assert.equal(hash(committedPatch), record.patchSha256LF)
  assert.equal(followUp.originalSha256LF, record.patchedSha256LF)
  assert.equal(hash(fs.readFileSync(record.file, 'utf8').replaceAll('\r\n', '\n')), followUp.patchedSha256LF)
  assert.equal(hash(fs.readFileSync(followUp.patchFile, 'utf8').replaceAll('\r\n', '\n')), followUp.patchSha256LF)
  execFileSync('git', ['apply', '--check', '--reverse', '--ignore-space-change', followUp.patchFile], { stdio: 'pipe' })
  const registry = JSON.parse(fs.readFileSync('refactor/third-party.json', 'utf8'))
  const group = registry.vendored.find(item => item.id === 'jassub-code-and-workers')
  assert.equal(group.localPatch.originalSha256LF, record.originalSha256LF)
  assert.equal(group.fingerprints.find(item => item.path === record.file).sha256, followUp.patchedSha256LF)
})
