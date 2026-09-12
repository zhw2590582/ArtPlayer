import assert from 'node:assert/strict'
import fs from 'node:fs'
// eslint-disable-next-line test/no-import-node-test -- Node frozen contract runner.
import test from 'node:test'
import { transform } from 'esbuild'
import { autoThumbnailEnvironment, autoThumbnailHistorical } from '../../test/helpers/auto-thumbnail.js'
import { verifyAutoThumbnailContract } from './auto-thumbnail-contract.mjs'
import { readMember } from './releases.mjs'

const contract = await verifyAutoThumbnailContract()
const implementations = await autoThumbnailHistorical()
const name = 'artplayer-plugin-auto-thumbnail'

test('Auto-thumbnail freezes all three actual archives, sixteen members and eight workspace inputs', () => {
  const { baseline } = contract
  const releases = [baseline.release, ...baseline.previous]
  assert.deepEqual(releases.map(item => item.version), ['1.1.0', '1.0.1', '1.0.0'])
  assert.equal(releases.reduce((sum, item) => sum + Object.keys(item.files).length, 0), 16)
  assert.equal(Object.keys(baseline.source).length, 8)
  assert.deepEqual(releases.map(item => item.historicalCore.version), ['5.3.1', '5.2.2', '5.2.2'])
  for (const release of releases) {
    assert.equal(release.manifest.peerDependencies, undefined)
    assert.equal(release.manifest.dependencies, undefined)
  }
})

test('Auto-thumbnail 1.0.0 lacks both declared runtimes; its shipped source is explicitly a source-only fixture', async () => {
  const { baseline, archives } = contract
  const release = baseline.previous.find(item => item.version === '1.0.0')
  assert.deepEqual(release.missingEntrypoints, { main: `dist/${name}.js`, legacy: `dist/${name}.legacy.js` })
  assert(!implementations.some(item => item.name === 'published-1.0.0-main' || item.name === 'published-1.0.0-legacy'))
  assert(implementations.some(item => item.name === 'published-1.0.0-source-only'))
  const sources = ['1.0.0', '1.0.1'].map(version => readMember(archives.get(version), 'package/src/index.js').toString())
  const compiled = await Promise.all(sources.map(source => transform(source, { format: 'esm', target: 'es2020', minify: true })))
  assert.equal(compiled[0].code, compiled[1].code, 'The two shipped source implementations differ only in formatting')
})

