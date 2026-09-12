import assert from 'node:assert/strict'
import fs from 'node:fs'
// eslint-disable-next-line test/no-import-node-test -- Node frozen contract runner.
import test from 'node:test'
import vm from 'node:vm'
import ts from 'typescript'
import compat from 'typescript-compat'
import { mbEnvironment, mbHistorical } from '../../test/helpers/mediabunny.js'
import { diagnostics } from './factory-assignability.mjs'
import { verifyMbContract } from './mb-contract.mjs'
import { readMember } from './releases.mjs'

const contract = await verifyMbContract()
const { baseline, archives } = contract
const surface = JSON.parse(fs.readFileSync('refactor/baselines/mb-surface.json', 'utf8'))

test('MediaBunny freezes two real releases, twelve members, seventeen Git inputs and separately locked SDK provenance', () => {
  assert.deepEqual([baseline.release.version, ...baseline.previous.map(item => item.version)], ['1.2.0', '1.0.0'])
  assert.equal([baseline.release, ...baseline.previous].reduce((sum, item) => sum + Object.keys(item.files).length, 0), 12)
  assert.equal(Object.keys(baseline.source).length, 17)
  assert.equal(baseline.dependency.version, '1.56.1')
  assert.equal(baseline.dependency.manifestLicense, 'MPL-2.0')
  assert.deepEqual([baseline.release, ...baseline.previous].map(item => item.bundledDependencyVersion), [null, null])
})

test('Historical proxy archives embed SDK code without separate license/notice members or MPL markers', () => {
  for (const release of [baseline.release, ...baseline.previous]) {
    const files = Object.keys(release.files)
    assert(!files.some(file => /license|notice|\.wasm$|worker/i.test(file)))
    assert.equal(release.manifest.license, 'MIT')
    const archive = archives.get(release.version)
    for (const field of ['main', 'legacy', 'module']) {
      const code = readMember(archive, `package/${release.manifest[field].replace(/^\.\//, '')}`).toString()
      assert.doesNotMatch(code, /Mozilla Public License|MPL-2\.0|This Source Code Form/)
      if (field === 'module') {
        assert.match(code, /AudioBufferSink/)
        assert.match(code, /CanvasSink/)
      }
    }
  }
  assert.match(fs.readFileSync('node_modules/mediabunny/LICENSE', 'utf8'), /^Mozilla Public License Version 2\.0/)
})

test('Published declarations preserve optional factory replacements and exact Canvas results in both supported compiler generations', () => {
  const source = `import Artplayer from 'artplayer'; import factory from './factory-history';
type Option = Parameters<typeof factory>[0];
const replacement: typeof factory = (_option?: Option) => (_art: Artplayer) => document.createElement('canvas');
const result: ReturnType<ReturnType<typeof factory>> = document.createElement('canvas');
factory(); factory({ volume: 0.7, source: new Blob([]), loadTimeout: 1000 }); void [replacement, result];`
  for (const release of [baseline.release, ...baseline.previous]) {
    const types = readMember(archives.get(release.version), `package/${release.manifest.types.replace(/^\.\//, '')}`).toString()
    for (const compiler of [ts, compat]) {
      assert.deepEqual(diagnostics(compiler, source, types), [])
      assert.deepEqual(diagnostics(compiler, `${source} factory({ volume: 'loud' });`, types).map(item => item.code), [2322])
      assert.deepEqual(diagnostics(compiler, `${source} factory({ m3u8: {} });`, types).map(item => item.code), release.version === '1.0.0' ? [compiler === compat ? 2345 : 2353] : [])
    }
  }
})

test('Actual main, legacy, browser globals and native ESM retain historical export shapes', async () => {
  for (const release of [baseline.release, ...baseline.previous]) {
    for (const field of ['main', 'legacy']) {
      const code = readMember(archives.get(release.version), `package/${release.manifest[field].replace(/^\.\//, '')}`).toString()
      const env = mbEnvironment({ code })
      assert.equal(typeof env.exported, release.version === '1.0.0' ? 'object' : 'function')
      assert.equal(typeof env.factory(), 'function')
      const global = { ...env.globals }
      delete global.module
      delete global.exports
      vm.runInNewContext(code, global)
      const value = global.artplayerProxyMediabunny || global.window.artplayerProxyMediabunny
      assert.equal(typeof (value.default || value), 'function')
    }
    const code = readMember(archives.get(release.version), `package/${release.manifest.module.replace(/^\.\//, '')}`).toString()
    const module = await import(`data:text/javascript,${encodeURIComponent(code)}`)
    assert.deepEqual(Object.keys(module), ['default'])
    assert.equal(typeof module.default(), 'function')
  }
})

