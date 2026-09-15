import assert from 'node:assert/strict'
import { execFileSync } from 'node:child_process'
import { createHash } from 'node:crypto'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
// eslint-disable-next-line test/no-import-node-test -- Filesystem fault injection uses the existing Node baseline runner.
import test from 'node:test'
import { prepareReleaseBundle } from '../../scripts/release/bundle.ts'
import { assertCleanSource } from '../../scripts/release/prepare.ts'

const digest = (bytes, algorithm = 'sha256', encoding = 'hex') => createHash(algorithm).update(bytes).digest(encoding)

// These are synthetic complete reports, not release evidence for an actual package.
function fixture(t, names = ['artplayer', 'artplayer-plugin-chapter']) {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'artplayer-bundle-test-'))
  const cache = path.join(directory, 'refactor/.cache')
  fs.mkdirSync(cache, { recursive: true })
  t.after(() => {
    const resolved = fs.realpathSync(directory)
    assert.equal(path.dirname(resolved), fs.realpathSync(os.tmpdir()))
    assert(path.basename(resolved).startsWith('artplayer-bundle-test-'))
    fs.rmSync(resolved, { recursive: true })
  })
  const packages = names.map((name) => {
    const version = '2.0.0'
    const source = path.join(directory, name, 'package')
    fs.mkdirSync(source, { recursive: true })
    fs.writeFileSync(path.join(source, 'package.json'), JSON.stringify({ name, version, main: 'index.js' }))
    fs.writeFileSync(path.join(source, 'index.js'), 'module.exports = 42\n')
    const filename = `refactor/.cache/${name}.tgz`
    execFileSync('tar', ['-czf', path.join(directory, filename), '-C', path.dirname(source), 'package'], { stdio: 'pipe' })
    const bytes = fs.readFileSync(path.join(directory, filename))
    return { name, version, distribution: 'npm', fingerprint: 'frozen-inputs', status: 'evidence-complete', blockers: [], candidate: { path: filename, version, sourceCommit: 'a'.repeat(40), inputFingerprint: 'frozen-inputs', integrity: `sha512-${digest(bytes, 'sha512', 'base64')}`, errors: [] } }
  })
  const report = { schemaVersion: 1, sourceCommit: 'b'.repeat(40), evidenceComplete: true, publicationAuthorized: false, toolchain: { node: 'v24.21.0', canonicalNode: '24.21.0', packageManager: 'yarn@1.22.22', lock: { sha256: 'c'.repeat(64) } }, packages }
  const stages = () => fs.readdirSync(cache).filter(name => name.startsWith('npm-bundle-'))
  return { directory, cache, names, report, stages, inspect: () => structuredClone(report) }
}

test('Release bundle copies exact tarballs and binds the final ledger without publication authority', (t) => {
  const f = fixture(t)
  let inspected = 0
  const result = prepareReleaseBundle(f.directory, f.names, 'next', () => {
    inspected++
    return f.inspect()
  })
  assert.equal(inspected, 2)
  const manifest = JSON.parse(fs.readFileSync(path.join(result.directory, 'manifest.json')))
  assert.deepEqual(manifest, result.manifest)
  assert.equal(manifest.publicationAuthorized, false)
  assert.equal(manifest.registry, 'https://registry.npmjs.org/')
  assert.equal(manifest.tag, 'next')
  assert.equal(manifest.sourceCommit, f.report.sourceCommit)
  assert.equal(manifest.preflight.sha256, digest(fs.readFileSync(path.join(result.directory, 'preflight.json'))))
  assert.deepEqual(JSON.parse(fs.readFileSync(path.join(result.directory, 'preflight.json'))), f.report)
  for (const item of manifest.packages) {
    const original = f.report.packages.find(row => row.name === item.name)
    const bytes = fs.readFileSync(path.join(result.directory, item.file))
    assert.deepEqual(bytes, fs.readFileSync(path.join(f.directory, original.candidate.path)))
    assert.equal(item.sha256, digest(bytes))
    assert.equal(item.integrity, `sha512-${digest(bytes, 'sha512', 'base64')}`)
    assert.equal(item.sourceCommit, original.candidate.sourceCommit)
  }
  assert.equal(f.stages().length, 1)
})

