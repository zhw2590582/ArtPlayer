import assert from 'node:assert/strict'
import { execFileSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'
import { ensureArchive, hash, readMember, refactorDir } from './releases.mjs'

const workspace = path.dirname(refactorDir.replace(/[\\/]$/u, ''))
const prefix = 'packages/artplayer-plugin-danmuku/'

export function danmukuArchiveFiles(archive) {
  const names = execFileSync('tar', ['-tzf', archive], { encoding: 'utf8' }).trim().split(/\r?\n/u)
  const descriptions = execFileSync('tar', ['-tvzf', archive], { encoding: 'utf8' }).trim().split(/\r?\n/u)
  assert.equal(names.length, descriptions.length)
  assert.equal(new Set(names).size, names.length, 'Duplicate archive entries')
  return names.filter((name, index) => {
    const kind = descriptions[index][0]
    assert(kind === 'd' || kind === '-', `Unsupported archive entry: ${name}`)
    // npm 5.1.7 contains directory headers without a trailing slash, including package.
    assert((name.startsWith('package/') || (name === 'package' && kind === 'd'))
      && !name.includes('\\') && !name.split('/').includes('..'), `Invalid archive path: ${name}`)
    return kind === '-'
  }).sort()
}

function gitText(commit, file) {
  return execFileSync('git', ['show', `${commit}:${file}`], { cwd: workspace, encoding: 'utf8', maxBuffer: 16 * 1024 * 1024 }).replaceAll('\r\n', '\n')
}

export async function verifyDanmukuContract() {
  const baseline = JSON.parse(fs.readFileSync(path.join(refactorDir, 'baselines/danmuku-release.json'), 'utf8'))
  const releases = [baseline.release, ...baseline.previous]
  assert.deepEqual(releases.map(release => release.version).sort(), [...baseline.registrySnapshot.selectedVersions].sort())
  assert.deepEqual(baseline.registrySnapshot.catalog.map(item => item.version), baseline.registrySnapshot.stableVersions)
  const archives = new Map()
  for (const release of releases) {
    const metadata = baseline.registrySnapshot.catalog.find(item => item.version === release.version)
    for (const field of ['tarball', 'integrity', 'publishedAt'])
      assert.equal(release[field], metadata[field], `${release.version}/${field}`)
    assert.equal(release.registryGitHead, metadata.gitHead)
    const archive = await ensureArchive(release)
    assert.deepEqual(danmukuArchiveFiles(archive), Object.keys(release.files).sort())
    for (const [file, expected] of Object.entries(release.files))
      assert.equal(hash(readMember(archive, file)), expected, `${release.version}/${file}`)
    const manifest = JSON.parse(readMember(archive, 'package/package.json'))
    assert.deepEqual(manifest, release.manifest)
    assert.equal(manifest.name, release.name)
    assert.equal(manifest.version, release.version)
    const memberExists = target => assert(Object.hasOwn(release.files, `package/${target.replace(/^\.\//u, '')}`), `${release.version}/${target}`)
    for (const field of ['main', 'module', 'types', 'legacy']) {
      assert.equal(manifest[field] ?? null, release.entrypoints[field])
      if (manifest[field])
        memberExists(manifest[field])
    }
    assert.deepEqual(manifest.exports ?? null, release.entrypoints.exports)
    function checkExports(value) {
      if (typeof value === 'string')
        memberExists(value)
      else if (value && typeof value === 'object')
        Object.values(value).forEach(checkExports)
    }
    checkExports(manifest.exports)
    for (const association of [release.registrySourceManifest, release.historicalCore]) {
      if (association.status === 'verified-local-git-object') {
        assert.equal(association.commit, release.registryGitHead)
        const text = gitText(association.commit, association.file)
        assert.equal(hash(text), association.sha256LF)
        assert.equal(JSON.parse(text).version, association.version)
      }
      else {
        assert(['registry-gitHead-absent', 'git-object-or-path-unavailable'].includes(association.status))
        if (association.status === 'registry-gitHead-absent')
          assert.equal(release.registryGitHead, null)
      }
    }
    for (const comparison of release.registrySourceComparison) {
      if (comparison.sha256LF) {
        const digest = hash(gitText(release.registryGitHead, comparison.file))
        assert.equal(digest, comparison.sha256LF)
        assert.equal(comparison.matchesArchiveBytes, digest === release.files[`package/${comparison.file.slice(prefix.length)}`])
      }
      else {
        assert.equal(comparison.status, 'git-object-or-path-unavailable')
      }
    }
    archives.set(release.version, archive)
  }
  const sources = new Map()
  for (const [file, expected] of Object.entries(baseline.source)) {
    const source = gitText(baseline.sourceCommit, file)
    assert.equal(hash(source), expected, file)
    sources.set(file, source)
  }
  for (const file of baseline.observations.latestArchiveMatchesFrozenSourceFiles)
    assert.equal(hash(sources.get(file)), baseline.release.files[`package/${file.slice(prefix.length)}`])
  return { baseline, archives, sources }
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const { baseline, archives, sources } = await verifyDanmukuContract()
  console.log(JSON.stringify({ sourceCommit: baseline.sourceCommit, sourceFiles: sources.size, catalogStableVersions: baseline.registrySnapshot.stableVersions.length, releases: [...archives.keys()], validation: 'SHA512/SHA256, actual archive members and entrypoints, frozen Git source and available registry Git associations; no playback or publishing claim' }, null, 2))
}
