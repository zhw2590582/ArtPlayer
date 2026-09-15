import type { Archive, Member } from './archives.ts'
import type { Contribution } from './contributions.ts'
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
import { emitAmd } from './compiler.ts'
import { assembleContributions, readContributionMetadata } from './contributions.ts'
import { moduleIds } from './languages.ts'

interface Provenance {
  commit: string
  archives: Archive[]
  compilerMembers: Member[]
  sourceArchive: { url: string, file: string, bytes: number, sha256: string }
  members: { path: string, member: string, sha256: string, gitBlobSha: string, frozen?: string }[]
  modules: { id: string, path: string }[]
  groups: Contribution[]
  files: { type: 'dev' | 'min', core: Member, editor: Member }[]
  target: { path: string, sha256: string }
}

const root = fileURLToPath(new URL('../../../', import.meta.url))
assert(process.argv.slice(2).every(arg => arg === '--fetch'), 'Use reproduce-contributions.ts [--fetch]')
assert.equal(process.version, `v${fs.readFileSync(path.join(root, '.node-version'), 'utf8').trim()}`, 'Use canonical Node')
const record: Provenance = JSON.parse(fs.readFileSync(path.join(root, 'refactor/baselines/monaco-contributions-provenance.json'), 'utf8'))
const cache = new ArchiveCache(root, path.join(root, 'refactor/.cache/monaco-review'))
const online = process.argv.includes('--fetch')
await cache.verify(record.archives, [], online)
assert.equal(record.sourceArchive.file, 'monaco-editor-source.tgz')
assert.equal(record.sourceArchive.url, `https://codeload.github.com/microsoft/monaco-editor/tar.gz/${record.commit}`)
const archiveFile = path.join(cache.directory, record.sourceArchive.file)
let archive: Buffer
if (online) {
  const response = await fetch(record.sourceArchive.url, { signal: AbortSignal.timeout(60000) })
  assert(response.ok, `Repository archive HTTP ${response.status}`)
  archive = Buffer.from(await response.arrayBuffer())
}
else {
  archive = fs.readFileSync(archiveFile)
}
assert.equal(archive.length, record.sourceArchive.bytes)
assert.equal(hash(archive), record.sourceArchive.sha256, 'Repository archive changed')
if (online)
  fs.writeFileSync(archiveFile, archive)
const sources = new Map<string, string>()
for (const member of record.members) {
  assert.equal(member.member, `monaco-editor-${record.commit}/${member.path}`)
  assert(!member.path.split('/').includes('..'), 'Invalid repository member')
  const bytes = execFileSync('tar', ['-xOzf', archiveFile, member.member], { maxBuffer: 20 * 1024 * 1024 })
  assert.equal(hash(bytes), member.sha256, `Source changed: ${member.path}`)
  assert.equal(createHash('sha1').update(`blob ${bytes.length}\0`).update(bytes).digest('hex'), member.gitBlobSha, 'Git blob changed')
  if (member.frozen)
    assert.deepEqual(fs.readFileSync(path.join(root, member.frozen)), bytes, 'Frozen recipe changed')
  assert(!sources.has(member.path), 'Duplicate source')
  sources.set(member.path, bytes.toString('utf8'))
}
function read(file: string): string {
  const source = sources.get(file)
  assert(source !== undefined, `Unverified source: ${file}`)
  return source
}
const groups = readContributionMetadata(read('monaco-editor/metadata.js'))
assert.deepEqual(groups, record.groups)
const lock = JSON.parse(read('package-lock.json')).dependencies
for (const name of ['typescript', 'terser', 'source-map', 'requirejs']) {
  const item = record.archives.find(item => item.name === name)
  const dependency = name === 'source-map' ? lock.terser.dependencies[name] : lock[name]
  assert(item && item.version === dependency.version && item.integrity === dependency.integrity, `Wrong historical tool: ${name}`)
  cache.extractCompiler(item)
}
for (const member of record.compilerMembers)
  cache.member(member)
const require = createRequire(path.join(cache.directory, 'compiler/entry.cjs'))
const ts = require('typescript') as typeof import('typescript')
const terser = require('terser') as { minify: (source: string, options: { output: { comments: string } }) => Promise<{ code: string }> }

