import assert from 'node:assert/strict'
import { test } from 'node:test'
import { compareApiSnapshots, validateApiReport, verifyFrozenApi } from './api.mjs'

test('frozen API reports require passing checks and the exact published source', () => {
  const { report } = verifyFrozenApi()
  const missing = structuredClone(report)
  missing.checks.pop()
  assert.throws(() => validateApiReport(missing), /Missing or failed API checks/)
  const wrong = structuredClone(report)
  wrong.capture.releases[0].version = '999.0.0'
  assert.throws(() => validateApiReport(wrong), /Published sources differ/)
  const failed = structuredClone(report)
  failed.errors.push('constructor failed')
  assert.throws(() => validateApiReport(failed), /Browser capture failed/)
})

test('API comparison detects descriptor, method and default-value regressions', () => {
  const { snapshot } = verifyFrozenApi().report
  compareApiSnapshots(snapshot, structuredClone(snapshot))
  for (const change of [
    copy => { copy.instance.play.enumerable = !copy.instance.play.enumerable },
    copy => { copy.static.NOTICE_TIME.writable = !copy.static.NOTICE_TIME.writable },
    copy => { delete copy.prototype.destroy },
    copy => { copy.defaults.volume = 0.25 },
    copy => { copy.constants.SEEK_STEP += 1 },
    copy => { delete copy.integrations.controls.resolved.show },
    copy => { copy.integrations.controls.resolved.show.set = 'undefined' },
  ]) {
    const changed = structuredClone(snapshot)
    change(changed)
    assert.throws(() => compareApiSnapshots(snapshot, changed), /Public API snapshot differs/)
  }
})
