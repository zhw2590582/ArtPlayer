import type { LedgerSnapshot } from './bundle.ts'
import type { BundleExpectation } from './verify.ts'
import assert from 'node:assert/strict'
import { buildLedger } from '../../refactor/scripts/release-ledger.mjs'
import { assessRegistry, observeRegistry, registry } from './registry.ts'
import { verifyReleaseBundle } from './verify.ts'

// The CLI supplies a clean-source inspector. Test seams never enter CLI inputs.
export async function checkReleaseRegistry(repository: string, directory: string, expected: BundleExpectation, inspect: (repository: string, names: string[]) => LedgerSnapshot = buildLedger, fetcher: typeof fetch = fetch) {
  const verified = verifyReleaseBundle(repository, directory, expected, inspect)
  const startedAt = new Date().toISOString()
  const packages = []
  for (const candidate of verified.packages)
    packages.push(assessRegistry(candidate, expected.tag, await observeRegistry(candidate.name, fetcher)))
  assert.deepEqual(verifyReleaseBundle(repository, directory, expected, inspect), verified, 'Candidate bundle changed during registry lookup')
  return {
    schemaVersion: 1,
    sourceCommit: verified.sourceCommit,
    manifestSha256: verified.manifestSha256,
    registry,
    tag: expected.tag,
    startedAt,
    finishedAt: new Date().toISOString(),
    packages,
    conflicts: packages.filter(item => item.state === 'conflict').map(item => item.name),
    contentVerified: true,
    workflowProvenanceVerified: false,
    publicationAuthorized: false,
    limitations: ['Read-only metadata observations, not downloaded registry tarball verification or publish permission.', 'Registry state can change immediately; recheck at authorized use time.', 'Not-observed versions may have been unpublished and cannot necessarily be reused.', 'Never execute this report as a publication or tag-change command.'],
  }
}
