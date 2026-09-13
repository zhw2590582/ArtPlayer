import assert from 'node:assert/strict'
// eslint-disable-next-line test/no-import-node-test -- Frozen Chromecast observations use the repository runner.
import test from 'node:test'
import { chromecastEnvironment, chromecastHistorical } from './helpers/chromecast.js'

for (const implementation of await chromecastHistorical()) {
  if (implementation.name.startsWith('published-1.0.0-')) {
    for (const script of [false, true]) {
      test(`Chromecast ${implementation.name}: ${script ? 'global' : 'CJS'} eager SDK registration returns only name`, async () => {
        const env = chromecastEnvironment(implementation, { script })
        const player = env.player()
        const register = env.factory({ icon: '<b>cast</b>' })
        assert.equal(typeof env.context.__onGCastApiAvailable, 'function')
        assert.equal(env.scripts.length, 0)
        const pending = register(player.art)
        assert.equal(player.controls.length, 0)
        assert.equal(env.scripts.length, 1)
        env.installSdk()
        env.context.__onGCastApiAvailable(true)
        env.scripts[0].onload({ type: 'load' })
        const plugin = await pending
        assert.deepEqual(Object.keys(plugin), ['name'])
        assert.equal(plugin.name, 'artplayerPluginChromecast')
        assert.equal(plugin.getCastState, undefined)
        assert.equal(player.controls[0].name, 'chromecast')
        assert.equal(player.controls[0].html, '<i class="art-icon art-icon-cast"><b>cast</b></i>')
        assert.equal(player.controls[0].click(), undefined)
        await env.flush()
        assert.equal(env.mediaLoads[0].media.contentId, '/video.mp4')
        assert.equal(env.mediaLoads[0].media.contentType, 'video/mp4')
        assert.equal(env.sdkListeners.size, 0)
      })
    }
    test(`Chromecast ${implementation.name}: existing SDK skips loading and live options select media without modern callbacks`, async () => {
      const env = chromecastEnvironment(implementation)
      env.installSdk()
      const player = env.player('/movie.M3U8?token=one#position')
      const events = []
      const option = { onCastStart: () => events.push('start') }
      await env.factory(option)(player.art)
      assert.equal(env.scripts.length, 0)
      player.controls[0].click()
      await env.flush()
      assert.equal(env.mediaLoads[0].media.contentType, 'application/x-mpegURL')
      option.url = '/custom'
      option.mimeType = 'application/custom'
      player.controls[0].click()
      await env.flush()
      assert.equal(env.mediaLoads.at(-1).media.contentId, '/custom')
      assert.equal(env.mediaLoads.at(-1).media.contentType, 'application/custom')
      assert.deepEqual(events, [])
      assert.equal(player.art.notice.show, '')
    })
    test(`Chromecast ${implementation.name}: script failure rejects registration without adding controls`, async () => {
      const env = chromecastEnvironment(implementation)
      const player = env.player()
      const pending = env.factory({})(player.art)
      const error = { type: 'error' }
      env.scripts[0].onerror(error)
      await assert.rejects(pending, value => value === error)
      assert.equal(player.controls.length, 0)
    })
    continue
  }
  for (const script of [false, true]) {
    test(`Chromecast ${implementation.name}: ${script ? 'global' : 'CJS'} lazy registration and public extraction`, async () => {
      const env = chromecastEnvironment(implementation, { script })
      const player = env.player()
      const register = env.factory({ icon: '<b>cast</b>' })
      assert.equal(env.scripts.length, 0)
      assert.equal(player.controls.length, 0)
      const pending = register(player.art)
      assert.equal(typeof pending.then, 'function')
      const plugin = await pending
      assert.deepEqual(Object.keys(plugin), ['name', 'getCastState', 'isCasting'])
      assert.equal(plugin.name, 'artplayerPluginChromecast')
      assert.equal(plugin.getCastState(), null)
      assert.equal(plugin.isCasting(), false)
      assert.equal(player.controls[0].name, 'chromecast')
      assert.equal(player.controls[0].position, 'right')
      assert.equal(player.controls[0].tooltip, 'Chromecast')
      assert.equal(player.controls[0].html, '<i class="art-icon art-icon-cast"><b>cast</b></i>')
      assert.equal(env.scripts.length, 0)
    })
  }

  test(`Chromecast ${implementation.name}: session callback order, casting request and MIME remain observable`, async () => {
    const env = chromecastEnvironment(implementation)
    const player = env.player('/movie.M3U8?token=one#position')
    const events = []
    const option = { sdk: '/local-sender.js', onStateChange: state => events.push(['state', state]), onCastAvailable: value => events.push(['available', value]), onCastStart: () => events.push(['start']) }
    const plugin = await env.factory(option)(player.art)
    const pending = player.controls[0].click()
    assert.equal(env.scripts[0].src, '/local-sender.js')
    const { session } = env.installSdk()
    env.context.__onGCastApiAvailable(true)
    env.sessionState('SESSION_STARTED', session)
    await pending
    await env.flush()
    assert.equal(env.requests(), 0)
    assert.equal(env.mediaLoads[0].media.contentId, '/movie.M3U8?token=one#position')
    assert.equal(env.mediaLoads[0].media.contentType, 'application/x-mpegURL')
    assert.equal(player.art.notice.show, 'Casting started')
    assert.equal(plugin.getCastState(), 'SESSION_STARTED')
    assert.equal(plugin.isCasting(), true)
    assert.equal(player.icon.style.color, 'red')
    assert.deepEqual(events, [['state', 'connected'], ['start']])
    env.emit('caststatechanged', { castState: 'NO_DEVICES_AVAILABLE' })
    env.emit('caststatechanged', { castState: 'NOT_CONNECTED' })
    assert.deepEqual(events.slice(-2), [['available', false], ['available', true]])
    option.url = 'https://media.test/custom'
    option.mimeType = 'application/custom'
    await player.controls[0].click()
    await env.flush()
    assert.equal(env.mediaLoads.at(-1).media.contentId, option.url)
    assert.equal(env.mediaLoads.at(-1).media.contentType, option.mimeType)
    assert.equal(env.scripts.length, 1)
  })

  test(`Chromecast ${implementation.name}: script failure preserves error identity and does not mark initialized`, async () => {
    const env = chromecastEnvironment(implementation)
    const player = env.player()
    const failures = []
    const plugin = await env.factory({ onError: error => failures.push(error) })(player.art)
    const pending = player.controls[0].click()
    const error = { type: 'error', target: env.scripts[0] }
    env.scripts[0].onerror(error)
    await assert.rejects(pending, value => value === error)
    assert.equal(failures[0], error)
    assert.equal(player.art.notice.show, 'Failed to initialize Cast API')
    assert.equal(plugin.isCasting(), false)
  })
}
