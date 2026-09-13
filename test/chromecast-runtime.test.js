import assert from 'node:assert/strict'
import { Buffer } from 'node:buffer'
import fs from 'node:fs'
import process from 'node:process'
// eslint-disable-next-line test/no-import-node-test -- Candidate SDK behavior uses the repository runner.
import test from 'node:test'
import { setImmediate as nextTurn } from 'node:timers/promises'
import { pathToFileURL } from 'node:url'
import { chromecastEnvironment } from './helpers/chromecast.js'
import { compilePackage } from './helpers/load.js'

const artifact = process.env.ARTPLAYER_CHROMECAST_ARTIFACT
const implementation = { code: artifact ? fs.readFileSync(artifact, 'utf8') : await compilePackage('artplayer-plugin-chromecast', 'umd') }

function environment(options) {
  const env = chromecastEnvironment(implementation, options)
  const timers = new Map()
  let next = 0
  env.context.setTimeout = (callback, delay) => {
    const id = ++next
    timers.set(id, { callback, delay })
    return id
  }
  env.context.clearTimeout = id => timers.delete(id)
  return { ...env, timers, player(...args) {
    const player = env.player(...args)
    const add = player.art.controls.add
    player.art.controls.add = (option) => {
      const element = add(option)
      option.mounted?.call(player.art, element)
      // The actual Control.add override has no return, unlike Component.add.
      return undefined
    }
    return player
  } }
}

function deferred() {
  let resolve
  let reject
  const promise = new Promise((yes, no) => {
    resolve = yes
    reject = no
  })
  return { promise, resolve, reject }
}

for (const script of [false, true]) {
  test(`Chromecast candidate ${script ? 'global' : 'CJS'}: lazy async registration and custom DOM contract`, async () => {
    const env = environment({ script })
    assert.equal(env.factory.default, env.factory)
    const player = env.player()
    const register = env.factory({ icon: '<b>custom</b>' })
    assert.equal(player.controls.length, 0)
    const pending = register(player.art)
    assert.equal(typeof pending.then, 'function')
    assert.equal(player.controls.length, 1)
    const plugin = await pending
    assert.deepEqual(Object.keys(plugin), ['name', 'getCastState', 'isCasting'])
    assert.equal(plugin.name, 'artplayerPluginChromecast')
    assert.equal(plugin.getCastState(), null)
    assert.equal(plugin.isCasting(), false)
    assert.equal(player.controls[0].name, 'chromecast')
    assert.equal(player.controls[0].position, 'right')
    assert.equal(player.controls[0].tooltip, 'Chromecast')
    assert.equal(player.controls[0].html, '<i class="art-icon art-icon-cast"><b>custom</b></i>')
    assert.equal(env.scripts.length, 0)
    assert.equal(env.timers.size, 0)
    player.destroy()
  })
}

test('Chromecast candidate: native ESM default and historical factory default alias retain identity', async () => {
  const esmArtifact = process.env.ARTPLAYER_CHROMECAST_ESM_ARTIFACT
  const namespace = esmArtifact
    ? await import(pathToFileURL(esmArtifact))
    : await import(`data:text/javascript;base64,${Buffer.from(await compilePackage('artplayer-plugin-chromecast', 'es')).toString('base64')}`)
  assert.equal(typeof namespace.default, 'function')
  assert.equal(namespace.default.default, namespace.default)
  assert.equal(Object.getOwnPropertyDescriptor(namespace.default, 'default').writable, true)
  assert.equal(typeof namespace.default({}), 'function')
})

test('Chromecast candidate: existing complete SDK immediately installs listeners without loading another script', async () => {
  const env = environment()
  env.installSdk()
  const player = env.player()
  const plugin = await env.factory({})(player.art)
  const pending = player.controls[0].click()
  env.sessionState('SESSION_STARTED')
  assert.equal(plugin.getCastState(), 'SESSION_STARTED')
  assert.equal(player.icon.style.color, 'red')
  await pending
  assert.equal(env.scripts.length, 0)
  assert.equal(env.sdkOptions.length, 1)
  assert.equal(env.requests(), 0)
  assert.equal(env.mediaLoads.length, 1)
  assert.equal(player.art.notice.show, 'Casting started')
  player.destroy()
})

