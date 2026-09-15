import assert from 'node:assert/strict'
import { execFileSync } from 'node:child_process'
import { createHash } from 'node:crypto'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import process from 'node:process'
// eslint-disable-next-line test/no-import-node-test -- Release boundary tests use the existing Node baseline runner.
import test from 'node:test'
import { prepareReleaseBundle } from '../../scripts/release/bundle.ts'
import { verifyReleaseBundle } from '../../scripts/release/verify.ts'

const digest = (bytes, algorithm = 'sha256', encoding = 'hex') => createHash(algorithm).update(bytes).digest(encoding)

// The successful reports below are synthetic. No real ArtPlayer release gate is waived.
function fixture(t) {
  const repository = fs.mkdtempSync(path.join(os.tmpdir(), 'artplayer-verify-test-'))
  fs.mkdirSync(path.join(repository, 'refactor/.cache'), { recursive: true })
  t.after(() => {
    assert.equal(path.dirname(fs.realpathSync(repository)), fs.realpathSync(os.tmpdir()))
    assert(path.basename(repository).startsWith('artplayer-verify-test-'))
    fs.rmSync(repository, { recursive: true })
  })
  const names = ['artplayer', 'artplayer-plugin-chapter']
  const packages = names.map((name) => {
    const source = path.join(repository, name, 'package')
    fs.mkdirSync(source, { recursive: true })
    fs.writeFileSync(path.join(source, 'package.json'), JSON.stringify({ name, version: '6.0.0', main: 'index.js' }))
    fs.writeFileSync(path.join(source, 'index.js'), 'module.exports = 42\n')
    const file = `refactor/.cache/${name}.tgz`
    execFileSync('tar', ['-czf', path.join(repository, file), '-C', path.dirname(source), 'package'], { stdio: 'pipe' })
    const bytes = fs.readFileSync(path.join(repository, file))
    return { name, version: '6.0.0', distribution: 'npm', fingerprint: `input-${name}`, status: 'evidence-complete', blockers: [], candidate: { path: file, version: '6.0.0', sourceCommit: 'a'.repeat(40), inputFingerprint: `input-${name}`, integrity: `sha512-${digest(bytes, 'sha512', 'base64')}`, errors: [] } }
  })
  const report = { schemaVersion: 1, sourceCommit: 'b'.repeat(40), evidenceComplete: true, publicationAuthorized: false, toolchain: { node: 'v24.21.0', canonicalNode: '24.21.0', packageManager: 'yarn@1.22.22', lock: { sha256: 'c'.repeat(64) } }, packages }
  const inspect = () => structuredClone(report)
  const prepared = prepareReleaseBundle(repository, names, 'next', inspect)
  const directory = path.join(repository, 'downloaded')
  fs.cpSync(prepared.directory, directory, { recursive: true })
  const manifestFile = path.join(directory, 'manifest.json')
  const expected = { sourceCommit: report.sourceCommit, manifestSha256: digest(fs.readFileSync(manifestFile)), names, tag: 'next' }
  const verify = (inspector = inspect) => verifyReleaseBundle(repository, directory, expected, inspector)
  const modifyManifest = (change) => {
    const manifest = JSON.parse(fs.readFileSync(manifestFile))
    change(manifest)
    fs.writeFileSync(manifestFile, JSON.stringify(manifest))
    expected.manifestSha256 = digest(fs.readFileSync(manifestFile))
  }
  return { repository, directory, report, expected, verify, inspect, modifyManifest, manifestFile }
}

test('Downloaded bundle is checked against independent inputs and two fresh ledger reads without gaining authority', (t) => {
  const f = fixture(t)
  const before = fs.readdirSync(f.directory).map(name => [name, digest(fs.readFileSync(path.join(f.directory, name)))])
  let reads = 0
  const result = f.verify(() => {
    reads++
    return f.inspect()
  })
  assert.equal(reads, 2)
  assert.equal(result.packages.length, 2)
  assert.equal(result.contentVerified, true)
  assert.equal(result.publicationAuthorized, false)
  assert.equal(result.workflowProvenanceVerified, false)
  assert.equal(result.registryOccupancyVerified, false)
  assert.deepEqual(fs.readdirSync(f.directory).map(name => [name, digest(fs.readFileSync(path.join(f.directory, name)))]), before)
})

