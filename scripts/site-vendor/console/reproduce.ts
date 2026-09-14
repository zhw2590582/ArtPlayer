import type { EmbeddedNotice } from './embedded-notices.ts'
import type { Member, SourceMapRecord, TransformedSource } from './embedded-sources.ts'
import type { Archive, External, Source } from './provenance.ts'
import type { BabelRuntime, EsmSource } from './reconstruction.ts'
import assert from 'node:assert/strict'
import { Buffer } from 'node:buffer'
import { execFileSync } from 'node:child_process'
import fs from 'node:fs'
import { createRequire } from 'node:module'
import path from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'
import { extractNotice } from './embedded-notices.ts'
import { verifyMappedSources, verifyTransformedSources } from './embedded-sources.ts'
import { hash, parcelModules, verifyArchive, verifyModules, verifyPackageEdges } from './provenance.ts'
import { reconstructModule, verifyPrelude } from './reconstruction.ts'

interface CompilerOptions { warnings: boolean, safari10: boolean, mangle: { toplevel: boolean }, output?: { comments: boolean } }
interface Provenance {
  archive: Archive
  frozen: { path: string, sha256: string }
  compiler: { archive: Archive, member: string, sha256: string, sourceMapVersion: string, options: CompilerOptions }
  sources: Source[]
  external: External[]
}
interface Minifier { minify: (source: string, options: CompilerOptions) => { code?: string, error?: unknown } }
interface CommonSource extends Source { archive: string, transform: 'plain' | 'production' | 'process-browser' }
interface Notice { source: string, member: string, sha256: string }
interface SourceGroup<S extends Source> {
  archives: (Archive & { id: string, notices: Notice[] })[]
  sources: S[]
  external: External[]
  roots: string[]
  compilerOptions: CompilerOptions
  unresolvedModules: string[]
}
interface EsmProvenance extends SourceGroup<EsmSource> {
  babel: { archive: Archive, member: string, sha256: string, version: string }
  parcel: { archive: Archive, prelude: { member: string, sha256: string }, footer: string, notices: Notice[], recipeMembers: { member: string, sha256: string }[] }
  supplementalNotices: { url: string, apiUrl?: string, source: string, sha256: string }[]
}
interface EmbeddedProvenance {
  archives: (Archive & { id: string, notices: Notice[] })[]
  compiler: { archive: Archive, member: string, sha256: string, version: string, options: { presets: [string, { loose: boolean }][] } }
  sourceMaps: SourceMapRecord[]
  tokenizer: { dependency: Member, value: string, sources: TransformedSource[] }
}
interface HistoricalBabel { version: string, transform: (source: string, options: EmbeddedProvenance['compiler']['options']) => { code: string } }

const root = fileURLToPath(new URL('../../../', import.meta.url))
const record: Provenance = JSON.parse(fs.readFileSync(path.join(root, 'refactor/baselines/console-feed-provenance.json'), 'utf8'))
const common: SourceGroup<CommonSource> = JSON.parse(fs.readFileSync(path.join(root, 'refactor/baselines/console-commonjs-provenance.json'), 'utf8'))
const esm: EsmProvenance = JSON.parse(fs.readFileSync(path.join(root, 'refactor/baselines/console-esm-provenance.json'), 'utf8'))
const embeddedSources: EmbeddedProvenance = JSON.parse(fs.readFileSync(path.join(root, 'refactor/baselines/console-embedded-sources.json'), 'utf8'))
assert(process.argv.slice(2).every(arg => arg === '--fetch'), 'Use reproduce.ts [--fetch]')
assert.equal(process.version, `v${fs.readFileSync(path.join(root, '.node-version'), 'utf8').trim()}`, 'Use canonical Node')
const cacheRoot = fs.realpathSync(path.join(root, 'refactor/.cache'))
const cache = path.join(cacheRoot, 'console-feed-reproduction')
fs.mkdirSync(cache, { recursive: true })
assert.equal(fs.realpathSync(cache), cache, 'Reproduction cache must not redirect')
async function download(url: string) {
  try {
    const response = await fetch(url)
    assert(response.ok, `HTTP ${response.status}`)
    return new Uint8Array(await response.arrayBuffer())
  }
  catch (cause) {
    const error = new Error(`Historical source download failed: ${url}`)
    Object.defineProperty(error, 'cause', { value: cause })
    throw error
  }
}
const allArchives = [record.archive, record.compiler.archive, ...common.archives, ...esm.archives, esm.babel.archive, esm.parcel.archive, ...embeddedSources.archives, embeddedSources.compiler.archive]
const allArchiveIds = new Set(allArchives.map(archive => `${encodeURIComponent(archive.name)}-${archive.version}`))
assert.equal(allArchiveIds.size, allArchives.length, 'Duplicate reproduction archive')
for (const archive of allArchives) {
  const target = path.join(cache, `${encodeURIComponent(archive.name)}-${archive.version}.tgz`)
  if (process.argv.includes('--fetch')) {
    const bytes = await download(archive.tarball)
    verifyArchive(bytes, archive)
    fs.writeFileSync(target, bytes)
  }
  verifyArchive(fs.readFileSync(target), archive)
}
const readMember = (name: string, member: string) => execFileSync('tar', ['-xOzf', path.join(cache, name), member], { maxBuffer: 8 * 1024 * 1024 })
const compilerBytes = readMember('terser-3.17.0.tgz', record.compiler.member)
assert.equal(hash(compilerBytes), record.compiler.sha256, 'Compiler member changed')
const compilerPath = path.join(cache, 'terser.cjs')
fs.writeFileSync(compilerPath, compilerBytes)
const require = createRequire(compilerPath)
assert.equal(require('source-map/package.json').version, record.compiler.sourceMapVersion, 'Source-map dependency changed')

