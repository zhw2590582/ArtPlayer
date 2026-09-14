import assert from 'node:assert/strict'
// eslint-disable-next-line test/no-import-node-test -- Published and candidate callback contracts use controlled SDKs.
import test from 'node:test'
import { deferred, vastEnvironment, vastImplementations } from './helpers/vast.js'

const implementations = await vastImplementations()
const source = implementations.find(item => item.name === 'source')

for (const implementation of implementations.filter(item => item.name === 'source' || item.published)) {
  test(`${implementation.name}: npm callback receives an allocated SDK and original data fields without changing SDK defaults`, async () => {
    const env = vastEnvironment(implementation)
    const host = env.host()
    let context
    await env.factory((value) => {
      context = value
      assert.equal(env.state.players.length, 1)
      assert.equal(value.imaPlayer, env.state.players[0])
      assert.equal(value.$container, host.parent.children[0])
      assert.equal(value.id, value.$container.id)
      assert.match(value.id, /^art-\d/)
      value.imaPlayer.addEventListener('custom', () => {})
      for (const key of ['imaPlayer', 'id', '$container']) {
        const descriptor = Object.getOwnPropertyDescriptor(value, key)
        assert.equal(descriptor.get, undefined)
        assert.equal(descriptor.writable, true)
        assert.equal(descriptor.enumerable, true)
        assert.equal(descriptor.configurable, true)
      }
    })(host.art)
    const player = env.state.players[0]
    assert.equal(player.args[3].enablePreloading, undefined)
    assert.equal(player.args[3].restoreCustomPlaybackStateOnAdBreakComplete, undefined)
    assert.equal(context.$container.style.backgroundColor, undefined)
    assert.equal(context.$container.style.pointerEvents, undefined)
    context.playUrl('/first.xml')
    player.emit('AdStarted')
    context.playUrl('/second.xml')
    assert.equal(player.requests.length, 2, 'The published wrapper forwards both explicit requests')
  })
}

test('VAST explicit workspace mode retains lazy initialization and caller option identities', async () => {
  const env = vastEnvironment(source)
  const host = env.host()
  let context
  await env.factory((value) => {
    context = value
    assert.equal(value.imaPlayer, null)
    assert.equal(value.container, null)
    assert.equal(env.state.players.length, 0)
    value.playerOptions.custom = 'before initialization'
  }, { compatibility: 'workspace-1.2' })(host.art)
  const player = context.init()
  assert.equal(player.args[3], context.adsRenderingSettings)
  assert.equal(player.args[4], context.playerOptions)
  assert.equal(player.args[4].custom, 'before initialization')
  assert.equal(player.args[3].enablePreloading, true)
  assert.equal(player.args[3].restoreCustomPlaybackStateOnAdBreakComplete, true)
  assert.match(context.container.id, /^art-vast-/)
  context.playUrl('/first.xml')
  player.emit('AdStarted')
  context.playUrl('/suppressed.xml')
  assert.equal(player.requests.length, 1)
  host.art.destroy()
  assert.equal(player.destroyCalls, 1)
  assert.equal(context.imaPlayer, null)
})

test('VAST default initializes even without a callback and releases on core destruction', async () => {
  const env = vastEnvironment(source)
  const host = env.host()
  await env.factory()(host.art)
  assert.equal(env.state.players.length, 1)
  host.art.destroy()
  assert.equal(env.state.players[0].destroyCalls, 1)
  assert.equal(host.parent.children.length, 0)
})

test('VAST eager constructor failure rejects registration before callback and removes owned DOM', async () => {
  const failure = new Error('eager allocation failed')
  const env = vastEnvironment(source, { constructError: failure })
  const host = env.host()
  let called = false
  await assert.rejects(env.factory(() => {
    called = true
  })(host.art), error => error === failure)
  assert.equal(called, false)
  assert.equal(host.parent.children.length, 0)
  assert.equal(host.listeners.get('destroy').size, 0)
})

test('VAST eager allocation reentered by core destruction never invokes callback', async () => {
  const env = vastEnvironment(source)
  const host = env.host()
  env.state.onConstruct = () => host.art.destroy()
  let called = false
  await env.factory(() => {
    called = true
  })(host.art)
  assert.equal(called, false)
  assert.equal(env.state.players[0].destroyCalls, 1)
  assert.equal(host.parent.children.length, 0)
})

test('VAST eager callback cancellation releases the live SDK without rewriting its published snapshots', async () => {
  const env = vastEnvironment(source)
  const host = env.host()
  const gate = deferred()
  const started = deferred()
  let context
  const pending = env.factory(async (value) => {
    context = value
    started.resolve()
    await gate.promise
    value.playUrl('/too-late.xml')
  })(host.art)
  await started.promise
  const player = context.imaPlayer
  assert(player)
  const container = context.$container
  host.art.destroy()
  gate.resolve()
  await pending
  assert.equal(context.imaPlayer, player)
  assert.equal(context.$container, container)
  assert.equal(container.parentNode, null)
  assert.equal(player.destroyCalls, 1)
  assert.equal(player.requests.length, 0)
  assert.equal(context.init(), null)
})

test('VAST default callback rejection releases allocation and keeps the original failure', async () => {
  for (const destroyError of [null, new Error('secondary cleanup')]) {
    const env = vastEnvironment(source, { destroyError })
    const host = env.host()
    const failure = new Error('callback failed')
    let context
    await assert.rejects(env.factory((value) => {
      context = value
      return Promise.reject(failure)
    })(host.art), error => error === failure)
    assert.equal(env.state.players[0].destroyCalls, 1)
    assert.equal(host.parent.children.length, 0)
    assert.equal(host.listeners.get('destroy').size, 0)
    assert.equal(context.init(), null)
  }
})

test('VAST default explicit destroy and recreation update aliases without reusing disposed resources', async () => {
  const env = vastEnvironment(source)
  const host = env.host()
  let context
  const result = await env.factory((value) => {
    context = value
  })(host.art)
  const first = context.imaPlayer
  const firstId = context.id
  result.destroy()
  result.destroy()
  assert.equal(context.imaPlayer, first)
  assert.equal(first.destroyCalls, 1)
  context.playUrl('/fresh.xml')
  assert.notEqual(context.imaPlayer, first)
  assert.notEqual(context.id, firstId)
  assert.equal(context.$container, context.container)
  assert.equal(context.imaPlayer.requests[0].adTagUrl, '/fresh.xml')
  assert.equal(host.parent.children.length, 1)
  host.art.destroy()
  assert.deepEqual(env.state.players.map(player => player.destroyCalls), [1, 1])
})

test('VAST rejects an unknown mode before loading the SDK and snapshots a valid mode once', async () => {
  const env = vastEnvironment(source)
  assert.throws(() => env.factory(undefined, { compatibility: 'typo' }), /Unsupported VAST compatibility mode/)
  assert.equal(env.state.loads, 0)
  const options = { compatibility: 'workspace-1.2' }
  const attach = env.factory(undefined, options)
  options.compatibility = 'changed later'
  await attach(env.host().art)
  assert.equal(env.state.players.length, 0)
})