test('A changed manifest is rejected before interpreting its report or inspecting the repository', (t) => {
  const f = fixture(t)
  fs.appendFileSync(f.manifestFile, ' ')
  assert.throws(() => f.verify(() => {
    throw new Error('must not inspect')
  }), /independent digest/)
})

test('Self-consistent forged manifest fields cannot replace fresh repository evidence', (t) => {
  const f = fixture(t)
  const original = fs.readFileSync(f.manifestFile)
  const cases = [
    m => m.publicationAuthorized = true,
    m => m.registry = 'https://example.invalid/',
    m => m.tag = 'latest',
    m => m.sourceCommit = 'd'.repeat(40),
    m => m.toolchain.lock.sha256 = 'e'.repeat(64),
    m => m.preflight.sha256 = 'e'.repeat(64),
    m => m.preflight.file = '../preflight.json',
    m => m.packages.reverse(),
    m => m.packages.push(m.packages[0]),
    m => m.packages[0].version = '7.0.0',
    m => m.packages[0].file = '../escape.tgz',
    m => m.packages[0].sha256 = 'e'.repeat(64),
    m => m.packages[0].integrity = 'sha512-forged',
    m => m.packages[0].sourceCommit = 'd'.repeat(40),
    m => m.packages[0].inputFingerprint = 'new-inputs',
    m => m.kind = 'other-bundle',
    m => m.extraApproval = true,
  ]
  for (const change of cases) {
    fs.writeFileSync(f.manifestFile, original)
    f.modifyManifest(change)
    assert.throws(() => f.verify(), /metadata differs/)
  }
})

test('A freshly blocked or changed ledger rejects even an intact formerly accepted bundle', (t) => {
  const f = fixture(t)
  const changes = [
    r => r.evidenceComplete = false,
    r => r.packages[0].status = 'blocked',
    r => r.packages[0].blockers.push('new finding'),
    r => r.packages[0].distribution = 'site',
    r => r.packages[0].candidate.errors.push('changed candidate'),
    r => r.packages[0].candidate.inputFingerprint = 'stale',
    r => r.sourceCommit = 'd'.repeat(40),
    r => r.toolchain.lock.sha256 = 'd'.repeat(64),
  ]
  for (const change of changes) {
    assert.throws(() => f.verify(() => {
      const report = f.inspect()
      change(report)
      return report
    }))
  }
  fs.writeFileSync(path.join(f.directory, 'preflight.json'), JSON.stringify({ ...f.report, extraApproval: true }))
  f.modifyManifest(m => m.preflight.sha256 = digest(fs.readFileSync(path.join(f.directory, 'preflight.json'))))
  assert.throws(() => f.verify(), /Downloaded preflight differs/)
})

test('Changed archive bytes, even if copied into the registered location, cannot reuse candidate integrity', (t) => {
  const f = fixture(t)
  const file = path.join(f.directory, 'artplayer-6.0.0.tgz')
  fs.appendFileSync(file, 'tampered')
  assert.throws(() => f.verify(), /downloaded tarball differs/)
  fs.copyFileSync(file, path.join(f.repository, f.report.packages[0].candidate.path))
  assert.throws(() => f.verify(), /candidate integrity changed/)
})

