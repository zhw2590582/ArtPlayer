import type { Archive, External, Source } from './provenance.ts'
import assert from 'node:assert/strict'
import { execFileSync } from 'node:child_process'
import fs from 'node:fs'
import { createRequire } from 'node:module'
import path from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'
import { hash, parcelModules, verifyArchive, verifyModules } from './provenance.ts'

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
interface CommonProvenance {
  archives: (Archive & { id: string, notices: { source: string, member: string, sha256: string }[] })[]
  sources: CommonSource[]
  external: External[]
  roots: string[]
  compilerOptions: CompilerOptions
  unresolvedModules: string[]
}

const root = fileURLToPath(new URL('../../../', import.meta.url))
const record: Provenance = JSON.parse(fs.readFileSync(path.join(root, 'refactor/baselines/console-feed-provenance.json'), 'utf8'))
const common: CommonProvenance = JSON.parse(fs.readFileSync(path.join(root, 'refactor/baselines/console-commonjs-provenance.json'), 'utf8'))
assert(process.argv.slice(2).every(arg => arg === '--fetch'), 'Use reproduce.ts [--fetch]')
assert.equal(process.version, `v${fs.readFileSync(path.join(root, '.node-version'), 'utf8').trim()}`, 'Use canonical Node')
const cacheRoot = fs.realpathSync(path.join(root, 'refactor/.cache'))
const cache = path.join(cacheRoot, 'console-feed-reproduction')
fs.mkdirSync(cache, { recursive: true })
assert.equal(fs.realpathSync(cache), cache, 'Reproduction cache must not redirect')
for (const archive of [record.archive, record.compiler.archive, ...common.archives]) {
  const target = path.join(cache, `${archive.name}-${archive.version}.tgz`)
  if (process.argv.includes('--fetch')) {
    const response = await fetch(archive.tarball)
    assert(response.ok, `Archive request failed: ${response.status}`)
    const bytes = new Uint8Array(await response.arrayBuffer())
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

const frozen = fs.readFileSync(path.join(root, record.frozen.path), 'utf8')
assert.equal(hash(frozen), record.frozen.sha256, 'Frozen console changed')
assert.equal(record.sources.length, 32, 'Incomplete console-feed scope')
function compile(source: string, options: CompilerOptions) {
  const result = minify(source, options)
  if (result.error)
    throw result.error
  assert(typeof result.code === 'string')
  return result.code
}
const modules = parcelModules(frozen)
const count = verifyModules(modules, record.sources, record.external, member => readMember('console-feed-3.2.2.tgz', member).toString('utf8'), source => compile(source, record.compiler.options))
assert.equal(common.sources.length, 41, 'Incomplete commonjs scope')
const archiveIds = new Set(common.archives.map(archive => archive.id))
assert.equal(archiveIds.size, common.archives.length, 'Duplicate archives')
for (const archive of common.archives) {
  assert.equal(archive.id, `${archive.name}-${archive.version}`, 'Archive ID differs')
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
console.log(JSON.stringify({ exactModules: identified.size, consoleFeed: count, commonjs: commonCount, totalVendorModules: 100, unresolved: common.unresolvedModules.length, licenseClosure: false }))
