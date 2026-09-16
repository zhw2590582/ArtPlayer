import type { LedgerSnapshot } from './bundle.ts'
import assert from 'node:assert/strict'
import { createHash } from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import { buildLedger, localFile } from '../../refactor/scripts/release-ledger.mjs'
import { bundleManifest, checkBatch } from './bundle.ts'

export interface BundleExpectation {
  sourceCommit: string
  manifestSha256: string
  names: string[]
  tag: string
}

const digest = (bytes: Uint8Array, algorithm = 'sha256', encoding: 'hex' | 'base64' = 'hex') => createHash(algorithm).update(bytes).digest(encoding)

function readFile(directory: string, name: string) {
  assert(name && path.basename(name) === name && !/[\\/:]/.test(name) && name !== '.' && name !== '..', 'Bundle member must be a single filename')
  const file = path.join(directory, name)
  assert(fs.lstatSync(file).isFile(), `Bundle member is not a regular file: ${name}`)
  assert.equal(fs.realpathSync(file), file, `Redirected bundle member: ${name}`)
  return fs.readFileSync(file)
}

// The CLI computes inspect from the current repository. A downloaded report is
// never used to decide whether the current candidate's release gates have passed.
export function verifyReleaseBundle(repository: string, directory: string, expected: BundleExpectation, inspect: (repository: string, names: string[]) => LedgerSnapshot = buildLedger) {
  assert(/^[a-f\d]{40}$/.test(expected.sourceCommit), 'Supply the independently expected source commit')
  assert(/^[a-f\d]{64}$/.test(expected.manifestSha256), 'Supply the independently expected manifest SHA-256')
  assert(expected.names.length && new Set(expected.names).size === expected.names.length && expected.names.every(name => /^artplayer(?:-[a-z0-9]+)*$/.test(name)), 'Select explicit, unique workspace packages')
  assert(['next', 'alpha', 'beta', 'rc', 'latest'].includes(expected.tag), 'Select an explicit supported tag')
  repository = fs.realpathSync(repository)
  directory = path.resolve(directory)
  assert(fs.lstatSync(directory).isDirectory(), 'Bundle path is not a regular directory')
  assert.equal(fs.realpathSync(directory), directory, 'Redirected bundle directory')
  const initialFiles = fs.readdirSync(directory).sort()
  const bytes = readFile(directory, 'manifest.json')
  assert.equal(digest(bytes), expected.manifestSha256, 'Bundle manifest differs from the independent digest')
  // JSON stays untrusted until exact comparison with a freshly computed manifest.
  const manifest = JSON.parse(bytes.toString('utf8')) as Record<string, unknown>
  const fresh = inspect(repository, expected.names)
  checkBatch(fresh, expected.names, expected.tag)
  assert.equal(fresh.sourceCommit, expected.sourceCommit, 'Current source differs from the expected commit')
  const preflight = readFile(directory, 'preflight.json')
  assert.deepEqual(JSON.parse(preflight.toString('utf8')), fresh, 'Downloaded preflight differs from the fresh repository ledger')
  const packages = fresh.packages.map((row) => {
    const candidate = row.candidate!
    const file = `${row.name}-${row.version}.tgz`
    const packed = readFile(directory, file)
    const registered = fs.readFileSync(localFile(repository, candidate.path))
    assert.deepEqual(packed, registered, `${row.name}: downloaded tarball differs from registered candidate`)
    assert.equal(`sha512-${digest(packed, 'sha512', 'base64')}`, candidate.integrity, `${row.name}: candidate integrity changed`)
    return { name: row.name, version: row.version, file, bytes: packed.length, sha256: digest(packed), integrity: candidate.integrity, sourceCommit: candidate.sourceCommit, inputFingerprint: row.fingerprint }
  })
  assert.deepEqual(manifest, bundleManifest(fresh, expected.tag, digest(preflight), packages), 'Bundle metadata differs from the freshly verified candidate batch')
  assert.deepEqual(initialFiles, ['manifest.json', 'preflight.json', ...packages.map(pkg => pkg.file)].sort(), 'Unexpected or missing bundle files')
  const final = inspect(repository, expected.names)
  checkBatch(final, expected.names, expected.tag)
  assert.deepEqual(final, fresh, 'Release inputs or evidence changed during verification')
  assert.deepEqual(fs.readdirSync(directory).sort(), initialFiles, 'Bundle membership changed during verification')
  assert.deepEqual(readFile(directory, 'manifest.json'), bytes, 'Bundle manifest changed during verification')
  assert.deepEqual(readFile(directory, 'preflight.json'), preflight, 'Bundle preflight changed during verification')
  for (const item of packages)
    assert.equal(digest(readFile(directory, item.file)), item.sha256, `${item.name}: bundle changed during verification`)
  return { sourceCommit: fresh.sourceCommit, manifestSha256: expected.manifestSha256, packages, contentVerified: true, workflowProvenanceVerified: false, registryOccupancyVerified: false, publicationAuthorized: false }
}
