import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import test from 'node:test'
import { comparePerformance, summarizePerformance, validatePerformance } from './performance.mjs'
import { publishedSizes, validateSizes } from './sizes.mjs'
import { refactorDir } from './releases.mjs'

const baseline = () => JSON.parse(fs.readFileSync(path.join(refactorDir, 'baselines/performance.json'), 'utf8'))

test('Performance evidence rejects background, fake playback and broken teardown', () => {
  const frozen = baseline()
  for (const report of frozen.runs) validatePerformance(report)
  for (const mutate of [
    report => report.visibilityChanges.push('hidden'),
    report => report.samples[2].mediaProgress = 0,
    report => report.samples[2].afterDestroy.instances = 1,
    report => report.resources[0].after.framesAfterDestroy = 1,
    report => report.resources[0].after.observedMs = 20,
    report => report.resources[0].after.proxyCalls = 2,
    report => report.samples.pop(),
  ]) {
    const changed = structuredClone(frozen.runs[0])
    mutate(changed)
    assert.throws(() => validatePerformance(changed))
  }
})

test('Performance comparison excludes warm-up, detects large regression and allows documented resource fixes', () => {
  const report = baseline().runs[0]
  const warmup = structuredClone(report)
  warmup.samples[0].constructorMs = 1000
  assert.deepEqual(summarizePerformance(warmup), summarizePerformance(report))
  const slower = structuredClone(report)
  for (const sample of slower.samples) {
    sample.constructorMs += 10
    sample.readyMs += 10
  }
  assert(comparePerformance(report, slower).reviewSignals.some(signal => signal.metric === 'constructorMs'))
  const fixed = structuredClone(report)
  for (const resource of fixed.resources) {
    resource.after.timers = []
    resource.after.lateCallbacks = []
    resource.after.lateResizeEvents = 0
  }
  validatePerformance(fixed)
  assert.equal(comparePerformance(report, fixed).resourceProfileChanged, true)
  const otherDevice = structuredClone(report)
  otherDevice.environment.hardwareConcurrency++
  assert.throws(() => comparePerformance(report, otherDevice))
})

test('Published compression sizes are reproducible and inventory cannot omit a library', async () => {
  const report = JSON.parse(fs.readFileSync(path.join(refactorDir, 'baselines/sizes.json'), 'utf8'))
  validateSizes(report)
  assert.deepEqual(await publishedSizes(), report.published)
  const missing = structuredClone(report)
  missing.workspaceObserved = missing.workspaceObserved.filter(item => item.name !== 'artplayer-plugin-chapter')
  assert.throws(() => validateSizes(missing))
})
