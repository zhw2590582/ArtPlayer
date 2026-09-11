import assert from 'node:assert/strict'
import { createHash } from 'node:crypto'
import { execFileSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

export const refactorDir = fileURLToPath(new URL('../', import.meta.url))
export const cacheDir = path.join(refactorDir, '.cache/releases')
export const hash = (bytes, algorithm = 'sha256', encoding = 'hex') => createHash(algorithm).update(bytes).digest(encoding)

export function verifyIntegrity(bytes, release) {
  assert.equal(`sha512-${hash(bytes, 'sha512', 'base64')}`, release.integrity, `Integrity mismatch: ${release.name}`)
  assert.equal(hash(bytes), release.sha256, `Archive hash mismatch: ${release.name}`)
}

export function archiveFiles(archive) {
  const names = execFileSync('tar', ['-tzf', archive], { encoding: 'utf8' }).trim().split(/\r?\n/)
  assert.equal(new Set(names).size, names.length, 'Duplicate archive entries')
  for (const name of names) {
    assert(name.startsWith('package/') && !name.includes('\\') && !name.split('/').includes('..'), `Invalid archive path: ${name}`)
  }
  return names.filter(name => !name.endsWith('/')).sort()
}

// Read a member to memory; never extract untrusted paths into the working tree.
export function readMember(archive, member) {
  assert(member.startsWith('package/') && !member.includes('..') && !member.includes('\\'), 'Invalid member')
  return execFileSync('tar', ['-xOzf', archive, member], { maxBuffer: 16 * 1024 * 1024 })
}

export async function ensureArchive(release) {
  assert(/^(?:@[a-z0-9]+(?:[.-][a-z0-9]+)*\/)?[a-z0-9]+(?:[.-][a-z0-9]+)*$/.test(release.name) && /^\d+\.\d+\.\d+$/.test(release.version), 'Invalid release identifier')
  const archive = path.join(cacheDir, `${release.name.replace('/', '+')}-${release.version}.tgz`)
  if (!fs.existsSync(archive)) {
    const url = new URL(release.tarball)
    assert.equal(url.origin, 'https://registry.npmjs.org', 'Unexpected registry')
    const response = await fetch(url, { redirect: 'error', signal: AbortSignal.timeout(30000) })
    assert(response.ok, `Download failed: ${response.status} ${release.name}`)
    const bytes = Buffer.from(await response.arrayBuffer())
    verifyIntegrity(bytes, release)
    fs.mkdirSync(cacheDir, { recursive: true })
    fs.writeFileSync(archive, bytes)
  }
  verifyIntegrity(fs.readFileSync(archive), release)
  return archive
}

export async function verifyReleases() {
  const baseline = JSON.parse(fs.readFileSync(path.join(refactorDir, 'baselines/releases.json'), 'utf8'))
  for (const release of baseline.releases) {
    const archive = await ensureArchive(release)
    const names = archiveFiles(archive)
    assert.deepEqual(names, Object.keys(release.files).sort(), `File inventory changed: ${release.name}`)
    for (const name of names) {
      assert.equal(hash(readMember(archive, name)), release.files[name], `File changed: ${name}`)
    }
    const manifest = JSON.parse(readMember(archive, 'package/package.json'))
    assert.equal(manifest.name, release.name)
    assert.equal(manifest.version, release.version)
    for (const field of ['main', 'module', 'types', 'legacy']) {
      if (manifest[field]) assert(names.includes(`package/${manifest[field].replace(/^\.\//, '')}`), `Missing ${field}: ${release.name}`)
    }
    console.log(`Verified ${release.name}@${release.version}: SHA-512, SHA-256, ${names.length} files and manifest entrypoints`)
  }
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  await verifyReleases()
}
