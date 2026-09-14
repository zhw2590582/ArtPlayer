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

function seekHost() {
  const host = eventHost(4)
  Object.assign(host.video, { currentTime: 6, seeking: true, dispatchEvent() {
    assert.fail('Recovery must not dispatch native media events')
  } })
  const samples = []
  const levels = { video: 3, audio: 5 }
  const buffers = Object.fromEntries(['video', 'audio'].map(type => [type, {
    end: type === 'video' ? 6 : 11,
    pruning: false,
    removals: [],
    getRangeAt(time) { return this.end > time ? { end: this.end } : null },
    getIsPruningInProgress() { return this.pruning },
    getAllRangesWithSafetyFactor() { return this.removals },
    clearBuffers() { assert.fail('Recovery must not clear buffers') },
    pruneAllSafely() { assert.fail('Recovery must not prune buffers') },
  }]))
  const metrics = {
    getCurrentBufferLevel(type) { return levels[type] },
    addBufferLevel(type, at, level) {
      assert(Number.isFinite(at.valueOf()))
      samples.push({ type, level })
      levels[type] = level
    },
  }
  const state = { stream: { getProcessors: () => Object.entries(buffers).map(([type, buffer]) => ({ getType: () => type, getBufferController: () => buffer })) } }
  Object.assign(host.dash, { getVersion: () => '4.5.2', getDashMetrics: () => metrics, getActiveStream: () => state.stream })
  return { ...host, samples, levels, buffers, metrics, seekState: state }
}

function navigationHost(version) {
  const host = eventHost(version)
  const setting = host.art.setting
  const update = setting.update
  const renders = []
  Object.assign(setting, {
    option: [],
    active: null,
    show: true,
    find: name => host.settings.get(name),
    render(option) {
      setting.active = option
      renders.push(option)
    },
    update(option) {
      update(option)
      setting.active = setting.option
    },
  })
  return { ...host, renders, open(name) {
    setting.active = host.settings.get(name).selector
  } }
}

for (const { name, sdk, factory } of candidates) {
  test(`DASH ${sdk} (${name}): automatic refresh retains the owned quality or audio panel after both menu updates`, async () => {
    for (const name of ['dash-quality', 'dash-audio']) {
      const host = navigationHost(sdk)
      factory(bothMenus())(host.art).update()
      host.open(name)
      const previous = host.art.setting.active
      host.fire('qualityChangeRendered')
      await flush()
      assert.equal(host.renders.length, 1)
      assert.equal(host.art.setting.active, host.settings.get(name).selector)
      assert.notEqual(host.art.setting.active, previous)
    }
  })

  test(`DASH ${sdk} (${name}): explicit update and closed or foreign panels retain existing navigation behavior`, async () => {
    for (const mode of ['explicit', 'closed', 'foreign', 'unavailable', 'removed']) {
      const host = navigationHost(sdk)
      const option = bothMenus()
      const plugin = factory(option)(host.art)
      plugin.update()
      host.open('dash-quality')
      if (mode === 'explicit') {
        plugin.update()
      }
      else {
        if (mode === 'closed')
          host.art.setting.show = false
        if (mode === 'foreign')
          host.settings.get('dash-quality').onSelect = () => {}
        if (mode === 'unavailable')
          delete host.art.setting.render
        if (mode === 'removed')
          option.quality.setting = false
        host.fire('qualityChangeRendered')
        await flush()
      }
      assert.equal(host.renders.length, 0)
      assert.equal(host.art.setting.active, host.art.setting.option)
    }
  })

  test(`DASH ${sdk} (${name}): navigation lookup cannot restore an obsolete refresh after a nested explicit update`, async () => {
    const host = navigationHost(sdk)
    const plugin = factory(bothMenus())(host.art)
    plugin.update()
    host.open('dash-quality')
    const find = host.art.setting.find
    let reads = 0
    host.art.setting.find = (name) => {
      if (++reads === 2)
        plugin.update()
      return find(name)
    }
    host.fire('qualityChangeRendered')
    await flush()
    assert.equal(host.renders.length, 0)
    assert.equal(host.art.setting.active, host.art.setting.option)
  })

  test(`DASH ${sdk} (${name}): destruction from navigation lookup cannot reopen settings`, async () => {
    const host = navigationHost(sdk)
    factory(bothMenus())(host.art).update()
    host.open('dash-quality')
    const find = host.art.setting.find
    let reads = 0
    host.art.setting.find = (name) => {
      const result = find(name)
      if (++reads === 2)
        host.art.destroy()
      return result
    }
    host.fire('qualityChangeRendered')
    await flush()
    assert.equal(host.renders.length, 0)
  })
}

