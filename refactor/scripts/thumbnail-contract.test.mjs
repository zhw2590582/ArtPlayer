import assert from 'node:assert/strict'
import { execFileSync } from 'node:child_process'
// eslint-disable-next-line test/no-import-node-test -- Frozen package contract runner.
import test from 'node:test'
import { thumbnailEnvironment, thumbnailHistorical } from '../../test/helpers/thumbnail.js'
import { verifyThumbnailContract } from './thumbnail-contract.mjs'

const plain = value => JSON.parse(JSON.stringify(value))
const root = 'packages/artplayer-tool-thumbnail/'

test('Thumbnail recovered CDN files are not represented as a verified npm archive', () => {
  const { baseline, source, historical } = verifyThumbnailContract()
  assert.equal(baseline.observations.length, 11)
  assert.equal(source.size, 12)
  assert.equal(historical.size, 8)
  assert.equal(baseline.recovered.originalTarballAvailable, false)
  assert.equal(baseline.recovered.completeArchiveAvailable, false)
  const old = baseline.recovered.manifest
  const current = JSON.parse(source.get(`${root}package.json`))
  assert.equal(old.main, 'dist/artplayer-tool-thumbnail.js')
  assert.equal(old.style, 'dist/artplayer-tool-thumbnail.css')
  assert.equal(old.dependencies['tiny-emitter'], '^2.1.0')
  assert.equal(current.main, undefined)
  assert.equal(current.module, 'dist/artplayer-tool-thumbnail.esm.js')
  assert.equal(current.types, 'types/artplayer-tool-thumbnail.d.ts')
  assert.equal(source.has(`${root}${current.module}`), false)
  assert.equal(source.has(`${root}${current.types}`), false)
  const tree = execFileSync('git', ['ls-tree', '-r', '--name-only', baseline.sourceCommit, root], { encoding: 'utf8' }).split('\n')
  assert.equal(tree.includes(`${root}${current.module}`), false)
  assert.equal(tree.includes(`${root}${current.types}`), false)
  assert.match(source.get('docs/assets/example/tool.thumbnail.js'), /new ArtplayerToolThumbnail/)
  assert.match(source.get('docs/assets/example/thumbnail.js'), /artplayerPluginThumbnail/)
})

test('Thumbnail frozen workspace ESM exports only the default constructor', async () => {
  const { source } = verifyThumbnailContract()
  const esm = await import(`data:text/javascript,${encodeURIComponent(source.get(`${root}dist/artplayer-tool-thumbnail.mjs`))}`)
  assert.deepEqual(Object.keys(esm), ['default'])
  assert.equal(typeof esm.default, 'function')
})