test('Chromecast candidate: availability synchronously installs listeners and preserves live callbacks and callback this', async () => {
  const env = environment()
  const player = env.player('/movie.M3U8?token=one#position')
  const events = []
  const option = { sdk: '/sender.js', onStateChange(state) {
    assert.equal(this, option)
    events.push([state, player.icon.style.color])
  }, onCastStart() { assert.equal(this, option) } }
  const plugin = await env.factory(option)(player.art)
  const pending = player.controls[0].click()
  assert.equal(env.scripts[0].src, '/sender.js')
  env.installSdk()
  env.context.__onGCastApiAvailable(true)
  env.sessionState('SESSION_STARTED')
  assert.equal(plugin.getCastState(), 'SESSION_STARTED')
  assert.deepEqual(events, [['connected', undefined]])
  assert.equal(player.icon.style.color, 'red')
  await pending
  assert.equal(env.mediaLoads[0].media.contentType, 'application/x-mpegURL')
  assert.equal(env.timers.size, 0)
  player.art.option.url = '/changed.webm'
  option.onCastStart = function () {
    assert.equal(this, option)
    events.push(['live'])
  }
  await player.controls[0].click()
  assert.equal(env.mediaLoads[1].media.contentId, '/changed.webm')
  option.url = '/override'
  option.mimeType = 'application/custom'
  await player.controls[0].click()
  assert.equal(env.mediaLoads[2].media.contentId, '/override')
  assert.equal(env.mediaLoads[2].media.contentType, 'application/custom')
  assert.deepEqual(events.slice(-2), [['live'], ['live']])
  player.destroy()
})

test('Chromecast candidate: concurrent loading deduplicates scripts, preserves prior handler, and isolates uninitialized factory instances', async () => {
  const env = environment()
  const calls = []
  function prior(...args) {
    calls.push(args)
  }
  env.context.__onGCastApiAvailable = prior
  const register = env.factory({ sdk: '/first.js' })
  const first = env.player()
  const second = env.player()
  const idle = env.player()
  const firstPlugin = await register(first.art)
  const secondPlugin = await register(second.art)
  const idlePlugin = await register(idle.art)
  const one = first.controls[0].click()
  const two = second.controls[0].click()
  assert.equal(env.scripts.length, 1)
  env.installSdk()
  env.context.__onGCastApiAvailable(true, 'ready')
  env.sessionState('SESSION_STARTED')
  await Promise.all([one, two])
  assert.deepEqual(calls, [[true, 'ready']])
  assert.equal(env.context.__onGCastApiAvailable, prior)
  assert.equal(env.sdkOptions.length, 1)
  assert.equal(firstPlugin.isCasting(), true)
  assert.equal(secondPlugin.isCasting(), true)
  assert.equal(first.icon.style.color, 'red')
  assert.equal(second.icon.style.color, 'red')
  assert.equal(idle.icon.style.color, undefined)
  assert.equal(idlePlugin.isCasting(), false)
  assert.equal(idlePlugin.getCastState(), null)
  first.destroy()
  assert.equal(env.sdkListeners.get('sessionstatechanged').length, 1)
  env.sessionState('SESSION_ENDED', null)
  assert.equal(second.icon.style.color, 'white')
  assert.equal(first.icon.style.color, 'red')
  second.destroy()
  idle.destroy()
})

test('Chromecast candidate: successful undefined requestSession completion resolves current session and concurrent clicks share one operation', async () => {
  const env = environment()
  const { castContext, session } = env.installSdk()
  const requested = deferred()
  let current = null
  let requests = 0
  castContext.getCurrentSession = () => current
  castContext.requestSession = () => {
    requests++
    return requested.promise
  }
  const player = env.player()
  await env.factory({})(player.art)
  const one = player.controls[0].click()
  const two = player.controls[0].click()
  assert.equal(one, two)
  await env.flush()
  assert.equal(requests, 1)
  current = session
  requested.resolve(undefined)
  await one
  assert.equal(env.mediaLoads.length, 1)
  player.destroy()
})

