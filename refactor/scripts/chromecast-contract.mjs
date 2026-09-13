import assert from 'node:assert/strict'
import { execFileSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'
import { archiveFiles, ensureArchive, hash, readMember, refactorDir } from './releases.mjs'

const workspace = path.dirname(refactorDir.replace(/[\\/]$/u, ''))

function gitText(commit, file) {
  return execFileSync('git', ['show', `${commit}:${file}`], { cwd: workspace, encoding: 'utf8' }).replaceAll('\r\n', '\n')
}

function verifyManifestAssociation(association) {
  const text = gitText(association.commit, association.file)
  assert.equal(hash(text), association.sha256LF, association.file)
  assert.equal(JSON.parse(text).version, association.version)
}

export async function verifyChromecastContract() {
  const baseline = JSON.parse(fs.readFileSync(path.join(refactorDir, 'baselines/chromecast-release.json'), 'utf8'))
  const archives = new Map()
  const releases = [baseline.release, ...baseline.previous]
  assert.deepEqual(releases.map(release => release.version).sort(), [...baseline.registrySnapshot.stableVersions].sort())
  for (const release of releases) {
    const archive = await ensureArchive(release)
    assert.deepEqual(archiveFiles(archive), Object.keys(release.files).sort())
    for (const [file, expected] of Object.entries(release.files))
      assert.equal(hash(readMember(archive, file)), expected, `${release.version}/${file}`)
    const manifest = JSON.parse(readMember(archive, 'package/package.json'))
    assert.deepEqual(manifest, release.manifest)
    assert.equal(manifest.name, release.name)
    assert.equal(manifest.version, release.version)
    for (const field of ['main', 'module', 'types', 'legacy']) {
      assert.equal(manifest[field] ?? null, release.entrypoints[field], `${release.version}/${field}`)
      if (manifest[field])
        assert(Object.hasOwn(release.files, `package/${manifest[field].replace(/^\.\//u, '')}`), `${release.version}/${field} member`)
    }
    // Check actual conditional export targets without inventing exports for 1.0.0.
    function checkTargets(value) {
      if (typeof value === 'string')
        assert(Object.hasOwn(release.files, `package/${value.replace(/^\.\//u, '')}`), `${release.version}/${value}`)
      else if (value && typeof value === 'object')
        Object.values(value).forEach(checkTargets)
    }
    checkTargets(manifest.exports)
    assert.equal(release.registrySourceManifest.commit, release.registryGitHead)
    assert.equal(release.registrySourceManifest.versionMatchesRelease, release.registrySourceManifest.version === release.version)
    assert.equal(release.historicalCore.commit, release.registryGitHead)
    verifyManifestAssociation(release.registrySourceManifest)
    verifyManifestAssociation(release.historicalCore)
    for (const comparison of release.registrySourceComparison) {
      const digest = hash(gitText(release.registryGitHead, comparison.file))
      assert.equal(digest, comparison.sha256LF)
      const member = `package/${comparison.file.slice('packages/artplayer-plugin-chromecast/'.length)}`
      assert.equal(comparison.matchesArchiveBytes, digest === release.files[member])
    }
    archives.set(release.version, archive)
  }
  const sources = new Map()
  for (const [file, expected] of Object.entries(baseline.source)) {
    const source = gitText(baseline.sourceCommit, file)
    assert.equal(hash(source), expected, file)
    sources.set(file, source)
  }
  for (const file of baseline.observations.latestArchiveMatchesFrozenSourceFiles) {
    const member = `package/${file.slice('packages/artplayer-plugin-chromecast/'.length)}`
    assert.equal(hash(sources.get(file)), baseline.release.files[member])
  }
  const icon = sources.get(baseline.thirdParty.icon.reference)
  const iconPath = icon.match(/<path d="([^"]+)"/u)[1]
  assert.equal(hash(iconPath), baseline.thirdParty.icon.pathSha256)
  assert(icon.includes(baseline.thirdParty.icon.notice))
  assert(sources.get('packages/artplayer-plugin-chromecast/src/index.js').includes(iconPath))
  return { baseline, archives, sources }
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const { baseline, archives, sources } = await verifyChromecastContract()
  console.log(JSON.stringify({ sourceCommit: baseline.sourceCommit, sourceFiles: sources.size, releases: [...archives.keys()], validation: 'SHA512/SHA256, archive members, actual entrypoints and Git source associations' }, null, 2))
}
