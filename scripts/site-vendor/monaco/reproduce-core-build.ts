import type { Archive, Member, Remote } from './archives.ts'
import type { CoreSourceMap } from './core-build.ts'
import assert from 'node:assert/strict'
import { execFileSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'
import { ArchiveCache, hash } from './archives.ts'
import { inventoryCoreMap, readCoreNls, restoreCoreMapComment } from './core-build.ts'

interface Record {
  commit: string
  archives: Archive[]
  remotes: Remote[]
  binaries: { [platform: string]: Member }
  files: { relative: string, development: Member, minified: Member, target: { path: string, sha256: string }, appendedContributions: boolean }[]
  sourceMaps: (Member & { sources: ReturnType<typeof inventoryCoreMap> })[]
  locales: { path: string, sha256: string }
}

const root = fileURLToPath(new URL('../../../', import.meta.url))
assert(process.argv.slice(2).every(arg => arg === '--fetch'), 'Use reproduce-core-build.ts [--fetch]')
assert.equal(process.version, `v${fs.readFileSync(path.join(root, '.node-version'), 'utf8').trim()}`, 'Use canonical Node')
const record: Record = JSON.parse(fs.readFileSync(path.join(root, 'refactor/baselines/monaco-core-build-provenance.json'), 'utf8'))
const host = `${process.platform}-${process.arch}`
const binary = record.binaries[host]
assert(binary, `No frozen esbuild binary for ${host}`)
const cache = new ArchiveCache(root, path.join(root, 'refactor/.cache/monaco-review'))
const archives = record.archives.filter(item => !item.name.startsWith('esbuild-') || `${item.name}-${item.version}` === binary.archive)
await cache.verify(archives, record.remotes, process.argv.includes('--fetch'))
const lock = fs.readFileSync(path.join(root, 'refactor/baselines/site-vendor/monaco-core-build/build-yarn.lock.txt'), 'utf8')
const esbuild = archives.find(archive => archive.name === 'esbuild')
assert(esbuild && lock.includes(`esbuild@^0.12.6:\n  version "0.12.6"`) && lock.includes(`integrity ${esbuild.integrity}`), 'Wrong historical minifier')
const executable = path.join(cache.directory, process.platform === 'win32' ? 'core-esbuild.exe' : 'core-esbuild')
assert(!fs.existsSync(executable) || !fs.lstatSync(executable).isSymbolicLink(), 'Redirected historical executable')
fs.writeFileSync(executable, cache.member(binary), { mode: 0o700 })
assert.equal(execFileSync(executable, ['--version'], { encoding: 'utf8' }).trim(), '0.12.6')
const sourceFile = path.join(cache.directory, 'core-reproduction-input.js')
assert(!fs.existsSync(sourceFile) || !fs.lstatSync(sourceFile).isSymbolicLink(), 'Redirected historical input')
const archiveFiles = execFileSync('tar', ['-tzf', path.join(cache.directory, 'monaco-editor-core-0.30.1.tgz')], { encoding: 'utf8' }).trim().split(/\r?\n/)
assert.deepEqual(record.files.map(file => file.development.member).sort(), archiveFiles.filter(file => file.startsWith('package/dev/') && file.endsWith('.js')).sort(), 'Missing core JavaScript output')
assert.equal(record.files.length, 13)
const results = []
for (const file of record.files) {
  const development = cache.member(file.development)
  fs.writeFileSync(sourceFile, development)
  const output = execFileSync(executable, [sourceFile, '--minify', '--platform=node', '--target=esnext'], { encoding: 'utf8', maxBuffer: 30 * 1024 * 1024 })
  const minified = cache.member(file.minified).toString('utf8')
  assert.equal(restoreCoreMapComment(output, file.relative), minified, 'Core minification differs')
  const shipped = fs.readFileSync(path.join(root, file.target.path))
  assert.equal(hash(shipped), file.target.sha256, 'Core site asset changed')
  assert.deepEqual(shipped, cache.read('monaco-editor-0.30.1', `package/min/${file.relative}`), 'Core editor archive differs')
  if (file.appendedContributions) {
    assert.equal(file.relative, 'vs/editor/editor.main.js')
    const renamed = minified.replace('"vs/editor/editor.main"', '"vs/editor/edcore.main"')
    const offset = renamed.lastIndexOf('//# sourceMappingURL=')
    assert(shipped.toString('utf8').startsWith(renamed.slice(0, offset)) && shipped.toString('utf8').endsWith(renamed.slice(offset)), 'Editor core boundary differs')
  }
  else {
    assert.equal(shipped.toString('utf8'), minified, 'Core copied output differs')
  }
  results.push({ relative: file.relative, exactMinification: true, appendedContributions: file.appendedContributions, sha256: hash(shipped) })
}
const maps: CoreSourceMap[] = []
for (const member of record.sourceMaps) {
  const map: CoreSourceMap = JSON.parse(cache.member(member).toString('utf8'))
  assert.deepEqual(inventoryCoreMap(map), member.sources, 'Prepared source inventory differs')
  maps.push(map)
}
for (const name of ['loader', 'css', 'nls']) {
  const remote = record.remotes.find(remote => remote.source.endsWith(`src-vs-${name}.js.txt`))
  assert(remote)
  const source = fs.readFileSync(path.join(root, remote.source), 'utf8')
  const map = maps.find(map => map.sources.includes(`vs/${name}.js`))
  assert(map)
  assert.equal(map.sourcesContent[map.sources.indexOf(`vs/${name}.js`)], source, 'Loader source differs')
  if (name === 'loader') {
    const header = `/*!-----------------------------------------------------------\n * Copyright (c) Microsoft Corporation. All rights reserved.\n * Version: 0.30.1(${record.commit})\n * Released under the MIT license\n * https://github.com/microsoft/vscode/blob/main/LICENSE.txt\n *-----------------------------------------------------------*/\n\n`
    assert.equal(cache.read('monaco-editor-core-0.30.1', 'package/dev/vs/loader.js').toString('utf8'), header + source, 'Loader release header differs')
  }
}
const locales = fs.readFileSync(path.join(root, record.locales.path))
assert.equal(hash(locales), record.locales.sha256)
for (const locale of JSON.parse(locales.toString('utf8'))) {
  assert(record.files.some(file => file.development.member === locale.member), 'Unverified locale')
  const { id, messages } = readCoreNls(cache.read('monaco-editor-core-0.30.1', locale.member).toString('utf8'))
  assert.equal(id, `vs/editor/editor.main.nls${locale.locale === 'en' ? '' : `.${locale.locale}`}`)
  const labels = messages['vs/editor/contrib/find/findWidget']!
  assert.deepEqual([locale.find, locale.next, locale.close], [labels[7], labels[10], labels[12]], 'Locale fixture differs')
}
console.log(JSON.stringify({ host, archives: archives.length, gitSources: record.remotes.length, outputs: results, mappedInstances: maps.reduce((count, map) => count + map.sources.length, 0), uniqueMappedSources: new Set(maps.flatMap(map => map.sources)).size, completeTypeScriptBuild: false, remainingEmbeddedOriginsReviewed: false }))
