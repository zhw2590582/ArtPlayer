import type { Archive, Member, Remote } from './archives.ts'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import { createRequire } from 'node:module'
import path from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'
import { ArchiveCache, hash } from './archives.ts'
import { aliasModule, languageHeader, nameModule, verifyWorkerSources } from './languages.ts'

interface Provenance {
  archives: Archive[]
  remotes: Remote[]
  compilerMembers: Member[]
  modules: (Member & { id: string })[]
  aliases: { id: string, main: string }[]
  workers: {
    language: string
    development: Member
    target: { path: string, sha256: string }
    ids: string[]
    source: string
    shim: string
    config: string
  }[]
}
const root = fileURLToPath(new URL('../../../', import.meta.url))
assert(process.argv.slice(2).every(arg => arg === '--fetch'), 'Use reproduce-languages.ts [--fetch]')
assert.equal(process.version, `v${fs.readFileSync(path.join(root, '.node-version'), 'utf8').trim()}`, 'Use canonical Node')
const record: Provenance = JSON.parse(fs.readFileSync(path.join(root, 'refactor/baselines/monaco-languages-provenance.json'), 'utf8'))
assert.deepEqual(record.workers.map(worker => worker.language), ['css', 'html', 'json'], 'Missing language worker')
assert.equal(record.modules.length, 91, 'Missing historical npm module')
assert.equal(new Set(record.modules.map(member => member.id)).size, 91, 'Duplicate npm module source')
assert.equal(record.aliases.length, 8, 'Missing historical package alias')
assert.equal(new Set(record.aliases.map(alias => alias.id)).size, 8, 'Duplicate package alias')
const lock = JSON.parse(fs.readFileSync(path.join(root, 'refactor/baselines/site-vendor/monaco-typescript/package-lock.json.txt'), 'utf8'))
for (const archive of record.archives.filter(item => item.name !== 'monaco-editor')) {
  const entry = archive.name === 'source-map' ? lock.dependencies.terser.dependencies['source-map'] : lock.dependencies[archive.name]
  assert(entry && entry.version === archive.version && entry.resolved === archive.tarball && entry.integrity === archive.integrity, 'Archive differs from the fixed upstream lock')
}
for (const member of record.modules) {
  const [name, ...parts] = member.id.split('/')
  const archive = record.archives.find(item => item.name === name)
  assert(archive && member.archive === `${name}-${archive.version}`, 'Wrong module archive binding')
  assert.equal(member.member, `package/lib/umd/${parts.join('/')}.js`, 'Wrong UMD source path')
}
const cache = new ArchiveCache(root, path.join(root, 'refactor/.cache/monaco-review'))
await cache.verify(record.archives, record.remotes, process.argv.includes('--fetch'))
for (const name of ['typescript', 'terser', 'source-map']) {
  const archive = record.archives.find(item => item.name === name)
  assert(archive, 'Missing historical compiler dependency')
  cache.extractCompiler(archive)
}
for (const member of record.compilerMembers)
  cache.member(member)
const require = createRequire(path.join(cache.directory, 'compiler/entry.cjs'))
const ts = require('typescript') as typeof import('typescript')

const terser = require('terser') as { minify: (source: string, options: { output: { comments: string } }) => Promise<{ code: string }> }

assert.equal(ts.version, '4.4.4', 'Wrong TypeScript compiler')
assert.equal(require('terser/package.json').version, '5.9.0', 'Wrong Terser compiler')

assert.equal(require('source-map/package.json').version, '0.7.3', 'Wrong minifier dependency')

function compile(source: string): string {
  // Emit with the real pinned standard libraries. Isolated transpileModule loses
  // Promise type resolution and emits a different async helper argument here.
  // Unresolved service imports are intentionally not a full upstream typecheck.
  const options: import('typescript').CompilerOptions = {
    target: ts.ScriptTarget.ES5,
    module: ts.ModuleKind.AMD,
    newLine: ts.NewLineKind.LineFeed,
    noResolve: true,
    lib: ['lib.es5.d.ts', 'lib.dom.d.ts', 'lib.es2015.collection.d.ts', 'lib.es2015.promise.d.ts', 'lib.es2015.iterable.d.ts'],
  }
  const host = ts.createCompilerHost(options)
  const getSourceFile = host.getSourceFile.bind(host)
  host.getSourceFile = (file, languageVersion, onError, createNew) => file === 'worker.ts'
    ? ts.createSourceFile(file, source, languageVersion, true)
    : getSourceFile(file, languageVersion, onError, createNew)
  let output = ''
  host.writeFile = (file, text) => {
    assert(file.endsWith('.js') && !output, 'Unexpected compiler output')
    output = text
  }
  const program = ts.createProgram(['worker.ts'], options, host)
  const result = program.emit()
  assert(!result.emitSkipped && output, 'Missing language source emission')
  return output
}
const modules = new Map(record.modules.map(member => [member.id, nameModule(cache.member(member).toString('utf8'), member.id)]))
const aliases = new Map(record.aliases.map(alias => [alias.id, aliasModule(alias.id, alias.main)]))
const results = []
for (const worker of record.workers) {
  const config = JSON.parse(fs.readFileSync(path.join(root, worker.config), 'utf8')).compilerOptions
  assert.equal(config.module, 'amd')
  assert.equal(config.target, 'es5')
  assert.deepEqual(config.lib, ['dom', 'es5', 'es2015.collection', 'es2015.promise', 'es2015.iterable'])
  const ownId = `vs/language/${worker.language}/${worker.language}Worker`
  const local = new Map([
    [ownId, nameModule(compile(fs.readFileSync(path.join(root, worker.source), 'utf8')), ownId)],
    ['vscode-nls/vscode-nls', nameModule(compile(fs.readFileSync(path.join(root, worker.shim), 'utf8')), 'vscode-nls/vscode-nls')],
  ])
  const development = cache.member(worker.development).toString('utf8')
  const fragments = worker.ids.map((id) => {
    const source = local.get(id) ?? modules.get(id) ?? aliases.get(id)
    assert(source, `Missing source for ${id}`)
    return { id, source }
  })
  verifyWorkerSources(development, worker.ids, fragments)
  const target = fs.readFileSync(path.join(root, worker.target.path))
  assert.equal(hash(target), worker.target.sha256, 'Shipped Monaco language worker changed')
  const { code } = await terser.minify(development, { output: { comments: 'some' } })
  assert.equal(languageHeader(worker.language) + code, target.toString('utf8'), 'Minified language worker differs')
  results.push({ language: worker.language, modules: worker.ids.length, exactSources: true, exactWorker: true, sha256: hash(target) })
}
console.log(JSON.stringify({ archives: record.archives.length, gitSources: record.remotes.length, npmModules: modules.size, aliases: aliases.size, workers: results, licenseReviewComplete: false, otherMonacoComponentsReviewed: false }))