for (const mode of ['missing-session', 'request-reject', 'media-reject', 'configure-throw']) {
  test(`Chromecast candidate: ${mode} settles click with one original error callback and stage notice`, async () => {
    const env = environment()
    const error = new Error(mode)
    const { castContext } = env.installSdk(mode === 'media-reject' ? { loadError: error } : {})
    if (mode === 'configure-throw')
      castContext.setOptions = () => { throw error }
    if (mode === 'missing-session' || mode === 'request-reject') {
      castContext.getCurrentSession = () => null
      if (mode === 'request-reject')
        castContext.requestSession = () => Promise.reject(error)
    }
    const errors = []
    const option = { onError(value) {
      assert.equal(this, option)
      errors.push(value)
    } }
    const player = env.player()
    await env.factory(option)(player.art)
    await assert.rejects(player.controls[0].click(), value => mode === 'missing-session' ? value.message === 'No active Cast session' : value === error)
    assert.equal(errors.length, 1)
    assert.equal(player.art.notice.show, mode === 'media-reject' ? 'Error casting media' : mode === 'configure-throw' ? 'Failed to initialize Cast API' : 'Error connecting to cast session')
    if (mode !== 'media-reject')
      assert.equal(env.mediaLoads.length, 0)
    player.destroy()
  })
}

test('Chromecast candidate: configure errors inside availability do not escape global callback and permit retry', async () => {
  const env = environment()
  const player = env.player()
  await env.factory({})(player.art)
  const pending = player.controls[0].click()
  const { castContext } = env.installSdk()
  const original = castContext.setOptions
  const error = new Error('configuration')
  castContext.setOptions = () => {
    throw error
  }
  assert.doesNotThrow(() => env.context.__onGCastApiAvailable(true))
  await assert.rejects(pending, value => value === error)
  castContext.setOptions = original
  await player.controls[0].click()
  assert.equal(env.mediaLoads.length, 1)
  assert.equal(env.sdkListeners.get('sessionstatechanged').length, 1)
  player.destroy()
})

for (const mode of ['script-error', 'unavailable', 'timeout']) {
  test(`Chromecast candidate: ${mode} restores external callback, removes failed script and permits retry`, async () => {
    const env = environment()
    function prior() {}
    env.context.__onGCastApiAvailable = prior
    const player = env.player()
    const errors = []
    await env.factory({ onError: value => errors.push(value) })(player.art)
    const pending = player.controls[0].click()
    const script = env.scripts[0]
    const original = { type: 'error' }
    if (mode === 'script-error') {
      script.onerror(original)
    }
    else if (mode === 'unavailable') {
      env.context.__onGCastApiAvailable(false)
    }
    else {
      script.onload()
      const timer = [...env.timers.values()][0]
      assert.equal(timer.delay, 30000)
      timer.callback()
    }
    await assert.rejects(pending, value => mode === 'script-error' ? value === original : value.message.includes(mode === 'timeout' ? 'Timed out' : 'not available'))
    assert.equal(errors.length, 1)
    assert.equal(env.context.__onGCastApiAvailable, prior)
    assert.equal(env.scripts.length, 0)
    assert.equal(env.timers.size, 0)
    const retry = player.controls[0].click()
    assert.equal(env.scripts.length, 1)
    env.installSdk()
    env.context.__onGCastApiAvailable(true)
    await retry
    assert.equal(env.mediaLoads.length, 1)
    player.destroy()
  })
}

test('Chromecast candidate: asynchronous framework can become ready after script load and the last owner cancels unfinished loading', async () => {
  const env = environment()
  const first = env.player()
  const second = env.player()
  await env.factory({})(first.art)
  await env.factory({ sdk: '/different.js' })(second.art)
  const one = first.controls[0].click()
  const two = second.controls[0].click()
  assert.equal(env.scripts.length, 1)
  assert.match(env.scripts[0].src, /gstatic/)
  env.scripts[0].onload()
  assert.equal(env.timers.size, 1)
  first.destroy()
  await one
  assert.equal(env.scripts.length, 1)
  second.destroy()
  await two
  assert.equal(env.scripts.length, 0)
  assert.equal(env.timers.size, 0)
  assert.equal(env.context.__onGCastApiAvailable, undefined)
  assert.equal(env.mediaLoads.length, 0)
})

