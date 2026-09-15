import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'
import { ArchiveCache, hash } from './archives.ts'
import { adaptCoreOrigin, readCoreOrigins, verifyMonacoCoreNotices } from './core-origins.ts'

const root = fileURLToPath(new URL('../../../', import.meta.url))
assert(process.argv.slice(2).every(arg => arg === '--fetch'), 'Use reproduce-core-origins.ts [--fetch]')
assert.equal(process.version, `v${fs.readFileSync(path.join(root, '.node-version'), 'utf8').trim()}`, 'Use canonical Node')
const record = readCoreOrigins(root)
const cache = new ArchiveCache(root, path.join(root, 'refactor/.cache/monaco-review'))
await cache.verify(record.archives, record.remotes, process.argv.includes('--fetch'))
verifyMonacoCoreNotices(root, JSON.parse(fs.readFileSync(path.join(root, 'scripts/site-vendor/manifest.json'), 'utf8')))
for (const name of ['dompurify', 'marked']) {
  const manifest = record.remotes.find(remote => remote.source.endsWith(`${name}-cgmanifest.json.txt`))
  assert(manifest, 'Missing upstream component registration')
  const registrations = JSON.parse(fs.readFileSync(path.join(root, manifest.source), 'utf8')).registrations
  assert.equal(registrations.length, 1)
  assert.equal(registrations[0].component.git.name, name)
  assert.equal(registrations[0].version, record.archives.find(archive => archive.name === name)?.version, 'Upstream component version differs')
}
for (const member of record.members)
  cache.member(member)
const sourceMap: { sources: string[], sourcesContent: string[] } = JSON.parse(cache.read('monaco-editor-core-0.30.1', 'package/dev/vs/editor/editor.main.js.map').toString('utf8'))
const development = cache.read('monaco-editor-core-0.30.1', 'package/dev/vs/editor/editor.main.js').toString('utf8')
const results = []
for (const module of record.modules) {
  assert(record.remotes.some(remote => remote.source === module.source), 'Unverified embedded Git source')
  const git = fs.readFileSync(path.join(root, module.source), 'utf8')
  assert.equal(adaptCoreOrigin(cache.member(module).toString('utf8'), module.edits), git, 'Embedded npm adaptation differs')
  const named = adaptCoreOrigin(git, [module.naming])
  assert.equal(sourceMap.sourcesContent[sourceMap.sources.indexOf(`${module.id}.js`)], named, 'Embedded source map differs')
  const offset = development.indexOf(named)
  assert(offset >= 0 && development.lastIndexOf(named) === offset, 'Missing or repeated complete embedded source')
  results.push({ id: module.id, bytes: named.length, offset, exactNpmAdaptation: true, exactGitAndDevelopment: true })
}
for (const notice of record.notices) {
  const bytes = fs.readFileSync(path.join(root, notice.source))
  assert.equal(hash(bytes), notice.sha256, 'Core notice changed')
  if (notice.archive && notice.member)
    assert.deepEqual(cache.read(notice.archive, notice.member), bytes, 'Original core notice differs')
}
const purifyNotice = record.remotes.find(remote => remote.source.endsWith('dompurify.license.txt.txt'))
assert(purifyNotice)
const originalLicense = cache.read('dompurify-2.3.1', 'package/LICENSE')
assert.equal(originalLicense.subarray(-2).toString(), '\n\n')
// VS Code drops exactly one final newline; distribute the complete npm bytes.
assert.deepEqual(fs.readFileSync(path.join(root, purifyNotice.source)), originalLicense.subarray(0, -1), 'DOMPurify upstream license differs')
const target = fs.readFileSync(path.join(root, record.target.path))
assert.equal(hash(target), record.target.sha256, 'Core site bytes changed')
assert.deepEqual(target, cache.read('monaco-editor-0.30.1', 'package/min/vs/editor/editor.main.js'), 'Site differs from pinned editor archive')
const core = cache.read('monaco-editor-core-0.30.1', 'package/min/vs/editor/editor.main.js').toString('utf8').replace('"vs/editor/editor.main"', '"vs/editor/edcore.main"')
const mapOffset = core.lastIndexOf('//# sourceMappingURL=')
assert(mapOffset > 0, 'Missing core source map boundary')
assert(target.toString('utf8').startsWith(core.slice(0, mapOffset)), 'Archived core prefix differs')
assert(target.toString('utf8').endsWith(core.slice(mapOffset)), 'Archived core map suffix differs')
console.log(JSON.stringify({ archives: record.archives.length, gitSources: record.remotes.length, modules: results, notices: record.notices.length, archivedCorePrefix: true, completeCoreBuild: false, otherEmbeddedOriginsReviewed: false }))
