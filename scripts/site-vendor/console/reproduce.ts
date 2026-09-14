import type { Archive, External, Source } from './provenance.ts'
import assert from 'node:assert/strict'
import { execFileSync } from 'node:child_process'
import fs from 'node:fs'
import { createRequire } from 'node:module'
import path from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'
import { hash, parcelModules, verifyArchive, verifyModules } from './provenance.ts'

interface CompilerOptions { warnings: boolean, safari10: boolean, mangle: { toplevel: boolean } }
interface Provenance {
  archive: Archive
  frozen: { path: string, sha256: string }
  compiler: { archive: Archive, member: string, sha256: string, sourceMapVersion: string, options: CompilerOptions }
  sources: Source[]
  external: External[]
}
interface Minifier { minify: (source: string, options: CompilerOptions) => { code?: string, error?: unknown } }

const root = fileURLToPath(new URL('../../../', import.meta.url))
const record: Provenance = JSON.parse(fs.readFileSync(path.join(root, 'refactor/baselines/console-feed-provenance.json'), 'utf8'))
assert(process.argv.slice(2).every(arg => arg === '--fetch'), 'Use reproduce.ts [--fetch]')
assert.equal(process.version, `v${fs.readFileSync(path.join(root, '.node-version'), 'utf8').trim()}`, 'Use canonical Node')
const cacheRoot = fs.realpathSync(path.join(root, 'refactor/.cache'))
const cache = path.join(cacheRoot, 'console-feed-reproduction')
fs.mkdirSync(cache, { recursive: true })
assert.equal(fs.realpathSync(cache), cache, 'Reproduction cache must not redirect')
for (const archive of [record.archive, record.compiler.archive]) {
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
const count = verifyModules(parcelModules(frozen), record.sources, record.external, member => readMember('console-feed-3.2.2.tgz', member).toString('utf8'), (source) => {
  const result = minify(source, record.compiler.options)
  if (result.error)
    throw result.error
  assert(typeof result.code === 'string')
  return result.code
})
console.log(JSON.stringify({ exactModules: count, totalVendorModules: 100, archive: record.archive.sha256, licenseClosure: false }))
