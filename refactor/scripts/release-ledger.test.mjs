import assert from 'node:assert/strict'
import { execFileSync } from 'node:child_process'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
// eslint-disable-next-line test/no-import-node-test -- Release evidence must fail closed under stale or mis-scoped input.
import test from 'node:test'
import { dependencyClosure, evaluatePackage, findingPackages, libraryGates, sharedTasks, siteGates, validateLedger } from './release-ledger-model.mjs'
import { checkedCandidate, checkedReport, fingerprintInputs, fingerprintOf, localFile, root } from './release-ledger.mjs'
import { hash } from './releases.mjs'

function fixture() {
  const row = { name: 'example', distribution: 'npm', targetVersion: '2.0.0', extraRequirements: ['cast-session'], rollback: { strategy: 'restore previous tested candidate' } }
  const candidate = { version: '2.0.0', integrity: 'candidate-digest', inputFingerprint: 'current-inputs', errors: [] }
  const evidence = Object.fromEntries(libraryGates.map(gate => [gate, { errors: [], result: 'pass', package: 'example', version: '2.0.0', gate, candidateIntegrity: candidate.integrity, inputFingerprint: 'current-inputs', checks: [{ id: gate === 'devices' ? 'cast-session' : 'normal-path', result: 'pass', mode: 'native' }], environment: [{ os: 'device-os', browser: 'browser-version', device: 'physical-model', emulated: false, remote: true, runUrl: 'https://github.com/example/repo/actions/runs/1' }], command: 'actual test command', reviewedBy: 'review record' }]))
  return { row, fingerprint: 'current-inputs', version: '2.0.0', candidate, evidence, taskGaps: [], risks: [], assets: [], history: { verified: true } }
}

test('Release ledger synthetic complete evidence remains publication-unauthorized', () => {
  const result = evaluatePackage(fixture())
  assert.equal(result.status, 'evidence-complete')
  assert.equal(result.publicationAuthorized, false)
})

for (const [name, mutate, kind] of [
  ['missing candidate', input => input.candidate = null, 'candidate'],
  ['changed sources', input => input.fingerprint = 'changed-source', 'stale-candidate'],
  ['unprepared major', input => input.version = '1.1.0', 'version'],
  ['wrong artifact version', input => input.candidate.version = '9.0.0', 'candidate-version'],
  ['archive bytes differ', input => input.candidate.errors.push('digest differs'), 'candidate'],
  ['missing rollback archive', input => input.history = { verified: false, reason: 'not recovered' }, 'distribution-history'],
  ['completed rehearsal without candidate rollback', input => delete input.evidence.rollback, 'evidence:rollback'],
  ['early rehearsal tarball used for final rollback', input => input.evidence.rollback.candidateIntegrity = 'early-rehearsal-tarball', 'evidence:rollback'],
  ['early rehearsal version used for final rollback', input => input.evidence.rollback.version = '1.1.0', 'evidence:rollback'],
  ['open affected risk', input => input.risks.push({ id: 'CAST-01', status: 'open' }), 'risk'],
  ['unfinished review', input => input.taskGaps.push('REVIEW-03'), 'task'],
  ['missing format report', input => delete input.evidence.runtime, 'evidence:runtime'],
  ['wrong package scope', input => input.evidence.runtime.package = 'other-package', 'evidence:runtime'],
  ['wrong gate scope', input => input.evidence.runtime.gate = 'types', 'evidence:runtime'],
  ['wrong report version', input => input.evidence.runtime.version = '1.0.0', 'evidence:runtime'],
  ['old tarball report', input => input.evidence.runtime.candidateIntegrity = 'old-digest', 'evidence:runtime'],
  ['stale type report', input => input.evidence.types.inputFingerprint = 'old-inputs', 'evidence:types'],
  ['skipped native check', input => input.evidence.devices.checks[0].result = 'skipped', 'evidence:devices'],
  ['emulated device', input => input.evidence.devices.environment[0].emulated = true, 'evidence:devices'],
  ['unidentified device', input => delete input.evidence.devices.environment[0].device, 'evidence:devices'],
  ['mock capability on real device', input => input.evidence.devices.checks[0].mode = 'mock', 'evidence:devices'],
  ['local CI as remote proof', input => input.evidence['remote-ci'].environment[0].remote = false, 'evidence:remote-ci'],
  ['missing capability', input => input.evidence.devices.checks[0].id = 'viewport-only', 'evidence:devices'],
  ['missing source/license coverage', input => input.assets.push({ id: 'worker-wasm-font' }), 'evidence:licenses'],
  ['empty successful report', input => input.evidence.browser.checks = [], 'evidence:browser'],
]) {
  test(`Release ledger blocks ${name}`, () => {
    const input = fixture()
    mutate(input)
    const result = evaluatePackage(input)
    assert.equal(result.status, 'blocked')
    assert(result.blockers.some(blocker => blocker.kind === kind))
  })
}

