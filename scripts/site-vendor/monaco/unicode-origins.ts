import type { VendorManifest } from '../notices.ts'
import type { Archive, Member, Remote } from './archives.ts'
import type { UnicodeTables } from './unicode.ts'
import assert from 'node:assert/strict'
import { Buffer } from 'node:buffer'
import fs from 'node:fs'
import path from 'node:path'
import { hash } from './archives.ts'
import { readUnicodeTables } from './unicode.ts'

export interface UnicodeOrigins {
  archives: Archive[]
  generatorArchives: (Archive & { lockedIntegrity: string })[]
  remotes: Remote[]
  vscodeSource: string
  packageSource: string
  lockSource: string
  generators: { kind: 'rtl' | 'emoji' | 'grapheme', source: string, inputs: Record<string, string>, outputs: string[] }[]
  maps: (Member & { source: string })[]
  shipped: (Member & { target: string })[]
  generated: Record<keyof UnicodeTables, { sha256: string, length: number }>
  component: { name: string, version: string, tarball: string, assets: string[], notices: string[] }
  notices: { source: string, target: string, sha256: string }[]
}

export function readUnicodeOrigins(root: string): UnicodeOrigins {
  return JSON.parse(fs.readFileSync(path.join(root, 'refactor/baselines/monaco-unicode-provenance.json'), 'utf8'))
}

export function verifyMonacoUnicodeNotices(root: string, manifest: VendorManifest): void {
  const record = readUnicodeOrigins(root)
  assert.equal(record.component.name, 'Unicode data (Monaco core)')
  assert.equal(record.component.version, 'mixed historical inputs: 10.0.0d5, 13.0 drafts, Emoji 13.1')
  assert.deepEqual(record.component.assets, ['docs/assets/js/vs/editor/editor.main.js', 'docs/assets/js/vs/base/worker/workerMain.js'], 'Wrong Unicode origin assets')
  assert.deepEqual(record.notices.map(notice => notice.target), ['docs/licenses/monaco-editor/core-unicode/LICENSE.txt', 'docs/licenses/monaco-editor/core-unicode/ATTRIBUTION.md'], 'Missing complete Unicode notice set')
  assert.deepEqual(record.component.notices, record.notices.map(notice => notice.target), 'Missing Unicode attribution or terms')
  const group = manifest.groups.find(group => group.name === 'monaco-editor')
  assert(group, 'Missing Monaco Unicode group')
  assert.deepEqual(group.components?.filter(item => item.name === record.component.name), [record.component], 'Wrong Monaco Unicode notice binding')
  for (const notice of record.notices) {
    assert.deepEqual(group.notices.filter(item => item.target === notice.target), [notice], 'Missing Monaco Unicode notice')
    assert.equal(hash(fs.readFileSync(path.join(root, notice.source))), notice.sha256, 'Changed Monaco Unicode terms')
  }
  const tables = readUnicodeTables(fs.readFileSync(path.join(root, record.vscodeSource), 'utf8'))
  assert.deepEqual(record.generated, Object.fromEntries(Object.entries(tables).map(([name, value]) => [name, { sha256: hash(Buffer.from(typeof value === 'string' ? value : JSON.stringify(value))), length: value.length }])), 'Changed Unicode data fragments')
}
