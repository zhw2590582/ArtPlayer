import assert from 'node:assert/strict'
import { execFileSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'
import lockfile from '@yarnpkg/lockfile'
import { archiveFiles, ensureArchive, hash, readMember, refactorDir } from './releases.mjs'

export async function verifyMbContract() {
  const baseline = JSON.parse(fs.readFileSync(path.join(refactorDir, 'baselines/mb-release.json'), 'utf8'))
  const archives = new Map()
  for (const release of [baseline.release, ...baseline.previous]) {
    const archive = await ensureArchive(release)
    assert.deepEqual(archiveFiles(archive), Object.keys(release.files).sort())
    for (const [file, expected] of Object.entries(release.files))
      assert.equal(hash(readMember(archive, file)), expected, `${release.version}/${file}`)
    assert.deepEqual(JSON.parse(readMember(archive, 'package/package.json')), release.manifest)
    for (const field of ['main', 'module', 'types', 'legacy'])
      assert(Object.hasOwn(release.files, `package/${release.manifest[field].replace(/^\.\//, '')}`))
    const core = release.historicalCore
    const source = execFileSync('git', ['show', `${core.commit}:${core.file}`], { encoding: 'utf8' }).replaceAll('\r\n', '\n')
    assert.equal(hash(source), core.sha256LF)
    assert.equal(JSON.parse(source).version, core.version)
    archives.set(release.version, archive)
  }
  const sources = new Map()
  for (const [file, expected] of Object.entries(baseline.source)) {
    const source = execFileSync('git', ['show', `${baseline.sourceCommit}:${file}`], { encoding: 'utf8', maxBuffer: 16 * 1024 * 1024 }).replaceAll('\r\n', '\n')
    assert.equal(hash(source), expected, `MediaBunny frozen source: ${file}`)
    sources.set(file, source)
  }
  const sdk = baseline.dependency
  for (const [file, expected] of Object.entries(sdk.files))
    assert.equal(hash(fs.readFileSync(path.join(refactorDir, '../node_modules', sdk.name, file))), expected, `Installed SDK provenance changed: ${file}`)
  const lock = lockfile.parse(fs.readFileSync(path.join(refactorDir, '../yarn.lock'), 'utf8'))
  assert.equal(lock.type, 'success')
  assert.equal(lock.object[`${sdk.name}@${sdk.declaredRange}`].version, sdk.version)
  return { baseline, archives, sources }
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const { baseline } = await verifyMbContract()
  console.log(`MediaBunny proxy verified: two releases, twelve archive members, ${Object.keys(baseline.source).length} frozen inputs; installed SDK ${baseline.dependency.version} provenance is separate from historical bundles`)
}
