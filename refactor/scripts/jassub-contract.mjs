import assert from 'node:assert/strict'
import { execFileSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import { archiveFiles, ensureArchive, hash, readMember, refactorDir } from './releases.mjs'

export async function verifyJassubContract() {
  const baseline = JSON.parse(fs.readFileSync(path.join(refactorDir, 'baselines/jassub-release.json'), 'utf8'))
  const archives = new Map()
  for (const release of [baseline.release, ...baseline.previous]) {
    const archive = await ensureArchive(release)
    assert.deepEqual(archiveFiles(archive), Object.keys(release.files).sort())
    for (const [file, expected] of Object.entries(release.files))
      assert.equal(hash(readMember(archive, file)), expected, `${release.version}/${file}`)
    assert.deepEqual(JSON.parse(readMember(archive, 'package/package.json')), release.manifest)
    const core = release.historicalCore
    const coreSource = execFileSync('git', ['show', `${core.commit}:${core.file}`], { encoding: 'utf8' }).replaceAll('\r\n', '\n')
    assert.equal(hash(coreSource), core.sha256LF)
    assert.equal(JSON.parse(coreSource).version, core.version)
    archives.set(release.version, archive)
  }
  const sources = new Map()
  for (const [file, expected] of Object.entries(baseline.source)) {
    const source = execFileSync('git', ['show', `${baseline.sourceCommit}:${file}`], { encoding: 'utf8', maxBuffer: 16 * 1024 * 1024 }).replaceAll('\r\n', '\n')
    assert.equal(hash(source), expected, file)
    sources.set(file, source)
  }
  return { baseline, archives, sources }
}
