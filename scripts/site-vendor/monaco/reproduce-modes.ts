import type { Archive, Member, Remote } from './archives.ts'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import { createRequire } from 'node:module'
import path from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'
import { ArchiveCache, hash } from './archives.ts'
import { emitAmd } from './compiler.ts'
import { aliasModule, languageHeader, nameModule, verifyWorkerSources } from './languages.ts'

interface Provenance {
  archives: Archive[]
  remotes: Remote[]
  compilerMembers: Member[]
  declaration: Member
  npmModules: (Member & { id: string })[]
  aliases: { id: string, main: string }[]
  files: {
    language: string
    development: Member
    target: { path: string, sha256: string }
    ids: string[]
    modules: { id: string, source: string, resolveJsonc: boolean }[]
    config: string
  }[]
}
const root = fileURLToPath(new URL('../../../', import.meta.url))
assert(process.argv.slice(2).every(arg => arg === '--fetch'), 'Use reproduce-modes.ts [--fetch]')
assert.equal(process.version, `v${fs.readFileSync(path.join(root, '.node-version'), 'utf8').trim()}`, 'Use canonical Node')
const record: Provenance = JSON.parse(fs.readFileSync(path.join(root, 'refactor/baselines/monaco-modes-provenance.json'), 'utf8'))
assert.deepEqual(record.files.map(file => file.language), ['css', 'html', 'json', 'typescript'], 'Missing mode bundle')
assert.equal(record.files.flatMap(file => file.modules).length, 14, 'Missing Monaco mode source')
assert.equal(record.npmModules.length, 6, 'Missing mode dependency source')
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

assert.equal(ts.version, '4.4.4')
assert.equal(require('terser/package.json').version, '5.9.0')

assert.equal(require('source-map/package.json').version, '0.7.3')

const jsonc = cache.member(record.declaration).toString('utf8')
const modules = new Map(record.npmModules.map(member => [member.id, nameModule(cache.member(member).toString('utf8'), member.id)]))
const aliases = new Map(record.aliases.map(alias => [alias.id, aliasModule(alias.id, alias.main)]))
const results = []
for (const file of record.files) {
  assert(record.remotes.some(remote => remote.source === file.config), 'Unverified mode compiler config')
  const config: { compilerOptions: { module: string, target: string, lib: string[], strict?: boolean } } = JSON.parse(fs.readFileSync(path.join(root, file.config), 'utf8'))
  assert.equal(config.compilerOptions.module, 'amd')
  assert.equal(config.compilerOptions.target, 'es5')
  const local = new Map(file.modules.map((module) => {
    assert(record.remotes.some(remote => remote.source === module.source), 'Unverified mode source')
    const source = fs.readFileSync(path.join(root, module.source), 'utf8')
    const compiled = emitAmd(ts, source, config.compilerOptions.lib, config.compilerOptions.strict, module.resolveJsonc ? [{ name: 'jsonc-parser', source: jsonc }] : [])
    return [module.id, nameModule(compiled, module.id)]
  }))
  const development = cache.member(file.development).toString('utf8')
  verifyWorkerSources(development, file.ids, file.ids.map((id) => {
    const source = local.get(id) ?? modules.get(id) ?? aliases.get(id)
    assert(source, `Missing mode source: ${id}`)
    return { id, source }
  }))
  const target = fs.readFileSync(path.join(root, file.target.path))
  assert.equal(hash(target), file.target.sha256, 'Shipped Monaco mode changed')
  const { code } = await terser.minify(development, { output: { comments: 'some' } })
  assert.equal(languageHeader(file.language) + code, target.toString('utf8'), 'Minified mode bundle differs')
  results.push({ language: file.language, modules: file.ids.length, exactSources: true, exactOutput: true, sha256: hash(target) })
}
console.log(JSON.stringify({ archives: record.archives.length, gitSources: record.remotes.length, ownModules: 14, npmModules: modules.size, aliases: aliases.size, modes: results, coreAndBasicLanguagesReviewed: false }))