for (const implementation of thumbnailHistorical()) {
  const create = (options = {}) => {
    const env = thumbnailEnvironment(implementation)
    const instance = new env.Factory({ fileInput: new env.Element('input'), ...options })
    return { ...env, instance }
  }

  test(`Thumbnail ${implementation.name}: direct CJS and script class retain public spellings and fields`, () => {
    const env = create()
    assert.equal(typeof env.exported, 'function')
    assert.equal(env.exported.default, undefined)
    assert.equal(typeof thumbnailEnvironment(implementation, true).exported, 'function')
    assert.deepEqual(Object.getOwnPropertyNames(env.Factory.prototype), ['constructor', 'ondrop', 'setup', 'inputChange', 'loadVideo', 'start', 'creatScreenshotDate', 'creatCanvas', 'download', 'errorHandle', 'destroy'])
    assert.deepEqual(Object.keys(env.instance), ['processing', 'option', 'video', 'duration', 'inputChange', 'ondrop'])
    assert.equal(typeof env.Factory.creatVideo, 'function')
    assert.equal(typeof env.Factory.ondragover, 'function')
    assert.equal(env.Factory.ondrop, undefined)
    assert.equal(env.instance.video.muted, true)
    assert.equal(env.instance.video.controls, true)
    assert.equal(env.instance.video.parentNode, env.body)
    assert.equal(env.instance.processing, false)
    assert.equal(env.instance.duration, 0)
  })

  test(`Thumbnail ${implementation.name}: fresh defaults, setup clamps, unknown options and wrapper`, () => {
    const env = create({ number: 1, width: 2000, column: 0, custom: 123 })
    assert.notEqual(env.Factory.DEFAULTS, env.Factory.DEFAULTS)
    assert.deepEqual(plain(env.Factory.DEFAULTS), { ...(implementation.legacy ? { delay: 300 } : {}), number: 60, width: 160, height: 90, column: 10, begin: 0, end: null })
    assert(Number.isNaN(env.Factory.DEFAULTS.end))
    assert.equal(env.instance.option.number, 10)
    assert.equal(env.instance.option.width, 1000)
    assert.equal(env.instance.option.column, 1)
    assert.equal(env.instance.option.custom, 123)
    assert.equal(env.instance.setup({ number: 12.5 }), env.instance)
    assert.equal(env.instance.option.number, 12.5)
    assert.throws(() => env.instance.setup({ width: '160' }), /The 'width' is not a number/)
    assert.throws(() => new env.Factory({ fileInput: {} }), /The 'fileInput' is not a Element/)
    const wrapper = new env.Element('div')
    const wrapped = new env.Factory({ fileInput: wrapper })
    assert.equal(wrapper.style.position, 'relative')
    assert.equal(wrapped.option.fileInput, wrapper.children[0])
    assert.equal(wrapped.option.fileInput.style.opacity, '0')
    assert.equal(wrapped.option.fileInput.type, 'file')
  })

  test(`Thumbnail ${implementation.name}: event snapshot, once identity, context and chaining`, () => {
    const { instance } = create()
    const seen = []
    const ctx = { marker: 1 }
    function second(value) {
      seen.push([this, value])
    }
    assert.equal(instance.on('value', () => instance.off('value', second)), instance)
    assert.equal(instance.once('value', second, ctx), instance)
    assert.equal(instance.emit('value', 7), instance)
    instance.emit('value', 8)
    assert.deepEqual(seen, [[ctx, 7]])
    instance.once('removed', second, ctx)
    assert.equal(instance.off('removed', second), instance)
    instance.emit('removed', 9)
    assert.equal(seen.length, 1)
    assert.equal(instance.off('value'), instance)
  })

  test(`Thumbnail ${implementation.name}: file and video event timing identifies old delay semantics`, async () => {
    const env = create()
    const file = { name: 'video.mp4', type: 'video/mp4' }
    const seen = []
    env.instance.on('file', value => seen.push(['file', value, env.instance.video.src]))
    env.instance.on('video', value => seen.push(['video', value, value.src]))
    assert.equal(env.instance.loadVideo(file), undefined)
    assert.equal(env.instance.file, file)
    assert.equal(env.instance.videoUrl, 'blob:thumbnail-1')
    assert.deepEqual(seen[0], ['file', file, undefined])
    assert.equal(seen.length, implementation.legacy ? 1 : 2)
    assert.equal(env.timers.size, implementation.legacy ? 1 : 0)
    if (implementation.legacy) {
      const [id, timer] = [...env.timers][0]
      assert.equal(timer.delay, 300)
      env.timers.delete(id)
      timer.callback()
      await Promise.resolve()
    }
    assert.deepEqual(seen[1], ['video', env.instance.video, 'blob:thumbnail-1'])
    assert.equal(env.instance.loadVideo(undefined), undefined)
    assert.equal(seen.length, 2)
  })

  test(`Thumbnail ${implementation.name}: input reset and existing ineffective drop binding stay distinguished`, () => {
    const env = create()
    const input = env.instance.option.fileInput
    input.value = 'selected.mp4'
    input.files = [{ name: 'selected.mp4', type: 'video/mp4' }]
    assert.equal(input.handlers.get('change').has(env.instance.inputChange), true)
    assert.equal(input.handlers.has('drop'), false)
    env.instance.inputChange({ target: input })
    assert.equal(input.value, implementation.legacy ? 'selected.mp4' : '')
    let prevented = 0
    const preventDefault = () => {
      prevented++
    }
    env.instance.ondrop({ preventDefault, dataTransfer: { files: [] } })
    env.Factory.ondragover({ preventDefault })
    assert.equal(prevented, 2)
  })

  test(`Thumbnail ${implementation.name}: midpoint grid and footer geometry`, () => {
    const env = create({ number: 10, width: 20, height: 30, column: 3, begin: 5 })
    env.instance.duration = 100
    assert.deepEqual(plain(env.instance.creatScreenshotDate()), Array.from({ length: 10 }, (_, i) => ({ time: 10 + i * 10, x: i % 3 * 20, y: Math.floor(i / 3) * 30 })))
    const canvas = env.instance.creatCanvas()
    assert.equal(canvas.width, 60)
    assert.equal(canvas.height, 150)
    assert.deepEqual(env.operations.filter(item => item.name === 'fillRect' || item.name === 'fillText'), [
      { name: 'fillRect', args: [0, 0, 60, 150] },
      { name: 'fillText', args: ['From: https://artplayer.org/, Number: 10, Width: 20, Height: 30, Column: 3', 10, 139] },
    ])
    assert.equal(env.context2D.font, '14px Georgia')
  })

  test(`Thumbnail ${implementation.name}: configured height versus source aspect ratio predates this refactor`, () => {
    const { instance } = create({ height: 25, width: 160 })
    instance.video.duration = 1
    instance.file = { name: 'short.mp4' }
    assert.throws(() => instance.start(), /preview density cannot be greater than 1/)
    assert.equal(instance.option.height, implementation.legacy ? 25 : 90)
    assert.equal(instance.processing, false)
  })

  test(`Thumbnail ${implementation.name}: synchronous errors, download names and destroy cleanup contract`, () => {
    const env = create()
    const errors = []
    env.instance.on('error', message => errors.push(message))
    assert.throws(() => env.instance.download(), /Download does not seem to be ready/)
    assert.equal(errors.length, 1)
    assert.equal(env.instance.errorHandle(true, 'unused'), undefined)
    env.instance.video.canPlayType = () => ''
    assert.throws(() => env.instance.loadVideo({ type: 'bad/type' }), /Playback of this file format is not supported: bad\/type/)
    assert.equal(errors.length, 2)
    env.instance.videoUrl = 'blob:video'
    env.instance.thumbnailUrl = 'blob:sheet'
    const downloads = []
    env.instance.on('download', name => downloads.push(name))
    for (const name of ['movie.part.mp4', 'noextension']) {
      env.instance.file = { name }
      assert.equal(env.instance.download(), env.instance)
    }
    assert.deepEqual(downloads, ['movie.part.png', '.png'])
    assert.deepEqual(env.operations.filter(item => item.name === 'click').map(item => item.download), downloads)
    let destroyed = 0
    env.instance.on('destroy', () => destroyed++)
    assert.equal(env.instance.destroy(), undefined)
    assert.equal(destroyed, 1)
    assert.equal(env.body.children.length, 0)
    assert.equal(env.instance.option.fileInput.handlers.get('change').size, 0)
    assert.deepEqual(env.operations.filter(item => item.name === 'revokeURL').map(item => item.url), ['blob:video', 'blob:sheet'])
    assert.throws(() => env.instance.destroy(), /NotFoundError/)
  })
}
