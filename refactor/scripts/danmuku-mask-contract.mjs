import assert from 'node:assert/strict'
import { execFileSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'
import lockfile from '@yarnpkg/lockfile'
import { archiveFiles, ensureArchive, hash, readMember, refactorDir } from './releases.mjs'

const workspace = path.dirname(refactorDir.replace(/[\\/]$/u, ''))
const prefix = 'packages/artplayer-plugin-danmuku-mask/'
function gitBytes(commit, file) {
  return execFileSync('git', ['show', `${commit}:${file}`], { cwd: workspace, maxBuffer: 32 * 1024 * 1024 })
}
function gitText(commit, file) {
  return gitBytes(commit, file).toString().replaceAll('\r\n', '\n')
}

export async function verifyDanmukuMaskContract() {
  const baseline = JSON.parse(fs.readFileSync(path.join(refactorDir, 'baselines/danmuku-mask-release.json'), 'utf8'))
  const registryBytes = fs.readFileSync(path.join(refactorDir, 'baselines/danmuku-mask-registry.json'))
  assert.equal(hash(registryBytes), baseline.registrySnapshot.bodySha256)
  const registry = JSON.parse(registryBytes)
  assert.deepEqual(registry['dist-tags'], baseline.registrySnapshot.distTags)
  assert.deepEqual(Object.keys(registry.versions).filter(version => /^\d+\.\d+\.\d+$/u.test(version)), baseline.registrySnapshot.stableVersions)
  const archives = new Map()
  for (const release of [baseline.release, ...baseline.previous]) {
    const metadata = registry.versions[release.version]
    assert.equal(metadata.dist.integrity, release.integrity)
    assert.equal(metadata.dist.tarball, release.tarball)
    assert.equal(metadata.gitHead, release.registryGitHead)
    const archive = await ensureArchive(release)
    assert.deepEqual(archiveFiles(archive), Object.keys(release.files).sort())
    for (const [file, expected] of Object.entries(release.files))
      assert.equal(hash(readMember(archive, file)), expected, `${release.version}/${file}`)
    const manifest = JSON.parse(readMember(archive, 'package/package.json'))
    assert.deepEqual(manifest, release.manifest)
    assert.equal(manifest.version, release.version)
    assert.equal(manifest.name, release.name)
    for (const [field, target] of Object.entries(release.entrypoints)) {
      assert.equal(manifest[field] ?? null, target)
      if (target)
        assert(Object.hasOwn(release.files, `package/${target.replace(/^\.\//u, '')}`), `${release.version}/${field}`)
    }
    function targetExists(target) {
      if (typeof target === 'string')
        assert(Object.hasOwn(release.files, `package/${target.replace(/^\.\//u, '')}`))
      else if (target && typeof target === 'object')
        Object.values(target).forEach(targetExists)
    }
    targetExists(manifest.exports)
    for (const association of [release.registrySourceManifest, release.historicalCore]) {
      assert.equal(association.commit, release.registryGitHead)
      const text = gitText(association.commit, association.file)
      assert.equal(hash(text), association.sha256LF)
      assert.equal(JSON.parse(text).version, association.version)
    }
    assert.equal(release.registrySourceManifest.versionMatchesRelease, release.registrySourceManifest.version === release.version)
    for (const comparison of release.registrySourceComparison) {
      const text = gitText(release.registryGitHead, comparison.file)
      assert.equal(hash(text), comparison.sha256LF)
      assert.equal(comparison.matchesArchiveBytes, hash(text) === release.files[`package/${comparison.file.slice(prefix.length)}`])
    }
    archives.set(release.version, archive)
  }
  assert.deepEqual([...archives.keys()].sort(), [...baseline.registrySnapshot.stableVersions].sort())
  const sources = new Map()
  for (const [file, expected] of Object.entries(baseline.source)) {
    const text = gitText(baseline.sourceCommit, file)
    assert.equal(hash(text), expected, file)
    sources.set(file, text)
  }
  for (const file of baseline.observations.latestArchiveMatchesFrozenSourceFiles)
    assert.equal(hash(sources.get(file)), baseline.release.files[`package/${file.slice(prefix.length)}`])
  const locked = gitText(baseline.sdk.lock.commit, baseline.sdk.lock.file)
  assert.equal(hash(locked), baseline.sdk.lock.sha256LF)
  const parsed = lockfile.parse(locked)
  assert.equal(parsed.type, 'success')
  const manifest = JSON.parse(sources.get(`${prefix}package.json`))
  for (const dependency of baseline.sdk.dependencies) {
    assert.equal(manifest.dependencies[dependency.name], dependency.range)
    const entry = parsed.object[dependency.key]
    for (const field of ['version', 'resolved', 'integrity'])
      assert.equal(entry[field], dependency[field])
    const installed = fs.readFileSync(path.join(workspace, dependency.installedManifest.file))
    assert.equal(hash(installed), dependency.installedManifest.sha256)
    assert.equal(JSON.parse(installed).version, dependency.version)
  }
  for (const [file, digest] of Object.entries(baseline.sdk.adapterFiles))
    assert.equal(hash(fs.readFileSync(path.join(workspace, file))), digest, file)
  for (const asset of baseline.sdk.assets) {
    const bytes = gitBytes(baseline.sourceCommit, asset.file)
    assert.equal(bytes.length, asset.bytes)
    assert.equal(hash(bytes), asset.sha256)
    const installed = fs.readFileSync(path.join(workspace, asset.installedFile))
    assert.equal(hash(installed), asset.installedSha256)
    assert.equal(asset.matchesInstalled, asset.sha256 === asset.installedSha256)
  }
  assert(sources.get(`${prefix}src/index.js`).includes(baseline.sdk.defaultSolutionPath))
  assert(sources.get('docs/assets/example/danmuku.mask.js').includes(baseline.sdk.demoSolutionPath))
  return { baseline, archives, sources }
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const { baseline, archives, sources } = await verifyDanmukuMaskContract()
  console.log(JSON.stringify({ sourceCommit: baseline.sourceCommit, sourceFiles: sources.size, releases: [...archives.keys()], dependencies: baseline.sdk.dependencies.map(item => `${item.name}@${item.version}`), existingAssets: baseline.sdk.assets.length, validation: 'Archive SHA512/SHA256, complete entrypoints, Git associations, frozen Yarn versions, installed SDK source and existing asset bytes; no model execution' }, null, 2))
}
