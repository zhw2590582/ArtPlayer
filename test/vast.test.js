import assert from 'node:assert/strict'
// eslint-disable-next-line test/no-import-node-test -- The external SDK boundary is explicitly controlled.
import test from 'node:test'
import { deferred, vastEnvironment, vastImplementations } from './helpers/vast.js'

const implementations = await vastImplementations()

for (const implementation of implementations) {
  const { name, published } = implementation
  test(`${name}: SDK resolution precedes callback and result waits for callback completion`, async () => {
    const env = vastEnvironment(implementation, { deferLoad: true })
    const host = env.host()
    const started = deferred()
    const finish = deferred()
    let calls = 0
    let settled = false
    const attaching = env.factory(async (context) => {
      calls++
      started.resolve(context)
      await finish.promise
    })(host.art)
    attaching.then(() => {
      settled = true
    })
    assert.equal(env.state.loads, 1)
    assert.equal(calls, 0)
    assert.equal(host.parent.children.length, 0)
    env.resolveLoad()
    const context = await started.promise
    assert.equal(context.art, host.art)
    assert.equal(context.ima, env.ima)
    assert.equal(settled, false)
    finish.resolve()
    assert.equal((await attaching).name, 'artplayerPluginVast')
    assert.equal(calls, 1)
  })

  test(`${name}: SDK rejection propagates unchanged and does not invoke callback or allocate DOM`, async () => {
    const env = vastEnvironment(implementation, { deferLoad: true })
    const host = env.host()
    let calls = 0
    const attaching = env.factory(() => calls++)(host.art)
    const failure = new Error('SDK unavailable')
    const rejected = assert.rejects(attaching, error => error === failure)
    env.rejectLoad(failure)
    await rejected
    assert.equal(calls, 0)
    assert.equal(env.state.players.length, 0)
    assert.equal(host.parent.children.length, 0)
  })

  test(`${name}: absent callback remains accepted at runtime`, async () => {
    const env = vastEnvironment(implementation)
    const result = await env.factory()(env.host().art)
    assert.equal(result.name, 'artplayerPluginVast')
  })

  test(`${name}: playUrl and playRes preserve request content and return void`, async () => {
    const env = vastEnvironment(implementation)
    let context
    await env.factory((value) => {
      context = value
    })(env.host().art)
    assert.equal(context.playUrl('https://example.test/ad.xml'), undefined)
    assert.equal(context.playRes('<VAST version="3.0"/>'), undefined)
    const [player] = env.state.players
    assert.equal(player.requests[0].adTagUrl, 'https://example.test/ad.xml')
    assert.equal(player.requests[1].adsResponse, '<VAST version="3.0"/>')
    assert.equal(player.requests[0] instanceof env.ima.AdsRequest, true)
    assert.notEqual(player.requests[0], player.requests[1])
  })

  test(`${name}: one attach factory creates independent contexts, players and requests`, async () => {
    const env = vastEnvironment(implementation)
    const contexts = []
    const attach = env.factory(context => contexts.push(context))
    const one = env.host()
    const two = env.host()
    await Promise.all([attach(one.art), attach(two.art)])
    contexts[0].playUrl('/first.xml')
    contexts[1].playRes('<VAST/>')
    assert.notEqual(contexts[0], contexts[1])
    assert.equal(env.state.players.length, 2)
    assert.equal(env.state.players[0].args[1], one.art.template.$video)
    assert.equal(env.state.players[1].args[1], two.art.template.$video)
    assert.equal(env.state.players[0].requests.length, 1)
    assert.equal(env.state.players[1].requests.length, 1)
  })

  test(`${name}: playAds exceptions remain synchronous and are not converted to silent success`, async () => {
    const failure = new Error('request failure')
    const env = vastEnvironment(implementation, { playError: failure })
    let context
    await env.factory((value) => {
      context = value
    })(env.host().art)
    assert.throws(() => context.playUrl('/ad.xml'), error => error === failure)
    env.state.playError = null
    context.playUrl('/retry.xml')
    assert.equal(env.state.players[0].requests[0].adTagUrl, '/retry.xml')
  })

  test(`${name}: callback throws and rejected promises propagate their original value`, async () => {
    for (const asynchronous of [false, true]) {
      const env = vastEnvironment(implementation)
      const failure = new Error('callback failure')
      const attaching = env.factory(() => {
        if (asynchronous)
          return Promise.reject(failure)
        throw failure
      })(env.host().art)
      await assert.rejects(attaching, error => error === failure)
    }
  })

  if (published)
    continue

  test(`${name}: lazy init is idempotent and settings identities reach the Player constructor`, async () => {
    const env = vastEnvironment(implementation)
    const host = env.host()
    let context
    await env.factory((value) => {
      context = value
    })(host.art)
    assert.equal(context.imaPlayer, null)
    assert.equal(context.container, null)
    context.playerOptions.custom = 'caller option'
    context.adsRenderingSettings.enablePreloading = false
    const player = context.init()
    assert.equal(context.init(), player)
    assert.equal(context.imaPlayer, player)
    assert.equal(context.container, player.args[2])
    assert.equal(player.args[3], context.adsRenderingSettings)
    assert.equal(player.args[4], context.playerOptions)
    assert.equal(player.args[3].enablePreloading, false)
    assert.equal(host.parent.children.length, 1)
  })

  test(`${name}: request config is read live with own and inherited fields and primary overrides`, async () => {
    const env = vastEnvironment(implementation)
    let context
    await env.factory((value) => {
      context = value
    })(env.host().art)
    const config = Object.assign(Object.create({ inherited: 'legacy field' }), { adTagUrl: '/override.xml', adsResponse: 'override response' })
    context.playUrl('/ignored.xml', config)
    config.adTagUrl = '/changed.xml'
    context.playRes('ignored response', config)
    const [player] = env.state.players
    assert.equal(player.requests[0].adTagUrl, '/override.xml')
    assert.equal(player.requests[1].adTagUrl, '/changed.xml')
    assert.equal(player.requests[1].adsResponse, 'override response')
    assert.equal(player.requests[0].inherited, 'legacy field')
  })

  test(`${name}: four SDK events update visibility and duplicate ad requests are suppressed only while active`, async () => {
    const env = vastEnvironment(implementation)
    let context
    await env.factory((value) => {
      context = value
    })(env.host().art)
    context.playUrl('/first.xml')
    const player = context.imaPlayer
    assert.equal(context.container.style.display, 'none')
    player.emit('AdContentPauseRequested')
    assert.equal(context.container.style.display, 'block')
    context.playUrl('/suppressed.xml')
    context.playRes('suppressed')
    assert.equal(player.requests.length, 1)
    player.emit('AdContentResumeRequested')
    assert.equal(context.container.style.display, 'none')
    context.playUrl('/second.xml')
    player.emit('AdStarted')
    assert.equal(context.container.style.display, 'block')
    const detail = { errorCode: 301 }
    player.emit('AdError', detail)
    assert.equal(context.container.style.display, 'none')
    assert.equal(env.state.errors[0][1], detail)
    context.playUrl('/after-error.xml')
    assert.equal(player.requests.length, 3)
  })

  test(`${name}: explicit destroy is repeatable and permits a new inactive ad session`, async () => {
    const env = vastEnvironment(implementation)
    const host = env.host()
    let context
    const result = await env.factory((value) => {
      context = value
    })(host.art)
    const first = context.init()
    assert.equal(result.destroy(), undefined)
    result.destroy()
    assert.equal(first.destroyCalls, 1)
    assert.equal(context.imaPlayer, null)
    assert.equal(context.container, null)
    assert.equal(host.parent.children.length, 0)
    context.playUrl('/next.xml')
    assert.equal(env.state.players.length, 2)
    assert.equal(context.imaPlayer.requests[0].adTagUrl, '/next.xml')
  })
}

