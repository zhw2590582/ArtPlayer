import assert from 'node:assert/strict'
import { createHash } from 'node:crypto'
import fs from 'node:fs'
import { createRequire } from 'node:module'
import path from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'
import { ArchiveCache } from './archives.ts'
import { readUnicodeOrigins, verifyMonacoUnicodeNotices } from './unicode-origins.ts'
import { readUnicodeTables, replayUnicodeGenerator, verifyUnicodeGeneration } from './unicode.ts'

const root = fileURLToPath(new URL('../../../', import.meta.url))
assert(process.argv.slice(2).every(arg => arg === '--fetch'), 'Use reproduce-unicode.ts [--fetch]')
assert.equal(process.version, `v${fs.readFileSync(path.join(root, '.node-version'), 'utf8').trim()}`, 'Use canonical Node')
const record = readUnicodeOrigins(root)
const cache = new ArchiveCache(root, path.join(root, 'refactor/.cache/monaco-review'))
const generators = new ArchiveCache(root, path.join(cache.directory, 'unicode-generator'))
await cache.verify(record.archives, record.remotes, process.argv.includes('--fetch'))
await generators.verify(record.generatorArchives, [], process.argv.includes('--fetch'))
verifyMonacoUnicodeNotices(root, JSON.parse(fs.readFileSync(path.join(root, 'scripts/site-vendor/manifest.json'), 'utf8')))
const lock: { lockfileVersion: number, dependencies: Record<string, { version: string, resolved: string, integrity: string, dependencies?: unknown }> } = JSON.parse(fs.readFileSync(path.join(root, record.lockSource), 'utf8'))
assert.equal(lock.lockfileVersion, 1)
assert.deepEqual(record.generatorArchives.map(archive => archive.name).sort(), Object.keys(lock.dependencies).sort(), 'Incomplete Unicode dependency closure')
for (const archive of record.generatorArchives) {
  const dependency = lock.dependencies[archive.name]!
  assert.equal(dependency.dependencies, undefined, 'Unexpected nested Unicode dependency')
  assert.deepEqual([archive.version, archive.tarball, archive.lockedIntegrity], [dependency.version, dependency.resolved, dependency.integrity], 'Changed Unicode lock resolution')
  const bytes = fs.readFileSync(path.join(generators.directory, `${archive.name}-${archive.version}.tgz`))
  const algorithm = archive.lockedIntegrity.split('-')[0]!
  assert(['sha1', 'sha512'].includes(algorithm), 'Unexpected original Unicode integrity algorithm')
  assert.equal(`${algorithm}-${createHash(algorithm).update(bytes).digest('base64')}`, archive.lockedIntegrity, 'Changed original Unicode archive integrity')
  generators.extractCompiler(archive)
}
const require = createRequire(path.join(generators.directory, 'compiler/entry.cjs'))
assert.equal(require('regexpu/package.json').version, '3.3.0')

const recipeSources = new Set(record.remotes.map(remote => remote.source))
assert.deepEqual(record.generators.map(generator => generator.kind), ['rtl', 'emoji', 'grapheme'])
const outputs = record.generators.map((generator) => {
  assert(recipeSources.has(generator.source), 'Unverified Unicode generator')
  const inputs = new Map(Object.entries(generator.inputs).map(([name, source]) => {
    assert(recipeSources.has(source), 'Unverified Unicode data input')
    return [name, fs.readFileSync(path.join(root, source))]
  }))
  return replayUnicodeGenerator(fs.readFileSync(path.join(root, generator.source), 'utf8'), inputs, generator.outputs, require('regexpu'))
})
const tables = readUnicodeTables(fs.readFileSync(path.join(root, record.vscodeSource), 'utf8'))
verifyUnicodeGeneration(tables, outputs[0]!, outputs[1]!, outputs[2]!)
assert.deepEqual(record.maps.map(entry => entry.member), ['package/dev/vs/editor/editor.main.js.map', 'package/dev/vs/base/worker/workerMain.js.map'], 'Incomplete Unicode map coverage')
for (const entry of record.maps) {
  const map: { sources: string[], sourcesContent: string[] } = JSON.parse(cache.member(entry).toString('utf8'))
  assert.equal(map.sources.filter(source => source === entry.source).length, 1, 'Missing or repeated Unicode mapped source')
  assert.deepEqual(readUnicodeTables(map.sourcesContent[map.sources.indexOf(entry.source)]!), tables, 'Mapped Unicode differs from fixed VS Code')
}
assert.deepEqual(record.shipped.map(asset => asset.target), record.component.assets, 'Incomplete Unicode shipped coverage')
for (const asset of record.shipped)
  assert.deepEqual(fs.readFileSync(path.join(root, asset.target)), cache.member(asset), 'Shipped Unicode asset changed')
console.log(JSON.stringify({ archives: record.archives.length, generatorArchives: record.generatorArchives.length, gitSources: record.remotes.length, maps: record.maps.length, shippedAssets: record.shipped.length, exactGenerated: record.generated, fullMonacoCompilation: false, unicodeConformance: false }))
