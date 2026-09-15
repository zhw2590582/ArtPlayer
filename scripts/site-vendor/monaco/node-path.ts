import type { VendorManifest } from '../notices.ts'
import type { Archive, Member, Remote } from './archives.ts'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import vm from 'node:vm'

export interface PathProvenance {
  archives: Archive[]
  remotes: Remote[]
  nodeSource: string
  vscodeSource: string
  lockSource: string
  maps: (Member & { source: string })[]
  outputs: { development: Member, signature: string, offset: number, target: { path: string, sha256: string }, editor: Member }[]
  component: { name: string, version: string, tarball: string, assets: string[], notices: string[] }
  attribution: { source: string, target: string, sha256: string }
  legacyNotice: { source: string, target: string, sha256: string }
  fixtures: { path: string, sha256: string }
}

export interface PathCase { namespace: 'win32' | 'posix', method: string, args: unknown[], expected: unknown }

// Evaluate the frozen Node module for valid deterministic path calls only. This
// harness does not emulate Node's error messages, host cwd or drive environment.
export function nodePathResults(source: string, cases: Omit<PathCase, 'expected'>[]): unknown[] {
  const constants = { CHAR_UPPERCASE_A: 65, CHAR_LOWERCASE_A: 97, CHAR_UPPERCASE_Z: 90, CHAR_LOWERCASE_Z: 122, CHAR_DOT: 46, CHAR_FORWARD_SLASH: 47, CHAR_BACKWARD_SLASH: 92, CHAR_COLON: 58, CHAR_QUESTION_MARK: 63 }
  const module = { exports: {} as Record<string, Record<string, (...args: unknown[]) => unknown>> }
  vm.runInNewContext(source, {
    module,
    process: { platform: 'linux', env: {}, cwd: () => { throw new Error('Non-deterministic path cwd') } },
    require: (name: string) => {
      if (name === 'internal/constants')
        return constants
      if (name === 'internal/validators')
        return { validateString: (value: unknown) => assert.equal(typeof value, 'string', 'Valid path fixture required') }
      assert.equal(name, 'internal/errors', 'Unexpected Node path import')
      return { codes: { ERR_INVALID_ARG_TYPE: Error } }
    },
  }, { timeout: 1000 })
  return cases.map((entry) => {
    assert(['posix', 'win32'].includes(entry.namespace))
    assert(['normalize', 'basename', 'dirname', 'extname', 'join', 'relative', 'resolve', 'parse', 'format', 'isAbsolute', 'toNamespacedPath'].includes(entry.method), 'Unexpected path fixture method')
    return JSON.parse(JSON.stringify(module.exports[entry.namespace]![entry.method]!(...entry.args)))
  })
}

export function readPathProvenance(root: string): PathProvenance {
  return JSON.parse(fs.readFileSync(path.join(root, 'refactor/baselines/monaco-node-path-provenance.json'), 'utf8'))
}

export function preparePathSource(source: string): string {
  for (const name of ['isAbsolute', 'join', 'format', 'parse', 'toNamespacedPath', 'delimiter']) {
    const line = `export const ${name} = (process.platform === 'win32' ? win32.${name} : posix.${name});\n`
    assert.equal(source.split(line).length, 2, `Missing or repeated unused path export: ${name}`)
    source = source.replace(line, '')
  }
  return source
}

export function nodePathLicense(source: string): string {
  const boundary = source.indexOf('\n\'use strict\';')
  assert(boundary > 0, 'Missing Node source license boundary')
  const lines = source.slice(0, boundary).trimEnd().split('\n')
  assert(lines.every(line => line.startsWith('//')), 'Unexpected Node license comment')
  const license = lines.map(line => line.replace(/^\/\/ ?/, '')).join('\n')
  assert(license.startsWith('Copyright Joyent, Inc. and other Node contributors.'))
  assert(license.endsWith('USE OR OTHER DEALINGS IN THE SOFTWARE.'))
  return license
}

export function verifyMonacoPathNotices(root: string, manifest: VendorManifest): void {
  const record = readPathProvenance(root)
  const group = manifest.groups.find(group => group.name === 'monaco-editor')
  assert(group, 'Missing Monaco path group')
  assert.equal(record.component.name, 'nodejs path (Monaco core)')
  assert.equal(record.component.version, '14.16.0')
  assert.deepEqual(record.component.assets, ['docs/assets/js/vs/editor/editor.main.js', 'docs/assets/js/vs/base/worker/workerMain.js'], 'Wrong Node path assets')
  assert.deepEqual(record.component.notices, [record.legacyNotice.target, record.attribution.target], 'Missing Node path terms or source explanation')
  assert.deepEqual(group.components?.filter(component => component.name === record.component.name), [record.component], 'Wrong Node path notice binding')
  for (const notice of [record.legacyNotice, record.attribution])
    assert.deepEqual(group.notices.filter(item => item.target === notice.target), [notice], 'Missing Node path notice')
  const license = nodePathLicense(fs.readFileSync(path.join(root, record.nodeSource), 'utf8'))
  const legacy = fs.readFileSync(path.join(root, record.legacyNotice.source), 'utf8').replace(/\r\n/g, '\n')
  assert(legacy.includes(license), 'Legacy notice omits actual Node path terms')
  const port = fs.readFileSync(path.join(root, record.vscodeSource), 'utf8')
  const start = port.indexOf('/**\n * Copyright Joyent, Inc. and other Node contributors.')
  assert(start >= 0, 'Missing ported Node copyright')
  const end = port.indexOf('\n */', start)
  assert(end > start, 'Missing ported Node license end')
  assert.equal(port.slice(start + 4, end).split('\n').map(line => line.replace(/^ \* ?/, '')).join('\n'), license, 'Ported Node license differs')
  assert(port.includes('https://github.com/nodejs/node/blob/v14.16.0/lib/path.js'), 'Wrong ported Node version')
}