test('Release ledger maps dependency risks without generic review owners tainting unrelated packages', () => {
  const names = ['core', 'hls', 'cast', 'site']
  const edges = [{ consumer: 'hls', dependency: 'core' }, { consumer: 'cast', dependency: 'core' }, { consumer: 'site', dependency: 'hls' }]
  assert.deepEqual(dependencyClosure('cast', names, edges), ['cast', 'core'])
  assert.deepEqual(dependencyClosure('site', names, edges), ['core', 'hls', 'site'])
  assert.deepEqual(dependencyClosure('cast', names, edges, ['unknown-import']), [...names].sort())
  const tasks = new Map([['HLS-01', { scope: ['hls'] }], ['REVIEW-02', { scope: ['workspace'] }]])
  assert.deepEqual(findingPackages({ owners: ['HLS-01', 'REVIEW-02'] }, tasks, names), ['hls'])
  assert.deepEqual(findingPackages({ owners: ['REVIEW-02'] }, tasks, names), names)
})

function temp(t) {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'artplayer-ledger-test-'))
  t.after(() => {
    const resolved = fs.realpathSync(directory)
    assert.equal(path.dirname(resolved), fs.realpathSync(os.tmpdir()))
    assert(path.basename(resolved).startsWith('artplayer-ledger-test-'))
    fs.rmSync(resolved, { recursive: true, force: true })
  })
  const save = (file, value) => {
    fs.mkdirSync(path.dirname(path.join(directory, file)), { recursive: true })
    fs.writeFileSync(path.join(directory, file), value)
  }
  return { directory, save }
}

test('Release ledger hashes actual report and underlying artifacts; replaced bytes cannot pass', (t) => {
  const { directory, save } = temp(t)
  save('actual.log', 'actual observed output')
  const report = { schemaVersion: 1, result: 'pass', artifacts: [{ path: 'actual.log', sha256: hash('actual observed output') }] }
  save('report.json', JSON.stringify(report))
  const binding = { path: 'report.json', sha256: hash(JSON.stringify(report)) }
  assert.deepEqual(checkedReport(directory, binding).errors, [])
  save('actual.log', 'different output')
  assert.match(checkedReport(directory, binding).errors[0], /Underlying evidence changed/)
  save('report.json', '{}')
  assert.match(checkedReport(directory, binding).errors[0], /Report bytes changed/)
  assert.throws(() => localFile(directory, '../outside'), /escapes/)
})

test('Release input hashing isolates unrelated package edits but invalidates shared lock/test and dependencies', (t) => {
  const { directory, save } = temp(t)
  const files = ['packages/core/src.js', 'packages/hls/src.js', 'packages/cast/src.js', 'yarn.lock', 'test/shared.js', 'refactor/baselines/hls-sdk-matrix.json', 'refactor/release-reviews.md']
  files.forEach(file => save(file, 'original'))
  const fingerprint = () => fingerprintOf(fingerprintInputs(directory, files, ['core', 'cast'], false))
  const before = fingerprint()
  save('packages/hls/src.js', 'unrelated')
  assert.equal(fingerprint(), before)
  for (const file of ['packages/core/src.js', 'packages/cast/src.js', 'yarn.lock', 'test/shared.js', 'refactor/baselines/hls-sdk-matrix.json', 'refactor/release-reviews.md']) {
    save(file, 'changed')
    assert.notEqual(fingerprint(), before)
    save(file, 'original')
  }
})

test('Release input fingerprint normalizes text EOL but records raw bytes and preserves binary differences', (t) => {
  const { directory, save } = temp(t)
  const files = ['packages/core/src.ts', 'packages/core/font.woff2']
  save(files[0], 'line1\r\nline2\r\n')
  save(files[1], 'binary\r\n')
  const before = fingerprintInputs(directory, files, ['core'], false)
  save(files[0], 'line1\nline2\n')
  const after = fingerprintInputs(directory, files, ['core'], false)
  assert.equal(fingerprintOf(before), fingerprintOf(after))
  assert.notDeepEqual(before, after)
  save(files[1], 'binary\n')
  assert.notEqual(fingerprintOf(before), fingerprintOf(fingerprintInputs(directory, files, ['core'], false)))
})

