import assert from 'node:assert/strict'
import { Buffer } from 'node:buffer'
import fs from 'node:fs'
// eslint-disable-next-line test/no-import-node-test -- Published and vendor provenance checks use the repository runner.
import test from 'node:test'
import { transformSync } from 'esbuild'
import { verifyJassubContract } from './jassub-contract.mjs'
import { archiveFiles, ensureArchive, hash, readMember } from './releases.mjs'

const contract = await verifyJassubContract()
const releases = [contract.baseline.release, ...contract.baseline.previous]
test('JASSUB freezes both actual releases, twelve members and nine Git text inputs', () => {
  assert.deepEqual(releases.map(item => item.version), ['1.1.0', '1.0.0'])
  assert.equal(releases.reduce((count, item) => count + Object.keys(item.files).length, 0), 12)
  assert.equal(contract.sources.size, 9)
  assert.deepEqual(releases.map(item => item.historicalCore.version), ['5.3.1', '5.3.1-beta.1'])
  for (const release of releases) assert.deepEqual(release.missingEntrypoints, {})
})

test('JASSUB historical declarations require resource paths and incorrectly describe synchronous methods', () => {
  for (const release of releases) {
    const source = readMember(contract.archives.get(release.version), 'package/types/artplayer-plugin-jassub.d.ts').toString()
    for (const key of ['workerUrl', 'wasmUrl', 'modernWasmUrl']) assert.match(source, new RegExp(`${key}: string`))
    assert.match(source, /resize: \(force\?: boolean, width\?: number, height\?: number, top\?: number, left\?: number\) => Promise<void>/)
    assert.match(source, /setVideo: \(video: HTMLVideoElement\) => Promise<void>/)
    assert.match(source, /destroy: \(\) => Promise<void>/)
    assert.equal(source.match(/\[key: string\]: any/g).length, 2)
    assert.match(source, /export default artplayerPluginJassub/)
  }
})

test('JASSUB published packages omit worker/WASM/font payloads while the demo uses independently hosted assets', () => {
  for (const release of releases)
    assert(!Object.keys(release.files).some(file => /\.(?:wasm|ttf|otf|woff2?)$|\/worker\//.test(file)))
  const demo = contract.sources.get('docs/assets/example/jassub.js')
  for (const resource of ['jassub-worker.js', 'jassub-worker.wasm', 'jassub-worker-modern.wasm', 'default.woff2']) assert(demo.includes(`/assets/jassub/${resource}`))
  for (const asset of contract.baseline.assets) {
    assert.equal(hash(fs.readFileSync(asset.file)), asset.sha256, asset.file)
    assert.equal(fs.statSync(asset.file).size, asset.bytes, asset.file)
  }
})

test('JASSUB actual historical ESM artifacts expose only a lazy default factory', async () => {
  for (const release of releases) {
    const source = readMember(contract.archives.get(release.version), 'package/dist/artplayer-plugin-jassub.mjs').toString()
    const module = await import(`data:text/javascript;base64,${Buffer.from(source).toString('base64')}`)
    assert.deepEqual(Object.keys(module), ['default'])
    assert.equal(typeof module.default, 'function')
    assert.equal(typeof module.default({ workerUrl: '/worker.js' }), 'function')
  }
})

test('JASSUB 1.8.8 comparison proves wrapper/worker/default font matches without claiming different WASM builds match', async () => {
  const upstream = JSON.parse(fs.readFileSync('refactor/baselines/jassub-vendor.json', 'utf8'))
  const archive = await ensureArchive(upstream)
  assert.deepEqual(archiveFiles(archive), Object.keys(upstream.files).sort())
  for (const [file, expected] of Object.entries(upstream.files)) assert.equal(hash(readMember(archive, file)), expected)
  const normalize = source => transformSync(source, { format: 'esm', target: 'es2020', legalComments: 'none' }).code
  assert.equal(normalize(contract.sources.get('packages/artplayer-plugin-jassub/src/jassub.es.js')), normalize(readMember(archive, 'package/dist/jassub.es.js').toString()))
  for (const file of ['packages/artplayer-plugin-jassub/worker/jassub-worker.js', 'docs/assets/jassub/jassub-worker.js'])
    assert.deepEqual(fs.readFileSync(file), readMember(archive, 'package/dist/jassub-worker.js'))
  assert.deepEqual(fs.readFileSync('docs/assets/jassub/default.woff2'), readMember(archive, 'package/dist/default.woff2'))
  for (const name of ['jassub-worker.wasm', 'jassub-worker-modern.wasm']) {
    const local = fs.readFileSync(`packages/artplayer-plugin-jassub/worker/${name}`)
    const reference = readMember(archive, `package/dist/${name}`)
    assert.deepEqual(local, fs.readFileSync(`docs/assets/jassub/${name}`))
    assert(!local.equals(reference))
    assert(WebAssembly.validate(local))
    assert(WebAssembly.validate(reference))
  }
})

test('JASSUB font source clues cover every actual font without promoting embedded metadata to redistribution proof', () => {
  const metadata = JSON.parse(fs.readFileSync('refactor/baselines/jassub-font-metadata.json', 'utf8'))
  const files = contract.baseline.assets.filter(item => /\.(?:ttf|otf|woff2?)$/i.test(item.file))
  assert.equal(metadata.fonts.length, 12)
  assert.deepEqual(metadata.fonts.map(item => item.file).sort(), files.map(item => item.file).sort())
  for (const font of metadata.fonts) {
    assert.equal(hash(fs.readFileSync(font.file)), font.sha256)
    assert(font.names['1']?.length)
  }
  assert.match(metadata.scope, /not proof/)
  assert.deepEqual(metadata.tools, { fonttools: '4.60.1', brotli: '1.1.0' })
})
