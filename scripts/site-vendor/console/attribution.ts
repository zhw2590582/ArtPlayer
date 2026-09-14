import assert from 'node:assert/strict'
import { Buffer } from 'node:buffer'
import { createHash } from 'node:crypto'
import { hash } from './provenance.ts'

export interface GitSource { source: string, sha256: string, gitBlobSha: string, apiUrl: string }

export function verifyGitSource(bytes: Uint8Array, source: GitSource): void {
  assert.equal(hash(bytes), source.sha256, 'Fixed Git source content changed')
  const blob = createHash('sha1').update(`blob ${bytes.byteLength}\0`).update(bytes).digest('hex')
  assert.equal(blob, source.gitBlobSha, 'Fixed Git blob identity differs')
}

export function decodeGitSource(response: Uint8Array, source: GitSource): Uint8Array {
  const data: { encoding: string, content: string } = JSON.parse(Buffer.from(response).toString('utf8'))
  assert.equal(data.encoding, 'base64', 'Unexpected Git source encoding')
  assert.equal(typeof data.content, 'string', 'Missing Git source content')
  const bytes = Buffer.from(data.content, 'base64')
  verifyGitSource(bytes, source)
  return bytes
}

export function verifyForkOutput(compiled: string, target: string): void {
  const marker = '//# sourceMappingURL=data:application/json;base64,'
  const start = target.indexOf(marker)
  assert(start >= 0 && !target.includes(marker, start + 1), 'Expected one terminal inline source map')
  assert(/^[A-Z0-9+/=]+$/i.test(target.slice(start + marker.length)), 'Unexpected inline source map trailer')
  assert.equal(compiled, target.slice(0, start), 'Fork compiled runtime differs')
}
