import assert from 'node:assert/strict'
// eslint-disable-next-line test/no-import-node-test -- Verify immutable releases and wrapper contracts without external ad requests.
import test from 'node:test'
import vm from 'node:vm'
import { transform } from 'esbuild'
import { readMember } from './releases.mjs'
import { verifyVastContract } from './vast-contract.mjs'

const contract = await verifyVastContract()
const archive = contract.archives.get('artplayer-plugin-vast@1.0.0')

test('VAST published artifacts expose a CommonJS default namespace and browser global', () => {
  for (const member of ['package/dist/artplayer-plugin-vast.js', 'package/dist/artplayer-plugin-vast.legacy.js']) {
    const module = { exports: {} }
    const window = {}
    vm.runInNewContext(readMember(archive, member).toString(), { module, exports: module.exports, window, CustomEvent }, { timeout: 5000 })
    assert.equal(typeof module.exports, 'object')
    assert.deepEqual(Object.keys(module.exports), ['default'])
    assert.equal(typeof module.exports.default, 'function')
    assert.equal(window.artplayerPluginVast, module.exports.default)
    assert.equal(typeof module.exports.default(), 'function')
  }
})

function sdkFixture() {
  const players = []
  const ima = { AdsRenderingSettings: class {}, AdsRequest: class {} }
  const sdk = {
    loadImaSdk: async () => ima,
    PlayerOptions: class {},
    Player: class {
      constructor(...args) {
        this.args = args
        this.requests = []
        this.events = new Map()
        players.push(this)
      }

      addEventListener(name, callback) { this.events.set(name, callback) }
      playAds(request) { this.requests.push(request) }
      destroy() { this.destroyed = true }
    },
  }
  const node = () => ({ style: {}, parentNode: null })
  const parent = {
    children: [],
    appendChild(child) {
      child.parentNode = this
      this.children.push(child)
      return child
    },
    removeChild(child) {
      child.parentNode = null
      this.children.splice(this.children.indexOf(child), 1)
    },
  }
  const art = { template: { $player: parent, $video: {} }, constructor: { utils: { createElement: node, setStyles: (target, styles) => Object.assign(target.style, styles), append: (target, child) => target.appendChild(child) } } }
  return { players, ima, sdk, art }
}

async function loadSource(source, fixture) {
  const module = { exports: {} }
  const result = await transform(source, { loader: 'js', format: 'cjs', target: 'es2020' })
  vm.runInNewContext(result.code, { module, exports: module.exports, window: { google: { ima: fixture.ima } }, console, require(name) {
    assert.equal(name, '@glomex/vast-ima-player')
    return fixture.sdk
  } }, { timeout: 5000 })
  return module.exports.default
}

for (const family of ['published', 'workspace']) {
  test(`VAST ${family}: frozen source shows async callback timing and its exact context/initialization contract`, async () => {
    const fixture = sdkFixture()
    const source = family === 'published' ? readMember(archive, 'package/src/index.js').toString() : contract.sources.get('packages/artplayer-plugin-vast/src/index.js')
    const factory = await loadSource(source, fixture)
    let release
    let callbackStarted
    const ready = new Promise((resolve) => {
      callbackStarted = resolve
    })
    const gate = new Promise((resolve) => {
      release = resolve
    })
    const attaching = factory(async (value) => {
      callbackStarted(value)
      await gate
    })(fixture.art)
    assert.equal(typeof attaching.then, 'function', 'The historical synchronous declaration is inaccurate')
    const context = await ready
    assert(context)
    assert.equal(context.art, fixture.art)
    if (family === 'published') {
      assert.deepEqual(Object.keys(context), ['art', 'id', 'ima', 'imaPlayer', '$container', 'playUrl', 'playRes'])
      assert.equal(fixture.players.length, 1)
      assert.equal(context.imaPlayer, fixture.players[0])
      assert.equal(context.$container, fixture.art.template.$player.children[0])
      assert.equal(context.id, context.$container.id)
      assert.match(context.id, /^art-\d+$/)
    }
    else {
      assert.deepEqual(Object.keys(context), ['art', 'playUrl', 'playRes', 'init', 'ima', 'adsRenderingSettings', 'playerOptions', 'imaPlayer', 'container'])
      assert.equal(fixture.players.length, 0)
      assert.equal(context.imaPlayer, null)
      assert.equal(context.container, null)
      assert.equal(context.id, undefined)
      assert.equal(context.$container, undefined)
      assert.equal(context.init(), context.init())
      assert.equal(context.imaPlayer, fixture.players[0])
      assert.equal(context.container, fixture.art.template.$player.children[0])
      assert.equal(context.adsRenderingSettings.restoreCustomPlaybackStateOnAdBreakComplete, true)
      assert.equal(context.adsRenderingSettings.enablePreloading, true)
    }
    assert.equal(context.playUrl('/ad.xml', { adTagUrl: '/override.xml', extra: 1 }), undefined)
    assert.equal(fixture.players[0].requests[0].adTagUrl, family === 'published' ? '/ad.xml' : '/override.xml')
    assert.equal(context.playRes('<VAST/>'), undefined)
    assert.equal(fixture.players[0].requests[1].adsResponse, '<VAST/>')
    release()
    const result = await attaching
    assert.deepEqual(Object.keys(result), family === 'published' ? ['name'] : ['name', 'destroy'])
    assert.equal(result.name, 'artplayerPluginVast')
    if (family === 'workspace') {
      result.destroy()
      assert.equal(fixture.players[0].destroyed, true)
      assert.equal(context.container, null)
    }
  })
}

test('VAST wrapper SDK public declarations import a development-only dependency', () => {
  for (const release of contract.baseline.sdk) {
    assert.equal(release.manifest.dependencies?.['@alugha/ima'], undefined)
    assert.equal(typeof release.manifest.devDependencies['@alugha/ima'], 'string')
    const archive = contract.archives.get(`${release.name}@${release.version}`)
    assert.match(readMember(archive, 'package/dist/index.d.ts').toString(), /from ['"]@alugha\/ima['"]/)
    assert.match(readMember(archive, 'package/dist/vast-ima-player.d.ts').toString(), /from ['"]@alugha\/ima['"]/)
  }
})
