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
import { coreCssHeader, coreStyleOrder, prepareCoreStyles } from './css.ts'

interface Selector { selector: string, name: string, version: string, resolved: string, integrity: string }
interface LockedDependency {
  version: string
  resolved?: string
  integrity?: string
  dependencies?: Record<string, string>
  optionalDependencies?: Record<string, string>
}
interface Provenance {
  commit: string
  archives: Archive[]
  sourceArchive: { url: string, file: string, bytes: number, sha256: string }
  members: { path: string, member: string, sha256: string, gitBlobSha: string, gitNormalizeCRLF?: boolean, frozen?: string }[]
  tooling: { manifest: object, selectors: Selector[] }
  coreJavaScript: Member
  styles: { id: string, prepared: Member }[]
  fonts: string[]
  normalizedSeparators: number
  development: Member
  minified: Member
  editor: Member
  target: { path: string, sha256: string, crlf: number }
}

const root = fileURLToPath(new URL('../../../', import.meta.url))
assert(process.argv.slice(2).every(arg => arg === '--fetch'), 'Use yarn verify:monaco-css [--fetch]')
assert.equal(process.version, `v${fs.readFileSync(path.join(root, '.node-version'), 'utf8').trim()}`, 'Use canonical Node')
const yarn = process.env.npm_execpath
assert(yarn && process.env.npm_config_user_agent?.split(' ')[0] === 'yarn/1.22.22', 'Use Yarn Classic 1.22.22')
assert.equal(execFileSync(process.execPath, [yarn, '--version'], { encoding: 'utf8' }).trim(), '1.22.22')
for (const variable of ['BROWSERSLIST', 'BROWSERSLIST_CONFIG', 'BROWSERSLIST_ENV'])
  assert(!process.env[variable], `Historical CSS target must not inherit ${variable}`)
const record: Provenance = JSON.parse(fs.readFileSync(path.join(root, 'refactor/baselines/monaco-css-build-provenance.json'), 'utf8'))
const cache = new ArchiveCache(root, path.join(root, 'refactor/.cache/monaco-review'))
const online = process.argv.includes('--fetch')
await cache.verify(record.archives, [], online)
assert.equal(record.sourceArchive.file, 'vscode-source.tgz')
assert.equal(record.sourceArchive.url, `https://codeload.github.com/microsoft/vscode/tar.gz/${record.commit}`)
const archivePath = path.join(cache.directory, record.sourceArchive.file)
let archive: Buffer
if (online) {
  const response = await fetch(record.sourceArchive.url, { signal: AbortSignal.timeout(60000) })
  assert(response.ok, `VS Code archive HTTP ${response.status}`)
  archive = Buffer.from(await response.arrayBuffer())
}
else {
  archive = fs.readFileSync(archivePath)
}
assert.equal(archive.length, record.sourceArchive.bytes)
assert.equal(hash(archive), record.sourceArchive.sha256, 'VS Code archive changed')
if (online)
  fs.writeFileSync(archivePath, archive)
const sources = new Map<string, Buffer>()
for (const member of record.members) {
  assert.equal(member.member, `vscode-${record.commit}/${member.path}`)
  assert(!member.path.split('/').includes('..'), 'Invalid VS Code source')
  const bytes = execFileSync('tar', ['-xOzf', archivePath, member.member], { maxBuffer: 5 * 1024 * 1024 })
  assert.equal(hash(bytes), member.sha256, `Source changed: ${member.path}`)
  assert.equal(Boolean(member.gitNormalizeCRLF), member.path === 'LICENSE.txt', 'Unexpected Git line-ending adaptation')
  const gitBytes = member.gitNormalizeCRLF ? Buffer.from(bytes.toString('utf8').replace(/\r\n/g, '\n')) : bytes
  assert.equal(createHash('sha1').update(`blob ${gitBytes.length}\0`).update(gitBytes).digest('hex'), member.gitBlobSha, 'Git blob changed')
  if (member.frozen)
    assert.deepEqual(fs.readFileSync(path.join(root, member.frozen)), bytes, 'Frozen CSS recipe changed')
  assert(!sources.has(member.path), 'Duplicate CSS source')
  sources.set(member.path, bytes)
}
function read(file: string): Buffer {
  const source = sources.get(file)
  assert(source, `Unverified CSS source: ${file}`)
  return source
}
const ids = coreStyleOrder(cache.member(record.coreJavaScript).toString('utf8'))
assert(read('.gitattributes').toString('utf8').includes('LICENSE.txt eol=crlf'), 'Unexplained archive license line endings')
assert.deepEqual(ids, record.styles.map(style => style.id))
assert.equal(ids.length, 68)
const styles = prepareCoreStyles(read('build/lib/standalone.ts').toString('utf8'), read('src/vs/css.build.js').toString('utf8'), ids, read)
for (const [index, style] of styles.prepared.entries())
  assert(Buffer.from(style.contents).equals(cache.member(record.styles[index]!.prepared)), `Prepared CSS differs: ${style.id}`)
