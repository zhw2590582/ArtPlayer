import assert from 'node:assert/strict'
// eslint-disable-next-line test/no-import-node-test -- Controlled plugin contracts use Node's built-in runner.
import test from 'node:test'
import { bothMenus, dashHost, dashImplementations } from './helpers/dash-control.js'

const implementations = await dashImplementations()
const abr = video => ({ streaming: { abr: { autoSwitchBitrate: { video } } } })
for (const { name, factory, sdk } of implementations) {
  test(`${name}: optional factory, deferred SDK binding and synchronous update shape`, () => {
    const host = dashHost(sdk)
    delete host.art.dash
    const result = factory()(host.art)
    assert.deepEqual(Object.keys(result).sort(), ['name', 'update'])
    assert.equal(result.name, 'artplayerPluginDashControl')
    assert.equal(host.calls.length, 0)
    host.art.dash = host.dash
    assert.equal(result.update(), undefined)
    assert.equal(host.controls.size, 0)
    assert.equal(host.settings.size, 0)
  })
  test(`${name}: ready/restart render named surfaces and preserve default Auto/audio behavior`, () => {
    const host = dashHost(sdk)
    factory(bothMenus())(host.art)
    assert.equal(host.controls.size, 0)
    host.art.emit('ready')
    assert.deepEqual([...host.controls.keys()], ['dash-quality', 'dash-audio'])
    assert.deepEqual([...host.settings.keys()], ['dash-quality', 'dash-audio'])
    const quality = host.controls.get('dash-quality')
    const audio = host.controls.get('dash-audio')
    assert.equal(quality.html, 'Auto')
    assert.deepEqual(Array.from(quality.selector, item => item.html), ['1080p', '720p', '360p', 'Auto'])
    assert.deepEqual(Array.from(quality.selector).filter(item => item.default).map(item => item.value), ['auto'])
    assert.equal(audio.html, 'en')
    assert.deepEqual(Array.from(audio.selector, item => item.value), host.state.tracks)
    assert.equal(audio.selector[0].default, true)
    assert.equal(audio.selector.length, 2, 'Audio has no synthetic Auto item')
    for (const key of ['dash-quality', 'dash-audio']) {
      assert.equal(host.controls.get(key).position, 'right')
      assert.equal(host.controls.get(key).style.padding, '0 10px')
      assert.equal(host.settings.get(key).width, 200)
      assert.match(host.settings.get(key).icon, /<svg/)
    }
    host.calls.length = 0
    host.art.emit('restart', 'new.mpd')
    assert.deepEqual(host.calls.map(call => call[0]), ['controls.update', 'setting.update', 'controls.update', 'setting.update'])
  })
  test(`${name}: selectors preserve SDK/check identities, notice order and sync return values`, () => {
    for (const surface of ['controls', 'settings']) {
      const host = dashHost(sdk)
      factory(bothMenus())(host.art).update()
      const menu = host[surface].get('dash-quality')
      const item = menu.selector[0]
      host.calls.length = 0
      assert.equal(menu.onSelect(item), '1080p')
      assert.deepEqual(host.calls, [
        ['updateSettings', abr(false)],
        sdk === 4 ? ['setQualityFor', 'video', 2] : ['setRepresentationForTypeById', 'video', 'top'],
        ['notice', 'Quality: 1080p'],
        ['controls.check', item],
        ['setting.check', item],
      ])
      assert.equal(host.state.settings.streaming.abr.autoSwitchBitrate.audio, false)
      assert.equal(host.state.settings.streaming.abr.minBitrate.video, -1)
      host.calls.length = 0
      const auto = menu.selector.at(-1)
      assert.equal(menu.onSelect(auto), 'Auto')
      assert.deepEqual(host.calls, [['updateSettings', abr(true)], ['notice', 'Quality: Auto'], ['controls.check', auto], ['setting.check', auto]])
      const audio = host[surface].get('dash-audio')
      const track = audio.selector[1]
      host.calls.length = 0
      assert.equal(audio.onSelect(track), 'fr')
      assert.equal(host.state.currentTrack, host.state.tracks[1])
      assert.deepEqual(host.calls, [['setCurrentTrack', host.state.tracks[1]], ['notice', 'Audio: fr'], ['controls.check', track], ['setting.check', track]])
    }
  })
  test(`${name}: getName sees original objects, one argument and no receiver binding`, () => {
    const host = dashHost(sdk)
    host.state.settings.streaming.abr.autoSwitchBitrate.video = false
    const qualityCalls = []
    const audioCalls = []
    const options = bothMenus()
    options.quality.getName = function (...args) {
      qualityCalls.push([this, args])
      return `Q${args[0].height}`
    }
    options.audio.getName = function (...args) {
      audioCalls.push([this, args])
      return `A${args[0].lang}`
    }
    factory(options)(host.art).update()
    assert.deepEqual(qualityCalls.map(([receiver, args]) => [receiver, args.length, args[0]]), [host.state.levels[1], ...host.state.levels].map(item => [undefined, 1, item]))
    assert.deepEqual(audioCalls.map(([receiver, args]) => [receiver, args.length, args[0]]), [host.state.tracks[0], ...host.state.tracks].map(item => [undefined, 1, item]))
    assert.equal(host.controls.get('dash-quality').html, 'Q720')
    assert.equal(host.controls.get('dash-audio').html, 'Aen')
  })
  test(`${name}: labels deduplicate without mutating caller SDK arrays`, () => {
    const host = dashHost(sdk)
    host.state.levels[1].height = 360
    host.state.tracks[1].lang = 'en'
    const levels = [...host.state.levels]
    const tracks = [...host.state.tracks]
    const before = JSON.stringify({ levels, tracks })
    factory(bothMenus())(host.art).update()
    assert.deepEqual(Array.from(host.controls.get('dash-quality').selector, item => item.html), ['1080p', '360p', 'Auto'])
    assert.equal(host.controls.get('dash-audio').selector.length, 1)
    assert.equal(host.controls.get('dash-audio').selector[0].value, tracks[0])
    assert.equal(JSON.stringify({ levels: host.state.levels, tracks: host.state.tracks }), before)
    assert.deepEqual(host.state.levels, levels)
  })
  test(`${name}: explicit quality keys survive noncontiguous SDK metadata`, () => {
    const host = dashHost(sdk)
    host.state.levels.forEach((level, index) => {
      level[sdk === 4 ? 'qualityIndex' : 'absoluteIndex'] = 10 + index * 20
    })
    factory(bothMenus())(host.art).update()
    const menu = host.controls.get('dash-quality')
    const item = menu.selector.find(item => item.html === '720p')
    host.calls.length = 0
    menu.onSelect(item)
    assert.deepEqual(host.calls[1], sdk === 4 ? ['setQualityFor', 'video', 30] : ['setRepresentationForTypeById', 'video', 'high'])
  })
  test(`${name}: empty topology has no UI and later ready data can render`, () => {
    const host = dashHost(sdk)
    const { levels, tracks } = host.state
    host.state.levels = []
    host.state.tracks = null
    const plugin = factory(bothMenus())(host.art)
    plugin.update()
    assert.equal(host.calls.length, 0)
    host.state.levels = levels
    host.state.tracks = tracks
    host.art.emit('ready')
    assert.equal(host.controls.size, 2)
  })
  test(`${name}: truthy label defaults and per-surface enablement remain unchanged`, () => {
    const host = dashHost(sdk)
    factory({ quality: { control: true, title: '', auto: '' }, audio: { setting: true, title: '' } })(host.art).update()
    assert.deepEqual([...host.controls.keys()], ['dash-quality'])
    assert.deepEqual([...host.settings.keys()], ['dash-audio'])
    assert.equal(host.controls.get('dash-quality').html, 'Auto')
    assert.equal(host.settings.get('dash-audio').html, 'Audio')
    host.calls.length = 0
    const audio = host.settings.get('dash-audio')
    audio.onSelect(audio.selector[1])
    assert.equal(host.calls.some(call => call[0] === 'controls.check'), false)
  })
  test(`${name}: missing and wrong media ownership fails synchronously`, () => {
    const host = dashHost(sdk)
    const plugin = factory(bothMenus())(host.art)
    host.state.video = {}
    assert.throws(plugin.update, { message: 'Cannot find instance of DASH from "art.dash"' })
    assert.equal(host.controls.size, 0)
    delete host.art.dash
    assert.throws(plugin.update, { name: 'TypeError' })
    host.art.dash = host.dash
    host.state.video = host.video
    plugin.update()
    assert.equal(host.controls.size, 2)
  })
  test(`${name}: caller getName and SDK setter failures preserve error identity`, () => {
    const host = dashHost(sdk)
    const failure = new Error('caller failure')
    const options = bothMenus()
    options.quality.getName = () => {
      throw failure
    }
    const plugin = factory(options)(host.art)
    assert.throws(plugin.update, error => error === failure)
    assert.equal(host.controls.size, 0)
    delete options.quality.getName
    plugin.update()
    host.dash[sdk === 4 ? 'setQualityFor' : 'setRepresentationForTypeById'] = () => {
      throw failure
    }
    host.calls.length = 0
    const menu = host.controls.get('dash-quality')
    assert.throws(() => menu.onSelect(menu.selector[0]), error => error === failure)
    assert.deepEqual(host.calls, [['updateSettings', abr(false)]])
  })
  test(`${name}: SDK replacement and multiple hosts retain independent selections`, () => {
    const left = dashHost(sdk)
    const right = dashHost(sdk)
    factory(bothMenus())(left.art).update()
    factory(bothMenus())(right.art).update()
    right.state.video = left.video
    left.art.dash = right.dash
    left.art.emit('restart')
    left.calls.length = 0
    right.calls.length = 0
    const menu = left.controls.get('dash-audio')
    menu.onSelect(menu.selector[1])
    assert.equal(right.state.currentTrack, right.state.tracks[1])
    assert.equal(left.state.currentTrack, left.state.tracks[0])
    assert.equal(left.calls.some(call => call[0] === 'setCurrentTrack'), false)
    assert.equal(right.calls[0][0], 'setCurrentTrack')
  })
}
// These historical factories stay frozen when the live source is repaired.
for (const { name, factory, sdk } of implementations.filter(item => item.name.startsWith('published') || item.name === 'pre-refactor-v5')) {
  test(`${name} observation DASH-LIFE-01: empty/disabled surfaces remain registered`, () => {
    const host = dashHost(sdk)
    const options = bothMenus()
    const plugin = factory(options)(host.art)
    plugin.update()
    const previous = host.controls.get('dash-quality')
    host.state.levels = []
    host.state.tracks = []
    plugin.update()
    assert.equal(host.controls.get('dash-quality'), previous)
    options.quality.control = options.quality.setting = false
    options.audio.control = options.audio.setting = false
    plugin.update()
    assert.equal(host.controls.size, 2)
    assert.equal(host.settings.size, 2)
  })
  test(`${name} observation DASH-LIFE-01: retained callbacks outlive destruction and SDK replacement`, () => {
    const host = dashHost(sdk)
    const plugin = factory(bothMenus())(host.art)
    plugin.update()
    const menu = host.controls.get('dash-quality')
    const next = dashHost(sdk)
    next.state.video = host.video
    host.art.dash = next.dash
    plugin.update()
    host.art.destroy()
    host.calls.length = 0
    menu.onSelect(menu.selector[0])
    assert.equal(host.calls[1][0], sdk === 4 ? 'setQualityFor' : 'setRepresentationForTypeById')
    assert.equal(host.listeners.get('ready').size, 1)
    assert.equal(host.listeners.get('restart').size, 1)
    host.calls.length = 0
    plugin.update()
    assert.equal(host.calls.filter(call => call[0].endsWith('.update')).length, 4)
    assert.equal(host.calls.some(call => call[0] === 'dash.destroy'), false)
  })
  test(`${name} observation DASH-STATE-01: cloned current track and duplicate current label lose highlighting`, () => {
    const host = dashHost(sdk)
    host.state.currentTrack = { ...host.state.tracks[1] }
    host.state.settings.streaming.abr.autoSwitchBitrate.video = false
    host.state.levels[1].height = 360
    factory(bothMenus())(host.art).update()
    assert.equal(host.controls.get('dash-audio').html, 'fr')
    assert.equal(Array.from(host.controls.get('dash-audio').selector).filter(item => item.default).length, 0)
    assert.equal(host.controls.get('dash-quality').html, '360p')
    assert.equal(Array.from(host.controls.get('dash-quality').selector).filter(item => item.default).length, 0)
  })
}
test('pre-refactor v5 observation: numeric zero representation ID loses manual highlighting', () => {
  const { factory } = implementations.find(item => item.name === 'pre-refactor-v5')
  const host = dashHost(5)
  host.state.levels[1].id = 0
  host.state.settings.streaming.abr.autoSwitchBitrate.video = false
  factory(bothMenus())(host.art).update()
  const menu = host.controls.get('dash-quality')
  assert.equal(menu.html, '720p')
  assert.equal(Array.from(menu.selector).filter(item => item.default).length, 0)
})
test('frozen SDK generations demonstrate the two incompatible quality method surfaces', () => {
  const published = implementations.find(item => item.name === 'published-main').factory
  const historical = implementations.find(item => item.name === 'pre-refactor-v5').factory
  assert.throws(() => published(bothMenus())(dashHost(5).art).update(), /getBitrateInfoListFor/)
  assert.throws(() => historical(bothMenus())(dashHost(4).art).update(), /getRepresentationsByType/)
})
