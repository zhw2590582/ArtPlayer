import assert from 'node:assert/strict'
import { execFileSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'
import vm from 'node:vm'
import { archiveFiles, ensureArchive, hash, readMember, refactorDir } from './releases.mjs'

export async function verifyVttThumbnailContract() {
  const baseline = JSON.parse(fs.readFileSync(path.join(refactorDir, 'baselines/vtt-thumbnail-release.json'), 'utf8'))
  const archives = new Map()
  for (const release of [baseline.release, ...baseline.previous]) {
    const archive = await ensureArchive(release)
    assert.deepEqual(archiveFiles(archive), Object.keys(release.files).sort())
    for (const [file, expected] of Object.entries(release.files))
      assert.equal(hash(readMember(archive, file)), expected, `${release.version}/${file}`)
    assert.deepEqual(JSON.parse(readMember(archive, 'package/package.json')), release.manifest)
    const missing = Object.fromEntries(['main', 'module', 'types', 'legacy'].filter(field => release.manifest[field] && !Object.hasOwn(release.files, `package/${release.manifest[field].replace(/^\.\//, '')}`)).map(field => [field, release.manifest[field]]))
    assert.deepEqual(missing, release.missingEntrypoints)
    if (release.version === '1.0.0') {
      for (const field of ['main', 'legacy']) {
        const code = readMember(archive, `package/${release.manifest[field].replace(/^\.\//, '')}`).toString()
        assert.throws(() => new vm.Script(code), error => error.name === 'SyntaxError' && /Invalid regular expression/.test(error.message), 'The actual 1.0.0 bundles cannot parse; never replace them with source-only fixtures')
      }
    }
    const core = release.historicalCore
    const source = execFileSync('git', ['show', `${core.commit}:${core.file}`], { encoding: 'utf8' }).replaceAll('\r\n', '\n')
    assert.equal(hash(source), core.sha256LF)
    assert.equal(JSON.parse(source).version, core.version)
    archives.set(release.version, archive)
  }
  const sources = new Map()
  for (const [file, expected] of Object.entries(baseline.source)) {
    const source = execFileSync('git', ['show', `${baseline.sourceCommit}:${file}`], { encoding: 'utf8' }).replaceAll('\r\n', '\n')
    assert.equal(hash(source), expected, `VTT-thumbnail frozen source: ${file}`)
    sources.set(file, source)
  }
  return { baseline, archives, sources }
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  await verifyVttThumbnailContract()
  console.log('VTT-thumbnail verified: 5 actual npm archives, 34 members, 10 frozen inputs; 1.0.0 main/legacy syntax failures remain explicit')
}
