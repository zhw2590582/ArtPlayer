import assert from 'node:assert/strict'
// eslint-disable-next-line test/no-import-node-test -- Frozen package contract runner.
import test from 'node:test'
import vm from 'node:vm'
import { iframeEnvironment, iframeHistorical } from '../../test/helpers/iframe.js'
import { verifyIframeContract } from './iframe-contract.mjs'
import { readMember } from './releases.mjs'

test('Iframe actual old-name archive and renamed workspace remain separate provenance', async () => {
  const { baseline, archive, sources } = await verifyIframeContract()
  assert.equal(Object.keys(baseline.release.files).length, 8)
  assert.equal(Object.keys(baseline.source).length, 11)
  assert.equal(baseline.release.manifest.module, undefined)
  assert.equal(baseline.registryObservation.body.error, 'Not found')
  const old = readMember(archive, 'package/types/artplayer-plugin-iframe.d.ts').toString()
  const current = sources.get('packages/artplayer-tool-iframe/types/artplayer-tool-iframe.d.ts')
  assert.match(old, /export = ArtplayerPluginIframe/)
  assert.match(old, /export as namespace ArtplayerPluginIframe/)
  assert.match(current, /export default ArtplayerToolIframe/)
  for (const source of [old, current]) {
    assert.match(source, /resove:/)
    assert.match(source, /Promise<ReturnType<T>>/)
    assert.match(source, /static onMessage\(event: MessageEvent & \{ data: Message \}\): void/)
  }
  const esm = await import(`data:text/javascript,${encodeURIComponent(sources.get('packages/artplayer-tool-iframe/dist/artplayer-tool-iframe.mjs'))}`)
  assert.equal(typeof esm.default, 'function')
  assert.deepEqual(Object.keys(esm), ['default'])
})

