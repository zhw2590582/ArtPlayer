import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { hash, refactorDir } from './releases.mjs'

export const checkIds = [
  'API-01.version', 'API-01.defaults-independent', 'API-01.default-language',
  'API-01.instance-registration', 'API-01.container-selector', 'API-02.video',
  'API-02.bound-query', 'API-06.sync-chapter', 'API-06.add-return',
  'API-06.result-call', 'API-04.on-return', 'API-04.off',
  'API-05.destroy-return', 'API-05.instance-cleanup',
]

export function validateApiReport(report) {
  assert.equal(report.kind, 'public-api')
  assert.deepEqual(report.errors, [], 'Browser capture failed')
  assert.deepEqual(report.checks, checkIds.map(id => ({ id, passed: true })), 'Missing or failed API checks')
  assert(report.environment.userAgent && report.environment.language, 'Missing browser environment')
  assert(Number.isFinite(Date.parse(report.capture.capturedAt)), 'Missing capture timestamp')
  const releases = JSON.parse(fs.readFileSync(path.join(refactorDir, 'baselines/releases.json'), 'utf8')).releases
  const expectedSources = releases.map(release => {
    const member = `package/${release.manifest.main.replace(/^\.\//, '')}`
    return { name: release.name, version: release.version, integrity: release.integrity, member, sha256: release.files[member] }
  })
  assert.deepEqual(report.capture.releases, expectedSources, 'Published sources differ')
  assert.deepEqual(report.scripts, [...expectedSources.map(release => `/releases/${release.name}/${release.member.slice('package/'.length)}`), '/fixtures/api.js'], 'Unexpected loaded scripts')
  assert.equal(report.capture.fixtureHashAlgorithm, 'sha256-lf')
  for (const name of ['api.html', 'api.js']) {
    const source = fs.readFileSync(path.join(refactorDir, 'fixtures', name), 'utf8').replaceAll('\r\n', '\n')
    assert.equal(report.capture.fixtures[name], hash(source), `Fixture changed: ${name}; review the baseline explicitly`)
  }
  for (const section of ['static', 'prototype', 'emitterPrototype', 'defaults', 'constants', 'config', 'utilityDescriptors', 'instance', 'instanceResolved', 'chapterFactory', 'chapterResult', 'integrations']) {
    assert(report.snapshot?.[section] && Object.keys(report.snapshot[section]).length, `Missing API section: ${section}`)
  }
  assert.deepEqual(report.snapshot.defaults.lang, { $environment: 'navigator.language.toLowerCase()' })
}

export function compareApiSnapshots(expected, actual) {
  assert.deepEqual(actual, expected, 'Public API snapshot differs; investigate instead of overwriting the baseline')
}

export function verifyFrozenApi() {
  const frozen = JSON.parse(fs.readFileSync(path.join(refactorDir, 'baselines/public-api.json'), 'utf8'))
  assert.equal(frozen.schemaVersion, 1)
  validateApiReport(frozen.report)
  assert.equal(hash(JSON.stringify(frozen.report.snapshot)), frozen.verification.snapshotSha256, 'Frozen API snapshot digest differs')
  return frozen
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const frozen = verifyFrozenApi()
  const index = process.argv.indexOf('--compare')
  if (index !== -1) {
    assert(process.argv[index + 1], '--compare requires a captured report path')
    const captured = JSON.parse(fs.readFileSync(process.argv[index + 1], 'utf8'))
    validateApiReport(captured)
    compareApiSnapshots(frozen.report.snapshot, captured.snapshot)
    console.log('Published API capture matches the frozen snapshot')
  }
  else {
    assert(process.argv.slice(2).every(arg => arg === '--check'), 'Use --check or --compare <report>')
    console.log(`Frozen API verified: ${checkIds.length} browser checks; browser is not rerun by this command`)
  }
}