assert.equal(ts.version, '4.4.4')
assert.equal(require('terser/package.json').version, '5.9.0')
assert.equal(require('requirejs/package.json').version, '2.3.6')

assert.equal(record.modules.length, 88)
assert.equal(new Set(record.modules.map(module => module.id)).size, 88)

// Isolate output from earlier runs, so a missing source cannot resolve from cache.
const work = fs.mkdtempSync(path.join(cache.directory, 'contributions-'))
const built: (Contribution & { dev: string, min: string, modules: number })[] = []
for (const group of groups) {
  const config = JSON.parse(read(`${group.name}/src/tsconfig.json`)).compilerOptions
  assert.equal(config.module, 'amd')
  assert.equal(config.target, 'es5')
  const modules = record.modules.filter(module => module.id.startsWith(`${group.modulePrefix}/`))
  for (const module of modules) {
    const relative = module.id.slice(group.modulePrefix.length + 1)
    assert(/^[\w./-]+$/.test(relative) && !relative.split('/').includes('..'), 'Invalid AMD input')
    assert.equal(module.path, `${group.name}/src/${relative.replace(/fillers\/monaco-editor-core$/, 'fillers/monaco-editor-core-amd')}.ts`)
    const source = read(module.path)
    // transpileModule wraps non-module scripts in AMD. Compile the five standalone
    // fillers as programs to preserve their single define([], ...) registration.
    const emitted = relative === 'fillers/monaco-editor-core'
      ? emitAmd(ts, source, config.lib, config.strict)
      : ts.transpileModule(source, { compilerOptions: { target: ts.ScriptTarget.ES5, module: ts.ModuleKind.AMD, newLine: ts.NewLineKind.LineFeed, strict: config.strict } }).outputText
    const file = path.join(work, `${module.id}.js`)
    fs.mkdirSync(path.dirname(file), { recursive: true })
    fs.writeFileSync(file, emitted)
  }
  const output = path.join(work, `${group.name}.js`)
  execFileSync(process.execPath, [require.resolve('requirejs/bin/r.js'), '-o', `baseUrl=${work}`, `name=${group.contrib}`, `out=${output}`, 'optimize=none'], { maxBuffer: 10 * 1024 * 1024 })
  const dev = fs.readFileSync(output, 'utf8')
  assert.deepEqual(moduleIds(dev), modules.map(module => module.id), 'Contribution source coverage/order changed')
  const header = `/*!-----------------------------------------------------------------------------\n * Copyright (c) Microsoft Corporation. All rights reserved.\n * ${group.name} version: 0.30.1(${record.commit})\n * Released under the MIT license\n * https://github.com/Microsoft/${group.name}/blob/master/LICENSE.md\n *-----------------------------------------------------------------------------*/\n`
  const min = header + (await terser.minify(dev, { output: { comments: 'some' } })).code
  built.push({ ...group, dev, min, modules: modules.length })
}
assert.equal(built.reduce((total, group) => total + group.modules, 0), record.modules.length)
assert.deepEqual(record.files.map(file => file.type), ['dev', 'min'])
const outputs = record.files.map((file) => {
  const assembled = assembleContributions(cache.member(file.core).toString('utf8'), built.map(group => ({ ...group, source: group[file.type] })))
  const expected = cache.member(file.editor)
  assert(Buffer.from(assembled).equals(expected), `Complete ${file.type} editor assembly differs`)
  if (file.type === 'min') {
    const target = fs.readFileSync(path.join(root, record.target.path))
    assert.equal(hash(target), record.target.sha256, 'Shipped editor changed')
    assert.deepEqual(target, expected, 'Shipped editor differs from archive')
  }
  return { type: file.type, bytes: expected.length, sha256: hash(expected), exactAssembly: true }
})
console.log(JSON.stringify({ archives: record.archives.length, gitSources: sources.size, groups: built.map(group => ({ name: group.name, modules: group.modules })), modules: record.modules.length, outputs, fullUpstreamTypecheck: false, coreTypeScriptAndCssRebuilt: false }))