const { minify } = require(compilerPath) as Minifier

const babelBytes = readMember(`${encodeURIComponent(esm.babel.archive.name)}-${esm.babel.archive.version}.tgz`, esm.babel.member)
assert.equal(hash(babelBytes), esm.babel.sha256, 'Babel compiler member changed')
const babelPath = path.join(cache, 'babel.cjs')
fs.writeFileSync(babelPath, babelBytes)
const babel = require(babelPath) as BabelRuntime

assert.equal(babel.version, esm.babel.version, 'Babel version changed')
const frozen = fs.readFileSync(path.join(root, record.frozen.path), 'utf8')
assert.equal(hash(frozen), record.frozen.sha256, 'Frozen console changed')
assert.equal(record.sources.length, 32, 'Incomplete console-feed scope')
function compile(source: string, options: CompilerOptions) {
  const result = minify(source, structuredClone(options))
  if (result.error)
    throw result.error
  assert(typeof result.code === 'string')
  return result.code
}
const modules = parcelModules(frozen)
const count = verifyModules(modules, record.sources, record.external, member => readMember('console-feed-3.2.2.tgz', member).toString('utf8'), source => compile(source, record.compiler.options))
assert.equal(common.sources.length, 41, 'Incomplete commonjs scope')
const runtimeArchives = [...common.archives, ...esm.archives]
const archiveIds = new Set(runtimeArchives.map(archive => archive.id))
assert.equal(archiveIds.size, runtimeArchives.length, 'Duplicate archives')
for (const archive of runtimeArchives) {
  assert.equal(archive.id, `${encodeURIComponent(archive.name)}-${archive.version}`, 'Archive ID differs')
  for (const notice of archive.notices) {
    const bytes = readMember(`${archive.id}.tgz`, notice.member)
    assert.equal(hash(bytes), notice.sha256, 'Upstream notice differs')
    assert.equal(hash(fs.readFileSync(path.join(root, notice.source))), notice.sha256, 'Frozen notice differs')
  }
}
const commonCount = verifyModules(modules, common.sources, common.external, (member, item) => {
  assert(archiveIds.has(item.archive), 'Unknown source archive')
  return readMember(`${item.archive}.tgz`, member).toString('utf8')
}, (source, item) => {
  if (item.transform === 'production') {
    assert(source.includes('process.env.NODE_ENV'), 'Missing production substitution')
    source = source.replaceAll('process.env.NODE_ENV', '"production"')
  }
  else if (item.transform === 'process-browser') {
    assert.equal(source.split('process.browser = true;').length, 2, 'Unexpected process browser assignment')
    source = source.replace('process.browser = true;', '')
  }
  else {
    assert.equal(item.transform, 'plain', 'Unknown transform')
  }
  return compile(source, common.compilerOptions)
}, { roots: common.roots, sourcePrefix: 'package/' })
const identified = new Set([...record.sources, ...common.sources].map(source => source.id))
assert.equal(identified.size, count + commonCount, 'Duplicate identified module')
assert.deepEqual([...modules.keys()].filter(id => !identified.has(id) && !['Focm', 'W5CS'].includes(id)), common.unresolvedModules, 'Unresolved module scope changed')
assert.equal(esm.sources.length, 27, 'Incomplete ESM source scope')
const esmCount = verifyModules(modules, esm.sources, esm.external, (member, item) => {
  assert(archiveIds.has(item.archive), 'Unknown ESM source archive')
  return readMember(`${item.archive}.tgz`, member).toString('utf8')
}, (source, item) => reconstructModule(source, item, babel, code => compile(code, esm.compilerOptions)), { roots: esm.roots, sourcePrefix: 'package/' })
for (const source of esm.sources) {
  assert(!identified.has(source.id), 'Duplicate ESM module')
  identified.add(source.id)
}
assert.equal(identified.size, 100, 'Incomplete vendor reconstruction')
assert.deepEqual([...modules.keys()].filter(id => !identified.has(id) && !['Focm', 'W5CS'].includes(id)), esm.unresolvedModules, 'Unresolved ESM scope changed')
assert.equal(esm.unresolvedModules.length, 0, 'Vendor source scope still incomplete')
const archiveNames = new Map(runtimeArchives.map(archive => [archive.id, archive.name]))
verifyPackageEdges(modules, [
  ...record.sources.map(source => ({ id: source.id, packageName: record.archive.name })),
  ...[...common.sources, ...esm.sources].map(source => ({ id: source.id, packageName: archiveNames.get(source.archive)! })),
])
const parcelArchive = `${esm.parcel.archive.name}-${esm.parcel.archive.version}.tgz`
const prelude = readMember(parcelArchive, esm.parcel.prelude.member)
assert.equal(hash(prelude), esm.parcel.prelude.sha256, 'Parcel prelude source changed')
verifyPrelude(frozen, prelude.toString('utf8'), esm.parcel.footer)
for (const recipe of esm.parcel.recipeMembers)
  assert.equal(hash(readMember(parcelArchive, recipe.member)), recipe.sha256, 'Parcel recipe source changed')
