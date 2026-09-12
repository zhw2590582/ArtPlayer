import assert from 'node:assert/strict'
import { Buffer } from 'node:buffer'
import { execFileSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'
import { hash, refactorDir } from './releases.mjs'

export function verifyThumbnailContract() {
  const baseline = JSON.parse(fs.readFileSync(path.join(refactorDir, 'baselines/thumbnail-release.json')))
  assert.equal(baseline.recovered.originalTarballAvailable, false)
  assert.equal(baseline.recovered.completeArchiveAvailable, false)
  assert.equal(new Set(baseline.observations.map(item => item.url)).size, baseline.observations.length)
  const source = new Map()
  const historical = new Map()
  for (const [commit, entries, target] of [[baseline.sourceCommit, baseline.source, source], [baseline.recovered.historicalCommit, baseline.historicalSource, historical]]) {
    for (const [file, expected] of Object.entries(entries)) {
      const text = execFileSync('git', ['show', `${commit}:${file}`], { encoding: 'utf8' }).replaceAll('\r\n', '\n')
      assert.equal(hash(text), expected, file)
      target.set(file, text)
    }
  }
  for (const item of baseline.observations) {
    const bytes = item.identicalGit
      ? execFileSync('git', ['show', `${item.identicalGit.commit}:${item.identicalGit.file}`])
      : Buffer.from(item.text)
    assert.equal(hash(bytes), item.sha256, item.url)
    assert.equal(bytes.length, item.bytes, item.url)
  }
  const registry = baseline.observations.find(item => item.url === 'https://registry.npmjs.org/artplayer-tool-thumbnail')
  assert.equal(registry.status, 200)
  const metadata = JSON.parse(registry.text)
  assert.equal(metadata.name, baseline.recovered.name)
  assert(metadata.time.unpublished.versions.includes('3.5.31'))
  assert.equal(metadata.versions, undefined)
  const manifest = baseline.observations.find(item => item.url.endsWith('@3.5.31/package.json'))
  assert.equal(manifest.status, 200)
  assert.deepEqual(JSON.parse(manifest.text), baseline.recovered.manifest)
  assert.equal(baseline.recovered.manifest.gitHead, baseline.recovered.historicalCommit)
  const oldManifest = JSON.parse(historical.get('packages/artplayer-tool-thumbnail/package.json'))
  assert.deepEqual({ ...oldManifest, gitHead: null }, { ...baseline.recovered.manifest, gitHead: null })
  for (const [name, association] of Object.entries(baseline.coreAssociations)) {
    const files = name === 'historical' ? historical : source
    assert.equal(JSON.parse(files.get(association.file)).version, association.version)
  }
  return { baseline, source, historical }
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const { baseline } = verifyThumbnailContract()
  console.log(`Thumbnail contract: ${baseline.observations.length} frozen observations, ${Object.keys(baseline.source).length} workspace inputs, ${Object.keys(baseline.historicalSource).length} historical Git inputs; recovered CDN main is byte-identical, original npm archive remains unavailable`)
}
