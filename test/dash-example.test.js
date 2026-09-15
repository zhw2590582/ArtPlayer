import assert from 'node:assert/strict'
import fs from 'node:fs'
// eslint-disable-next-line test/no-import-node-test -- Execute the actual public example with a controlled SDK lifecycle.
import { test } from 'node:test'
import { runInNewContext } from 'node:vm'

const source = fs.readFileSync(new URL('../docs/assets/example/dash.control.js', import.meta.url), 'utf8')

function loadExample(supported) {
  const engines = []
  const hooks = []
  const pluginOptions = []
  const dashjs = {
    supportsMediaSource: () => supported,
    MediaPlayer: () => ({ create() {
      const engine = {
        destroyed: 0,
        initialize(video, url, autoplay) {
          Object.assign(this, { video, url, autoplay })
        },
        destroy() { this.destroyed++ },
      }
      engines.push(engine)
      return engine
    } }),
  }
  class Artplayer {
    constructor(option) {
      this.option = { autoplay: false, ...option }
      this.notice = {}
    }

    on(event, callback) { hooks.push({ event, callback }) }
  }
  const sandbox = { Artplayer, dashjs, artplayerPluginDashControl: (option) => {
    pluginOptions.push(option)
    return () => ({})
  } }
  runInNewContext(`${source}\nglobalThis.exampleArt = art`, sandbox)
  const art = sandbox.exampleArt
  const video = {}
  return { art, engines, hooks, pluginOptions, video, load: url => art.option.customType.mpd(video, url, art) }
}

test('DASH example releases replaced engines once and has one final cleanup hook', () => {
  const example = loadExample(true)
  for (const url of ['first.mpd', 'second.mpd', 'third.mpd'])
    example.load(url)
  assert.equal(example.art.dash, example.engines[2])
  assert.equal(example.art.dash.video, example.video)
  assert.equal(example.art.dash.autoplay, false)
  assert.deepEqual(example.engines.map(engine => engine.destroyed), [1, 1, 0])
  const hooks = example.hooks.filter(hook => hook.event === 'destroy')
  assert.equal(hooks.length, 1)
  for (const hook of hooks) {
    hook.callback()
    hook.callback()
  }
  assert.deepEqual(example.engines.map(engine => engine.destroyed), [1, 1, 1])
})

test('unsupported DASH creates no SDK or SDK-dependent control plugin', () => {
  const example = loadExample(false)
  example.load('unsupported.mpd')
  assert.equal(example.art.notice.show, 'Unsupported playback format: mpd')
  assert.equal(example.engines.length, 0)
  assert.equal(example.art.option.plugins.length, 0)
  assert.equal(example.pluginOptions.length, 0)
  for (const hook of example.hooks.filter(hook => hook.event === 'destroy'))
    hook.callback()
})

test('DASH audio formatter handles actual SDK nullable metadata and preserves language labels', () => {
  const format = loadExample(true).pluginOptions[0].audio.getName
  assert.equal(format({ lang: 'en', id: 0 }), 'EN')
  assert.equal(format({ lang: null, id: 0 }), '0')
  assert.equal(format({ id: 'commentary' }), 'commentary')
  assert.equal(format({ lang: null, id: null }), 'Audio')
})
