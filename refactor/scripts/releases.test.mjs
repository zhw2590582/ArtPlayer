import assert from 'node:assert/strict'
import { test } from 'node:test'
import { hash, verifyIntegrity } from './releases.mjs'

test('release integrity rejects corrupted bytes and inconsistent frozen digests', () => {
  const bytes = Buffer.from('known release artifact')
  const release = { name: 'fixture', integrity: `sha512-${hash(bytes, 'sha512', 'base64')}`, sha256: hash(bytes) }
  assert.doesNotThrow(() => verifyIntegrity(bytes, release))
  assert.throws(() => verifyIntegrity(Buffer.from('replaced artifact'), release), /Integrity mismatch/)
  assert.throws(() => verifyIntegrity(bytes, { ...release, sha256: '0'.repeat(64) }), /Archive hash mismatch/)
})