for (const [name, mutate, expected] of [
  ['incomplete preflight', r => r.evidenceComplete = false, /preflight is blocked/],
  ['incomplete package', r => r.packages[0].status = 'blocked', /incomplete evidence/],
  ['blocked package', r => r.packages[0].blockers.push('device'), /blocking findings/],
  ['missing candidate', r => r.packages[0].candidate = null, /missing candidate/],
  ['candidate errors', r => r.packages[0].candidate.errors.push('changed'), /invalid candidate/],
  ['stale fingerprint', r => r.packages[0].fingerprint = 'new', /stale candidate/],
  ['version mismatch', r => r.packages[0].version = '3.0.0', /version drift/],
  ['site distribution', r => r.packages[0].distribution = 'site', /site output/],
  ['implicit approval', r => r.publicationAuthorized = true, /cannot authorize/],
  ['missing source identity', r => r.sourceCommit = 'master', /source commit/],
  ['missing candidate identity', r => r.packages[0].candidate.sourceCommit = 'master', /candidate commit/],
  ['different selected packages', r => r.packages.reverse(), /selection differs/],
  ['path-like version', r => r.packages[0].version = '../../elsewhere', /invalid prepared version/],
]) {
  test(`Release bundle rejects ${name} before creating output`, (t) => {
    const f = fixture(t)
    mutate(f.report)
    assert.throws(() => prepareReleaseBundle(f.directory, f.names, 'next', f.inspect), expected)
    assert.deepEqual(f.stages(), [])
  })
}

test('Release bundle rejects empty, duplicate, path-like package selections and unapproved tag syntax', (t) => {
  const f = fixture(t)
  for (const names of [[], ['artplayer', 'artplayer'], ['../artplayer'], ['Artplayer']])
    assert.throws(() => prepareReleaseBundle(f.directory, names, 'next', f.inspect), /explicit, unique/)
  for (const tag of ['', '1.0.0', '--tag=latest', 'NEXT'])
    assert.throws(() => prepareReleaseBundle(f.directory, f.names, tag, f.inspect), /Select next/)
  assert.deepEqual(f.stages(), [])
})

test('Release bundle prevents assigning latest to prerelease candidates', (t) => {
  const f = fixture(t)
  f.report.packages[0].version = f.report.packages[0].candidate.version = '2.0.0-rc.1'
  assert.throws(() => prepareReleaseBundle(f.directory, f.names, 'latest', f.inspect), /Prerelease versions/)
})

test('Release bundle removes partial copies when a later candidate changed', (t) => {
  const f = fixture(t)
  fs.appendFileSync(path.join(f.directory, f.report.packages[1].candidate.path), 'changed after inspection')
  assert.throws(() => prepareReleaseBundle(f.directory, f.names, 'next', f.inspect), /changed after preflight/)
  assert.deepEqual(f.stages(), [])
})

test('Release bundle rejects a candidate path outside the repository without deleting that file', (t) => {
  const f = fixture(t)
  const other = fixture(t, ['artplayer'])
  const original = path.join(other.directory, other.report.packages[0].candidate.path)
  const bytes = fs.readFileSync(original)
  f.report.packages[0].candidate.path = path.relative(f.directory, original).replaceAll('\\', '/')
  assert.throws(() => prepareReleaseBundle(f.directory, f.names, 'next', f.inspect), /path|repository/i)
  assert.deepEqual(fs.readFileSync(original), bytes)
  assert.deepEqual(f.stages(), [])
})

test('Release bundle does not prepare from inputs or evidence changed during the copy', (t) => {
  const f = fixture(t)
  let reads = 0
  assert.throws(() => prepareReleaseBundle(f.directory, f.names, 'next', () => {
    const report = f.inspect()
    if (++reads === 2)
      report.toolchain.lock.sha256 = 'd'.repeat(64)
    return report
  }), /changed while preparing/)
  assert.deepEqual(f.stages(), [])
})