test('Release ledger requires exactly22 packages, all reviews and site-specific distribution', () => {
  const ledger = JSON.parse(fs.readFileSync(path.join(root, 'refactor/release-ledger.json')))
  const inventory = JSON.parse(fs.readFileSync(path.join(root, 'refactor/package-inventory.json'))).packages
  const tasks = new Map(sharedTasks.map(id => [id, {}]))
  validateLedger(ledger, inventory, tasks)
  assert.equal(ledger.packages.length, 22)
  assert.equal(ledger.packages.find(row => row.name === 'artplayer-vitepress').distribution, 'site')
  assert.deepEqual(ledger.siteGates, siteGates)
  for (const mutate of [data => data.packages.pop(), data => data.libraryGates.pop(), data => data.sharedTasks.pop(), data => data.packages.find(row => row.distribution === 'site').distribution = 'npm']) {
    const changed = structuredClone(ledger)
    mutate(changed)
    assert.throws(() => validateLedger(changed, inventory, tasks))
  }
})

test('Release candidate verifies site output bytes and refuses using an npm artifact for site scope', (t) => {
  const { directory, save } = temp(t)
  execFileSync('git', ['init', '-q', directory])
  execFileSync('git', ['-c', 'user.name=Ledger test', '-c', 'user.email=ledger@example.invalid', 'commit', '--allow-empty', '-qm', 'fixture'], { cwd: directory })
  const sourceCommit = execFileSync('git', ['rev-parse', 'HEAD'], { cwd: directory, encoding: 'utf8' }).trim()
  save('output/index.html', '<html>verified build</html>')
  const manifest = JSON.stringify({ package: 'site', version: '2.0.0', outputRoot: 'output', files: [{ path: 'output/index.html', sha256: hash('<html>verified build</html>') }] })
  save('manifest.json', manifest)
  const row = { name: 'site', distribution: 'site', candidate: { kind: 'site-manifest', path: 'manifest.json', sourceCommit, version: '2.0.0', integrity: `sha512-${hash(manifest, 'sha512', 'base64')}` } }
  assert.deepEqual(checkedCandidate(directory, row).errors, [])
  save('output/index.html', 'stale')
  assert.match(checkedCandidate(directory, row).errors[0], /Site build changed/)
  save('output/extra.js', 'unlisted build output')
  assert.match(checkedCandidate(directory, row).errors[0], /Site output inventory differs/)
  row.candidate.kind = 'npm-tarball'
  assert.match(checkedCandidate(directory, row).errors[0], /Site requires/)
})

test('Release candidate checks actual tarball manifest and detects digest/version/name mismatches', (t) => {
  const { directory, save } = temp(t)
  execFileSync('git', ['init', '-q', directory])
  execFileSync('git', ['-c', 'user.name=Ledger test', '-c', 'user.email=ledger@example.invalid', 'commit', '--allow-empty', '-qm', 'fixture'], { cwd: directory })
  const sourceCommit = execFileSync('git', ['rev-parse', 'HEAD'], { cwd: directory, encoding: 'utf8' }).trim()
  save('staging/package/package.json', JSON.stringify({ name: 'example', version: '2.0.0' }))
  execFileSync('tar', ['-czf', path.join(directory, 'candidate.tgz'), '-C', path.join(directory, 'staging'), 'package'])
  const integrity = `sha512-${hash(fs.readFileSync(path.join(directory, 'candidate.tgz')), 'sha512', 'base64')}`
  const row = { name: 'example', distribution: 'npm', candidate: { kind: 'npm-tarball', path: 'candidate.tgz', integrity, version: '2.0.0', sourceCommit } }
  assert.deepEqual(checkedCandidate(directory, row).errors, [])
  row.candidate.version = '2.1.0'
  assert.match(checkedCandidate(directory, row).errors[0], /Tarball version mismatch/)
  row.candidate.version = '2.0.0'
  row.name = 'wrong'
  assert.match(checkedCandidate(directory, row).errors[0], /Tarball package name mismatch/)
  row.name = 'example'
  save('candidate.tgz', 'tampered')
  assert.match(checkedCandidate(directory, row).errors[0], /Candidate integrity mismatch/)
})