for (const { name, factory } of candidates.filter(item => item.sdk === 4)) {
  test(`DASH (${name}): seeking records only measured empty stale metrics without changing SDK methods or media`, () => {
    const host = seekHost()
    const getters = [host.metrics.getCurrentBufferLevel, host.buffers.video.getRangeAt]
    const settings = JSON.stringify(host.state.settings)
    factory(bothMenus())(host.art).update()
    assert.equal(host.listenerCount(), 8)
    host.fire('playbackSeeking')
    host.fire('playbackSeeking')
    assert.deepEqual(host.samples, [{ type: 'video', level: 0 }])
    assert.equal(host.levels.audio, 5)
    assert.equal(host.video.currentTime, 6)
    assert.equal(JSON.stringify(host.state.settings), settings)
    assert.deepEqual([host.metrics.getCurrentBufferLevel, host.buffers.video.getRangeAt], getters)
  })

  test(`DASH (${name}): recovery excludes other SDK versions and unavailable optional capabilities`, () => {
    for (const version of ['5.2.1', '4.5.1', undefined]) {
      const host = seekHost()
      host.dash.getVersion = () => version
      factory(bothMenus())(host.art).update()
      assert.equal(host.listenerCount(), 7)
      host.fire('playbackSeeking')
      assert.equal(host.samples.length, 0)
    }
    const host = seekHost()
    delete host.dash.getDashMetrics
    factory(bothMenus())(host.art).update()
    assert.equal(host.listenerCount(), 7)
  })

  test(`DASH (${name}): nonempty, pruning, unready and invalid seek measurements do not overwrite metrics`, () => {
    const changes = [
      h => h.video.seeking = false,
      h => h.video.currentTime = Number.NaN,
      h => h.levels.video = 0,
      h => h.levels.video = Number.NaN,
      h => h.levels.video = Number.POSITIVE_INFINITY,
      h => h.buffers.video.end = 8,
      h => h.buffers.video.getRangeAt = () => ({ end: Number.NaN }),
      h => h.buffers.video.getRangeAt = () => undefined,
      h => h.buffers.video.pruning = true,
      h => h.buffers.video.pruning = undefined,
      h => h.buffers.video.removals.push({ start: 0, end: 1 }),
      h => delete h.buffers.video.getRangeAt,
      h => h.seekState.stream = null,
    ]
    for (const change of changes) {
      const host = seekHost()
      factory(bothMenus())(host.art).update()
      change(host)
      host.fire('playbackSeeking')
      assert.equal(host.samples.length, 0)
    }
  })

  test(`DASH (${name}): escaped recovery callbacks are inert after SDK replacement or destruction`, () => {
    const host = seekHost()
    factory(bothMenus())(host.art).update()
    const retained = [...host.events.get('playbackSeeking')][0]
    host.art.dash = {}
    retained()
    host.art.dash = host.dash
    host.art.destroy()
    retained()
    assert.equal(host.samples.length, 0)
    assert.equal(host.listenerCount(), 0)
  })

  test(`DASH (${name}): stream teardown suspends recovery until the active stream is initialized`, async () => {
    const host = seekHost()
    factory(bothMenus())(host.art).update()
    host.fire('streamTeardownComplete')
    host.fire('playbackSeeking')
    assert.equal(host.samples.length, 0)
    host.fire('streamInitialized')
    await flush()
    host.fire('playbackSeeking')
    assert.deepEqual(host.samples, [{ type: 'video', level: 0 }])
  })

  test(`DASH (${name}): reentrant metrics and destruction cannot write a second stream measurement`, () => {
    const host = seekHost()
    host.buffers.audio.end = 6
    const add = host.metrics.addBufferLevel
    host.metrics.addBufferLevel = (...args) => {
      host.fire('playbackSeeking')
      add(...args)
      host.art.destroy()
    }
    factory(bothMenus())(host.art).update()
    host.fire('playbackSeeking')
    assert.deepEqual(host.samples, [{ type: 'video', level: 0 }])
    assert.equal(host.listenerCount(), 0)
  })

  test(`DASH (${name}): source, video and time changes during measurement cancel the stale write`, () => {
    for (const change of [h => h.seekState.stream = {}, h => h.state.video = {}, h => h.video.currentTime = 7, h => h.dash.getDashMetrics = () => null]) {
      const host = seekHost()
      host.buffers.video.getRangeAt = () => {
        change(host)
        return null
      }
      factory(bothMenus())(host.art).update()
      host.fire('playbackSeeking')
      assert.equal(host.samples.length, 0)
    }
  })

  test(`DASH (${name}): metric errors keep menus and allow a later recovery attempt`, (t) => {
    const host = seekHost()
    const add = host.metrics.addBufferLevel
    const failure = new Error('Metric write failed')
    const warnings = []
    t.mock.method(console, 'warn', (...args) => warnings.push(args))
    host.metrics.addBufferLevel = () => {
      throw failure
    }
    factory(bothMenus())(host.art).update()
    host.fire('playbackSeeking')
    assert.equal(warnings.length, 1)
    assert.equal(warnings[0][1], failure)
    assert.equal(host.controls.size + host.settings.size, 4)
    assert.equal(host.listenerCount(), 8)
    host.metrics.addBufferLevel = add
    host.fire('playbackSeeking')
    assert.equal(host.samples.length, 1)
  })

  test(`DASH (${name}): destruction from the final SDK media check prevents a late metric write`, () => {
    const host = seekHost()
    factory(bothMenus())(host.art).update()
    let reads = 0
    host.dash.getVideoElement = () => {
      if (++reads === 2)
        host.art.destroy()
      return host.video
    }
    host.fire('playbackSeeking')
    assert.equal(host.samples.length, 0)
    assert.equal(host.listenerCount(), 0)
  })
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
