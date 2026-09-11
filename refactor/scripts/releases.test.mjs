import assert from 'node:assert/strict'
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
  for (const name of ['../hls.js', '.hls', 'hls..js', 'hls/js', 'hls\\js', 'hls.js/evil', '-hls'])
    await assert.rejects(ensureArchive({ name, version: '1.5.17' }), /Invalid release identifier/)
  for (const version of ['../1.5.17', '1.5.17/evil', 'latest'])
    await assert.rejects(ensureArchive({ name: 'hls.js', version }), /Invalid release identifier/)
})
