import type { PathCase } from './node-path.ts'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import { createRequire } from 'node:module'
import path from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'
import { ArchiveCache, hash } from './archives.ts'
import { nodePathResults, preparePathSource, readPathProvenance, verifyMonacoPathNotices } from './node-path.ts'

const root = fileURLToPath(new URL('../../../', import.meta.url))
assert(process.argv.slice(2).every(arg => arg === '--fetch'), 'Use reproduce-node-path.ts [--fetch]')
assert.equal(process.version, `v${fs.readFileSync(path.join(root, '.node-version'), 'utf8').trim()}`, 'Use canonical Node')
const record = readPathProvenance(root)
const cache = new ArchiveCache(root, path.join(root, 'refactor/.cache/monaco-review'))
await cache.verify(record.archives, record.remotes, process.argv.includes('--fetch'))
verifyMonacoPathNotices(root, JSON.parse(fs.readFileSync(path.join(root, 'scripts/site-vendor/manifest.json'), 'utf8')))
const compiler = record.archives.find(archive => archive.name === 'typescript')
assert(compiler && compiler.version === '4.5.0-dev.20211021', 'Wrong path compiler')
const lock = fs.readFileSync(path.join(root, record.lockSource), 'utf8')
assert(lock.includes(`typescript@^4.5.0-dev.20211021:\n  version "4.5.0-dev.20211021"`) && lock.includes(`integrity ${compiler.integrity}`), 'Path compiler not in upstream lock')
const isolated = new ArchiveCache(root, path.join(cache.directory, 'core-compiler'))
const archiveFile = `${compiler.name}-${compiler.version}.tgz`
fs.copyFileSync(path.join(cache.directory, archiveFile), path.join(isolated.directory, archiveFile))
isolated.extractCompiler(compiler)
const require = createRequire(path.join(isolated.directory, 'compiler/entry.cjs'))
const ts = require('typescript') as typeof import('typescript')

assert.equal(ts.version, compiler.version)
const prepared = preparePathSource(fs.readFileSync(path.join(root, record.vscodeSource), 'utf8'))
assert.equal(record.maps.length, 2)
for (const member of record.maps) {
  const map: { sources: string[], sourcesContent: string[] } = JSON.parse(cache.member(member).toString('utf8'))
  assert.equal(map.sources.filter(source => source === member.source).length, 1, 'Missing or repeated mapped path source')
  assert.equal(map.sourcesContent[map.sources.indexOf(member.source)], prepared, 'Prepared path source differs')
}
const emitted = ts.transpileModule(prepared, { compilerOptions: { target: ts.ScriptTarget.ES2020, module: ts.ModuleKind.AMD, newLine: ts.NewLineKind.LineFeed } }).outputText
const anonymous = 'define(["require", "exports", "vs/base/common/process"],'
assert.equal(emitted.split(anonymous).length, 2, 'Unexpected path emission signature')
assert.equal(record.outputs.length, 2)
const outputs = record.outputs.map((output) => {
  assert(/^define\(__m\[\d+\/\*vs\/base\/common\/path\*\/\], __M\(\[0\/\*require\*\/,1\/\*exports\*\/,\d+\/\*vs\/base\/common\/process\*\/\]\),$/.test(output.signature), 'Unexpected path bundle signature')
  const fragment = emitted.replace(anonymous, output.signature).trimEnd()
  const development = cache.member(output.development).toString('utf8')
  assert.equal(development.indexOf(fragment), output.offset, 'Compiled path module differs')
  assert(output.offset > 0 && !development.includes(fragment, output.offset + 1), 'Missing or repeated compiled path module')
  const target = fs.readFileSync(path.join(root, output.target.path))
  assert.equal(hash(target), output.target.sha256, 'Shipped path-bearing asset changed')
  assert.deepEqual(target, cache.member(output.editor), 'Shipped path-bearing asset differs from archive')
  return { path: output.target.path, offset: output.offset, moduleBytes: new TextEncoder().encode(fragment).length, exactModule: true, sha256: hash(target) }
})
const fixtureBytes = fs.readFileSync(path.join(root, record.fixtures.path))
assert.equal(hash(fixtureBytes), record.fixtures.sha256, 'Node path fixtures changed')
const fixtures: PathCase[] = JSON.parse(fixtureBytes.toString('utf8'))
assert.deepEqual(nodePathResults(fs.readFileSync(path.join(root, record.nodeSource), 'utf8'), fixtures), fixtures.map(fixture => fixture.expected), 'Original Node path results differ')
console.log(JSON.stringify({ archives: record.archives.length, gitSources: record.remotes.length, maps: record.maps.length, removedUnusedExports: 6, outputs, fixtures: fixtures.length, existingLicenseTextMatches: true, compiler: ts.version, fullCoreTypeScriptBuild: false, unmodifiedNodeRuntimeClaimed: false }))
