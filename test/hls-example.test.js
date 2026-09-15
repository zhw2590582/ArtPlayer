import assert from 'node:assert/strict'
import fs from 'node:fs'
// eslint-disable-next-line test/no-import-node-test -- Verify the actual demo source against a controlled SDK lifecycle.
import { test } from 'node:test'
import { runInNewContext } from 'node:vm'

const source = fs.readFileSync(new URL('../docs/assets/example/hls.control.js', import.meta.url), 'utf8')

function loadExample(supported) {
  const engines = []
  const hooks = []
  let pluginCalls = 0
  class Hls {
    static isSupported() { return supported }
    constructor() {
      this.destroyCount = 0
      engines.push(this)
    }

    loadSource(url) { this.url = url }
    attachMedia(video) { this.media = video }
    destroy() { this.destroyCount++ }
  }
  class Artplayer {
    constructor(option) {
      this.option = option
      this.notice = {}
    }

    on(event, callback) { hooks.push({ event, callback }) }
  }
  const sandbox = { Artplayer, Hls, artplayerPluginHlsControl: () => {
    pluginCalls++
    return () => ({})
  } }
  runInNewContext(`${source}\nglobalThis.exampleArt = art`, sandbox)
  const art = sandbox.exampleArt
  const video = { canPlayType: () => 'maybe', src: '' }
  return { art, video, engines, hooks, get pluginCalls() {
    return pluginCalls
  }, load: url => art.option.customType.m3u8(video, url, art) }
}

test('HLS example destroys every replaced engine once and keeps one final cleanup hook', () => {
  const example = loadExample(true)
  example.load('one.m3u8')
  example.load('two.m3u8')
  example.load('three.m3u8')
  assert.equal(example.engines.length, 3)
  assert.equal(example.art.hls, example.engines[2])
  assert.equal(example.art.hls.media, example.video)
  assert.deepEqual(example.engines.map(engine => engine.destroyCount), [1, 1, 0])
  assert.equal(example.hooks.filter(hook => hook.event === 'destroy').length, 1)
  for (const hook of example.hooks.filter(hook => hook.event === 'destroy'))
    hook.callback()
  assert.deepEqual(example.engines.map(engine => engine.destroyCount), [1, 1, 1])
})

test('native HLS fallback does not install controls requiring an Hls.js instance', () => {
  const example = loadExample(false)
  example.load('native.m3u8')
  assert.equal(example.video.src, 'native.m3u8')
  assert.equal(example.art.option.plugins.length, 0)
  assert.equal(example.pluginCalls, 0)
  assert.equal(example.engines.length, 0)
  for (const hook of example.hooks.filter(hook => hook.event === 'destroy'))
    hook.callback()
})

test('unsupported HLS reports the existing notice without creating an SDK', () => {
  const example = loadExample(false)
  example.video.canPlayType = () => ''
  example.load('unsupported.m3u8')
  assert.equal(example.art.notice.show, 'Unsupported playback format: m3u8')
  assert.equal(example.video.src, '')
  assert.equal(example.engines.length, 0)
})
