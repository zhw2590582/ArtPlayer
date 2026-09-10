import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { validatePublishedCapture } from './api.mjs'
import { hash, refactorDir } from './releases.mjs'

export const lifecycleChecks = [
  'LIFE.version', 'EVENT.chain', 'EVENT.context-arguments', 'EVENT.once-reentry',
  'EVENT.dispatch-snapshot', 'EVENT.off-original-once', 'EVENT.throw-propagation',
  'LIFE.ready-callback', 'MEDIA.metadata', 'MEDIA.play-promise', 'MEDIA.play-result',
  'MEDIA.time-advances', 'MEDIA.pause-sync-stable', 'MEDIA.seek',
  'MEDIA.quality-preserves-time', 'MEDIA.url-resets-resumes',
  'LIFE.ready-once-after-switches', 'LIFE.restart-url', 'MEDIA.play-rejects-original',
  'PLUGIN.async-promise', 'PLUGIN.async-registry', 'PLUGIN.duplicate-throws',
  'MEDIA.latest-source', 'LIFE.destroy-retains-markup', 'LIFE.destroy-cleans-proxy',
  'LIFE.destroy-removes-markup', 'LIFE.constructor-plugin-error',
]

export function validateLifecycleReport(report) {
  assert.equal(report.kind, 'lifecycle')
  assert.deepEqual(report.errors, [], 'Lifecycle capture failed')
  assert.deepEqual(report.unhandled, [], 'Unexpected unhandled rejection')
  assert.deepEqual(report.checks, lifecycleChecks.map(id => ({ id, passed: true })), 'Missing or failed lifecycle checks')
  validatePublishedCapture(report, 'lifecycle')
  for (const name of ['video.mp4', 'video2.mp4']) {
    assert.equal(report.capture.media[name], hash(fs.readFileSync(path.resolve(refactorDir, '../docs/assets/sample', name))), `Media fixture changed: ${name}`)
  }
  const o = report.observations
  assert(o.playback.progressed >= o.playback.start + 0.1 && o.playback.width > 0 && o.playback.duration > 2, 'No real-media advancement evidence')
  assert(o.pause.observedMs >= 250 && o.pause.maxDelta < 0.02, 'No stable pause evidence')
  assert.equal(o.readyCallbacks, 1, 'Ready callback repeated')
  assert.equal(o.remainingInstances, 0, 'Probe leaked registered instances')
  const order = (phase, earlier, later) => {
    const events = report.trace.filter(item => item.phase === phase).map(item => item.event)
    assert(events.indexOf(earlier) >= 0 && events.indexOf(earlier) < events.indexOf(later), `Unexpected ${phase} order: ${earlier} -> ${later}`)
  }
  order('initial', 'video:loadedmetadata', 'ready')
  order('play', 'video:play', 'video:playing')
  order('play', 'video:playing', 'play')
  order('pause', 'pause', 'video:pause')
  order('quality-paused', 'video:canplay', 'restart')
  for (const item of o.expectedUnhandled) {
    assert.deepEqual(item, { phase: 'controlled-resume-rejection', message: 'controlled switch resume rejection' }, 'Unexpected controlled rejection')
  }
  const tasks = JSON.parse(fs.readFileSync(path.join(refactorDir, 'tasks.json'), 'utf8')).tasks
  assert.equal(new Set(report.findings.map(item => item.id)).size, report.findings.length, 'Duplicate finding IDs')
  for (const finding of report.findings) assert(tasks.some(task => task.id === finding.owner), `Unknown finding owner: ${finding.owner}`)
}

export function lifecycleProfile(report) {
  const o = report.observations
  return {
    checks: report.checks,
    emitterOrder: o.emitterOrder,
    readyCallbacks: o.readyCallbacks,
    restarts: o.restarts,
    concurrentSwitch: { outcomes: o.concurrentSwitch.outcomes, finalSource: o.concurrentSwitch.finalSource },
    destroyPending: { switchState: o.destroyPending.switchState, latePluginRegistered: o.destroyPending.latePluginRegistered },
    repeatedDestroy: o.repeatedDestroy,
    failedConstructor: { hasMarkup: o.failedConstructor.hasMarkup, retainedListeners: o.failedConstructor.listeners > 0, registered: o.failedConstructor.registered },
    rejectedResume: { switchState: o.rejectedResume.switchState, expectedUnhandled: o.rejectedResume.expectedUnhandled },
    findings: report.findings.map(({ id, owner }) => ({ id, owner })).sort((a, b) => a.id.localeCompare(b.id)),
  }
}

export function verifyFrozenLifecycle() {
  const frozen = JSON.parse(fs.readFileSync(path.join(refactorDir, 'baselines/lifecycle.json'), 'utf8'))
  assert.equal(frozen.schemaVersion, 1)
  validateLifecycleReport(frozen.report)
  assert.equal(hash(JSON.stringify(lifecycleProfile(frozen.report))), frozen.verification.profileSha256, 'Frozen lifecycle profile changed')
  return frozen
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const frozen = verifyFrozenLifecycle()
  const index = process.argv.indexOf('--compare')
  if (index !== -1) {
    assert(process.argv[index + 1], '--compare requires a report path')
    const captured = JSON.parse(fs.readFileSync(process.argv[index + 1], 'utf8'))
    validateLifecycleReport(captured)
    assert.deepEqual(lifecycleProfile(captured), lifecycleProfile(frozen.report), 'Published lifecycle profile differs')
    console.log('Published lifecycle capture matches semantic baseline; historical findings remain recorded')
  }
  else {
    assert(process.argv.slice(2).every(arg => arg === '--check'), 'Use --check or --compare <report>')
    console.log(`Frozen lifecycle report verified: ${lifecycleChecks.length} checks; this command does not rerun the browser`)
  }
}
