import assert from 'node:assert/strict'
import fs from 'node:fs'
// eslint-disable-next-line test/no-import-node-test -- Node baseline runner.
import test from 'node:test'
import vm from 'node:vm'
import { canvasEnvironment, canvasHistorical } from '../../test/helpers/canvas.js'
import { verifyCanvasContract } from './canvas-contract.mjs'
import { ensureArchive, hash, readMember } from './releases.mjs'

const contract = await verifyCanvasContract()

test('Canvas Git-associated core 5.1.7 has proxy support that the actual npm 5.1.7 declaration lacks', async () => {
  const release = JSON.parse(fs.readFileSync('refactor/baselines/vast-core.json')).release
  assert.equal(release.version, '5.1.7')
  const file = 'package/types/option.d.ts'
  const declaration = readMember(await ensureArchive(release), file)
  assert.equal(hash(declaration), release.files[file])
  assert.doesNotMatch(declaration.toString(), /proxy\??\s*:/)
  assert.match(contract.coreSources.get('1.0.0:packages/artplayer/src/index.js'), /proxy:\s*undefined/)
  assert.match(contract.coreSources.get('1.0.0:packages/artplayer/src/template.js'), /option\.proxy\.call\(this\.art, this\.art\)/)
})

test('Canvas actual archives and frozen workspace retain exact files, versions and Git associations', () => {
  assert.equal(contract.baseline.release.version, '1.1.0')
  assert.equal(contract.baseline.previous[0].version, '1.0.0')
  assert.equal(contract.baseline.release.historicalCore.version, '5.3.1')
  assert.equal(contract.baseline.previous[0].historicalCore.version, '5.1.7')
  assert.equal([...contract.archives].length, 2)
  assert.equal([...contract.sources].length, 6)
})

test('Canvas published CJS namespaces, callable exports, script globals and actual ESM stay distinct', async () => {
  for (const release of [contract.baseline.release, ...contract.baseline.previous]) {
    for (const field of ['main', 'legacy']) {
      const source = readMember(contract.archives.get(release.version), `package/${release.manifest[field].replace(/^\.\//, '')}`).toString()
      const module = { exports: {} }
      vm.runInNewContext(source, { module, exports: module.exports, window: {} })
      assert.equal(typeof module.exports, release.version === '1.0.0' ? 'object' : 'function')
      assert.equal(typeof (module.exports.default || module.exports)(), 'function')
      const global = { window: {} }
      vm.runInNewContext(source, global)
      assert.equal(typeof (global.artplayerProxyCanvas || global.window.artplayerProxyCanvas), 'function')
    }
  }
  const source = readMember(contract.archives.get('1.1.0'), 'package/dist/artplayer-proxy-canvas.mjs').toString()
  const namespace = await import(`data:text/javascript,${encodeURIComponent(source)}`)
  assert.deepEqual(Object.keys(namespace), ['default'])
  assert.equal(typeof namespace.default(), 'function')
})

test('Canvas published declarations preserve callback/result shape and expose the historical optional-argument change', () => {
  const old = readMember(contract.archives.get('1.0.0'), 'package/types/artplayer-proxy-canvas.d.ts').toString()
  const current = readMember(contract.archives.get('1.1.0'), 'package/types/artplayer-proxy-canvas.d.ts').toString()
  assert.match(old, /export = artplayerProxyCanvas/)
  assert.match(old, /\(option: Option\)/)
  assert.match(current, /export default artplayerProxyCanvas/)
  assert.match(current, /\(option\?: Option\)/)
  for (const source of [old, current]) {
    assert.match(source, /ctx: CanvasRenderingContext2D, video: HTMLVideoElement/)
    assert.match(source, /type Result = HTMLCanvasElement/)
  }
})