assert.deepEqual(styles.fonts, record.fonts)
for (const font of styles.fonts)
  assert.deepEqual(read(`src/${font}`), cache.read('monaco-editor-core-0.30.1', `package/esm/${font}`), 'Copied font differs')
assert.equal(styles.normalizedSeparators, record.normalizedSeparators)
assert.equal(styles.normalizedSeparators, 70)
// The archived dev CSS is LF-only; the fixed plugin joins 70 separators with CRLF.
// Record this observed publication normalization instead of ignoring whitespace.
const development = `${coreCssHeader(record.commit)}\n${styles.joined}`.replace(/\r\n/g, '\n')
assert(Buffer.from(development).equals(cache.member(record.development)), 'Complete CSS development bundle differs')

// The existing Yarn lock parser has no declarations; keep its used boundary local.
const lockfile = createRequire(import.meta.url)('@yarnpkg/lockfile') as { parse: (source: string) => { type: string, object: Record<string, LockedDependency> } }
const parsed = lockfile.parse(read('yarn.lock').toString('utf8'))
assert.equal(parsed.type, 'success')
const closure = new Map<string, Selector>()
function visit(selector: string) {
  if (closure.has(selector))
    return
  const dependency = parsed.object[selector]
  assert(dependency?.resolved && dependency.integrity, `Unpinned historical CSS dependency: ${selector}`)
  closure.set(selector, { selector, name: selector.slice(0, selector.lastIndexOf('@')), version: dependency.version, resolved: dependency.resolved, integrity: dependency.integrity })
  for (const [name, range] of Object.entries({ ...dependency.dependencies, ...dependency.optionalDependencies }))
    visit(`${name}@${range}`)
}
visit('cssnano@^4.1.11')
assert.deepEqual([...closure.values()], record.tooling.selectors)
assert.equal(JSON.parse(read('package.json').toString('utf8')).devDependencies.cssnano, '^4.1.11')
const manifest = { name: 'monaco-css-historical-tools', private: true, browserslist: ['defaults'], dependencies: { cssnano: '^4.1.11' } }
assert.deepEqual(manifest, record.tooling.manifest)
const compiler = fs.mkdtempSync(path.join(cache.directory, 'css-build-'))
fs.writeFileSync(path.join(compiler, 'package.json'), `${JSON.stringify(manifest, null, 2)}\n`)
fs.writeFileSync(path.join(compiler, 'yarn.lock'), read('yarn.lock'))
const install = execFileSync(process.execPath, [yarn, 'install', '--frozen-lockfile', '--ignore-scripts', '--non-interactive', ...online ? [] : ['--offline']], { cwd: compiler, encoding: 'utf8', maxBuffer: 10 * 1024 * 1024 })
fs.writeFileSync(path.join(cache.directory, 'css-install-last.log'), install)
assert.deepEqual(fs.readFileSync(path.join(compiler, 'yarn.lock')), read('yarn.lock'), 'Frozen historical lock changed')
const require = createRequire(path.join(compiler, 'entry.cjs'))
const cssnanoPath = require.resolve('cssnano/package.json')
const cssRequire = createRequire(cssnanoPath)
assert.equal(require(cssnanoPath).version, '4.1.11')
assert.equal(cssRequire('postcss/package.json').version, '7.0.35')
const minified: { css: string } = await cssRequire('postcss')([require('cssnano')({ preset: 'default' })]).process(development, { from: path.join(compiler, 'editor.main.css'), map: false })

assert(Buffer.from(minified.css).equals(cache.member(record.minified)), 'Complete CSS minification differs')
assert.deepEqual(cache.member(record.minified), cache.member(record.editor), 'Editor CSS archive differs')
const target = fs.readFileSync(path.join(root, record.target.path))
assert.equal(hash(target), record.target.sha256, 'Site CSS changed')
assert.equal((target.toString('utf8').match(/\r\n/g) || []).length, record.target.crlf)
assert.equal(record.target.crlf, 5)
assert(Buffer.from(minified.css.replace(/\n/g, '\r\n')).equals(target), 'Site CSS differs beyond five header newlines')
console.log(JSON.stringify({ gitSources: sources.size, styles: ids.length, inlinedImages: styles.assets.filter(file => !file.endsWith('.css')), fonts: styles.fonts, dependencySelectors: closure.size, normalizedSeparators: styles.normalizedSeparators, developmentBytes: Buffer.byteLength(development), minifiedBytes: Buffer.byteLength(minified.css), siteBytes: target.length, exactDevelopment: true, exactMinification: true, preservedSiteCrlf: 5, compiler: { cssnano: '4.1.11', postcss: '7.0.35' }, originalCoreTypeScriptCompiled: false }))
