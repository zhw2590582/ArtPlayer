import type { Archive, Member } from './archives.ts'
import assert from 'node:assert/strict'
import { Buffer } from 'node:buffer'
import { execFileSync } from 'node:child_process'
import { createHash } from 'node:crypto'
import fs from 'node:fs'
import { createRequire } from 'node:module'
import path from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'
import { ArchiveCache, hash } from './archives.ts'
import { extractBasicFixtures } from './basic-fixtures.ts'
import { emitAmd } from './compiler.ts'
import { nameModule, verifyWorkerSources } from './languages.ts'

interface Provenance {
  commit: string
  archives: Archive[]
  compilerMembers: Member[]
  sourceArchive: { url: string, file: string, bytes: number, sha256: string }
  members: { path: string, member: string, sha256: string, gitBlobSha: string, frozen?: string }[]
  modules: { id: string, path: string, suffix: string }[]
  files: { language: string, development: Member, target: { path: string, sha256: string }, ids: string[] }[]
  fixtures: { path: string, sha256: string, tests: string[], cases: number, suites: number }
}

const root = fileURLToPath(new URL('../../../', import.meta.url))
assert(process.argv.slice(2).every(arg => arg === '--fetch'), 'Use reproduce-basic.ts [--fetch]')
assert.equal(process.version, `v${fs.readFileSync(path.join(root, '.node-version'), 'utf8').trim()}`, 'Use canonical Node')
const record: Provenance = JSON.parse(fs.readFileSync(path.join(root, 'refactor/baselines/monaco-basic-provenance.json'), 'utf8'))
const cache = new ArchiveCache(root, path.join(root, 'refactor/.cache/monaco-review'))
await cache.verify(record.archives, [], process.argv.includes('--fetch'))
assert.equal(record.sourceArchive.file, 'monaco-editor-source.tgz')
assert.equal(record.sourceArchive.url, `https://codeload.github.com/microsoft/monaco-editor/tar.gz/${record.commit}`)
const archiveFile = path.join(cache.directory, record.sourceArchive.file)
let archive: Buffer
if (process.argv.includes('--fetch')) {
  const response = await fetch(record.sourceArchive.url, { signal: AbortSignal.timeout(60000) })
  assert(response.ok, `Repository archive HTTP ${response.status}`)
  archive = Buffer.from(await response.arrayBuffer())
}
else {
  archive = fs.readFileSync(archiveFile)
}
assert.equal(archive.length, record.sourceArchive.bytes)
assert.equal(hash(archive), record.sourceArchive.sha256, 'Repository archive changed')
if (process.argv.includes('--fetch'))
  fs.writeFileSync(archiveFile, archive)
const sources = new Map<string, string>()
for (const member of record.members) {
  assert.equal(member.member, `monaco-editor-${record.commit}/${member.path}`)
  assert(!member.path.split('/').includes('..'), 'Invalid repository member')
  const bytes = execFileSync('tar', ['-xOzf', archiveFile, member.member], { maxBuffer: 20 * 1024 * 1024 })
  assert.equal(hash(bytes), member.sha256, `Source changed: ${member.path}`)
  assert.equal(createHash('sha1').update(`blob ${bytes.length}\0`).update(bytes).digest('hex'), member.gitBlobSha, 'Git blob changed')
  if (member.frozen)
    assert.deepEqual(fs.readFileSync(path.join(root, member.frozen)), bytes, 'Frozen upstream recipe/notice changed')
  sources.set(member.path, bytes.toString('utf8'))
}
function read(file: string) {
  const source = sources.get(file)
  assert(source !== undefined, `Unverified source: ${file}`)
  return source
}
for (const name of ['typescript', 'terser', 'source-map']) {
  const archive = record.archives.find(item => item.name === name)
  assert(archive, 'Missing compiler dependency')
  cache.extractCompiler(archive)
}
for (const member of record.compilerMembers)
  cache.member(member)
const require = createRequire(path.join(cache.directory, 'compiler/entry.cjs'))
const ts = require('typescript') as typeof import('typescript')
const terser = require('terser') as { minify: (source: string, options: { output: { comments: string } }) => Promise<{ code: string }> }

assert.equal(ts.version, '4.4.4')
assert.equal(require('terser/package.json').version, '5.9.0')
assert.equal(require('source-map/package.json').version, '0.7.3')

const config = JSON.parse(read('monaco-languages/src/tsconfig.json')).compilerOptions
assert.equal(config.module, 'amd')
assert.equal(config.target, 'es5')
const modules = new Map(record.modules.map((module) => {
  // RequireJS adds this separator after HTML/PHP's trailing source comments.
  const suffix = ['vs/basic-languages/html/html', 'vs/basic-languages/php/php'].includes(module.id) ? '\n;' : ''
  assert.equal(module.suffix, suffix, 'Unexpected optimizer adaptation')
  return [module.id, nameModule(emitAmd(ts, read(module.path), config.lib, config.strict), module.id) + suffix]
}))
assert.equal(modules.size, 76)
assert.deepEqual(record.files.map(file => file.language), fs.readdirSync(path.join(root, 'docs/assets/js/vs/basic-languages')).sort(), 'Missing basic-language bundle')
const results = []
for (const file of record.files) {
  const development = cache.member(file.development).toString('utf8')
  verifyWorkerSources(development, file.ids, file.ids.map((id) => {
    const source = modules.get(id)
    assert(source, `Missing grammar: ${id}`)
    return { id, source }
  }))
  const target = fs.readFileSync(path.join(root, file.target.path))
  assert.equal(hash(target), file.target.sha256, 'Shipped grammar changed')
  const header = `/*!-----------------------------------------------------------------------------\n * Copyright (c) Microsoft Corporation. All rights reserved.\n * monaco-languages version: 0.30.1(${record.commit})\n * Released under the MIT license\n * https://github.com/Microsoft/monaco-languages/blob/master/LICENSE.md\n *-----------------------------------------------------------------------------*/\n`
  const { code } = await terser.minify(development, { output: { comments: 'some' } })
  assert.equal(header + code, target.toString('utf8'), 'Minified grammar differs')
  results.push({ language: file.language, modules: file.ids.length, exactSources: true, exactOutput: true, sha256: hash(target) })
}
const fixtureBytes = fs.readFileSync(path.join(root, record.fixtures.path))
assert.equal(hash(fixtureBytes), record.fixtures.sha256, 'Frozen token cases changed')
const fixtures = extractBasicFixtures(ts, record.fixtures.tests, read)
assert.deepEqual(fixtures, JSON.parse(fixtureBytes.toString('utf8')).fixtures, 'Upstream test semantics changed')
assert.equal(fixtures.length, record.fixtures.suites)
assert.equal(fixtures.reduce((total, fixture) => total + fixture.cases.length, 0), record.fixtures.cases)
console.log(JSON.stringify({ files: results, sources: sources.size, upstreamSuites: fixtures.length, upstreamCases: record.fixtures.cases, coreAndEmbeddedOriginsReviewed: false }))
