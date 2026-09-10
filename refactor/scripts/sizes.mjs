import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { brotliCompressSync, constants, gzipSync } from 'node:zlib'
import { ensureArchive, hash, readMember, refactorDir } from './releases.mjs'

const reportPath = path.join(refactorDir, 'baselines/sizes.json')
export function measureBytes(bytes) {
  return { sha256: hash(bytes), raw: bytes.length, gzip9: gzipSync(bytes, { level: 9 }).length, brotli6: brotliCompressSync(bytes, { params: { [constants.BROTLI_PARAM_QUALITY]: 6 } }).length }
}
export async function publishedSizes() {
  const releases = JSON.parse(fs.readFileSync(path.join(refactorDir, 'baselines/releases.json'), 'utf8')).releases
  const result = []
  for (const release of releases) {
    const archive = await ensureArchive(release)
    for (const member of Object.keys(release.files).filter(name => /\.(m?js)$/.test(name)).sort()) {
      const sizes = measureBytes(readMember(archive, member))
      assert.equal(sizes.sha256, release.files[member])
      result.push({ name: release.name, version: release.version, path: member, ...sizes })
    }
  }
  return result
}
export function validateSizes(report) {
  assert.equal(report.schemaVersion, 1)
  for (const source of ['published', 'workspaceObserved']) {
    for (const item of report[source]) {
      assert(/^[a-f0-9]{64}$/.test(item.sha256))
      for (const key of ['raw', 'gzip9', 'brotli6']) assert(Number.isInteger(item[key]) && item[key] > 0, 'Invalid bundle size')
    }
  }
  const packages = JSON.parse(fs.readFileSync(path.join(refactorDir, 'package-inventory.json'), 'utf8')).packages.filter(pkg => pkg.name !== 'artplayer-vitepress').map(pkg => pkg.name).sort()
  assert.deepEqual([...new Set(report.workspaceObserved.map(item => item.name))].sort(), packages, 'Missing library size inventory')
}
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const published = await publishedSizes()
  if (process.argv.includes('--capture')) {
    assert(!fs.existsSync(reportPath), 'Do not overwrite historical size measurements')
    const distribution = JSON.parse(fs.readFileSync(path.join(refactorDir, 'baselines/distribution.json'), 'utf8'))
    const workspaceObserved = distribution.packages.flatMap(pkg => pkg.resources.filter(resource => resource.path.startsWith('dist/') && /\.(m?js)$/.test(resource.path)).map(resource => {
      const bytes = fs.readFileSync(path.resolve(refactorDir, '../packages', pkg.name, resource.path))
      assert.equal(hash(bytes), resource.sha256, 'Observed dist changed since BASE-05; record a new source snapshot')
      return { name: pkg.name, version: pkg.manifest.version, path: resource.path, ...measureBytes(bytes) }
    }))
    const report = { schemaVersion: 1, task: 'BASE-06', sourceCommit: 'c7a375e1', capturedAt: new Date().toISOString(), node: process.version, zlib: process.versions.zlib, brotli: process.versions.brotli,
      note: 'Independent file compression: gzip level 9, Brotli quality 6. Not production HTTP transfer size. Workspace files match BASE-05 observed hashes and may be stale; do not treat them as verified npm releases. Documentation site has no library bundle entry.',
      reviewThreshold: { relative: 0.05, absoluteBytes: 1024, rule: 'Review if same-file increase exceeds max(5 percent, 1024 bytes); not an optimization or automatic release verdict' }, published, workspaceObserved }
    validateSizes(report)
    fs.writeFileSync(reportPath, `${JSON.stringify(report, null, 2)}\n`)
  }
  else {
    assert(process.argv.slice(2).every(arg => arg === '--check'), 'Use --capture or --check')
    const frozen = JSON.parse(fs.readFileSync(reportPath, 'utf8'))
    validateSizes(frozen)
    assert.deepEqual(published, frozen.published, 'Published bundle sizes changed')
    console.log(`Recomputed ${published.length} published JS sizes; workspace inventory remains historical`)
  }
}
