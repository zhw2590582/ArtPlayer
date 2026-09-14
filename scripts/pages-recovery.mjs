import assert from 'node:assert/strict'
import { execFileSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import { readJson, workspace, writeJson } from './package-consumer.mjs'
import { digest, inside } from './pages/artifact.ts'
import { replaceRehearsalSite, verifyRestoredTree } from './pages/recovery.ts'

assert.equal(process.versions.node, fs.readFileSync(path.join(workspace, '.node-version'), 'utf8').trim(), 'Use pinned Node')
const baseline = readJson(path.join(workspace, 'refactor/baselines/pages-artifact-validation.json'))
const archived = baseline.remote.rollbackArchive
assert(/^[a-f0-9]{40}$/.test(archived.commit))
const previousArchive = inside(workspace, archived.path)
assert.deepEqual(digest(previousArchive), { bytes: archived.bytes, sha256: archived.sha256 }, 'Frozen Pages archive changed')
const git = args => execFileSync('git', args, { cwd: workspace, encoding: 'utf8', windowsHide: true })
assert.equal(git(['rev-parse', '--show-object-format']).trim(), 'sha1', 'Recovery verifier expects Git SHA-1 object IDs')
const tree = git(['ls-tree', '-r', '-l', '-z', archived.commit]).split('\0').filter(Boolean)
const expected = {}
for (const entry of tree) {
  const match = /^(100644|100755) blob ([a-f0-9]{40}) +(\d+)\t(.+)$/s.exec(entry)
  assert(match, 'Site snapshot contains unsupported Git entries')
  const [, , objectId, bytes, relative] = match
  inside(workspace, relative)
  assert(!Object.hasOwn(expected, relative), 'Duplicate Git path')
  expected[relative] = { objectId, bytes: Number(bytes) }
}
const parent = path.join(workspace, 'refactor/.cache/pages-recovery')
fs.mkdirSync(parent, { recursive: true })
const output = fs.mkdtempSync(path.join(parent, 'run-'))
const report = { task: 'REL-04', capturedAt: new Date().toISOString(), source: git(['rev-parse', 'HEAD']).trim(), node: process.versions.node, passed: false, archived, gitFiles: expected, scope: 'Local restoration of the complete frozen gh-pages snapshot; no deployment or remote setting changes' }
try {
  const archive = path.join(output, 'canonical.zip')
  const archiveArgs = ['-c', 'core.autocrlf=false', '-c', 'core.eol=lf', 'archive', '--format=zip', `--output=${archive}`, archived.commit]
  git(archiveArgs)
  report.canonicalArchive = { command: ['git', ...archiveArgs], ...digest(archive) }
  const members = execFileSync('tar', ['-tf', archive], { encoding: 'utf8', windowsHide: true }).trim().split(/\r?\n/)
  assert.equal(new Set(members).size, members.length)
  for (const member of members) inside(workspace, member.replace(/\/$/, ''))
  assert.deepEqual(members.filter(member => !member.endsWith('/')).sort(), Object.keys(expected).sort(), 'Archive inventory differs from frozen Git tree')
  const original = path.join(output, 'original')
  const site = path.join(output, 'site')
  const prepared = path.join(output, 'prepared')
  fs.mkdirSync(original)
  execFileSync('tar', ['-xf', archive, '-C', original], { windowsHide: true })
  const before = verifyRestoredTree(original, expected)
  assert.equal(fs.readFileSync(path.join(original, 'CNAME'), 'utf8').trim(), 'github.artplayer.org')
  fs.cpSync(original, site, { recursive: true })
  fs.writeFileSync(path.join(site, 'compiled/artplayer.js'), 'broken candidate fixture\n')
  fs.writeFileSync(path.join(site, 'CNAME'), 'recovery-fixture.invalid\n')
  fs.unlinkSync(path.join(site, 'iframe.html'))
  fs.writeFileSync(path.join(site, 'candidate-only.txt'), 'must disappear after restoration\n')
  assert.throws(() => verifyRestoredTree(site, expected), /missing or additional files/)
  fs.cpSync(original, prepared, { recursive: true })
  const restored = replaceRehearsalSite(output, expected)
  assert.deepEqual(restored, before)
  assert.equal(fs.readFileSync(path.join(site, 'CNAME'), 'utf8').trim(), 'github.artplayer.org')
  assert.equal(fs.readFileSync(path.join(output, 'failed-site/compiled/artplayer.js'), 'utf8'), 'broken candidate fixture\n')
  assert(!fs.existsSync(path.join(site, 'candidate-only.txt')))
  report.files = restored
  report.simulatedChanges = ['modified compiled/artplayer.js', 'changed CNAME', 'deleted iframe.html', 'added candidate-only.txt']
  report.failedSnapshotRetained = true
  report.passed = true
}
catch (error) {
  report.error = { name: error.name, message: error.message }
  throw error
}
finally {
  writeJson(path.join(output, 'report.json'), report)
  writeJson(path.join(parent, 'latest.json'), { output: path.relative(workspace, output).replaceAll('\\', '/'), passed: report.passed })
  console.log(`Pages recovery: ${path.relative(workspace, output)}; passed=${report.passed}`)
}
