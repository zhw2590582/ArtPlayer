import assert from 'node:assert/strict'
import { test } from 'node:test'
import { lifecycleProfile, validateLifecycleReport, verifyFrozenLifecycle } from './lifecycle.mjs'

test('lifecycle evidence rejects fake progress, unexpected errors and event reordering', () => {
  const { report } = verifyFrozenLifecycle()
  const stopped = structuredClone(report)
  stopped.observations.playback.progressed = stopped.observations.playback.start
  assert.throws(() => validateLifecycleReport(stopped), /No real-media advancement/)
  const error = structuredClone(report)
  error.unhandled.push('unexpected error')
  assert.throws(() => validateLifecycleReport(error), /Unexpected unhandled/)
  const reordered = structuredClone(report)
  const phase = reordered.trace.filter(item => item.phase === 'play')
  const native = phase.find(item => item.event === 'video:playing')
  const publicEvent = phase.find(item => item.event === 'play')
  native.event = 'play'
  publicEvent.event = 'video:playing'
  assert.throws(() => validateLifecycleReport(reordered), /Unexpected play order/)
})

test('lifecycle profile ignores media clock jitter but retains lifecycle findings', () => {
  const { report } = verifyFrozenLifecycle()
  const jitter = structuredClone(report)
  jitter.observations.playback.progressed += 0.03
  jitter.observations.pause.observedMs += 10
  assert.deepEqual(lifecycleProfile(jitter), lifecycleProfile(report))
  const changed = structuredClone(report)
  changed.observations.repeatedDestroy.survivorAfter = true
  assert.notDeepEqual(lifecycleProfile(changed), lifecycleProfile(report))
})
