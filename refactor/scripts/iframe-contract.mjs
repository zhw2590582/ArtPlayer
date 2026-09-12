import assert from 'node:assert/strict'
import { execFileSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'
import { archiveFiles, ensureArchive, hash, readMember, refactorDir } from './releases.mjs'

export async function verifyIframeContract() {
  const baseline = JSON.parse(fs.readFileSync(path.join(refactorDir, 'baselines/iframe-release.json')))
  assert.equal(baseline.registryObservation.status, 404)
  assert.equal(baseline.release.name, 'artplayer-plugin-iframe')
  const archive = await ensureArchive(baseline.release)
  assert.deepEqual(archiveFiles(archive), Object.keys(baseline.release.files).sort())
  for (const [file, expected] of Object.entries(baseline.release.files))
    assert.equal(hash(readMember(archive, file)), expected, file)
  assert.deepEqual(JSON.parse(readMember(archive, 'package/package.json')), baseline.release.manifest)
  const core = baseline.release.historicalCore
  const coreSource = execFileSync('git', ['show', `${core.commit}:${core.file}`], { encoding: 'utf8' }).replaceAll('\r\n', '\n')
  assert.equal(hash(coreSource), core.sha256LF)
  assert.equal(JSON.parse(coreSource).version, core.version)
  const sources = new Map()
  for (const [file, expected] of Object.entries(baseline.source)) {
    const source = execFileSync('git', ['show', `${baseline.sourceCommit}:${file}`], { encoding: 'utf8' }).replaceAll('\r\n', '\n')
    assert.equal(hash(source), expected, file)
    sources.set(file, source)
  }
  return { baseline, archive, sources }
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const { baseline } = await verifyIframeContract()
  console.log(`Iframe contract: historical ${baseline.release.name}@${baseline.release.version}, ${Object.keys(baseline.release.files).length} archive members, ${Object.keys(baseline.source).length} frozen workspace inputs; tool-name registry 404 remains an observation`)
}
