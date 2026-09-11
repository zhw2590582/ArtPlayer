import assert from 'node:assert/strict'
// eslint-disable-next-line test/no-import-node-test -- SDK event ownership uses Node's lifecycle runner.
import test from 'node:test'
import { bothMenus, dashHost, dashImplementations } from './helpers/dash-control.js'

const candidates = (await dashImplementations()).filter(item => item.name.startsWith('source') || item.name.startsWith('artifact'))
const flush = () => Promise.resolve()
function eventHost(version) {
  const host = dashHost(version)
  const events = new Map()
  host.dash.on = (name, callback) => {
    if (!events.has(name))
      events.set(name, new Set())
    events.get(name).add(callback)
  }
  host.dash.off = (name, callback) => events.get(name)?.delete(callback)
  return { ...host, events, fire(name) {
    for (const callback of [...(events.get(name) || [])])
      callback()
  }, listenerCount: () => [...events.values()].reduce((sum, callbacks) => sum + callbacks.size, 0) }
}

for (const { name, sdk, factory } of candidates) {
  test(`DASH ${sdk} (${name}): SDK events coalesce without interrupting synchronous selection`, async () => {
    const host = eventHost(sdk)
    factory(bothMenus())(host.art).update()
    assert.equal(host.listenerCount(), 7)
    const oldSelect = host.dash.setCurrentTrack
    host.dash.setCurrentTrack = (track) => {
      oldSelect.call(host.dash, track)
      host.fire('trackChangeRendered')
      host.fire('streamUpdated')
    }
    const menu = host.controls.get('dash-audio')
    host.calls.length = 0
    assert.equal(menu.onSelect(menu.selector[1]), 'fr')
    assert.deepEqual(host.calls.map(call => call[0]), ['setCurrentTrack', 'notice', 'controls.check', 'setting.check'])
    await flush()
    assert.equal(host.controls.get('dash-audio').html, 'fr')
    assert.equal(host.calls.filter(call => call[0] === 'controls.update').length, 2)
  })

  test(`DASH ${sdk} (${name}): time ticks only refresh changed Auto state`, async () => {
    const host = eventHost(sdk)
    const plugin = factory(bothMenus())(host.art)
    plugin.update()
    host.calls.length = 0
    host.fire('playbackTimeUpdated')
    await flush()
    assert.equal(host.calls.length, 0)
    host.state.settings.streaming.abr.autoSwitchBitrate.video = false
    host.fire('playbackTimeUpdated')
    host.fire('playbackTimeUpdated')
    await flush()
    assert.equal(host.controls.get('dash-quality').html, '720p')
    assert.equal(host.calls.filter(call => call[0] === 'controls.update').length, 2)
    host.state.settings.streaming.abr.autoSwitchBitrate.video = true
    plugin.update()
    host.calls.length = 0
    host.fire('playbackTimeUpdated')
    await flush()
    assert.equal(host.calls.length, 0)
  })

  test(`DASH ${sdk} (${name}): changed SDK and destroy invalidate queued work and only remove owned listeners`, async () => {
    const host = eventHost(sdk)
    const next = eventHost(sdk)
    const external = () => {}
    host.dash.on('streamUpdated', external)
    const plugin = factory(bothMenus())(host.art)
    plugin.update()
    host.fire('streamUpdated')
    next.state.video = host.video
    host.art.dash = next.dash
    host.calls.length = 0
    await flush()
    assert.equal(host.calls.length, 0)
    plugin.update()
    assert.equal(host.listenerCount(), 1)
    assert(host.events.get('streamUpdated').has(external))
    assert.equal(next.listenerCount(), 7)
    next.fire('qualityChangeRendered')
    const retained = [...next.events.get('qualityChangeRendered')][0]
    host.art.destroy()
    host.calls.length = 0
    retained()
    await flush()
    assert.equal(next.listenerCount(), 0)
    assert.equal(host.calls.length, 0)
    assert(!next.calls.some(call => call[0] === 'dash.destroy'))
  })

  test(`DASH ${sdk} (${name}): SDK teardown clears menus and source initialization restores them`, async () => {
    const host = eventHost(sdk)
    factory(bothMenus())(host.art).update()
    host.fire('qualityChangeRendered')
    host.fire('streamTeardownComplete')
    assert.equal(host.controls.size + host.settings.size, 0)
    host.calls.length = 0
    host.fire('playbackTimeUpdated')
    await flush()
    assert.equal(host.calls.length, 0)
    host.fire('streamInitialized')
    await flush()
    assert.equal(host.controls.size + host.settings.size, 4)
    assert.equal(host.listenerCount(), 7)
  })

  test(`DASH ${sdk} (${name}): a partially installed SDK subscription is rolled back with its original error`, () => {
    const host = eventHost(sdk)
    const failure = new Error('SDK subscription failed')
    const on = host.dash.on
    host.dash.on = (name, callback) => {
      on(name, callback)
      if (host.listenerCount() === 2)
        throw failure
    }
    assert.throws(() => factory(bothMenus())(host.art).update(), error => error === failure)
    assert.equal(host.listenerCount(), 0)
    assert.equal(host.controls.size + host.settings.size, 0)
  })

  test(`DASH ${sdk} (${name}): throwing SDK removal still attempts every owned listener and menu`, () => {
    const host = eventHost(sdk)
    const failure = new Error('SDK unsubscribe failed')
    const off = host.dash.off
    let removed = 0
    host.dash.off = (name, callback) => {
      off(name, callback)
      removed++
      if (removed === 1)
        throw failure
    }
    factory(bothMenus())(host.art).update()
    assert.throws(() => host.art.destroy(), error => error === failure)
    assert.equal(removed, 7)
    assert.equal(host.listenerCount(), 0)
    assert.equal(host.controls.size + host.settings.size, 0)
  })

  test(`DASH ${sdk} (${name}): asynchronous formatter failure closes observation and reports the original error`, async (t) => {
    const host = eventHost(sdk)
    const option = bothMenus()
    factory(option)(host.art).update()
    const failure = new Error('SDK refresh formatter failed')
    option.audio.getName = () => {
      throw failure
    }
    const warnings = []
    t.mock.method(console, 'warn', (...args) => warnings.push(args))
    host.fire('trackChangeRendered')
    await flush()
    assert.equal(host.listenerCount(), 0)
    assert.equal(host.controls.size + host.settings.size, 0)
    assert.equal(warnings.length, 1)
    assert.equal(warnings[0][1], failure)
  })

  test(`DASH ${sdk} (${name}): destroy during SDK subscription cannot install later listeners`, () => {
    const host = eventHost(sdk)
    const on = host.dash.on
    host.dash.on = (name, callback) => {
      on(name, callback)
      host.art.destroy()
    }
    factory(bothMenus())(host.art).update()
    assert.equal(host.listenerCount(), 0)
    assert.equal(host.controls.size + host.settings.size, 0)
  })

  test(`DASH ${sdk} (${name}): SDK events emitted by a formatter cannot create an endless refresh loop`, async () => {
    const host = eventHost(sdk)
    const option = bothMenus()
    let formats = 0
    option.audio.getName = (track) => {
      formats++
      host.fire('streamUpdated')
      return track.lang
    }
    factory(option)(host.art).update()
    const initial = formats
    await flush()
    const refreshed = formats
    assert(refreshed > initial)
    await flush()
    assert.equal(formats, refreshed)
  })

  test(`DASH ${sdk} (${name}): destruction from a repeated binding snapshot leaves no stale writes`, () => {
    const host = eventHost(sdk)
    const plugin = factory(bothMenus())(host.art)
    plugin.update()
    const getSettings = host.dash.getSettings
    host.dash.getSettings = () => {
      host.art.destroy()
      return getSettings.call(host.dash)
    }
    plugin.update()
    assert.equal(host.listenerCount(), 0)
    assert.equal(host.controls.size + host.settings.size, 0)
  })

  test(`DASH ${sdk} (${name}): unsubscribe reentry keeps the newer SDK binding exactly once`, () => {
    const host = eventHost(sdk)
    const next = eventHost(sdk)
    next.state.video = host.video
    const off = host.dash.off
    let entered = false
    let plugin
    host.dash.off = (name, callback) => {
      off(name, callback)
      if (!entered) {
        entered = true
        plugin.update()
      }
    }
    plugin = factory(bothMenus())(host.art)
    plugin.update()
    host.art.dash = next.dash
    plugin.update()
    assert.equal(host.listenerCount(), 0)
    assert.equal(next.listenerCount(), 7)
    assert.equal(host.controls.size + host.settings.size, 4)
    host.art.destroy()
    assert.equal(next.listenerCount(), 0)
  })

  test(`DASH ${sdk} (${name}): failed Auto observation stops reads and an explicit update can recover`, async (t) => {
    const host = eventHost(sdk)
    const plugin = factory(bothMenus())(host.art)
    plugin.update()
    const getSettings = host.dash.getSettings
    const failure = new Error('SDK settings unavailable')
    let reads = 0
    host.dash.getSettings = () => {
      reads++
      throw failure
    }
    const warnings = []
    t.mock.method(console, 'warn', (...args) => warnings.push(args))
    host.fire('playbackTimeUpdated')
    host.fire('playbackTimeUpdated')
    await flush()
    assert.equal(reads, 1)
    assert.equal(host.listenerCount(), 0)
    assert.equal(host.controls.size + host.settings.size, 0)
    assert.equal(warnings.length, 1)
    assert.equal(warnings[0][1], failure)
    host.dash.getSettings = getSettings
    plugin.update()
    assert.equal(host.listenerCount(), 7)
    assert.equal(host.controls.size + host.settings.size, 4)
  })

  test(`DASH ${sdk} (${name}): explicit update errors stay synchronous when SDK events are supported`, (t) => {
    const host = eventHost(sdk)
    const option = bothMenus()
    const plugin = factory(option)(host.art)
    plugin.update()
    const failure = new Error('Explicit formatter failure')
    option.audio.getName = () => {
      throw failure
    }
    const warnings = []
    t.mock.method(console, 'warn', (...args) => warnings.push(args))
    assert.throws(() => plugin.update(), error => error === failure)
    assert.equal(host.listenerCount(), 0)
    assert.equal(host.controls.size + host.settings.size, 0)
    assert.equal(warnings.length, 0)
  })
}