for (const implementation of await mbHistorical()) {
  test(`MediaBunny ${implementation.name}: exact observable canvas surface and media defaults`, () => {
    const env = mbEnvironment(implementation)
    const canvas = env.factory()(env.art)
    const expected = surface.records.find(item => item.name === implementation.name)
    assert.equal(canvas, env.canvas)
    assert.deepEqual(Object.keys(canvas), expected.canvasKeys)
    assert.equal(Boolean(env.art.mediabunny), expected.artMediabunny)
    if (env.art.mediabunny) {
      assert.deepEqual(Object.getOwnPropertyNames(env.art.mediabunny), expected.shimOwn)
      assert.deepEqual(Object.getOwnPropertyNames(Object.getPrototypeOf(env.art.mediabunny)), expected.shimPrototype)
    }
    for (const [name, value] of Object.entries(expected.defaults)) assert.equal(canvas[name], value, name)
    for (const name of ['src', 'currentTime', 'play', 'duration', 'engine']) {
      const descriptor = Object.getOwnPropertyDescriptor(canvas, name)
      assert.equal(descriptor.enumerable, true)
      assert.equal(descriptor.configurable, true)
      assert.equal(typeof descriptor.get, 'function')
      assert.equal(typeof descriptor.set, 'function')
    }
    if (implementation.name === 'published-1.0.0') {
      assert.equal(Reflect.set(canvas, 'duration', 12), true, 'Older non-strict forwarding silently ignores readonly writes')
      assert(Number.isNaN(canvas.duration))
    }
    else {
      assert.throws(() => Reflect.set(canvas, 'duration', 12), { name: 'TypeError' })
    }
    assert.notEqual(canvas.play, canvas.play, 'Forwarded methods are rebound on every read')
  })

  test(`MediaBunny ${implementation.name}: option reference, coercion and historical no-op setters`, () => {
    const env = mbEnvironment(implementation)
    const option = { volume: 2, muted: true, poster: 'old.png', autoplay: true, loop: true, crossOrigin: 'anonymous' }
    const canvas = env.factory(option)(env.art)
    assert.equal(canvas.option, option)
    assert.equal(canvas.volume, 2, 'Initial volume bypasses setter clamp')
    canvas.volume = '0.4'
    assert.equal(canvas.volume, 0.4)
    assert.equal(canvas.muted, false)
    canvas.volume = -1
    assert.equal(canvas.volume, 0)
    canvas.volume = 2
    assert.equal(canvas.volume, 1)
    canvas.muted = 'yes'
    assert.equal(canvas.muted, true)
    canvas.playbackRate = 2
    canvas.playbackRate = 0
    canvas.playbackRate = Number.NaN
    assert.equal(canvas.playbackRate, 2)
    canvas.poster = 'new.png'
    assert.equal(option.poster, 'new.png')
    canvas.autoplay = false
    canvas.loop = false
    canvas.crossOrigin = 'use-credentials'
    assert.equal(canvas.autoplay, true)
    assert.equal(canvas.loop, true)
    assert.equal(canvas.crossOrigin, 'anonymous')
    assert.deepEqual(env.emitted.map(item => item.name), ['video:volumechange', 'video:volumechange', 'video:volumechange', 'video:volumechange', 'video:ratechange'])
  })

  test(`MediaBunny ${implementation.name}: native canvas methods win and configured shim events forward through ArtPlayer`, () => {
    const env = mbEnvironment(implementation)
    const canvas = env.factory()(env.art)
    assert.equal(canvas.getContext('2d'), env.context)
    assert.deepEqual(env.nativeCalls.at(-1), ['context', '2d', true])
    canvas.setAttribute('src', 'media.mp4')
    assert.equal(canvas.src, null, 'Canvas native setAttribute is not shim setAttribute')
    assert.deepEqual(env.nativeCalls.at(-1), ['attribute', 'src', 'media.mp4'])
    let nativeEvents = 0
    canvas.addEventListener('volumechange', () => nativeEvents++)
    for (const name of env.eventNames) {
      const detail = { name }
      canvas.events.emit(name, detail)
      const event = env.emitted.at(-1)
      assert.equal(event.name, `video:${name}`)
      assert.equal(event.args[0].type, name)
      assert.equal(event.args[0].detail, detail)
    }
    assert.equal(nativeEvents, 0)
    env.art.emit('resize')
    assert.deepEqual({ ...canvas.style }, { width: '100%', height: '100%', objectFit: 'contain' })
  })

  test(`MediaBunny ${implementation.name}: sync and async forwarding, synthetic ranges and factory teardown`, async () => {
    const env = mbEnvironment(implementation)
    const canvas = env.factory()(env.art)
    const calls = []
    const promise = Promise.resolve()
    canvas.engine.play = () => promise
    canvas.engine.pause = () => calls.push('pause')
    canvas.engine.load = source => calls.push(['load', source])
    canvas.engine.seek = time => calls.push(['seek', time])
    canvas.engine.destroy = () => calls.push('destroy')
    assert.equal(canvas.play(), promise)
    assert.equal(canvas.pause(), undefined)
    canvas.src = 'first.mp4'
    assert.equal(canvas.load(), undefined)
    canvas.currentTime = '3.5'
    assert.equal(canvas.currentSrc, 'first.mp4')
    assert.equal(canvas.buffered.length, 0)
    Object.defineProperty(canvas.engine, 'duration', { value: 12, configurable: true })
    Object.defineProperty(canvas.engine, 'currentTime', { value: 3.5, configurable: true })
    assert.equal(canvas.buffered.end(99), 12, 'Synthetic range does not validate indices or measure downloaded bytes')
    assert.equal(canvas.played.end(0), 3.5)
    assert.equal(canvas.seekable.start(0), 0)
    env.art.emit('destroy')
    assert.equal(env.art.mediabunny, undefined)
    assert.deepEqual(calls, ['pause', ['load', 'first.mp4'], ['load', 'first.mp4'], ['seek', 3.5], 'destroy'])
    await promise
  })

  test(`MediaBunny ${implementation.name}: frame callback is one cancellable RAF, not decoded-frame evidence`, () => {
    const env = mbEnvironment(implementation)
    const canvas = env.factory()(env.art)
    const calls = []
    const first = canvas.requestVideoFrameCallback((...args) => calls.push(args))
    assert.equal(first, 0)
    canvas.cancelVideoFrameCallback(first)
    assert.equal(env.frames.size, 0)
    const second = canvas.requestVideoFrameCallback((...args) => calls.push(args))
    env.frames.get(second)(100)
    assert.equal(calls.length, 1)
    assert.equal(calls[0][0], 100)
    assert.equal(calls[0][1].presentedFrames, 0)
    assert.equal(calls[0][1].mediaTime, 0)
    assert.equal(canvas.canPlayType('not/a-real-codec'), 'maybe')
  })
}
