import assert from 'node:assert/strict'
import { createHash } from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'

const root = path.resolve(fileURLToPath(new URL('../../', import.meta.url)))
const digest = bytes => createHash('sha256').update(bytes).digest('hex')

export function versionObservation(status, metadata, target) {
  assert(status === 200 || status === 404, `Registry status is not an absence observation: ${status}`)
  assert(metadata && typeof metadata === 'object' && !Array.isArray(metadata), 'Malformed registry metadata')
  if (status === 404) {
    assert(metadata.error === 'Not found', 'Unexpected registry 404 response')
    return { nameState: 'not-found', targetState: 'not-observed', tags: {}, activeVersions: [], historicalVersions: [], majorConflicts: [], ownershipVerified: false }
  }
  assert(typeof metadata.name === 'string', 'Registry metadata has no package name')
  assert((metadata.versions && typeof metadata.versions === 'object' && !Array.isArray(metadata.versions)) || metadata.time?.unpublished, 'Registry metadata has no versions or unpublish record')
  const activeVersions = Object.keys(metadata.versions || {})
  const historicalVersions = [...new Set([
    ...Object.keys(metadata.time || {}).filter(version => /^\d+\.\d+\.\d+(?:-.+)?$/.test(version)),
    ...metadata.time?.unpublished?.versions || [],
  ])]
  const used = new Set([...activeVersions, ...historicalVersions])
  const major = Number(target.split('.')[0])
  return {
    nameState: metadata.time?.unpublished ? 'unpublished' : 'published',
    targetState: activeVersions.includes(target) ? 'published' : historicalVersions.includes(target) ? 'previously-used' : 'not-observed',
    tags: metadata['dist-tags'] || {},
    activeVersions,
    historicalVersions,
    majorConflicts: [...used].filter(version => /^\d+\.\d+\.\d+$/.test(version) && Number(version.split('.')[0]) >= major),
    prereleasesInTargetMajor: [...used].filter(version => version.startsWith(`${major}.`) && version.includes('-')),
    unpublished: metadata.time?.unpublished || null,
    ownershipVerified: false,
  }
}

export async function observePackage(name, target, fetcher = fetch) {
  assert(/^[a-z0-9]+(?:[.-][a-z0-9]+)*$/.test(name), 'Unexpected package name')
  assert(/^\d+\.0\.0$/.test(target), 'Expected a frozen next-major version')
  const url = `https://registry.npmjs.org/${name}`
  const response = await fetcher(url, { headers: { 'accept': 'application/json', 'cache-control': 'no-cache' }, redirect: 'error', signal: AbortSignal.timeout(30000) })
  const bytes = new Uint8Array(await response.arrayBuffer())
  const metadata = JSON.parse(new TextDecoder().decode(bytes))
  if (response.status === 200)
    assert.equal(metadata.name, name, 'Registry returned a different package')
  return { name, target, url, status: response.status, observedAt: new Date().toISOString(), responseSha256: digest(bytes), responseBytes: bytes.length, ...versionObservation(response.status, metadata, target) }
}

async function main() {
  const [flag, output, ...extra] = process.argv.slice(2)
  assert(flag === '--capture' && output && !extra.length, 'Use --capture <new repository-local JSON file>')
  const destination = path.resolve(root, output)
  assert(destination.startsWith(root + path.sep) && !fs.existsSync(destination), 'Snapshot must be a new repository-local file')
  const ledger = JSON.parse(fs.readFileSync(path.join(root, 'refactor/release-ledger.json'), 'utf8'))
  const targets = ledger.packages.map(row => ({ name: row.name, target: row.targetVersion, distribution: row.distribution }))
  targets.push({ name: 'artplayer-plugin-iframe', target: '2.0.0', distribution: 'historical-name-only' })
  const observations = []
  for (let index = 0; index < targets.length; index += 4) {
    const batch = targets.slice(index, index + 4)
    const results = await Promise.allSettled(batch.map(async item => ({ ...await observePackage(item.name, item.target), distribution: item.distribution })))
    for (let offset = 0; offset < results.length; offset++) {
      const result = results[offset]
      observations.push(result.status === 'fulfilled' ? result.value : { ...batch[offset], error: String(result.reason), targetState: 'unknown' })
    }
  }
  const report = { schemaVersion: 1, capturedAt: new Date().toISOString(), registry: 'https://registry.npmjs.org', policy: 'Absence is an observation, not name ownership, reservation or publication authorization. Previously used versions cannot be reused even after unpublish.', observations }
  fs.mkdirSync(path.dirname(destination), { recursive: true })
  fs.writeFileSync(destination, `${JSON.stringify(report, null, 2)}\n`)
  for (const row of observations)
    console.log(`${row.name}: ${row.nameState || 'error'}, latest=${row.tags?.latest || '-'}, target=${row.target} ${row.targetState}, major-conflicts=${row.majorConflicts?.length ?? '?'}`)
  if (observations.some(row => row.error || (!['site', 'historical-name-only'].includes(row.distribution) && (row.targetState !== 'not-observed' || row.majorConflicts.length))))
    process.exitCode = 1
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url))
  await main()
