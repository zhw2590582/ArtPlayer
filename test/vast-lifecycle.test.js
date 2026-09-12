import assert from 'node:assert/strict'
// eslint-disable-next-line test/no-import-node-test -- Candidate SDK lifecycle acceptance uses Node's runner.
import test from 'node:test'
import { deferred, vastEnvironment, vastImplementations } from './helpers/vast.js'

const candidates = (await vastImplementations()).filter(item => !item.historical)

for (const implementation of candidates) {
  const { name } = implementation
  test(`${name}: core destruction releases SDK and makes escaped methods inert`, async () => {
    const env = vastEnvironment(implementation)
    const host = env.host()
    let context
    const result = await env.factory((value) => {
      context = value
      value.playUrl('/first.xml')
    })(host.art)
    const player = context.imaPlayer
    host.art.destroy()
    result.destroy()
    assert.equal(context.init(), null)
    context.playUrl('/late.xml')
    context.playRes('late response')
    assert.equal(player.destroyCalls, 1)
    assert.equal(player.requests.length, 1)
    assert.equal(host.parent.children.length, 0)
    assert.equal(context.imaPlayer, null)
    assert.equal(context.container, null)
  })

  test(`${name}: destruction while SDK is loading suppresses callback and allocation`, async () => {
    const env = vastEnvironment(implementation, { deferLoad: true })
    const host = env.host()
    let calls = 0
    const attaching = env.factory(() => calls++)(host.art)
    assert.equal(host.listeners.get('destroy').size, 1)
    host.art.destroy()
    env.resolveLoad()
    const result = await attaching
    result.destroy()
    assert.equal(calls, 0)
    assert.equal(env.state.players.length, 0)
    assert.equal(host.parent.children.length, 0)
  })

  test(`${name}: already destroyed hosts do not load SDK or subscribe`, async () => {
    const env = vastEnvironment(implementation)
    const host = env.host()
    host.art.destroy()
    await env.factory(() => assert.fail('Unexpected callback'))(host.art)
    assert.equal(env.state.loads, 0)
    assert.equal(host.listeners.size, 0)
  })

  test(`${name}: SDK rejection unregisters the pending core listener`, async () => {
    const env = vastEnvironment(implementation, { deferLoad: true })
    const host = env.host()
    const attaching = env.factory()(host.art)
    const failure = new Error('load failure')
    const rejected = assert.rejects(attaching, error => error === failure)
    env.rejectLoad(failure)
    await rejected
    assert.equal(host.listeners.get('destroy').size, 0)
  })

  test(`${name}: callback rejection reclaims its SDK and preserves the original error over cleanup failure`, async () => {
    const failure = new Error('callback failure')
    for (const destroyError of [null, new Error('cleanup failure')]) {
      const env = vastEnvironment(implementation, { destroyError })
      const host = env.host()
      let context
      await assert.rejects(env.factory((value) => {
        context = value
        context.init()
        throw failure
      })(host.art), error => error === failure)
      assert.equal(env.state.players[0].destroyCalls, 1)
      assert.equal(host.parent.children.length, 0)
      assert.equal(host.listeners.get('destroy').size, 0)
      assert.equal(context.init(), null)
      if (destroyError)
        assert.equal(env.state.errors[0][1], destroyError)
    }
  })

  test(`${name}: a callback resumed after core destroy cannot request or recreate ads`, async () => {
    const env = vastEnvironment(implementation)
    const host = env.host()
    const started = deferred()
    const finish = deferred()
    const attaching = env.factory(async (context) => {
      context.init()
      started.resolve()
      await finish.promise
      context.playUrl('/late.xml')
      assert.equal(context.init(), null)
    })(host.art)
    await started.promise
    host.art.destroy()
    finish.resolve()
    await attaching
    assert.equal(env.state.players.length, 1)
    assert.equal(env.state.players[0].destroyCalls, 1)
    assert.equal(env.state.players[0].requests.length, 0)
    assert.equal(host.parent.children.length, 0)
  })

  test(`${name}: constructor and event-registration failures roll back and allow explicit retry`, async () => {
    for (const field of ['constructError', 'listenError']) {
      const failure = new Error(field)
      const env = vastEnvironment(implementation, { [field]: failure })
      const host = env.host()
      let context
      await env.factory((value) => {
        context = value
      })(host.art)
      assert.throws(() => context.init(), error => error === failure)
      assert.equal(host.parent.children.length, 0)
      assert.equal(context.imaPlayer, null)
      assert.equal(context.container, null)
      if (field === 'listenError')
        assert.equal(env.state.players[0].destroyCalls, 1)
      env.state[field] = null
      const player = context.init()
      assert.equal(player.listeners.size, 4)
      assert.equal(host.parent.children.length, 1)
    }
  })

  test(`${name}: same-millisecond instances use distinct IDs and clean up independently`, async () => {
    const env = vastEnvironment(implementation)
    const contexts = []
    const attach = env.factory((context) => {
      context.init()
      contexts.push(context)
    })
    const one = env.host()
    const two = env.host()
    const [result] = await Promise.all([attach(one.art), attach(two.art)])
    assert.notEqual(contexts[0].container.id, contexts[1].container.id)
    result.destroy()
    assert.equal(one.parent.children.length, 0)
    assert.equal(two.parent.children.length, 1)
    contexts[1].playUrl('/other.xml')
    assert.equal(contexts[1].imaPlayer.requests.length, 1)
  })

  test(`${name}: explicit destroy during an active ad clears suppression for a new session`, async () => {
    const env = vastEnvironment(implementation)
    let context
    const result = await env.factory((value) => {
      context = value
    })(env.host().art)
    context.playUrl('/first.xml')
    context.imaPlayer.emit('AdStarted')
    result.destroy()
    context.playUrl('/second.xml')
    assert.equal(env.state.players.length, 2)
    assert.equal(context.imaPlayer.requests[0].adTagUrl, '/second.xml')
  })

  test(`${name}: saved old SDK callbacks are inert both after cleanup and after recreation`, async () => {
    const env = vastEnvironment(implementation)
    let context
    const result = await env.factory((value) => {
      context = value
    })(env.host().art)
    const first = context.init()
    const late = [...first.listeners.values()].flatMap(listeners => [...listeners])
    result.destroy()
    for (const callback of late) assert.doesNotThrow(() => callback({ detail: 'late' }))
    context.init()
    for (const callback of late) callback({ detail: 'late' })
    assert.equal(context.container.style.display, 'none')
    context.playUrl('/fresh.xml')
    assert.equal(context.imaPlayer.requests.length, 1)
    assert.equal(env.state.errors.length, 0)
  })

  test(`${name}: SDK destroy failure still clears references and DOM and is not retried accidentally`, async () => {
    const failure = new Error('destroy failure')
    const env = vastEnvironment(implementation, { destroyError: failure })
    const host = env.host()
    let context
    const result = await env.factory((value) => {
      context = value
    })(host.art)
    const player = context.init()
    assert.throws(() => result.destroy(), error => error === failure)
    assert.equal(context.container, null)
    assert.equal(context.imaPlayer, null)
    assert.equal(host.parent.children.length, 0)
    assert.doesNotThrow(() => result.destroy())
    assert.equal(player.destroyCalls, 1)
    env.state.destroyError = null
    assert.notEqual(context.init(), player)
  })

  test(`${name}: a request config accessor destroying the core prevents playAds`, async () => {
    const env = vastEnvironment(implementation)
    const host = env.host()
    let context
    await env.factory((value) => {
      context = value
    })(host.art)
    context.playUrl('/cancelled.xml', { get extra() {
      host.art.destroy()
      return 1
    } })
    assert.equal(env.state.players[0].requests.length, 0)
    assert.equal(env.state.players[0].destroyCalls, 1)
    assert.equal(host.parent.children.length, 0)
  })

  test(`${name}: a request accessor replacing the session cannot dispatch through its stale player`, async () => {
    const env = vastEnvironment(implementation)
    let context
    const result = await env.factory((value) => {
      context = value
    })(env.host().art)
    context.playUrl('/stale.xml', { get extra() {
      result.destroy()
      context.init()
      return 1
    } })
    assert.equal(env.state.players.length, 2)
    assert.equal(env.state.players[0].requests.length, 0)
    assert.equal(env.state.players[1].requests.length, 0)
    context.playUrl('/fresh.xml')
    assert.equal(env.state.players[1].requests[0].adTagUrl, '/fresh.xml')
  })

  test(`${name}: destruction reentered from SDK construction or subscription reclaims late resources`, async () => {
    for (const hook of ['onConstruct', 'onListen']) {
      const env = vastEnvironment(implementation)
      const host = env.host()
      let context
      await env.factory((value) => {
        context = value
      })(host.art)
      env.state[hook] = () => host.art.destroy()
      assert.equal(context.init(), null)
      assert.equal(env.state.players[0].destroyCalls, 1)
      assert.equal(host.parent.children.length, 0)
      assert.equal(context.imaPlayer, null)
    }
  })

  test(`${name}: SDK destroy reentrancy cannot create a replacement until cleanup finishes`, async () => {
    const env = vastEnvironment(implementation)
    let context
    const result = await env.factory((value) => {
      context = value
    })(env.host().art)
    context.init()
    env.state.onDestroy = () => {
      assert.equal(context.init(), null)
      context.playUrl('/during-cleanup.xml')
    }
    result.destroy()
    assert.equal(env.state.players.length, 1)
    env.state.onDestroy = null
    context.playUrl('/after-cleanup.xml')
    assert.equal(env.state.players.length, 2)
    assert.equal(context.imaPlayer.requests.length, 1)
  })
}
