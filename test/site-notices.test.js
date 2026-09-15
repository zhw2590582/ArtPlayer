import assert from 'node:assert/strict'
import { Buffer } from 'node:buffer'
import { spawnSync } from 'node:child_process'
import { createHash } from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
// eslint-disable-next-line test/no-import-node-test -- Verify real notice bytes and failure-before-write behavior.
import test from 'node:test'
import { verifyConsoleNoticeSources } from '../scripts/site-vendor/console/notices.ts'
import { verifyMonacoLanguageNoticeArchives, verifyMonacoLanguageNotices } from '../scripts/site-vendor/monaco/notices.ts'
import { generateNotices, writeOrCheckNotices } from '../scripts/site-vendor/notices.ts'

const hash = bytes => createHash('sha256').update(bytes).digest('hex')
test('Monaco language notices bind full original terms to their actual worker sources', () => {
  const original = JSON.parse(fs.readFileSync('scripts/site-vendor/manifest.json', 'utf8'))
  assert.equal(verifyMonacoLanguageNotices(process.cwd(), original), 12)
  const manifest = structuredClone(original)
  const group = manifest.groups.find(group => group.name === 'monaco-editor')
  const json = group.components.find(item => item.name === 'vscode-json-languageservice')
  const css = group.components.find(item => item.name === 'vscode-css-languageservice')
  json.notices = [...css.notices]
  // All files still exist: a count/hash-only generator accepts this wrong license.
  assert.doesNotThrow(() => generateNotices(process.cwd(), manifest))
  assert.throws(() => verifyMonacoLanguageNotices(process.cwd(), manifest), /Wrong Monaco language notice binding/)
  json.notices = original.groups.find(group => group.name === 'monaco-editor').components.find(item => item.name === json.name).notices
  json.assets = [...css.assets]
  assert.throws(() => verifyMonacoLanguageNotices(process.cwd(), manifest), /Wrong Monaco language asset/)
  assert.throws(() => verifyMonacoLanguageNoticeArchives(process.cwd(), { read: () => Buffer.from('unrelated archive notice') }), /differs from archive/)
})

test('Monaco language delivery cannot omit a third-party notice or embedded author header', () => {
  const original = JSON.parse(fs.readFileSync('scripts/site-vendor/manifest.json', 'utf8'))
  const record = JSON.parse(fs.readFileSync('refactor/baselines/monaco-language-notices.json', 'utf8'))
  for (const notice of record.notices) {
    const manifest = structuredClone(original)
    const group = manifest.groups.find(group => group.name === 'monaco-editor')
    group.notices = group.notices.filter(item => item.target !== notice.target)
    assert.throws(() => verifyMonacoLanguageNotices(process.cwd(), manifest), /Missing Monaco language notice/)
  }
})

test('Console notices retain the verified owner and license association', () => {
  const manifest = JSON.parse(fs.readFileSync('scripts/site-vendor/manifest.json', 'utf8'))
  assert.deepEqual(verifyConsoleNoticeSources(process.cwd(), manifest), { components: 44, upstreamNotices: 46 })
  const group = manifest.groups.find(group => group.name === 'console')
  const bsd = group.components.find(component => component.name === 'hoist-non-react-statics')
  const react = group.components.find(component => component.name === 'react')
  bsd.notices = [...react.notices]
  // Every component/file remains present, but the BSD component falsely points to MIT.
  assert.doesNotThrow(() => generateNotices(process.cwd(), manifest))
  assert.throws(() => verifyConsoleNoticeSources(process.cwd(), manifest), /wrong notice: hoist-non-react-statics/)
  bsd.notices = group.notices.filter(notice => notice.source.includes('hoist-non-react-statics')).map(notice => notice.target)
  bsd.tarball = react.tarball
  assert.throws(() => verifyConsoleNoticeSources(process.cwd(), manifest), /one component for verified/)
})

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