test('Auto-thumbnail historical declarations require options and falsely describe async registration as synchronous', () => {
  const { baseline, archives, sources } = contract
  const declarations = [baseline.release, ...baseline.previous].map(release => ({ version: release.version, source: readMember(archives.get(release.version), `package/${release.manifest.types.replace(/^\.\//, '')}`).toString() }))
  declarations.push({ version: 'workspace', source: sources.get(`packages/${name}/types/${name}.d.ts`) })
  for (const { version, source } of declarations) {
    assert.match(source, /\(option: Option\) => \(art: Artplayer\) => Result/)
    assert.match(source, /url\?: string/)
    for (const field of ['width', 'scale']) assert.match(source, new RegExp(`${field}\\?: number`))
    if (version === '1.0.0' || version === '1.0.1') {
      assert.match(source, /height\?: number/)
      assert.doesNotMatch(source, /number\?: number/)
      assert.match(source, /export = artplayerPluginAutoThumbnail/)
      assert.match(source, /export as namespace artplayerPluginAutoThumbnail/)
    }
    else {
      assert.match(source, /number\?: number/)
      assert.doesNotMatch(source, /height\?: number/)
      assert.match(source, /export default artplayerPluginAutoThumbnail/)
    }
    assert.match(source, /name: ['"]artplayerPluginAutoThumbnail['"]/)
    assert.doesNotMatch(source, /Promise</)
  }
})

test('Auto-thumbnail actual CommonJS generations and script globals remain distinct', () => {
  for (const implementation of implementations.filter(item => !item.name.includes('source'))) {
    const env = autoThumbnailEnvironment(implementation)
    assert.equal(typeof env.factory, 'function')
    assert.equal(typeof env.exported, implementation.name.startsWith('published-1.0.1-') ? 'object' : 'function')
    if (typeof env.exported === 'object')
      assert.deepEqual(Object.keys(env.exported), ['default'])
    else assert.equal(env.exported.default, undefined)
    const global = autoThumbnailEnvironment(implementation, { script: true })
    assert.equal(typeof global.factory, 'function')
    assert.equal(global.videos.length, 0, 'Import/global setup itself creates no decoder')
  }
})

test('Auto-thumbnail native ESM has only a default function and preserves asynchronous registration', async () => {
  const { baseline, archives, sources } = contract
  const codes = [readMember(archives.get('1.1.0'), `package/${baseline.release.manifest.module.replace(/^\.\//, '')}`).toString(), sources.get(`packages/${name}/dist/${name}.mjs`)]
  for (const code of codes) {
    const exports = await import(`data:text/javascript,${encodeURIComponent(code)}`)
    assert.deepEqual(Object.keys(exports), ['default'])
    let registration
    const result = exports.default({})({ on: (...args) => {
      registration = args
    } })
    assert.equal(registration[0], 'video:loadedmetadata')
    assert.equal(typeof result.then, 'function')
    assert.deepEqual(await result, { name: 'artplayerPluginAutoThumbnail' })
  }
})

test('Auto-thumbnail README selects its own runnable demo; workspace demo and declarations are frozen separately from external thumbnail plugin', () => {
  const { baseline, archives, sources } = contract
  for (const release of [baseline.release, ...baseline.previous]) {
    const readme = readMember(archives.get(release.version), 'package/README.md').toString()
    assert.match(readme, /example=auto\.thumbnail/)
  }
  assert.match(sources.get(`packages/${name}/README.md`), /example=auto\.thumbnail/)
  const example = sources.get('docs/assets/example/auto.thumbnail.js')
  assert.match(example, /artplayerPluginAutoThumbnail\(\{/)
  assert.match(example, /\/assets\/sample\/video\.mp4/)
  assert(fs.existsSync('docs/assets/sample/video.mp4'))
})

for (const implementation of implementations) {
  test(`Auto-thumbnail ${implementation.name}: registration installs one listener synchronously and returns Promise of name only`, async () => {
    const env = autoThumbnailEnvironment(implementation)
    const register = env.factory({})
    assert.equal(typeof register, 'function')
    assert.equal(env.listeners.size, 0)
    const result = register(env.art)
    assert.equal(env.listeners.get('video:loadedmetadata').size, 1)
    assert.equal(typeof result.then, 'function')
    assert.equal(result.name, undefined)
    assert.deepEqual({ ...await result }, { name: 'artplayerPluginAutoThumbnail' })
    assert.equal(env.videos.length, 0)
    assert.deepEqual([...env.listeners.keys()], ['video:loadedmetadata'])
  })

  test(`Auto-thumbnail ${implementation.name}: defaults use truthiness and options remain live until each metadata event`, async () => {
    const env = autoThumbnailEnvironment(implementation)
    const options = { url: '', width: 0, number: 0, scale: 0 }
    await env.factory(options)(env.art)
    env.art.emit('video:loadedmetadata')
    assert.equal(env.videos[0].src, 'original.mp4')
    assert.equal(env.videos[0].crossOrigin, 'anonymous')
    env.metadata()
    assert.equal(env.canvases[0].width, 1600)
    assert.equal(env.canvases[0].height, 900)
    env.finish()
    assert.deepEqual({ ...env.updates[0] }, { url: 'blob:auto-thumbnail-1', height: 90, column: 10, number: 100, width: 160, scale: 1 })
    Object.assign(options, { url: 'override.mp4', width: 80, number: 12, scale: 0.5 })
    env.art.option.url = 'switched.mp4'
    env.art.emit('video:loadedmetadata')
    assert.equal(env.videos[1].src, 'override.mp4')
    env.metadata()
    assert.equal(env.canvases[1].width, 800)
    assert.equal(env.canvases[1].height, 90)
    env.finish(1)
    assert.deepEqual({ ...env.updates[1] }, { url: 'blob:auto-thumbnail-2', height: 45, column: 10, number: 12, width: 80, scale: 0.5 })
  })

  test(`Auto-thumbnail ${implementation.name}: ten-column JPEG grid uses frame starts and progressive encodes including initial blank`, async () => {
    const env = autoThumbnailEnvironment(implementation)
    await env.factory({ width: 80, number: 12, scale: 2, height: 999 })(env.art)
    env.art.emit('video:loadedmetadata')
    env.metadata()
    assert.equal(env.blobs.length, 1)
    assert.equal(env.blobs[0].draws.length, 0, 'Old implementation encodes an empty sheet before drawing')
    for (let i = 0; i < 12; i++) env.seeked()
    assert.deepEqual(env.operations.filter(item => item.name === 'seek').map(item => item.value), Array.from({ length: 12 }, (_, i) => i * 10))
    assert.equal(env.operations.find(item => item.name === 'seek').handlerInstalled, false, 'First seek occurs before onseeked installation')
    assert.equal(env.blobs.length, 13)
    assert.equal(env.blobs.at(-1).draws.length, 12)
    assert.deepEqual(env.canvases[0].draws.map(args => args.slice(1)), Array.from({ length: 12 }, (_, i) => [(i % 10) * 80, Math.floor(i / 10) * 45, 80, 45]))
    for (let i = 0; i < env.blobs.length; i++) {
      assert.equal(env.blobs[i].type, 'image/jpeg')
      env.finish(i)
    }
    assert.equal(env.updates.length, 13)
    assert.deepEqual(env.operations.filter(item => item.name === 'revokeURL').map(item => item.url), [null, ...Array.from({ length: 12 }, (_, i) => `blob:auto-thumbnail-${i + 1}`)])
    assert.deepEqual([...env.urls.keys()], ['blob:auto-thumbnail-13'])
    assert.equal(env.updates.at(-1).number, 12)
    assert.equal(env.updates.at(-1).scale, 2)
  })

  test(`Auto-thumbnail ${implementation.name}: omitted options fail only when metadata fires and no destroyed cleanup is registered`, async () => {
    const env = autoThumbnailEnvironment(implementation)
    const result = await env.factory()(env.art)
    assert.equal(result.name, 'artplayerPluginAutoThumbnail')
    assert.throws(() => env.art.emit('video:loadedmetadata'), /Cannot read properties of undefined/)
    assert.equal(env.videos.length, 0)
    assert.equal(env.listeners.has('destroy'), false)
    assert.equal(env.listeners.has('restart'), false)
  })
}