test('Chromecast candidate: one destroyed loader subscriber does not strand remaining subscriber', async () => {
  const env = environment()
  const first = env.player()
  const second = env.player()
  await env.factory({})(first.art)
  await env.factory({})(second.art)
  const one = first.controls[0].click()
  const two = second.controls[0].click()
  first.destroy()
  await one
  env.installSdk()
  env.context.__onGCastApiAvailable(true)
  await two
  assert.equal(env.mediaLoads.length, 1)
  assert.equal(env.sdkListeners.get('sessionstatechanged').length, 1)
  assert.equal(first.art.notice.show, '')
  second.destroy()
})

test('Chromecast candidate: an external callback exception preserves external semantics without stranding plugin initialization', async () => {
  const env = environment()
  const error = new Error('external')
  env.context.__onGCastApiAvailable = () => {
    throw error
  }
  const player = env.player()
  await env.factory({})(player.art)
  const pending = player.controls[0].click()
  env.installSdk()
  assert.throws(() => env.context.__onGCastApiAvailable(true), value => value === error)
  await pending
  assert.equal(env.mediaLoads.length, 1)
  player.destroy()
})

test('Chromecast candidate: external handler replacement during loading is not overwritten on cleanup', async () => {
  const env = environment()
  const player = env.player()
  await env.factory({})(player.art)
  const pending = player.controls[0].click()
  const own = env.context.__onGCastApiAvailable
  function replacement() {}
  env.context.__onGCastApiAvailable = replacement
  env.installSdk()
  own(true)
  await pending
  assert.equal(env.context.__onGCastApiAvailable, replacement)
  player.destroy()
})

for (const terminal of ['NO_SESSION', 'SESSION_ENDING', 'SESSION_ENDED', 'SESSION_START_FAILED']) {
  test(`Chromecast candidate: ${terminal} cancels an in-flight session request and cannot revive casting`, async () => {
    const env = environment()
    const { castContext, session } = env.installSdk()
    env.context.cast.framework.SessionState.SESSION_START_FAILED = 'SESSION_START_FAILED'
    let current = null
    const request = deferred()
    castContext.getCurrentSession = () => current
    castContext.requestSession = () => request.promise
    const player = env.player()
    const calls = []
    const plugin = await env.factory({ onStateChange: state => calls.push(state), onCastStart: () => calls.push('start') })(player.art)
    const pending = player.controls[0].click()
    await env.flush()
    env.sessionState(terminal, null)
    await pending
    current = session
    request.resolve(undefined)
    await env.flush()
    assert.equal(env.mediaLoads.length, 0)
    assert.equal(plugin.getCastState(), terminal)
    assert.equal(plugin.isCasting(), false)
    assert.deepEqual(calls, [terminal === 'SESSION_ENDING' ? 'disconnecting' : 'disconnected'])
    assert.equal(player.icon.style.color, terminal === 'SESSION_ENDING' ? 'orange' : 'white')
    player.destroy()
  })
}

for (const action of ['destroy', 'ended', 'replacement']) {
  test(`Chromecast candidate: ${action} during media load suppresses obsolete success and consumes late rejection`, async () => {
    const env = environment()
    const { session, castContext } = env.installSdk()
    const media = deferred()
    session.loadMedia = () => media.promise
    const calls = []
    const player = env.player()
    const plugin = await env.factory({ onCastStart: () => calls.push('start'), onError: () => calls.push('error') })(player.art)
    const pending = player.controls[0].click()
    await env.flush()
    assert.equal(plugin.isCasting(), true)
    if (action === 'destroy') {
      player.destroy()
    }
    else if (action === 'ended') {
      env.sessionState('SESSION_ENDED', null)
    }
    else {
      const other = { loadMedia: () => Promise.resolve() }
      castContext.getCurrentSession = () => other
      env.sessionState('SESSION_RESUMED', other)
    }
    await pending
    media.reject(new Error('obsolete'))
    await env.flush()
    assert.deepEqual(calls, [])
    assert.equal(player.art.notice.show, '')
    if (action === 'destroy') {
      assert.equal(env.sdkListeners.get('sessionstatechanged').length, 0)
      assert.equal(env.sdkListeners.get('caststatechanged').length, 0)
      assert.equal(player.listeners.get('destroy').length, 0)
    }
    player.destroy()
  })
}

