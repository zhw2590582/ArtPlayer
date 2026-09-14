import assert from 'node:assert/strict'
import { Buffer } from 'node:buffer'
import { createHash } from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
// eslint-disable-next-line test/no-import-node-test -- Verify real notice bytes and failure-before-write behavior.
import test from 'node:test'
import { generateNotices, writeOrCheckNotices } from '../scripts/site-vendor/notices.ts'

const hash = bytes => createHash('sha256').update(bytes).digest('hex')
function fixture(t) {
  const root = fs.mkdtempSync(path.resolve('refactor/.cache/site-notices-test-'))
  t.after(() => {
    assert.equal(path.dirname(root), path.resolve('refactor/.cache'))
    assert(path.basename(root).startsWith('site-notices-test-'))
    fs.rmSync(root, { recursive: true, force: true })
  })
  fs.mkdirSync(path.join(root, 'assets'))
  fs.writeFileSync(path.join(root, 'assets/code.js'), 'line\r\n')
  fs.writeFileSync(path.join(root, 'LICENSE'), 'Copyright\nPermission\n\n')
  const manifest = { schemaVersion: 1, scope: 'Fixture only', groups: [{ name: 'fixture', version: '1.0.0', tarball: 'https://example.org/fixed.tgz', roots: ['assets'], files: [{ path: 'assets/code.js', sha256: hash('line\n'), mode: 'lf-text' }], notices: [{ source: 'LICENSE', target: 'docs/licenses/fixture/LICENSE', sha256: hash('Copyright\nPermission\n\n') }] }] }
  return { root, manifest }
}

test('Site notices retain the complete upstream bytes including trailing lines; check is read-only', (t) => {
  const { root, manifest } = fixture(t)
  assert.equal(writeOrCheckNotices(root, manifest, false), 2)
  assert.deepEqual(fs.readFileSync(path.join(root, 'docs/licenses/fixture/LICENSE')), fs.readFileSync(path.join(root, 'LICENSE')))
  assert.equal(writeOrCheckNotices(root, manifest, true), 2)
  fs.writeFileSync(path.join(root, 'docs/licenses/fixture/LICENSE'), 'edited')
  assert.throws(() => writeOrCheckNotices(root, manifest, true), /notice drift/)
  assert.equal(fs.readFileSync(path.join(root, 'docs/licenses/fixture/LICENSE'), 'utf8'), 'edited')
})

test('Site notices reject missing/new/modified assets and altered license before writing', (t) => {
  const { root, manifest } = fixture(t)
  fs.writeFileSync(path.join(root, 'assets/new.js'), 'new')
  assert.throws(() => writeOrCheckNotices(root, manifest, false), /inventory drift/)
  assert(!fs.existsSync(path.join(root, 'docs')))
  fs.unlinkSync(path.join(root, 'assets/new.js'))
  fs.writeFileSync(path.join(root, 'assets/code.js'), 'different')
  assert.throws(() => generateNotices(root, manifest), /bytes changed/)
  fs.writeFileSync(path.join(root, 'assets/code.js'), 'line\n')
  fs.writeFileSync(path.join(root, 'LICENSE'), 'shortened')
  assert.throws(() => generateNotices(root, manifest), /notice changed/)
  fs.unlinkSync(path.join(root, 'assets/code.js'))
  assert.throws(() => generateNotices(root, manifest), /inventory drift/)
})

test('Site notice paths cannot escape or silently omit the component license', (t) => {
  const { root, manifest } = fixture(t)
  for (const target of ['../escape', '/absolute', 'docs/licenses/other/LICENSE']) {
    const changed = structuredClone(manifest)
    changed.groups[0].notices[0].target = target
    assert.throws(() => generateNotices(root, changed))
  }
  manifest.groups[0].notices = []
  assert.throws(() => generateNotices(root, manifest), /Missing upstream/)
})

test('Bundled component attribution requires its asset and every upstream notice before writing', (t) => {
  const { root, manifest } = fixture(t)
  const group = manifest.groups[0]
  const component = { name: 'icons', version: '1.0.0', tarball: group.tarball, assets: ['assets/code.js'], notices: [group.notices[0].target] }
  group.components = [component]
  const upstream = Buffer.from('Upstream attribution\r\n\r\n')
  fs.writeFileSync(path.join(root, 'ATTRIBUTION'), upstream)
  const attribution = { source: 'ATTRIBUTION', target: 'docs/licenses/fixture/icons/ATTRIBUTION', sha256: hash(upstream) }
  group.notices.push(attribution)
  component.notices.push(attribution.target)
  group.notices.pop()
  assert.throws(() => writeOrCheckNotices(root, manifest, false), /Missing component notice/)
  assert(!fs.existsSync(path.join(root, 'docs')))
  group.notices.push(attribution)
  component.assets = ['assets/absent.ttf']
  assert.throws(() => generateNotices(root, manifest), /Missing component asset/)
  component.assets = []
  assert.throws(() => generateNotices(root, manifest), /Missing component evidence/)
  component.assets = ['assets/code.js']
  assert.equal(writeOrCheckNotices(root, manifest, false), 3)
  assert(fs.readFileSync(path.join(root, attribution.target)).equals(upstream))
  assert.match(fs.readFileSync(path.join(root, 'docs/THIRD_PARTY_NOTICES.md'), 'utf8'), /Included component: icons 1.0.0/)
  fs.writeFileSync(path.join(root, 'ATTRIBUTION'), upstream.toString().replaceAll('\r\n', '\n'))
  assert.throws(() => generateNotices(root, manifest), /Upstream notice changed/)
})
