import assert from 'node:assert/strict'
import { createHash } from 'node:crypto'
import fs from 'node:fs'
// eslint-disable-next-line test/no-import-node-test -- Pinned provenance and distributable notice checks.
import test from 'node:test'

const read = file => fs.readFileSync(new URL(`../${file}`, import.meta.url), 'utf8')
const base = 'refactor/baselines/thumbnail-vendor/'
const license = read(`${base}tiny-emitter-license.txt`).replaceAll('\r\n', '\n').trim()

test('Thumbnail emitter reference files retain pinned bytes, version and full upstream attribution', () => {
  const manifest = JSON.parse(read(`${base}sources.json`))
  for (const source of manifest.sources)
    assert.equal(createHash('sha256').update(fs.readFileSync(new URL(`../${source.file}`, import.meta.url))).digest('hex'), source.sha256)
  const pkg = JSON.parse(read(`${base}tiny-emitter-package.json`))
  assert.equal(pkg.name, 'tiny-emitter')
  assert.equal(pkg.version, '2.1.0')
  assert.equal(pkg.license, 'MIT')
  assert.match(license, /Copyright \(c\) 2017 Scott Corgan/)
  assert(read('packages/artplayer-tool-thumbnail/THIRD_PARTY_NOTICES').replaceAll('\r\n', '\n').includes(license))
})

test('Thumbnail standalone distributions retain the complete notice and equal their docs copies', () => {
  for (const suffix of ['.js', '.legacy.js', '.mjs']) {
    const filename = `artplayer-tool-thumbnail${suffix}`
    const bundle = read(`packages/artplayer-tool-thumbnail/dist/${filename}`)
    const banner = bundle.match(/^\/\*![\s\S]*?\*\//)?.[0].replace(/^ \* ?/gm, '').replaceAll('\r\n', '\n')
    assert(banner?.includes(license), `${filename} must carry the complete upstream notice`)
    assert.equal(read(`docs/compiled/${filename}`), bundle)
  }
})
