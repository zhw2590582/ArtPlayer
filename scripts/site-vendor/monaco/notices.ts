import type { VendorManifest } from '../notices.ts'
import type { ArchiveCache, Member } from './archives.ts'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { hash } from './archives.ts'

interface Notice {
  source: string
  target: string
  sha256: string
  archive?: string
  member?: string
  memberSha256?: string
  slice?: { start: number, end: number }
}
interface Component { name: string, version: string, tarball: string, assets: string[], notices: string[] }
interface NoticeRecord { packages: (Component & { archive: string })[], components: Component[], notices: Notice[] }
interface Sources {
  archives: { name: string, version: string, tarball: string }[]
  modules: (Member & { id: string })[]
  workers: { ids: string[], target: { path: string } }[]
}
function readNotices(root: string): NoticeRecord {
  return JSON.parse(fs.readFileSync(path.join(root, 'refactor/baselines/monaco-language-notices.json'), 'utf8'))
}

// Cheap build-time binding checks; do not download or execute archived code.
export function verifyMonacoLanguageNotices(root: string, manifest: VendorManifest): number {
  const record = readNotices(root)
  const sources: Sources = JSON.parse(fs.readFileSync(path.join(root, 'refactor/baselines/monaco-languages-provenance.json'), 'utf8'))
  assert.equal(record.notices.length, 12, 'Missing Monaco language notice source')
  assert.equal(record.components.length, 9, 'Missing Monaco language component source')
  assert.deepEqual(record.packages.map(item => item.name).sort(), [...new Set(sources.modules.map(item => item.id.split('/')[0]))].sort(), 'Incomplete Monaco service attribution')
  const group = manifest.groups.find(group => group.name === 'monaco-editor')
  assert(group?.components, 'Missing Monaco group')
  for (const pkg of record.packages) {
    const archive = sources.archives.find(item => `${item.name}-${item.version}` === pkg.archive)
    assert(archive && archive.name === pkg.name && archive.version === pkg.version && archive.tarball === pkg.tarball, 'Wrong Monaco service source identity')
    const modules = sources.modules.filter(item => item.archive === pkg.archive).map(item => item.id)
    const assets = sources.workers.filter(worker => worker.ids.some(id => modules.includes(id))).map(worker => worker.target.path)
    assert.deepEqual(pkg.assets, assets, 'Wrong Monaco service asset binding')
  }
  for (const expected of record.components) {
    const matches: Component[] = group.components.filter(item => item.name === expected.name)
    assert.equal(matches.length, 1, `Missing Monaco language component: ${expected.name}`)
    const actual = matches[0]!
    assert.equal(actual.version, expected.version, 'Wrong Monaco language version')
    assert.equal(actual.tarball, expected.tarball, 'Wrong Monaco language source')
    assert.deepEqual([...actual.assets].sort(), [...expected.assets].sort(), 'Wrong Monaco language asset')
    assert.deepEqual([...actual.notices].sort(), [...expected.notices].sort(), `Wrong Monaco language notice binding: ${expected.name}`)
  }
  for (const expected of record.notices) {
    const matches: Notice[] = group.notices.filter(item => item.target === expected.target)
    assert.equal(matches.length, 1, `Missing Monaco language notice: ${expected.target}`)
    assert.equal(matches[0]!.source, expected.source, 'Wrong Monaco language notice source')
    assert.equal(matches[0]!.sha256, expected.sha256, 'Wrong Monaco language notice fingerprint')
  }
  return record.notices.length
}

// The source reproducer additionally proves the complete original files and the
// exact byte slices of embedded formatter headers against verified archives.
export function verifyMonacoLanguageNoticeArchives(root: string, cache: ArchiveCache): number {
  const record = readNotices(root)
  for (const notice of record.notices) {
    const local = fs.readFileSync(path.join(root, notice.source))
    assert.equal(hash(local), notice.sha256, 'Monaco language notice text changed')
    if (notice.archive && notice.member) {
      let upstream = cache.read(notice.archive, notice.member)
      if (notice.slice) {
        assert.equal(hash(upstream), notice.memberSha256, 'Monaco embedded header source changed')
        assert(notice.slice.start >= 0 && notice.slice.end > notice.slice.start && notice.slice.end <= upstream.length, 'Invalid Monaco header boundary')
        upstream = upstream.subarray(notice.slice.start, notice.slice.end)
      }
      assert(local.equals(upstream), 'Monaco language notice differs from archive')
    }
  }
  return record.notices.length
}
