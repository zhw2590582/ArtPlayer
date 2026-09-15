import assert from 'node:assert/strict'
import { Buffer } from 'node:buffer'
import { createHash } from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import { buildLedger, localFile } from '../../refactor/scripts/release-ledger.mjs'

interface Candidate {
  path: string
  version: string
  sourceCommit: string
  inputFingerprint: string
  integrity: string
  errors: string[]
}

interface PackageRow {
  name: string
  version: string
  distribution: string
  fingerprint: string
  status: string
  blockers: unknown[]
  candidate: Candidate | null
}

export interface LedgerSnapshot {
  schemaVersion: number
  sourceCommit: string
  evidenceComplete: boolean
  publicationAuthorized: boolean
  toolchain: { node: string, canonicalNode: string, packageManager: string, lock: { sha256: string } }
  packages: PackageRow[]
}

const sha256 = (bytes: Uint8Array) => createHash('sha256').update(bytes).digest('hex')
const integrity = (bytes: Uint8Array) => `sha512-${createHash('sha512').update(bytes).digest('base64')}`
const encode = (value: unknown) => Buffer.from(`${JSON.stringify(value, null, 2)}\n`)

function checkBatch(report: LedgerSnapshot, names: string[], tag: string): void {
  assert.equal(report.schemaVersion, 1, 'Unsupported release ledger report')
  assert.equal(report.publicationAuthorized, false, 'A ledger report cannot authorize publication')
  assert(/^[a-f\d]{40}$/.test(report.sourceCommit), 'Missing source commit')
  assert.deepEqual(report.packages.map(row => row.name), names, 'Ledger package selection differs')
  assert(report.evidenceComplete, 'Release preflight is blocked; candidate bundle was not prepared')
  for (const row of report.packages) {
    assert.equal(row.status, 'evidence-complete', `${row.name}: incomplete evidence`)
    assert.deepEqual(row.blockers, [], `${row.name}: blocking findings`)
    assert(['npm', 'renamed-npm', 'recovered-npm'].includes(row.distribution), `${row.name}: site output must not become an npm publication`)
    assert(/^artplayer(?:-[a-z0-9]+)*$/.test(row.name), 'Invalid workspace package name')
    assert(/^\d+\.\d+\.\d+(?:-[a-z0-9]+(?:[.-][a-z0-9]+)*)?$/i.test(row.version), `${row.name}: invalid prepared version`)
    assert(tag !== 'latest' || !row.version.includes('-'), 'Prerelease versions cannot use latest')
    assert(row.candidate, `${row.name}: missing candidate`)
    assert.deepEqual(row.candidate.errors, [], `${row.name}: invalid candidate`)
    assert.equal(row.candidate.version, row.version, `${row.name}: candidate version drift`)
    assert.equal(row.candidate.inputFingerprint, row.fingerprint, `${row.name}: stale candidate`)
    assert(/^[a-f\d]{40}$/.test(row.candidate.sourceCommit), `${row.name}: missing candidate commit`)
  }
}

// inspect is an internal test seam. The CLI always recomputes the repository ledger;
// it does not accept a caller-supplied JSON report as evidence.
export function prepareReleaseBundle(directory: string, names: string[], tag: string, inspect: (directory: string, names: string[]) => LedgerSnapshot = buildLedger) {
  assert(names.length && new Set(names).size === names.length && names.every(name => /^artplayer(?:-[a-z0-9]+)*$/.test(name)), 'Select explicit, unique workspace packages')
  assert(['next', 'alpha', 'beta', 'rc', 'latest'].includes(tag), 'Select next, alpha, beta, rc or latest explicitly')
  directory = fs.realpathSync(directory)
  const initial = inspect(directory, names)
  checkBatch(initial, names, tag)
  const cache = fs.realpathSync(path.join(directory, 'refactor/.cache'))
  assert(cache.startsWith(directory + path.sep), 'Bundle cache escapes repository')
  const stage = fs.mkdtempSync(path.join(cache, 'npm-bundle-'))
  try {
    const packages = initial.packages.map((row) => {
      const candidate = row.candidate!
      const bytes = fs.readFileSync(localFile(directory, candidate.path))
      assert.equal(integrity(bytes), candidate.integrity, `${row.name}: candidate changed after preflight`)
      const file = `${row.name}-${row.version}.tgz`
      const output = path.join(stage, file)
      fs.writeFileSync(output, bytes, { flag: 'wx' })
      assert.equal(sha256(fs.readFileSync(output)), sha256(bytes), `${row.name}: copied artifact differs`)
      return { name: row.name, version: row.version, file, bytes: bytes.length, sha256: sha256(bytes), integrity: candidate.integrity, sourceCommit: candidate.sourceCommit, inputFingerprint: row.fingerprint }
    })
    const final = inspect(directory, names)
    checkBatch(final, names, tag)
    assert.deepEqual(final, initial, 'Release inputs or evidence changed while preparing the bundle')
    for (const item of packages)
      assert.equal(sha256(fs.readFileSync(path.join(stage, item.file))), item.sha256, `${item.name}: staged artifact changed`)
    const preflight = encode(final)
    fs.writeFileSync(path.join(stage, 'preflight.json'), preflight, { flag: 'wx' })
    assert.equal(sha256(fs.readFileSync(path.join(stage, 'preflight.json'))), sha256(preflight), 'Written preflight report differs')
    const manifest = {
      schemaVersion: 1,
      kind: 'artplayer-npm-bundle',
      publicationAuthorized: false,
      sourceCommit: final.sourceCommit,
      registry: 'https://registry.npmjs.org/',
      tag,
      toolchain: final.toolchain,
      preflight: { file: 'preflight.json', sha256: sha256(preflight) },
      packages,
      limitations: ['This bundle is not publication authorization.', 'A future publisher must verify trusted workflow/run provenance, current registry occupancy, all bundle hashes and fresh release evidence before publishing these exact tarballs.'],
    }
    // Completion marker is written last; no directory is returned on failure.
    fs.writeFileSync(path.join(stage, 'manifest.json'), encode(manifest), { flag: 'wx' })
    return { directory: stage, manifest }
  }
  catch (error) {
    try {
      const resolved = fs.realpathSync(stage)
      assert.equal(path.dirname(resolved), cache, 'Refusing redirected bundle cleanup')
      assert(path.basename(resolved).startsWith('npm-bundle-'), 'Refusing unrelated bundle cleanup')
      fs.rmSync(resolved, { recursive: true })
    }
    catch (cleanupError) {
      throw new AggregateError([error, cleanupError], `Bundle preparation failed; inspect retained files at ${stage}`)
    }
    throw error
  }
}
