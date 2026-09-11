import assert from 'node:assert/strict'
import { comparePerformance, validatePerformanceMeasurements } from '../refactor/scripts/performance.mjs'

export function validatePairedPerformance(report) {
  assert.equal(report.schemaVersion, 1)
  assert(report.environment.browser && report.environment.version && report.environment.platform, 'Missing benchmark environment')
  assert.deepEqual(report.runs.map(({ group, variant }) => ({ group, variant })), Array.from({ length: 3 }, (_, group) => (group % 2 ? ['candidate', 'published'] : ['published', 'candidate']).map(variant => ({ group, variant }))).flat(), 'Require three alternating paired groups')
  for (const run of report.runs) {
    validatePerformanceMeasurements(run.measurements)
    assert.deepEqual(run.measurements.environment, report.runs[0].measurements.environment, 'Different browser/viewport/hardware cohort')
    assert.deepEqual(run.measurements.scripts, [`/${run.variant}/artplayer.js`, `/${run.variant}/artplayer-plugin-chapter.js`, '/test/performance.js'], 'Unexpected benchmark scripts')
    if (run.variant === 'candidate') {
      for (const resource of run.measurements.resources) {
        assert.deepEqual(resource.immediatelyAfter, [], 'Candidate left active timers at destroy')
        assert.deepEqual(resource.after.timers, [], 'Candidate retained timers after destroy')
        assert.deepEqual(resource.after.lateCallbacks, [], 'Candidate executed callbacks after destroy')
        assert.equal(resource.after.lateResizeEvents, 0, 'Candidate dispatched late resize')
      }
    }
  }
  const groups = Array.from({ length: 3 }, (_, group) => {
    const pair = report.runs.filter(run => run.group === group)
    const before = pair.find(run => run.variant === 'published').measurements
    const after = pair.find(run => run.variant === 'candidate').measurements
    return { group, ...comparePerformance(before, after) }
  })
  return { groups, reviewRequired: groups.some(group => group.reviewSignals.length > 0) }
}
