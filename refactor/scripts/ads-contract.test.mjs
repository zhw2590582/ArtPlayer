import assert from 'node:assert/strict'
import { execFileSync } from 'node:child_process'
// eslint-disable-next-line test/no-import-node-test -- Validate frozen package provenance and actual published exports.
import test from 'node:test'
import vm from 'node:vm'
import { verifyAdsContract } from './ads-contract.mjs'
import { readMember } from './releases.mjs'

test('Ads archives and historical contract remain immutable, including the unpublished workspace version boundary', verifyAdsContract)

test('actual Ads 1.0.6 exposes a CommonJS default namespace, browser factory and deferred synchronous result', async () => {
  const { baseline, archives } = await verifyAdsContract()
  const module = { exports: {} }
  const browser = {}
  vm.runInNewContext(readMember(archives.get('1.0.6'), 'package/dist/artplayer-plugin-ads.js').toString(), { module, exports: module.exports, window: browser }, { timeout: 5000 })
  assert.equal(typeof module.exports, 'object')
  assert.deepEqual(Object.keys(module.exports), ['default'])
  const factory = module.exports.default
  assert.equal(browser.artplayerPluginAds, factory)
  assert.equal(factory.version, '1.0.6')
  assert.equal(factory.env, 'production')
  assert.equal(typeof factory.build, 'string')
  const current = { exports: {} }
  vm.runInNewContext(execFileSync('git', ['show', `${baseline.sourceCommit}:packages/artplayer-plugin-ads/dist/artplayer-plugin-ads.js`]).toString(), { module: current, exports: current.exports }, { timeout: 5000 })
  assert.equal(typeof current.exports, 'function')
  assert.equal(current.exports.default, undefined)
  let options
  let schema
  const subscriptions = []
  const art = {
    template: { $player: {} },
    icons: {},
    constructor: {
      validator(value, rules) {
        options = value
        schema = rules
        return value
      },
      utils: {},
    },
    on(name) { subscriptions.push(name) },
  }
  const result = factory({ html: '<b>ad</b>', muted: true })(art)
  assert.deepEqual(Object.keys(result), ['name', 'skip', 'pause', 'play'])
  assert.equal(result.name, 'artplayerPluginAds')
  for (const method of ['skip', 'pause', 'play']) assert.equal(typeof result[method], 'function')
  assert.deepEqual(subscriptions, ['ready'])
  assert.equal(options.html, '<b>ad</b>')
  assert.equal(options.video, '')
  assert.equal(options.url, '')
  assert.equal(options.playDuration, 5)
  assert.equal(options.totalDuration, 10)
  assert.equal(options.muted, true)
  assert.equal(options.i18n.countdown, '%s秒')
  assert.equal(schema.totalDuration, 'number')
  assert(!Object.hasOwn(schema, 'source'))
  assert(!Object.hasOwn(schema, 'type'))
})