test('Chromecast candidate: reentrant destruction while reading current session never invokes media load', async () => {
  const env = environment()
  const { castContext, session } = env.installSdk()
  const player = env.player()
  await env.factory({})(player.art)
  castContext.getCurrentSession = () => {
    player.destroy()
    return session
  }
  await player.controls[0].click()
  assert.equal(env.mediaLoads.length, 0)
})

test('Chromecast candidate: availability and every normalized state retain raw session getters and owned callback ordering', async () => {
  const env = environment()
  env.installSdk()
  env.context.cast.framework.SessionState.SESSION_START_FAILED = 'SESSION_START_FAILED'
  const player = env.player()
  const states = []
  const availability = []
  const option = { onStateChange(state) {
    assert.equal(this, option)
    states.push(state)
  }, onCastAvailable(value) {
    assert.equal(this, option)
    availability.push(value)
  } }
  const plugin = await env.factory(option)(player.art)
  await player.controls[0].click()
  for (const state of ['SESSION_STARTING', 'SESSION_STARTED', 'SESSION_RESUMED', 'SESSION_ENDING', 'SESSION_ENDED', 'SESSION_START_FAILED', 'NO_SESSION']) {
    env.sessionState(state)
    assert.equal(plugin.getCastState(), state)
  }
  assert.deepEqual(states, ['connecting', 'connected', 'connected', 'disconnecting', 'disconnected', 'disconnected', 'disconnected'])
  assert.equal(plugin.isCasting(), false)
  for (const castState of ['NO_DEVICES_AVAILABLE', 'NOT_CONNECTED', 'CONNECTING', 'CONNECTED', 'unknown'])
    env.emit('caststatechanged', { castState })
  assert.deepEqual(availability, [false, true, true, true])
  player.destroy()
})

test('Chromecast candidate: synchronous initial no-session replay preserves casting and the availability subscription', async () => {
  const env = environment()
  const { castContext } = env.installSdk()
  const add = castContext.addEventListener
  castContext.addEventListener = (name, listener) => {
    add(name, listener)
    if (name === 'sessionstatechanged')
      listener({ sessionState: 'NO_SESSION', session: null })
  }
  const values = []
  const player = env.player()
  await env.factory({ onCastAvailable: value => values.push(value) })(player.art)
  await player.controls[0].click()
  assert.equal(env.mediaLoads.length, 1)
  await player.controls[0].click()
  env.emit('caststatechanged', { castState: 'NOT_CONNECTED' })
  assert.deepEqual(values, [true])
  assert.equal(env.sdkListeners.get('sessionstatechanged').length, 1)
  assert.equal(env.sdkListeners.get('caststatechanged').length, 1)
  player.destroy()
})

test('Chromecast candidate: initial NO_SESSION immediately after availability still requests and loads a new session', async () => {
  const env = environment()
  const player = env.player()
  const plugin = await env.factory({})(player.art)
  const pending = player.controls[0].click()
  const { castContext, session } = env.installSdk()
  let current = null
  let requests = 0
  castContext.getCurrentSession = () => current
  castContext.requestSession = () => {
    requests++
    current = session
    return Promise.resolve(undefined)
  }
  env.context.__onGCastApiAvailable(true)
  env.sessionState('NO_SESSION', null)
  await pending
  assert.equal(requests, 1)
  assert.equal(env.mediaLoads.length, 1)
  assert.equal(plugin.getCastState(), 'NO_SESSION', 'Getter remains the raw last SDK event')
  assert.equal(plugin.isCasting(), true)
  player.destroy()
})