test('Release bundle rejects previously copied files changed during the final ledger read', (t) => {
  const f = fixture(t)
  let reads = 0
  assert.throws(() => prepareReleaseBundle(f.directory, f.names, 'next', () => {
    if (++reads === 2) {
      const [stage] = f.stages()
      fs.appendFileSync(path.join(f.cache, stage, 'artplayer-2.0.0.tgz'), 'changed output')
    }
    return f.inspect()
  }), /staged artifact changed/)
  assert.deepEqual(f.stages(), [])
})

test('Release bundle source guard rejects untracked, staged and unstaged changes but allows ignored outputs', (t) => {
  const f = fixture(t)
  const git = args => execFileSync('git', args, { cwd: f.directory, stdio: 'pipe' })
  git(['init', '--quiet'])
  fs.writeFileSync(path.join(f.directory, '.gitignore'), 'refactor/.cache/\n')
  git(['add', '.'])
  git(['-c', 'user.name=ArtPlayer test', '-c', 'user.email=test@example.invalid', '-c', 'commit.gpgsign=false', 'commit', '-qm', 'fixture'])
  assert.doesNotThrow(() => assertCleanSource(f.directory))
  fs.writeFileSync(path.join(f.directory, 'new.txt'), 'untracked')
  assert.throws(() => assertCleanSource(f.directory), /Commit source/)
  git(['add', 'new.txt'])
  assert.throws(() => assertCleanSource(f.directory), /Commit source/)
  git(['-c', 'user.name=ArtPlayer test', '-c', 'user.email=test@example.invalid', '-c', 'commit.gpgsign=false', 'commit', '-qm', 'fixture addition'])
  fs.appendFileSync(path.join(f.directory, 'new.txt'), 'unstaged')
  assert.throws(() => assertCleanSource(f.directory), /Commit source/)
})

test('Release bundle preserves the original falsy failure while deleting partial output', (t) => {
  const f = fixture(t)
  let reads = 0
  let threw = false
  try {
    prepareReleaseBundle(f.directory, f.names, 'next', () => {
      if (++reads === 2) {
        // eslint-disable-next-line no-throw-literal -- Preserve the original thrown primitive, including undefined.
        throw undefined
      }
      return f.inspect()
    })
  }
  catch (error) {
    threw = true
    assert.equal(error, undefined)
  }
  assert.equal(threw, true)
  assert.deepEqual(f.stages(), [])
})

test('Release bundle reports both preparation and cleanup failures without an approval marker', (t) => {
  const f = fixture(t)
  const cleanupError = new Error('test removal denied')
  const preparationError = new Error('test ledger read failed')
  let reads = 0
  const mocked = t.mock.method(fs, 'rmSync', () => {
    throw cleanupError
  })
  assert.throws(() => prepareReleaseBundle(f.directory, f.names, 'next', () => {
    if (++reads === 2)
      throw preparationError
    return f.inspect()
  }), (error) => {
    assert(error instanceof AggregateError)
    assert.deepEqual(error.errors, [preparationError, cleanupError])
    return true
  })
  mocked.mock.restore()
  const [stage] = f.stages()
  assert(stage)
  assert.equal(fs.existsSync(path.join(f.cache, stage, 'manifest.json')), false)
})

test('Release bundle rejects a candidate symlink that resolves outside the repository', (t) => {
  const f = fixture(t)
  const other = fixture(t, ['artplayer'])
  fs.symlinkSync(other.directory, path.join(f.directory, 'redirect'), 'junction')
  f.report.packages[0].candidate.path = 'redirect/refactor/.cache/artplayer.tgz'
  assert.throws(() => prepareReleaseBundle(f.directory, f.names, 'next', f.inspect), /escapes repository/)
  assert.deepEqual(f.stages(), [])
  assert(fs.existsSync(path.join(other.directory, other.report.packages[0].candidate.path)))
})

test('Release bundle refuses a cache redirected outside the repository before writing there', (t) => {
  const f = fixture(t)
  const other = fixture(t, ['artplayer'])
  const before = fs.readdirSync(other.cache)
  fs.renameSync(f.cache, `${f.cache}-original`)
  fs.symlinkSync(other.cache, f.cache, 'junction')
  assert.throws(() => prepareReleaseBundle(f.directory, f.names, 'next', f.inspect), /cache escapes repository/)
  assert.deepEqual(fs.readdirSync(other.cache), before)
})
