import assert from 'node:assert/strict'
import { Buffer } from 'node:buffer'
import fs from 'node:fs'
// eslint-disable-next-line test/no-import-node-test -- Archive verification uses the repository Node baseline runner.
import { test } from 'node:test'
import { ensureArchive, hash, verifyIntegrity } from './releases.mjs'

test('release integrity rejects corrupted bytes and inconsistent frozen digests', () => {
  const bytes = Buffer.from('known release artifact')
  const release = { name: 'fixture', integrity: `sha512-${hash(bytes, 'sha512', 'base64')}`, sha256: hash(bytes) }
  assert.doesNotThrow(() => verifyIntegrity(bytes, release))
  assert.throws(() => verifyIntegrity(Buffer.from('replaced artifact'), release), /Integrity mismatch/)
  assert.throws(() => verifyIntegrity(bytes, { ...release, sha256: '0'.repeat(64) }), /Archive hash mismatch/)
})

test('release cache rejects unsafe package and version path identifiers before I/O', async () => {
  for (const name of ['../hls.js', '.hls', 'hls..js', 'hls/js', 'hls\\js', 'hls.js/evil', '-hls', '@svta/../outside', '@../outside', '@svta/cml/request', '@svta\\cml-request', '@svta+cml-request', '@svta/', '@svta/.hidden'])
    await assert.rejects(ensureArchive({ name, version: '1.5.17' }), /Invalid release identifier/)
  for (const version of ['../1.5.17', '1.5.17/evil', 'latest', '5.3.1-beta/1', '5.3.1-beta\\1', '5.3.1-beta..1', '5.3.1-../outside'])
    await assert.rejects(ensureArchive({ name: 'hls.js', version }), /Invalid release identifier/)
})

test('release cache accepts the fixed historical prerelease without replacing its identity', async () => {
  const baseline = JSON.parse(fs.readFileSync(new URL('../baselines/danmuku-mask-historical-cores.json', import.meta.url), 'utf8'))
  const { release } = baseline.entries.find(entry => entry.requestedVersion === '5.3.1-beta.1')
  assert.equal(release.version, '5.3.1-beta.1')
  const archive = await ensureArchive(release)
  assert(archive.endsWith('artplayer-5.3.1-beta.1.tgz'))
  verifyIntegrity(fs.readFileSync(archive), release)
})