for (const notice of esm.parcel.notices) {
  assert.equal(hash(readMember(parcelArchive, notice.member)), notice.sha256, 'Parcel notice source changed')
  assert.equal(hash(fs.readFileSync(path.join(root, notice.source))), notice.sha256, 'Frozen Parcel notice changed')
}
for (const notice of esm.supplementalNotices) {
  assert.equal(hash(fs.readFileSync(path.join(root, notice.source))), notice.sha256, 'Frozen supplemental notice changed')
  if (process.argv.includes('--fetch')) {
    let bytes: Uint8Array = await download(notice.apiUrl || notice.url)
    if (notice.apiUrl) {
      const content: { encoding: string, content: string } = JSON.parse(Buffer.from(bytes).toString('utf8'))
      assert.equal(content.encoding, 'base64', 'Unexpected upstream notice encoding')
      assert(typeof content.content === 'string', 'Missing upstream notice content')
      bytes = Buffer.from(content.content, 'base64')
    }
    assert.equal(hash(bytes), notice.sha256, 'Upstream supplemental notice changed')
  }
}
const embedded: { notices: EmbeddedNotice[] } = JSON.parse(fs.readFileSync(path.join(root, 'refactor/baselines/console-embedded-notices.json'), 'utf8'))
assert.equal(embedded.notices.length, 2, 'Incomplete reviewed embedded notice scope')
assert.equal(new Set(embedded.notices.map(notice => notice.source)).size, 2, 'Duplicate embedded notice source')
for (const notice of embedded.notices) {
  assert(archiveIds.has(notice.archive) || notice.archive === 'console-feed-3.2.2', 'Unknown embedded notice archive')
  const text = extractNotice(readMember(`${notice.archive}.tgz`, notice.member), notice)
  assert.equal(fs.readFileSync(path.join(root, notice.source), 'utf8'), text, 'Frozen embedded notice changed')
}
function readEmbedded(source: Member) {
  assert(allArchiveIds.has(source.archive), 'Unknown embedded source archive')
  return readMember(`${source.archive}.tgz`, source.member)
}
for (const archive of embeddedSources.archives) {
  assert.equal(archive.id, `${encodeURIComponent(archive.name)}-${archive.version}`, 'Embedded archive ID differs')
  for (const notice of archive.notices) {
    assert.equal(hash(readMember(`${archive.id}.tgz`, notice.member)), notice.sha256, 'Embedded upstream license changed')
    assert.equal(hash(fs.readFileSync(path.join(root, notice.source))), notice.sha256, 'Frozen embedded license changed')
  }
}
assert.equal(embeddedSources.sourceMaps.length, 1, 'Incomplete embedded map scope')
const mappedCount = embeddedSources.sourceMaps.reduce((total, source) => total + verifyMappedSources(source, readEmbedded), 0)
assert.equal(mappedCount, 17, 'Incomplete react-inspector embedded scope')
const tokenizer = embeddedSources.tokenizer
const dependencyBytes = readEmbedded(tokenizer.dependency)
assert.equal(hash(dependencyBytes), tokenizer.dependency.sha256, 'Tokenizer dependency manifest changed')
const dependency: { devDependencies: Record<string, string> } = JSON.parse(dependencyBytes.toString('utf8'))
assert.equal(dependency.devDependencies['simple-html-tokenizer'], tokenizer.value, 'Tokenizer Git dependency changed')
const compiler = embeddedSources.compiler
const legacyBytes = readMember(`${compiler.archive.name}-${compiler.archive.version}.tgz`, compiler.member)
assert.equal(hash(legacyBytes), compiler.sha256, 'Embedded compiler changed')
const legacyPath = path.join(cache, 'babel6.cjs')
fs.writeFileSync(legacyPath, legacyBytes)
const legacyBabel = require(legacyPath) as HistoricalBabel
assert.equal(legacyBabel.version, compiler.version, 'Embedded compiler version changed')
assert.deepEqual(compiler.options, { presets: [['es2015', { loose: true }]] }, 'Embedded compiler options changed')
const transformedCount = verifyTransformedSources(tokenizer.sources, readEmbedded, source => legacyBabel.transform(source, compiler.options).code)
assert.equal(transformedCount, 7, 'Incomplete tokenizer scope')
console.log(JSON.stringify({ exactModules: identified.size, consoleFeed: count, commonjs: commonCount, esm: esmCount, parcelPrelude: true, packageEdges: true, embeddedNotices: embedded.notices.length, embeddedMappedSources: mappedCount, embeddedTransformedSources: transformedCount, unresolved: 0, licenseClosure: false }))
