import type { VendorManifest } from '../notices.ts'
import type { Archive, Member, Remote } from './archives.ts'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'

export interface CoreOrigins {
  archives: Archive[]
  remotes: Remote[]
  members: Member[]
  modules: (Member & { id: string, source: string, edits: { before: string, after: string }[], naming: { before: string, after: string } })[]
  components: { name: string, version: string, tarball: string, assets: string[], notices: string[] }[]
  notices: { source: string, target: string, sha256: string, archive?: string, member?: string }[]
  target: { path: string, sha256: string }
}

export function readCoreOrigins(root: string): CoreOrigins {
  return JSON.parse(fs.readFileSync(path.join(root, 'refactor/baselines/monaco-core-origins-provenance.json'), 'utf8'))
}

export function adaptCoreOrigin(source: string, edits: { before: string, after: string }[]): string {
  for (const edit of edits) {
    assert(edit.before && source.split(edit.before).length === 2, 'Missing or repeated core adaptation boundary')
    source = source.replace(edit.before, () => edit.after)
  }
  return source
}

// Normal site builds enforce source/component/notice bindings without network.
export function verifyMonacoCoreNotices(root: string, manifest: VendorManifest): void {
  const record = readCoreOrigins(root)
  assert.deepEqual(record.components.map(item => item.name).sort(), ['dompurify (Monaco core)', 'marked (Monaco core)'])
  assert.equal(record.notices.length, 4, 'Missing Monaco core notice source')
  const group = manifest.groups.find(group => group.name === 'monaco-editor')
  assert(group?.components, 'Missing Monaco core group')
  for (const component of record.components) {
    const archive = record.archives.find(archive => `${archive.name} (Monaco core)` === component.name)
    assert(archive && component.version === archive.version && component.tarball === archive.tarball, 'Wrong Monaco core origin')
    assert.deepEqual(component.assets, [record.target.path], 'Wrong Monaco core asset')
    assert.deepEqual(group.components.filter(item => item.name === component.name), [component], 'Wrong Monaco core notice binding')
  }
  for (const notice of record.notices) {
    assert.deepEqual(group.notices.filter(item => item.target === notice.target), [{ source: notice.source, target: notice.target, sha256: notice.sha256 }], 'Missing or changed Monaco core notice')
  }
}