// Historical observations, never candidate acceptance requirements.
for (const implementation of implementations.filter(item => item.historical)) {
  const { name, published } = implementation
  const initialize = context => context.init?.() || context.imaPlayer
  test(`${name} historical: core destroy leaves the SDK allocated`, async () => {
    const env = vastEnvironment(implementation)
    const host = env.host()
    await env.factory(context => initialize(context))(host.art)
    const [player] = env.state.players
    host.art.destroy()
    assert.equal(player.destroyCalls, 0)
    assert.equal(host.parent.children.length, 1)
  })

  test(`${name} historical: SDK resolution after core destruction still invokes callback and allocates`, async () => {
    const env = vastEnvironment(implementation, { deferLoad: true })
    const host = env.host()
    let calls = 0
    const attaching = env.factory((context) => {
      calls++
      initialize(context)
    })(host.art)
    host.art.destroy()
    env.resolveLoad()
    await attaching
    assert.equal(calls, 1)
    assert.equal(env.state.players.length, 1)
    assert.equal(env.state.players[0].destroyCalls, 0)
  })

  test(`${name} historical: rejected callback leaks its already allocated SDK/container`, async () => {
    const env = vastEnvironment(implementation)
    const host = env.host()
    const failure = new Error('after allocation')
    await assert.rejects(env.factory((context) => {
      initialize(context)
      return Promise.reject(failure)
    })(host.art), error => error === failure)
    assert.equal(env.state.players[0].destroyCalls, 0)
    assert.equal(host.parent.children.length, 1)
  })

  test(`${name} historical: callback resumed after core destroy creates or reuses stale resources`, async () => {
    const env = vastEnvironment(implementation)
    const host = env.host()
    const started = deferred()
    const finish = deferred()
    const attaching = env.factory(async (context) => {
      started.resolve()
      await finish.promise
      context.playUrl('/late.xml')
    })(host.art)
    await started.promise
    host.art.destroy()
    finish.resolve()
    await attaching
    assert.equal(env.state.players[0].requests[0].adTagUrl, '/late.xml')
    assert.equal(env.state.players[0].destroyCalls, 0)
  })

  test(`${name} historical: SDK constructor failure leaves an attached container`, async () => {
    const failure = new Error('constructor failure')
    const env = vastEnvironment(implementation, { constructError: failure })
    const host = env.host()
    await assert.rejects(env.factory(context => initialize(context))(host.art), error => error === failure)
    assert.equal(host.parent.children.length, 1)
    assert.equal(env.state.players.length, 0)
  })

  test(`${name} historical: simultaneous instances generate duplicate container IDs`, async () => {
    const env = vastEnvironment(implementation)
    const one = env.host()
    const two = env.host()
    const attach = env.factory(context => initialize(context))
    await Promise.all([attach(one.art), attach(two.art)])
    assert.equal(one.parent.children[0].id, two.parent.children[0].id)
    assert.notEqual(one.parent.children[0], two.parent.children[0])
  })

  if (published)
    continue

  test(`${name} historical: active-ad destroy keeps the request suppression flag stuck`, async () => {
    const env = vastEnvironment(implementation)
    let context
    const result = await env.factory((value) => {
      context = value
    })(env.host().art)
    context.playUrl('/first.xml')
    context.imaPlayer.emit('AdStarted')
    result.destroy()
    context.playUrl('/second.xml')
    assert.equal(context.imaPlayer, null)
    assert.equal(env.state.players.length, 1)
  })

  test(`${name} historical: stale SDK callbacks throw after explicit destroy and corrupt a replacement`, async () => {
    const env = vastEnvironment(implementation)
    let context
    const result = await env.factory((value) => {
      context = value
    })(env.host().art)
    const first = context.init()
    const lateStart = [...first.listeners.get('AdStarted')][0]
    result.destroy()
    assert.throws(() => lateStart({}), /null/)
    const replacement = context.init()
    lateStart({})
    assert.equal(context.container.style.display, 'block')
    context.playUrl('/blocked-by-stale-event.xml')
    assert.equal(replacement.requests.length, 0)
  })

  test(`${name} historical: SDK destroy exception prevents DOM and reference cleanup`, async () => {
    const failure = new Error('destroy failure')
    const env = vastEnvironment(implementation, { destroyError: failure })
    const host = env.host()
    let context
    const result = await env.factory((value) => {
      context = value
    })(host.art)
    const player = context.init()
    assert.throws(() => result.destroy(), error => error === failure)
    assert.equal(context.imaPlayer, player)
    assert.equal(host.parent.children.length, 1)
  })

  test(`${name} historical: event registration failure leaves a partial SDK that init treats as ready`, async () => {
    const failure = new Error('listener failure')
    const env = vastEnvironment(implementation, { listenError: failure })
    const host = env.host()
    let context
    await env.factory((value) => {
      context = value
    })(host.art)
    assert.throws(() => context.init(), error => error === failure)
    env.state.listenError = null
    const player = context.init()
    assert.equal(player.listeners.size, 0)
    assert.equal(host.parent.children.length, 1)
  })
}
