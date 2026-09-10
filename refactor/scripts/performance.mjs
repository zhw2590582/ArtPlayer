import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { validatePublishedCapture } from './api.mjs'
import { hash, refactorDir } from './releases.mjs'

export const timingThresholds = {
  constructorMs: { relative: 0.25, absoluteMs: 2 },
  readyMs: { relative: 0.25, absoluteMs: 50 },
  playResolvedMs: { relative: 0.25, absoluteMs: 10 },
  destroyMs: { relative: 0.25, absoluteMs: 2 },
}
export function validatePerformance(report) {
  assert.equal(report.kind, 'performance')
  validatePublishedCapture(report, 'performance')
  assert.deepEqual(report.errors, [])
  assert.deepEqual(report.unhandled, [])
  assert.equal(report.environment.visibility, 'visible')
  assert.deepEqual(report.visibilityChanges, [], 'Background timing is not comparable')
  assert.equal(report.remainingInstances, 0)
  assert.equal(report.capture.media['video.mp4'], hash(fs.readFileSync(path.resolve(refactorDir, '../docs/assets/sample/video.mp4'))))
  assert.deepEqual(report.samples.map(({ configuration, round, warmup }) => ({ configuration, round, warmup })), Array.from({ length: 6 }, (_, round) => ['core', 'chapter'].map(configuration => ({ configuration, round, warmup: round === 0 }))).flat())
  for (const sample of report.samples) {
    for (const key of [...Object.keys(timingThresholds), 'playbackObservedMs']) assert(Number.isFinite(sample[key]) && sample[key] >= 0, `Invalid ${key}`)
    assert(sample.readyMs >= sample.constructorMs && sample.playbackObservedMs >= sample.playResolvedMs)
    assert(Number.isFinite(sample.mediaProgress) && sample.mediaProgress >= 0.15 && Number.isFinite(sample.videoWidth) && sample.videoWidth > 0, 'Missing real playback progress')
    assert(sample.nodes > 0 && sample.proxyCleanupEntries > 0)
    assert.deepEqual(sample.afterDestroy, { nodes: 0, instances: 0, proxyCleanupEntries: 0, paused: true, sourceAttribute: null }, 'Basic lifecycle cleanup failed')
  }
  assert.deepEqual(report.resources.map(({ configuration, round }) => ({ configuration, round })), Array.from({ length: 3 }, (_, round) => ['core', 'chapter'].map(configuration => ({ configuration, round }))).flat())
  for (const resource of report.resources) {
    assert.equal(resource.useRaf, true)
    assert(resource.before.frames >= 2 && resource.before.proxyCleanupEntries > 0)
    assert.equal(resource.before.proxyCalls, 1)
    assert(resource.before.timers.some(timer => timer.kind === 'raf'), 'RAF probe was not active')
    assert(resource.after.observedMs >= 350, 'Insufficient teardown observation')
    for (const key of ['nodes', 'instances', 'proxyCleanupEntries', 'framesAfterDestroy']) assert.equal(resource.after[key], 0, `Resource cleanup failed: ${key}`)
    assert.equal(resource.after.proxyCalls, 1, 'Removed proxy listener still responds')
    // Late timeout work remains evidence, not a normal candidate cleanup requirement.
    assert(Array.isArray(resource.after.timers) && Array.isArray(resource.after.lateCallbacks))
  }
}
export function summarizePerformance(report) {
  return Object.fromEntries(['core', 'chapter'].map(configuration => {
    const samples = report.samples.filter(sample => sample.configuration === configuration && !sample.warmup)
    return [configuration, Object.fromEntries(Object.keys(timingThresholds).map(metric => {
      const values = samples.map(sample => sample[metric]).sort((a, b) => a - b)
      return [metric, { count: values.length, min: values[0], median: values[Math.floor(values.length / 2)], max: values.at(-1) }]
    }))]
  }))
}
export function resourceProfile(report) {
  return report.resources.map(({ configuration, round, after }) => ({ configuration, round, timers: after.timers, lateCallbacks: after.lateCallbacks, lateResizeEvents: after.lateResizeEvents, framesAfterDestroy: after.framesAfterDestroy, proxyCalls: after.proxyCalls, nodes: after.nodes, instances: after.instances }))
}
export function comparePerformance(before, after) {
  const cohort = report => ({ ...report.environment, visibility: undefined })
  assert.deepEqual(cohort(after), cohort(before), 'Different browser/viewport/hardware cohort; rerun paired samples')
  const previous = summarizePerformance(before)
  const current = summarizePerformance(after)
  const reviewSignals = []
  for (const configuration of ['core', 'chapter']) {
    for (const [metric, threshold] of Object.entries(timingThresholds)) {
      const deltaMs = current[configuration][metric].median - previous[configuration][metric].median
      const allowanceMs = Math.max(previous[configuration][metric].median * threshold.relative, threshold.absoluteMs)
      if (deltaMs > allowanceMs) reviewSignals.push({ configuration, metric, deltaMs, allowanceMs })
    }
  }
  return { summary: current, reviewSignals, resourceProfileChanged: JSON.stringify(resourceProfile(after)) !== JSON.stringify(resourceProfile(before)) }
}
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const frozen = JSON.parse(fs.readFileSync(path.join(refactorDir, 'baselines/performance.json'), 'utf8'))
  for (const report of frozen.runs) validatePerformance(report)
  const index = process.argv.indexOf('--compare')
  if (index !== -1) {
    assert(process.argv[index + 1], '--compare requires a report path')
    const report = JSON.parse(fs.readFileSync(process.argv[index + 1], 'utf8'))
    validatePerformance(report)
    console.log(JSON.stringify(comparePerformance(frozen.runs[0], report), null, 2))
    console.log('Timing signals require repeat paired measurement and review, not automatic baseline replacement')
  }
  else {
    assert(process.argv.slice(2).every(arg => arg === '--check'), 'Use --check or --compare <report>')
    console.log(`Frozen performance evidence verified: ${frozen.runs.length} runs; no browser rerun or optimization claim`)
  }
}