for (const implementation of await canvasHistorical()) {
  test(`Canvas ${implementation.name}: bitmap closes before the public callback and draw event`, async () => {
    const sequence = []
    const bitmap = { close() {
      sequence.push('close')
    } }
    const env = await canvasEnvironment(implementation, {
      createImageBitmap(video) {
        assert.equal(video, env.video)
        sequence.push('bitmap')
        return Promise.resolve(bitmap)
      },
      onDraw() { sequence.push('draw') },
    })
    env.factory(() => sequence.push('callback'))(env.art)
    env.art.on('artplayerProxyCanvas:draw', () => sequence.push('event'))
    env.art.emit('resize')
    await env.flush()
    assert.equal(env.draws[0][0], bitmap)
    assert.deepEqual(sequence, ['bitmap', 'draw', 'close', 'callback', 'event'])
    assert.equal(env.frames.size, 0)
  })

  test(`Canvas ${implementation.name}: synchronous canvas return, own methods and live bound media forwarding`, async () => {
    const env = await canvasEnvironment(implementation)
    const result = env.factory()(env.art)
    assert.equal(result, env.canvas)
    assert.equal(result.title, 'canvas-title')
    result.src = 'sample.mp4'
    result.currentTime = 3
    assert.equal(env.video.src, 'sample.mp4')
    assert.equal(env.video.currentTime, 3)
    env.video.videoWidth = 999
    assert.equal(result.videoWidth, 999)
    const descriptor = Object.getOwnPropertyDescriptor(result, 'src')
    assert.equal(descriptor.enumerable, true)
    assert.equal(descriptor.configurable, true)
    const play = result.play
    await play('argument')
    assert.equal(env.calls[0].receiver, env.video)
    assert.deepEqual(env.calls[0].args, ['argument'])
    const toDataURL = result.toDataURL
    assert.equal(toDataURL('image/png'), 'data:canvas')
    assert.equal(env.calls[1].receiver, env.canvas)
    result.addEventListener('click', () => {})
    assert.equal(env.calls[2].name, 'canvas-listener')
    assert.equal(env.proxies.length, 0)
    assert.equal(env.timers.size, 1)
    env.flushTimers()
    assert.equal(env.proxies.length, env.art.constructor.config.events.length)
    const event = { type: 'seeked', target: env.video }
    env.emitVideo(event)
    assert.equal(env.emitted.at(-1).name, 'video:seeked')
    assert.equal(env.emitted.at(-1).args[0], event)
  })

  test(`Canvas ${implementation.name}: callback precedes draw event, metadata/resize preserve aspect and autoSize rules`, async () => {
    const env = await canvasEnvironment(implementation)
    const sequence = []
    env.factory((context, video) => {
      assert.equal(context, env.context)
      assert.equal(video, env.video)
      sequence.push('callback')
    })(env.art)
    env.art.on('artplayerProxyCanvas:draw', (context, video) => {
      assert.equal(context, env.context)
      assert.equal(video, env.video)
      sequence.push('event')
    })
    env.flushTimers()
    env.emitVideo({ type: 'loadedmetadata' })
    assert.deepEqual([env.canvas.width, env.canvas.height], [320, 180])
    env.art.emit('resize')
    await env.flush()
    assert.deepEqual([env.canvas.width, env.canvas.height], [640, 360])
    assert.equal(env.canvas.style.padding, '60px 0px')
    assert.deepEqual(env.draws[0], [env.video, 0, 0, 640, 360])
    assert.deepEqual(sequence, ['callback', 'event'])
    env.art.option.autoSize = true
    env.art.template.$player.clientWidth = 100
    env.art.emit('resize')
    await env.flush()
    assert.equal(env.canvas.width, 640)
    assert.equal(env.draws.length, 2, 'autoSize suppresses sizing, not the historical resize draw')
    env.emitVideo({ type: 'play' })
    await env.flush()
    assert.equal(env.frames.size, 1)
    env.emitVideo({ type: 'pause' })
    assert.equal(env.frames.size, 0)
  })
}
