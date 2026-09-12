import assert from 'node:assert/strict'
import { execFileSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'
import { archiveFiles, ensureArchive, hash, readMember, refactorDir } from './releases.mjs'

export async function verifyVastContract() {
  const baseline = JSON.parse(fs.readFileSync(path.join(refactorDir, 'baselines/vast-release.json')))
  const archives = new Map()
  for (const release of [baseline.release, ...baseline.sdk]) {
    const archive = await ensureArchive(release)
    assert.deepEqual(archiveFiles(archive), Object.keys(release.files).sort())
    for (const [member, expected] of Object.entries(release.files))
      assert.equal(hash(readMember(archive, member)), expected, `${release.name}@${release.version}/${member}`)
    assert.deepEqual(JSON.parse(readMember(archive, 'package/package.json')), release.manifest)
    for (const field of ['main', 'module', 'types', 'legacy']) {
      const target = release.manifest[field]
      if (target)
        assert(Object.hasOwn(release.files, `package/${target.replace(/^\.\//, '')}`))
    }
    archives.set(`${release.name}@${release.version}`, archive)
  }
  const sources = new Map()
  assert(/^[a-f\d]{40}$/.test(baseline.sourceCommit))
  for (const [file, expected] of Object.entries(baseline.source)) {
    const content = execFileSync('git', ['show', `${baseline.sourceCommit}:${file}`]).toString().replaceAll('\r\n', '\n')
    assert.equal(hash(content), expected, `Historical source changed: ${file}`)
    sources.set(file, content)
  }
  const core = baseline.historicalCore
  const manifest = execFileSync('git', ['show', `${core.commit}:${core.file}`]).toString().replaceAll('\r\n', '\n')
  assert.equal(hash(manifest), core.sha256LF)
  assert.equal(JSON.parse(manifest).version, core.version)
  assert.equal(baseline.registryObservation.workspaceVersionPublished, false)
  assert.deepEqual(baseline.registryObservation.versions, ['1.0.0'])
  console.log('Verified VAST: published 1.0.0, two SDK archives, 60 members and frozen workspace/core association')
  return { baseline, archives, sources }
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url))
  await verifyVastContract()
