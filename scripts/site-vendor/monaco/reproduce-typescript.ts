import assert from 'node:assert/strict'
import { Buffer } from 'node:buffer'
import { execFileSync } from 'node:child_process'
import { createHash } from 'node:crypto'
import fs from 'node:fs'
import { createRequire } from 'node:module'
import path from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'
import { verifyTypeScriptSource, workerHeader } from './typescript.ts'

interface Archive { name: string, version: string, tarball: string, integrity: string, sha256: string }
interface Member { archive: string, member: string, sha256: string }
interface Record {
  archives: Archive[]
  remotes: { source: string, sha256: string, gitBlobSha: string, apiUrl: string }[]
  source: Member
  worker: Member
  compiler: Member & { version: string, sourceMap: string, options: { output: { comments: string } } }
  target: { path: string, sha256: string }
  notices: { source: string, target: string, sha256: string, member: string | null }[]
}
const root = fileURLToPath(new URL('../../../', import.meta.url))
const record: Record = JSON.parse(fs.readFileSync(path.join(root, 'refactor/baselines/monaco-typescript-provenance.json'), 'utf8'))
assert(process.argv.slice(2).every(arg => arg === '--fetch'), 'Use reproduce-typescript.ts [--fetch]')
assert.equal(process.version, `v${fs.readFileSync(path.join(root, '.node-version'), 'utf8').trim()}`, 'Use canonical Node')
const cache = path.join(root, 'refactor/.cache/monaco-review')
fs.mkdirSync(cache, { recursive: true })
assert.equal(fs.realpathSync(cache).toLowerCase(), path.resolve(cache).toLowerCase(), 'Redirected Monaco cache')
const hash = (bytes: Uint8Array) => createHash('sha256').update(bytes).digest('hex')
async function download(url: string): Promise<Buffer> {
  const response = await fetch(url, { signal: AbortSignal.timeout(60000) })
  assert(response.ok, `${url}: HTTP ${response.status}`)
  return Buffer.from(await response.arrayBuffer())
}
for (const archive of record.archives) {
  const file = path.join(cache, `${archive.name}-${archive.version}.tgz`)
  const bytes = process.argv.includes('--fetch') ? await download(archive.tarball) : fs.readFileSync(file)
  assert.equal(hash(bytes), archive.sha256, 'Monaco archive changed')
  assert.equal(`sha512-${createHash('sha512').update(bytes).digest('base64')}`, archive.integrity, 'Monaco archive integrity changed')
  if (process.argv.includes('--fetch'))
    fs.writeFileSync(file, bytes)
}
for (const remote of record.remotes) {
  const verify = (bytes: Buffer) => {
    assert.equal(hash(bytes), remote.sha256, 'Monaco fixed Git content changed')
    assert.equal(createHash('sha1').update(`blob ${bytes.length}\0`).update(bytes).digest('hex'), remote.gitBlobSha, 'Monaco Git blob changed')
  }
  verify(fs.readFileSync(path.join(root, remote.source)))
  if (process.argv.includes('--fetch')) {
    const data: { encoding: string, content: string } = JSON.parse((await download(remote.apiUrl)).toString('utf8'))
    assert.equal(data.encoding, 'base64', 'Expected Git content encoding')
    verify(Buffer.from(data.content, 'base64'))
  }
}
function readMember(archive: string, member: string): Buffer {
  return execFileSync('tar', ['-xOzf', path.join(cache, `${archive}.tgz`), member], { maxBuffer: 20 * 1024 * 1024 })
}
function verifiedMember(member: Member): Buffer {
  const bytes = readMember(member.archive, member.member)
  assert.equal(hash(bytes), member.sha256, 'Monaco source member changed')
  return bytes
}
for (const notice of record.notices) {
  assert.equal(hash(fs.readFileSync(path.join(root, notice.source))), notice.sha256, 'TypeScript notice changed')
  if (notice.member)
    assert.equal(hash(readMember('typescript-4.4.4', notice.member)), notice.sha256, 'TypeScript upstream notice changed')
}
const source = verifiedMember(record.source).toString('utf8')
const worker = verifiedMember(record.worker).toString('utf8')
const matchedCharacters = verifyTypeScriptSource(source, worker)
// Only the fixed minifier and its fixed source-map library execute; no install scripts.
for (const name of ['terser', 'source-map']) {
  const archive = record.archives.find(item => item.name === name)!
  assert(archive, 'Missing historical compiler dependency')
  const members = execFileSync('tar', ['-tzf', path.join(cache, `${name}-${archive.version}.tgz`)], { encoding: 'utf8' }).trim().split(/\r?\n/)
  const directory = path.join(cache, 'compiler/node_modules', name)
  fs.mkdirSync(directory, { recursive: true })
  assert.equal(fs.realpathSync(directory).toLowerCase(), path.resolve(directory).toLowerCase(), 'Redirected compiler directory')
  for (const member of members.filter(member => !member.endsWith('/'))) {
    assert(member.startsWith('package/') && !member.includes('\\') && !member.split('/').includes('..'), 'Unsafe compiler archive member')
    const destination = path.resolve(directory, member.slice('package/'.length))
    assert(destination.startsWith(`${directory}${path.sep}`), 'Compiler member escapes cache')
    fs.mkdirSync(path.dirname(destination), { recursive: true })
    assert.equal(fs.realpathSync(path.dirname(destination)).toLowerCase(), path.dirname(destination).toLowerCase(), 'Redirected compiler member directory')
    assert(!fs.existsSync(destination) || !fs.lstatSync(destination).isSymbolicLink(), 'Redirected compiler file')
    fs.writeFileSync(destination, readMember(`${name}-${archive.version}`, member))
  }
}
const require = createRequire(path.join(cache, 'compiler/entry.cjs'))
assert.equal(require('terser/package.json').version, record.compiler.version, 'Wrong Terser version')

assert.equal(require('source-map/package.json').version, record.compiler.sourceMap, 'Wrong source-map version')

assert.equal(hash(fs.readFileSync(path.join(cache, 'compiler/node_modules/terser/dist/bundle.min.js'))), record.compiler.sha256, 'Wrong Terser compiler bytes')
const compiler = require('terser') as { minify: (source: string, options: Record['compiler']['options']) => Promise<{ code: string }> }

const { code } = await compiler.minify(worker, record.compiler.options)
const target = fs.readFileSync(path.join(root, record.target.path))
assert.equal(hash(target), record.target.sha256, 'Current Monaco TypeScript worker changed')
assert.equal(workerHeader + code, target.toString('utf8'), 'Minified Monaco TypeScript worker differs')
console.log(JSON.stringify({ archives: record.archives.length, fixedGitSources: record.remotes.length, typeScriptVersion: '4.4.4', sourceCharacters: matchedCharacters, exactWorker: true, workerSha256: hash(target), notices: record.notices.length, otherMonacoComponentsReviewed: false }))
