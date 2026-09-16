import assert from 'node:assert/strict'
import { Buffer } from 'node:buffer'
import { createHash } from 'node:crypto'

export const registry = 'https://registry.npmjs.org/'
const versionPattern = /^\d+\.\d+\.\d+(?:-[a-z0-9]+(?:[.-][a-z0-9]+)*)?$/i
const maxBytes = 10 * 1024 * 1024

export interface RegistryObservation {
  url: string
  observedAt: string
  status: 200 | 404
  sha256: string
  metadata: unknown
}

function record(value: unknown): Record<string, unknown> {
  assert(value !== null && typeof value === 'object' && !Array.isArray(value), 'Invalid registry object')
  return value as Record<string, unknown>
}

function own(value: Record<string, unknown>, key: string): unknown {
  return Object.hasOwn(value, key) ? value[key] : undefined
}

function validateName(name: string): void {
  assert(/^artplayer(?:-[a-z0-9]+)*$/.test(name), 'Invalid workspace package name')
}

// No npmrc, credentials, redirects, lifecycle commands or registry writes.
export async function observeRegistry(name: string, fetcher: typeof fetch = fetch): Promise<RegistryObservation> {
  validateName(name)
  const url = `${registry}${name}`
  const response = await fetcher(url, { method: 'GET', headers: { 'accept': 'application/json', 'cache-control': 'no-cache' }, redirect: 'error', signal: AbortSignal.timeout(15000) })
  if (response.status !== 200 && response.status !== 404) {
    await response.body?.cancel()
    throw new Error(`${name}: registry HTTP ${response.status}`)
  }
  assert(response.body, `${name}: empty registry response`)
  const reader = response.body.getReader()
  const chunks: Uint8Array[] = []
  let length = 0
  try {
    while (true) {
      const chunk = await reader.read()
      if (chunk.done)
        break
      length += chunk.value.byteLength
      assert(length <= maxBytes, `${name}: registry response exceeds 10 MiB`)
      chunks.push(chunk.value)
    }
  }
  finally {
    await reader.cancel()
    reader.releaseLock()
  }
  const bytes = Buffer.concat(chunks)
  return { url, status: response.status, observedAt: new Date().toISOString(), sha256: createHash('sha256').update(bytes).digest('hex'), metadata: JSON.parse(bytes.toString('utf8')) as unknown }
}

export function assessRegistry(candidate: { name: string, version: string, integrity: string }, tag: string, observation: RegistryObservation) {
  const { name, version, integrity } = candidate
  validateName(name)
  assert(versionPattern.test(version), 'Invalid candidate version')
  assert(/^sha512-[A-Za-z0-9+/]{86}==$/.test(integrity), 'Candidate requires exact SHA-512 integrity')
  assert(['next', 'alpha', 'beta', 'rc', 'latest'].includes(tag), 'Unsupported release tag')
  assert(tag !== 'latest' || !version.includes('-'), 'Prerelease versions cannot use latest')
  assert.equal(observation.url, `${registry}${name}`, 'Registry observation package differs')
  const document = record(observation.metadata)
  const base = { name, version, integrity, tag, observedAt: observation.observedAt, responseSha256: observation.sha256, httpStatus: observation.status }
  if (observation.status === 404) {
    assert.equal(own(document, 'error'), 'Not found', 'Unrecognized registry 404 response')
    return { ...base, state: 'not-observed', currentTag: null, reason: 'Package not found; prior publication and publish permission are unknown.' }
  }
  assert.equal(observation.status, 200, 'Unexpected registry status')
  assert.equal(own(document, 'name'), name, 'Registry package identity differs')
  const time = own(document, 'time')
  const timestamps = time === undefined ? {} : record(time)
  if (own(timestamps, 'unpublished') !== undefined)
    return { ...base, state: 'conflict', currentTag: null, reason: 'Registry records an unpublished package; do not attempt version reuse.' }
  const versions = record(own(document, 'versions'))
  const tags = record(own(document, 'dist-tags'))
  for (const value of Object.values(tags))
    assert(typeof value === 'string' && versionPattern.test(value), 'Invalid registry dist-tag version')
  const currentTag = own(tags, tag) as string | undefined
  const existing = own(versions, version)
  if (existing === undefined) {
    assert(currentTag !== version, 'Registry tag points to a missing candidate version')
    const previouslyPublished = own(timestamps, version) !== undefined
    return { ...base, state: previouslyPublished ? 'conflict' : 'not-observed', currentTag: currentTag ?? null, reason: previouslyPublished ? 'Registry retains this version in publication history.' : 'Version not found; absence does not prove it can be published.' }
  }
  const published = record(existing)
  assert.equal(own(published, 'name'), name, 'Registry version package identity differs')
  assert.equal(own(published, 'version'), version, 'Registry version identity differs')
  const dist = own(published, 'dist')
  const actual = dist === undefined ? undefined : own(record(dist), 'integrity')
  if (actual !== integrity)
    return { ...base, state: 'conflict', currentTag: currentTag ?? null, reason: 'Published integrity differs or is missing; never overwrite or republish.' }
  return { ...base, state: currentTag === version ? 'already-present' : 'tag-change-required', currentTag: currentTag ?? null, reason: 'Registry SHA-512 matches; do not republish. Tag changes require separate authorization.' }
}
