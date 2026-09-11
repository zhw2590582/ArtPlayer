import assert from 'node:assert/strict'
import { execFileSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'
import { archiveFiles, ensureArchive, hash, readMember, refactorDir } from './releases.mjs'

const root = path.resolve(refactorDir, '..')
const normalizeLF = value => value.toString().replaceAll('\r\n', '\n')

export async function verifyAdsContract() {
  const baseline = JSON.parse(fs.readFileSync(path.join(refactorDir, 'baselines/ads-release.json')))
  assert.equal(baseline.task, 'PKG-ADS-01')
  const releases = [...baseline.olderReleases, baseline.release]
  assert.deepEqual(releases.map(release => release.version), ['1.0.0', '1.0.2', '1.0.3', '1.0.4', '1.0.6'])
  const archives = new Map()
  for (const release of releases) {
    assert.equal(release.name, 'artplayer-plugin-ads')
    const archive = await ensureArchive(release)
    assert.deepEqual(archiveFiles(archive), Object.keys(release.files).sort())
    for (const [member, expected] of Object.entries(release.files))
      assert.equal(hash(readMember(archive, member)), expected, `Changed Ads release member: ${release.version}/${member}`)
    assert.deepEqual(JSON.parse(readMember(archive, 'package/package.json')), release.manifest)
    for (const entry of [release.manifest.main, release.manifest.types])
      assert(Object.hasOwn(release.files, `package/${entry.replace(/^\.\//, '')}`))
    archives.set(release.version, archive)
  }
  assert(/^[a-f\d]{40}$/.test(baseline.sourceCommit))
  for (const [file, expected] of Object.entries(baseline.source)) {
    const content = execFileSync('git', ['show', `${baseline.sourceCommit}:${file}`], { cwd: root })
    assert.equal(hash(normalizeLF(content)), expected, `Changed historical Ads source: ${file}`)
  }
  for (const comparison of baseline.comparisons) {
    const published = hash(normalizeLF(readMember(archives.get('1.0.6'), `package/${comparison.file}`)))
    assert.equal(published, comparison.publishedLF)
    assert.equal(baseline.source[`packages/artplayer-plugin-ads/${comparison.file}`], comparison.workspaceLF)
    assert.equal(published === comparison.workspaceLF, comparison.equal)
  }
  const core = baseline.historicalCore
  const content = execFileSync('git', ['show', `${core.commit}:${core.file}`], { cwd: root })
  assert.equal(hash(normalizeLF(content)), core.sha256LF)
  assert.equal(JSON.parse(content).version, core.version)
  console.log('Verified Ads: five published archives, 30 members, historical source and core-version association')
  return { baseline, archives }
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url))
  await verifyAdsContract()
