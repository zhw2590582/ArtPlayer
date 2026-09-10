import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import test from 'node:test'
import { consumerProfile, runConsumers, validateConsumerReport } from './consumers.mjs'
import { validateDistribution } from './distribution.mjs'
import { refactorDir } from './releases.mjs'
import { validateSsr } from './ssr.mjs'

test('Published packages rerun isolated runtime and strict TypeScript consumers', async () => {
  const frozen = JSON.parse(fs.readFileSync(path.join(refactorDir, 'baselines/consumers.json'), 'utf8'))
  validateConsumerReport(frozen)
  const result = await runConsumers()
  validateConsumerReport(result)
  assert.deepEqual(consumerProfile(result), consumerProfile(frozen))
  for (const mutate of [
    value => value.runtime.checks.pop(),
    value => value.compilerOptions.skipLibCheck = true,
    value => value.types.find(item => item.mode === 'bundler-esm' && item.fixture === 'public.ts').diagnostics.push({ code: 2322 }),
    value => value.releases[0].version = 'wrong',
  ]) {
    const changed = structuredClone(frozen)
    mutate(changed)
    assert.throws(() => validateConsumerReport(changed))
  }
})

test('Distribution inventory preserves all packages and the thumbnail discrepancy', () => {
  const frozen = JSON.parse(fs.readFileSync(path.join(refactorDir, 'baselines/distribution.json'), 'utf8'))
  validateDistribution(frozen)
  const changed = structuredClone(frozen)
  changed.packages.pop()
  assert.throws(() => validateDistribution(changed))
})

test('Browser SSR evidence requires node identity, real metadata and cleanup', () => {
  const frozen = JSON.parse(fs.readFileSync(path.join(refactorDir, 'baselines/ssr.json'), 'utf8'))
  validateSsr(frozen.report)
  const changed = structuredClone(frozen.report)
  changed.observations.videoWidth = 0
  assert.throws(() => validateSsr(changed))
})