test('Extra files and missing archives fail without deleting downloaded evidence', (t) => {
  const f = fixture(t)
  fs.writeFileSync(path.join(f.directory, 'extra.sh'), 'exit 1')
  assert.throws(() => f.verify(), /Unexpected or missing bundle files/)
  assert(fs.existsSync(path.join(f.directory, 'extra.sh')))
  fs.unlinkSync(path.join(f.directory, 'extra.sh'))
  fs.unlinkSync(path.join(f.directory, 'artplayer-6.0.0.tgz'))
  assert.throws(() => f.verify(), /ENOENT/)
  assert(fs.existsSync(f.manifestFile))
})

test('Redirected directories, redirected parents and non-file members are rejected', (t) => {
  const f = fixture(t)
  const link = path.join(f.repository, 'redirect')
  fs.symlinkSync(f.directory, link, 'junction')
  assert.throws(() => verifyReleaseBundle(f.repository, link, f.expected, f.inspect), /regular directory|Redirected bundle/)
  const parent = path.join(f.repository, 'redirect-parent')
  fs.symlinkSync(f.repository, parent, 'junction')
  assert.throws(() => verifyReleaseBundle(f.repository, path.join(parent, 'downloaded'), f.expected, f.inspect), /Redirected bundle/)
  fs.unlinkSync(path.join(f.directory, 'artplayer-6.0.0.tgz'))
  fs.symlinkSync(path.join(f.repository, 'artplayer'), path.join(f.directory, 'artplayer-6.0.0.tgz'), 'junction')
  assert.throws(() => f.verify(), /not a regular file/)
})

test('Source or downloaded content changed during verification cannot produce a successful result', (t) => {
  const mutations = [
    f => fs.appendFileSync(f.manifestFile, ' '),
    f => fs.appendFileSync(path.join(f.directory, 'preflight.json'), ' '),
    f => fs.appendFileSync(path.join(f.directory, 'artplayer-6.0.0.tgz'), ' '),
    f => fs.writeFileSync(path.join(f.directory, 'late-file'), ' '),
    f => f.report.toolchain.lock.sha256 = 'd'.repeat(64),
  ]
  for (const mutate of mutations) {
    const f = fixture(t)
    let reads = 0
    assert.throws(() => f.verify(() => {
      if (++reads === 2)
        mutate(f)
      return f.inspect()
    }), /changed during verification/)
    assert.equal(reads, 2)
  }
})

test('Invalid independent selection, tag, source and digest fail before reading downloaded contents', (t) => {
  const f = fixture(t)
  for (const change of [{ names: [] }, { names: ['artplayer', 'artplayer'] }, { names: ['../artplayer'] }, { tag: 'arbitrary' }, { sourceCommit: 'master' }, { manifestSha256: '' }])
    assert.throws(() => verifyReleaseBundle(f.repository, 'not-a-directory', { ...f.expected, ...change }, f.inspect), /Supply|Select/)
})

test('Verifier CLI rejects omitted inputs, unknown options and an unsupported package manager', (t) => {
  const f = fixture(t)
  const script = path.resolve('scripts/verify-release.mjs')
  const full = ['--directory', f.directory, '--packages', f.expected.names.join(','), '--tag', 'next', '--source-commit', f.expected.sourceCommit, '--manifest-sha256', f.expected.manifestSha256]
  for (const [args, message] of [[[], /are required/], [['--unknown'], /Unknown option/], [full, /Use yarn release:verify-bundle/]]) {
    assert.throws(() => execFileSync(process.execPath, [script, ...args], { stdio: 'pipe', env: { ...process.env, npm_config_user_agent: 'npm/11.5.1' } }), (error) => {
      assert.equal(error.status, 1)
      assert.match(error.stderr.toString(), message)
      return true
    })
  }
})

test('A second-inspection exception is preserved and downloaded evidence is retained', (t) => {
  const f = fixture(t)
  const failure = new Error('fresh evidence read failed')
  let reads = 0
  assert.throws(() => f.verify(() => {
    if (++reads === 2)
      throw failure
    return f.inspect()
  }), error => error === failure)
  assert.equal(reads, 2)
  assert(fs.existsSync(f.manifestFile))
})
