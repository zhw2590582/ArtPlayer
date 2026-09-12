import assert from 'node:assert/strict'
import { execFileSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'
import { archiveFiles, ensureArchive, hash, readMember, refactorDir } from './releases.mjs'

export async function verifyCanvasContract() {
  const baseline = JSON.parse(fs.readFileSync(path.join(refactorDir, 'baselines/canvas-release.json'), 'utf8'))
  const archives = new Map()
  const coreSources = new Map()
  for (const release of [baseline.release, ...baseline.previous]) {
    const archive = await ensureArchive(release)
    assert.deepEqual(archiveFiles(archive), Object.keys(release.files).sort())
    for (const [file, expected] of Object.entries(release.files))
      assert.equal(hash(readMember(archive, file)), expected, `${release.version}/${file}`)
    assert.deepEqual(JSON.parse(readMember(archive, 'package/package.json')), release.manifest)
    for (const field of ['main', 'module', 'types', 'legacy']) {
      const entry = release.manifest[field]
      if (entry)
        assert(Object.hasOwn(release.files, `package/${entry.replace(/^\.\//, '')}`))
    }
    if (release.historicalCore) {
      const core = release.historicalCore
      const source = execFileSync('git', ['show', `${core.commit}:${core.file}`], { encoding: 'utf8' }).replaceAll('\r\n', '\n')
      assert.equal(hash(source), core.sha256LF)
      assert.equal(JSON.parse(source).version, core.version)
      for (const [file, expected] of Object.entries(core.proxySources || {})) {
        const content = execFileSync('git', ['show', `${core.commit}:${file}`], { encoding: 'utf8' }).replaceAll('\r\n', '\n')
        assert.equal(hash(content), expected)
        coreSources.set(`${release.version}:${file}`, content)
      }
    }
    archives.set(release.version, archive)
  }
  const sources = new Map()
  for (const [file, expected] of Object.entries(baseline.source)) {
    const source = execFileSync('git', ['show', `${baseline.sourceCommit}:${file}`], { encoding: 'utf8' }).replaceAll('\r\n', '\n')
    assert.equal(hash(source), expected, `Canvas frozen source: ${file}`)
    sources.set(file, source)
  }
  return { baseline, archives, sources, coreSources }
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const { baseline } = await verifyCanvasContract()
  console.log(`Canvas proxy verified: ${[baseline.release, ...baseline.previous].map(release => release.version).join(', ')}; 12 members and frozen Git inputs`)
}