test('Chromecast candidate: cleanup attempts all owned listeners and the player subscription after an SDK removal failure', async () => {
  const env = environment()
  const { castContext } = env.installSdk()
  const player = env.player()
  const plugin = await env.factory({})(player.art)
  await player.controls[0].click()
  const remove = castContext.removeEventListener
  const error = new Error('remove session listener')
  const names = []
  castContext.removeEventListener = (name, listener) => {
    names.push(name)
    if (name === 'sessionstatechanged')
      throw error
    remove(name, listener)
  }
  assert.throws(() => player.destroy(), value => value === error)
  assert.deepEqual(names, ['sessionstatechanged', 'caststatechanged'])
  assert.equal(env.sdkListeners.get('caststatechanged').length, 0)
  assert.equal(player.listeners.get('destroy').length, 0)
  assert.equal(plugin.isCasting(), false)
  const state = plugin.getCastState()
  env.sessionState('SESSION_STARTED')
  assert.equal(plugin.getCastState(), state)
  assert.doesNotThrow(() => player.destroy())
})

test('Chromecast candidate: partial subscription failure preserves the setup error and retries complete initialization', async () => {
  const env = environment()
  const { castContext } = env.installSdk()
  const add = castContext.addEventListener
  const remove = castContext.removeEventListener
  const setupError = new Error('add availability')
  const cleanupError = new Error('remove after add failed')
  castContext.addEventListener = (name, listener) => {
    if (name === 'caststatechanged')
      throw setupError
    add(name, listener)
  }
  castContext.removeEventListener = (name, listener) => {
    remove(name, listener)
    if (name === 'sessionstatechanged')
      throw cleanupError
  }
  const errors = []
  const player = env.player()
  await env.factory({ onError: error => errors.push(error) })(player.art)
  await assert.rejects(player.controls[0].click(), value => value === setupError)
  assert.deepEqual(errors, [setupError])
  assert.equal(env.sdkListeners.get('sessionstatechanged').length, 0)
  castContext.addEventListener = add
  castContext.removeEventListener = remove
  await player.controls[0].click()
  assert.equal(env.sdkListeners.get('sessionstatechanged').length, 1)
  assert.equal(env.sdkListeners.get('caststatechanged').length, 1)
  player.destroy()
})

test('Chromecast candidate: ignored DOM-dispatch click rejection is observed internally without duplicate reporting', async () => {
  const env = environment()
  const error = new Error('receiver load failed')
  env.installSdk({ loadError: error })
  const player = env.player()
  const errors = []
  await env.factory({ onError: value => errors.push(value) })(player.art)
  // The core DOM dispatcher calls click and ignores its return value.
  player.controls[0].click()
  await nextTurn()
  assert.deepEqual(errors, [error])
  assert.equal(player.art.notice.show, 'Error casting media')
  await assert.rejects(player.controls[0].click(), value => value === error)
  assert.deepEqual(errors, [error, error])
  player.destroy()
})

test('Chromecast candidate: synchronous user callback reentry shares the guarded click operation', async () => {
  const env = environment()
  const { castContext } = env.installSdk()
  const add = castContext.addEventListener
  castContext.addEventListener = (name, listener) => {
    add(name, listener)
    if (name === 'sessionstatechanged')
      listener({ sessionState: 'NO_SESSION', session: null })
  }
  let reentered
  const player = env.player()
  await env.factory({ onStateChange() {
    if (!reentered)
      reentered = player.controls[0].click()
  } })(player.art)
  const pending = player.controls[0].click()
  assert.equal(reentered, pending)
  await pending
  assert.equal(env.mediaLoads.length, 1)
  assert.equal(env.sdkListeners.get('sessionstatechanged').length, 1)
  player.destroy()
})

test('Chromecast candidate: mounted captures the owned icon when Control.add returns undefined', async () => {
  const env = environment()
  env.installSdk()
  const first = env.player()
  const second = env.player()
  await env.factory({})(first.art)
  await env.factory({})(second.art)
  assert.equal(typeof second.controls[0].mounted, 'function')
  await second.controls[0].click()
  env.sessionState('SESSION_STARTED')
  assert.equal(second.icon.style.color, 'red')
  assert.equal(first.icon.style.color, undefined)
  env.sessionState('SESSION_ENDING')
  assert.equal(second.icon.style.color, 'orange')
  env.sessionState('SESSION_ENDED', null)
  assert.equal(second.icon.style.color, 'white')
  first.destroy()
  second.destroy()
})