test('Site notice CLI rejects omitted reviewed components and supplemental vConsole notices', (t) => {
  const { root } = fixture(t)
  const manifestPath = path.join(root, 'scripts/site-vendor/manifest.json')
  fs.mkdirSync(path.dirname(manifestPath), { recursive: true })
  const original = JSON.parse(fs.readFileSync('scripts/site-vendor/manifest.json', 'utf8'))
  for (const name of ['LICENSE', 'MIT-LICENSE', 'ATTRIBUTION.md', 'webpack']) {
    const manifest = structuredClone(original)
    const group = manifest.groups.find(group => group.name === 'vconsole')
    if (name === 'webpack')
      group.components = group.components.filter(component => component.name !== name)
    else
      group.notices = group.notices.filter(notice => notice.target !== `docs/licenses/vconsole/${name}`)
    fs.writeFileSync(manifestPath, JSON.stringify(manifest))
    const result = spawnSync(process.execPath, [path.resolve('scripts/build-site-notices.mjs')], { cwd: root, encoding: 'utf8' })
    assert.equal(result.status, 1)
    assert.match(result.stderr, name === 'webpack' ? /Do not silently drop verified bundled component/ : /Missing vConsole notice/)
    assert(!fs.existsSync(path.join(root, 'docs')))
  }
})

test('Console notice CLI rejects omitted package or embedded attribution before writing', (t) => {
  const { root } = fixture(t)
  const manifestPath = path.join(root, 'scripts/site-vendor/manifest.json')
  fs.mkdirSync(path.dirname(manifestPath), { recursive: true })
  const original = JSON.parse(fs.readFileSync('scripts/site-vendor/manifest.json', 'utf8'))
  for (const name of ['console-feed', 'parcel-bundler', 'styled-components', 'chromium-string-utils', 'stylis-rule-sheet', '@babel/runtime (react-inspector embedded)', 'regenerator-runtime', 'simple-html-tokenizer', 'replicator (console-feed fork)', 'stylis (Emotion fork)', 'murmurhash-js (Gary Court)', 'murmurhash2 (Austin Appleby)', 'stackoverflow-custom-stringify', 'react-pure-render (shallowequal origin)']) {
    for (const field of ['components', 'notices']) {
      const manifest = structuredClone(original)
      const group = manifest.groups.find(group => group.name === 'console')
      const component = group.components.find(component => component.name === name)
      if (field === 'components')
        group.components = group.components.filter(item => item !== component)
      else
        group.notices = group.notices.filter(notice => !component.notices.includes(notice.target))
      fs.writeFileSync(manifestPath, JSON.stringify(manifest))
      const result = spawnSync(process.execPath, [path.resolve('scripts/build-site-notices.mjs')], { cwd: root, encoding: 'utf8' })
      assert.equal(result.status, 1)
      assert.match(result.stderr, field === 'components' ? /Do not silently drop verified console/ : /Missing reviewed console notice/)
      assert(!fs.existsSync(path.join(root, 'docs')))
    }
  }
})

test('Monaco TypeScript supplement requires all three upstream notices and its version explanation', (t) => {
  const { root } = fixture(t)
  const manifestPath = path.join(root, 'scripts/site-vendor/manifest.json')
  fs.mkdirSync(path.dirname(manifestPath), { recursive: true })
  const original = JSON.parse(fs.readFileSync('scripts/site-vendor/manifest.json', 'utf8'))
  for (const name of ['LICENSE.txt', 'CopyrightNotice.txt', 'ThirdPartyNoticeText.txt', 'ATTRIBUTION.md']) {
    const manifest = structuredClone(original)
    const component = manifest.groups.find(group => group.name === 'monaco-editor').components.find(component => component.name === 'typescript (Monaco worker)')
    component.notices = component.notices.filter(target => !target.endsWith(`/${name}`))
    fs.writeFileSync(manifestPath, JSON.stringify(manifest))
    const result = spawnSync(process.execPath, [path.resolve('scripts/build-site-notices.mjs')], { cwd: root, encoding: 'utf8' })
    assert.equal(result.status, 1)
    assert.match(result.stderr, /Missing TypeScript component notice/)
    assert(!fs.existsSync(path.join(root, 'docs')))
  }
})
