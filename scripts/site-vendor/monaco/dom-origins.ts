import type { VendorManifest } from '../notices.ts'
import type { Archive, Member, Remote } from './archives.ts'
import assert from 'node:assert/strict'
import { Buffer } from 'node:buffer'
import fs from 'node:fs'
import path from 'node:path'
import ts from 'typescript'
import { hash } from './archives.ts'

export const domOriginNames = ['SizeUtils', 'getTopLeftOffset', 'getTotalWidth', 'getContentWidth', 'getContentHeight', 'getTotalHeight']

export interface DomOrigins {
  archives: Archive[]
  remotes: Remote[]
  vscodeSource: string
  winjsSource: string
  map: Member & { source: string }
  fragments: { name: string, sha256: string }[]
  shipped: Member & { target: string }
  component: { name: string, version: string, tarball: string, assets: string[], notices: string[] }
  notices: { source: string, target: string, sha256: string }[]
  originalWinjsVersion: null
}

// Match declaration boundaries, never a same-named string or a substring of a function.
export function domOriginFragments(source: string): Map<string, string> {
  const file = ts.createSourceFile('dom.ts', source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS)
  const fragments = new Map<string, string>()
  for (const node of file.statements) {
    if ((!ts.isClassDeclaration(node) && !ts.isFunctionDeclaration(node)) || !node.name || !domOriginNames.includes(node.name.text))
      continue
    assert(!fragments.has(node.name.text), 'Repeated DOM origin declaration')
    fragments.set(node.name.text, node.getText(file))
  }
  assert.deepEqual([...fragments.keys()], domOriginNames, 'Missing or reordered DOM origin declarations')
  return fragments
}

export function readDomOrigins(root: string): DomOrigins {
  return JSON.parse(fs.readFileSync(path.join(root, 'refactor/baselines/monaco-dom-origins-provenance.json'), 'utf8'))
}

export function verifyMonacoDomNotices(root: string, manifest: VendorManifest): void {
  const record = readDomOrigins(root)
  assert.equal(record.originalWinjsVersion, null, 'Do not invent the original WinJS adaptation version')
  assert.equal(record.component.name, 'WinJS-derived DOM helpers (Monaco core)')
  assert.equal(record.component.version, 'unversioned adaptation; reference WinJS 4.4.5')
  assert.equal(record.component.tarball, 'https://github.com/winjs/winjs/tree/4329b1133b243d9ded3b5a1f98d096ee8e80e889', 'Wrong fixed WinJS reference')
  assert.deepEqual(record.component.assets, ['docs/assets/js/vs/editor/editor.main.js'], 'Wrong DOM origin assets')
  assert.deepEqual(record.notices.map(notice => notice.target), ['docs/licenses/monaco-editor/core-dom/LICENSE.txt', 'docs/licenses/monaco-editor/core-dom/ATTRIBUTION.md'], 'Missing complete DOM notice set')
  assert.deepEqual(record.component.notices, record.notices.map(notice => notice.target), 'Missing DOM attribution or terms')
  const group = manifest.groups.find(group => group.name === 'monaco-editor')
  assert(group, 'Missing Monaco DOM group')
  assert.deepEqual(group.components?.filter(item => item.name === record.component.name), [record.component], 'Wrong Monaco DOM notice binding')
  for (const notice of record.notices) {
    assert.deepEqual(group.notices.filter(item => item.target === notice.target), [notice], 'Missing Monaco DOM notice')
    assert.equal(hash(fs.readFileSync(path.join(root, notice.source))), notice.sha256, 'Changed Monaco DOM terms')
  }
  const source = fs.readFileSync(path.join(root, record.vscodeSource), 'utf8')
  assert.equal((source.match(/Adapted from WinJS/g) || []).length, 5, 'Changed explicit DOM attribution')
  const fragments = domOriginFragments(source)
  assert.deepEqual(record.fragments, [...fragments].map(([name, content]) => ({ name, sha256: hash(Buffer.from(content)) })), 'Changed DOM origin source fragments')
}
