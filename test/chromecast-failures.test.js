import assert from 'node:assert/strict'
// eslint-disable-next-line test/no-import-node-test -- Historical Chromecast defects remain explicit observations.
import test from 'node:test'
import { chromecastEnvironment, chromecastHistorical } from './helpers/chromecast.js'

for (const implementation of await chromecastHistorical()) {
  // Version 1.0 loads during registration and has no query/callback surface.
  // Its distinct public behavior is frozen in chromecast.test.js.
  if (implementation.name.startsWith('published-1.0.0-'))
    continue
  test(`Chromecast ${implementation.name}: available Framework still waits for an availability callback that already happened`, async () => {
    const env = chromecastEnvironment(implementation)
    env.installSdk()
    const player = env.player()
    await env.factory({})(player.art)
    let settled = false
    player.controls[0].click().then(() => {
      settled = true
    }, () => {
      settled = true
    })
    await env.flush()
    assert.equal(settled, false)
    assert.equal(env.scripts.length, 0)
    assert.equal(env.sdkOptions.length, 0)
    assert.equal(typeof env.context.__onGCastApiAvailable, 'function')
  })

  test(`Chromecast ${implementation.name}: successful requestSession completion is incorrectly used as a session`, async () => {
    const env = chromecastEnvironment(implementation)
    const player = env.player()
    const errors = []
    await env.factory({ onError: error => errors.push(error) })(player.art)
    const pending = player.controls[0].click()
    env.installSdk({ requestResult: undefined })
    env.context.__onGCastApiAvailable(true)
    await assert.rejects(pending, error => error.name === 'TypeError' && error.message.includes('loadMedia'))
    assert.equal(env.requests(), 1)
    assert.equal(env.mediaLoads.length, 0)
    assert.equal(errors.length, 1)
    assert.equal(player.art.notice.show, 'Error connecting to cast session')
  })

  test(`Chromecast ${implementation.name}: concurrent instances overwrite availability and strand the first click`, async () => {
    const env = chromecastEnvironment(implementation)
    const first = env.player()
    const second = env.player()
    await env.factory({})(first.art)
    await env.factory({})(second.art)
    let firstSettled = false
    first.controls[0].click().then(() => {
      firstSettled = true
    }, () => {
      firstSettled = true
    })
    const firstHandler = env.context.__onGCastApiAvailable
    const next = second.controls[0].click()
    assert.notEqual(env.context.__onGCastApiAvailable, firstHandler)
    assert.equal(env.scripts.length, 2)
    env.installSdk()
    env.context.__onGCastApiAvailable(true)
    env.sessionState('SESSION_STARTED')
    await next
    await env.flush()
    assert.equal(firstSettled, false)
    assert.equal(first.icon.style.color, 'red', 'Second instance modifies the first global icon')
    assert.equal(second.icon.style.color, undefined)
  })

  test(`Chromecast ${implementation.name}: reusing one factory shares session state across players`, async () => {
    const env = chromecastEnvironment(implementation)
    const first = env.player()
    const second = env.player()
    const register = env.factory({})
    const a = await register(first.art)
    const b = await register(second.art)
    const pending = second.controls[0].click()
    env.installSdk()
    env.context.__onGCastApiAvailable(true)
    env.sessionState('SESSION_STARTED')
    await pending
    assert.equal(a.getCastState(), 'SESSION_STARTED')
    assert.equal(a.isCasting(), true)
    assert.equal(b.isCasting(), true)
    assert.equal(first.icon.style.color, 'red')
    assert.equal(second.icon.style.color, undefined)
  })

  test(`Chromecast ${implementation.name}: ended state changes the raw getter but leaves callback and icon connected`, async () => {
    const env = chromecastEnvironment(implementation)
    const player = env.player()
    const states = []
    const plugin = await env.factory({ onStateChange: value => states.push(value) })(player.art)
    const pending = player.controls[0].click()
    env.installSdk()
    env.context.__onGCastApiAvailable(true)
    env.sessionState('SESSION_STARTED')
    await pending
    env.sessionState('SESSION_ENDED', null)
    assert.equal(plugin.getCastState(), 'SESSION_ENDED')
    assert.equal(plugin.isCasting(), false)
    assert.deepEqual(states, ['connected'])
    assert.equal(player.icon.style.color, 'red')
  })

  test(`Chromecast ${implementation.name}: media rejection is detached from the fulfilled click promise`, async () => {
    const env = chromecastEnvironment(implementation)
    const player = env.player()
    const error = new Error('receiver rejected media')
    const errors = []
    await env.factory({ onError: value => errors.push(value) })(player.art)
    const pending = player.controls[0].click()
    env.installSdk({ loadError: error })
    env.context.__onGCastApiAvailable(true)
    env.sessionState('SESSION_STARTED')
    assert.equal(await pending, undefined)
    await env.flush()
    await assert.rejects(env.pendingMedia.at(-1), value => value === error)
    assert.deepEqual(errors, [error])
    assert.equal(player.art.notice.show, 'Error casting media')
  })

  test(`Chromecast ${implementation.name}: destroy leaves SDK listeners and callbacks active`, async () => {
    const env = chromecastEnvironment(implementation)
    const player = env.player()
    const availability = []
    await env.factory({ onCastAvailable: value => availability.push(value) })(player.art)
    const pending = player.controls[0].click()
    env.installSdk()
    env.context.__onGCastApiAvailable(true)
    env.sessionState('SESSION_STARTED')
    await pending
    player.destroy()
    env.emit('caststatechanged', { castState: 'NO_DEVICES_AVAILABLE' })
    assert.deepEqual(availability, [false])
    assert.equal(player.listeners.size, 0)
    assert.equal(env.sdkListeners.get('sessionstatechanged').length, 1)
    assert.equal(env.sdkListeners.get('caststatechanged').length, 1)
  })

  test(`Chromecast ${implementation.name}: exception inside availability escapes without settling initialization`, async () => {
    const env = chromecastEnvironment(implementation)
    const player = env.player()
    await env.factory({})(player.art)
    let settled = false
    player.controls[0].click().then(() => {
      settled = true
    }, () => {
      settled = true
    })
    const error = new Error('CastOptions failed')
    const { castContext } = env.installSdk()
    castContext.setOptions = () => {
      throw error
    }
    assert.throws(() => env.context.__onGCastApiAvailable(true), value => value === error)
    await env.flush()
    assert.equal(settled, false)
  })

  test(`Chromecast ${implementation.name}: unavailable API rejects with one original callback error`, async () => {
    const env = chromecastEnvironment(implementation)
    const player = env.player()
    const errors = []
    const option = { onError(error) {
      errors.push({ error, receiver: this })
    } }
    await env.factory(option)(player.art)
    const pending = player.controls[0].click()
    env.context.__onGCastApiAvailable(false)
    await assert.rejects(pending, error => error.message === 'Cast API is not available' && error === errors[0].error)
    assert.equal(errors.length, 1)
    assert.equal(errors[0].receiver, option)
    assert.equal(env.scripts.length, 1, 'The failed loader retains its script')
  })

  test(`Chromecast ${implementation.name}: session request rejection preserves original error and notice`, async () => {
    const env = chromecastEnvironment(implementation)
    const player = env.player()
    const error = new Error('User declined the session')
    const errors = []
    await env.factory({ onError: value => errors.push(value) })(player.art)
    const pending = player.controls[0].click()
    env.installSdk({ requestError: error })
    env.context.__onGCastApiAvailable(true)
    await assert.rejects(pending, value => value === error)
    assert.deepEqual(errors, [error])
    assert.equal(env.requests(), 1)
    assert.equal(env.mediaLoads.length, 0)
    assert.equal(player.art.notice.show, 'Error connecting to cast session')
  })

  test(`Chromecast ${implementation.name}: current player source and live callback receiver are used on subsequent casting`, async () => {
    const env = chromecastEnvironment(implementation)
    const player = env.player('/first.mp4')
    const calls = []
    const option = { onCastStart() {
      calls.push(this)
    } }
    await env.factory(option)(player.art)
    const pending = player.controls[0].click()
    env.installSdk()
    env.context.__onGCastApiAvailable(true)
    env.sessionState('SESSION_STARTED')
    await pending
    await env.flush()
    player.art.option.url = '/next.webm'
    option.onCastStart = function () {
      calls.push(['replacement', this])
    }
    await player.controls[0].click()
    await env.flush()
    assert.equal(env.mediaLoads.at(-1).media.contentId, '/next.webm')
    assert.equal(env.mediaLoads.at(-1).media.contentType, 'video/webm')
    assert.equal(calls[0], option)
    assert.equal(calls[1][0], 'replacement')
    assert.equal(calls[1][1], option)
  })

  test(`Chromecast ${implementation.name}: failed script retry retains old script and replaces the global callback`, async () => {
    const env = chromecastEnvironment(implementation)
    const player = env.player()
    await env.factory({})(player.art)
    const first = player.controls[0].click()
    const previous = env.context.__onGCastApiAvailable
    const error = new Error('script failed')
    env.scripts[0].onerror(error)
    await assert.rejects(first, value => value === error)
    const second = player.controls[0].click()
    assert.equal(env.scripts.length, 2)
    assert.notEqual(env.context.__onGCastApiAvailable, previous)
    env.scripts[1].onerror(error)
    await assert.rejects(second, value => value === error)
  })

  test(`Chromecast ${implementation.name}: late SDK availability after destroy still loads media`, async () => {
    const env = chromecastEnvironment(implementation)
    const player = env.player()
    await env.factory({})(player.art)
    const pending = player.controls[0].click()
    player.destroy()
    env.installSdk()
    env.context.__onGCastApiAvailable(true)
    env.sessionState('SESSION_STARTED')
    await pending
    await env.flush()
    assert.equal(env.mediaLoads.length, 1)
    assert.equal(player.art.notice.show, 'Casting started')
  })
}