const implementations = await iframeHistorical()
for (const implementation of implementations.filter(item => item.global !== 'ArtplayerHelperIframe')) {
  test(`Iframe ${implementation.name}: class, CJS/script exports and constructor fields`, () => {
    const env = iframeEnvironment(implementation)
    assert.equal(typeof env.exported, implementation.namespace ? 'object' : 'function')
    const browser = {}
    browser.window = browser
    browser.self = browser
    vm.runInNewContext(implementation.code, browser)
    assert.equal(typeof browser[implementation.global], 'function')
    assert.deepEqual(Object.getOwnPropertyNames(env.Factory.prototype), ['constructor', 'onMessage', 'postMessage', 'commit', 'message', 'destroy'])
    assert.throws(() => new env.Factory({ iframe: {}, url: '/' }), error => error.name === (implementation.namespace ? 'Error' : 'TypeError') && /needs to be a HTMLIFrameElement/.test(error.message))
    assert.throws(() => new env.Factory({ iframe: new env.Frame(), url: null }), /needs to be a string/)
    const frame = new env.Frame()
    const instance = new env.Factory({ iframe: frame, url: '/iframe.html' })
    assert.deepEqual(Object.keys(instance), ['url', '$iframe', 'promises', 'injected', 'destroyed', 'messageCallback', 'onMessage'])
    assert.deepEqual(env.order, ['listen:message', 'src'])
    assert.equal(instance.$iframe, frame)
    assert.equal(instance.url, frame.url)
    assert.equal(instance.injected, false)
    assert.equal(instance.destroyed, false)
    assert.equal(instance.messageCallback(), null)
    assert.throws(() => instance.commit('return 1'), /needs to be a function/)
    assert.throws(() => instance.message(null), /needs to be a function/)
    assert.equal(instance.destroy(), undefined)
    assert.equal(env.handlers.get('message').size, 0)
  })

  test(`Iframe ${implementation.name}: numeric envelopes, resove spelling and callback receiver`, async () => {
    const env = iframeEnvironment(implementation)
    const instance = new env.Factory({ iframe: new env.Frame(), url: '/iframe.html' })
    const observed = []
    assert.equal(instance.message(function (message) {
      observed.push({ receiver: this === instance, ...message })
    }), undefined)
    env.dispatch({ type: 'inject' })
    assert.equal(instance.injected, true)
    const pending = instance.postMessage({ type: 'query', data: 3, id: 999 })
    assert.equal(typeof pending.then, 'function')
    assert.deepEqual(JSON.parse(JSON.stringify(env.sent)), [{ packet: { type: 'query', data: 3, id: 1234 }, origin: '*' }])
    assert.deepEqual(Object.keys(instance.promises[1234]), ['resove', 'reject'])
    env.dispatch({ type: 'response', data: 4, id: 1234 })
    assert.equal(await pending, 4)
    assert.equal(Object.keys(instance.promises).length, 0)
    assert.deepEqual(observed, [{ receiver: true, type: 'inject', data: undefined }, { receiver: true, type: 'response', data: 4 }])
    instance.destroy()
  })

  test(`Iframe ${implementation.name}: child injection and synchronous commit response contract`, async () => {
    const parent = iframeEnvironment(implementation)
    assert.equal(parent.Factory.iframe, false)
    assert.throws(() => parent.Factory.inject(), /can only be used in iframe/)
    const env = iframeEnvironment(implementation, true)
    assert.equal(env.Factory.iframe, true)
    assert.equal(env.Factory.inject(), undefined)
    assert.deepEqual(JSON.parse(JSON.stringify(env.sent)), [{ packet: { type: 'inject', id: 0 }, origin: '*' }])
    await env.Factory.onMessage({ data: { type: 'commit', data: 'return 2 + 3', id: 17 } })
    assert.deepEqual(JSON.parse(JSON.stringify(env.sent.at(-1))), { packet: { type: 'response', data: 5, id: 17 }, origin: '*' })
  })

  test(`Iframe ${implementation.name}: commit serializes a body and resolver replies remain asynchronous`, async () => {
    const env = iframeEnvironment(implementation)
    const instance = new env.Factory({ iframe: new env.Frame(), url: '/' })
    env.dispatch({ type: 'inject' })
    const pending = instance.commit(() => {
      return 7
    })
    const packet = env.sent.at(-1).packet
    assert.equal(packet.type, 'commit')
    assert.equal(packet.data.trim(), 'return 7')
    assert.equal(packet.id, 1234)
    env.dispatch({ type: 'response', data: 7, id: packet.id })
    assert.equal(await pending, 7)
    const child = iframeEnvironment(implementation, true)
    const completion = child.Factory.onMessage({ data: { type: 'commit', data: 'resolve(8)', id: 18 } })
    assert.equal(typeof completion.then, 'function')
    await completion
    assert.deepEqual(JSON.parse(JSON.stringify(child.sent.at(-1))), { packet: { type: 'response', data: 8, id: 18 }, origin: '*' })
    instance.destroy()
  })
}

for (const implementation of implementations.filter(item => item.global === 'ArtplayerHelperIframe')) {
  test(`Iframe ${implementation.name}: extra helper artifact has a distinct static destroy protocol`, async () => {
    const env = iframeEnvironment(implementation)
    assert.equal(typeof env.exported, 'object')
    assert.equal(env.Factory.iframe, undefined)
    assert.equal(typeof env.Factory.destroy, 'function')
    const browser = {}
    browser.window = browser
    browser.self = browser
    vm.runInNewContext(implementation.code, browser)
    assert.equal(typeof browser.ArtplayerHelperIframe, 'function')
    const instance = new env.Factory({ iframe: new env.Frame(), url: '/' })
    assert.equal(instance.isInject, false)
    assert.equal(instance.isDestroy, false)
    assert.equal(instance.injected, undefined)
    env.Factory.inject()
    assert.equal(env.Factory.isInject, true)
    await env.Factory.onMessage({ data: { type: 'destroy' } })
    assert.equal(env.Factory.isDestroy, true)
    assert.equal(env.Factory.isInject, false)
    assert.deepEqual(JSON.parse(JSON.stringify(env.sent)), [{ packet: { type: 'inject', id: 0 }, origin: '*' }, { packet: { type: 'destroy', id: 0 }, origin: '*' }])
    instance.destroy()
    assert.equal(instance.isDestroy, true)
  })
}
