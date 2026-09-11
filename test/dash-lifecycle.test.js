import assert from 'node:assert/strict'
// eslint-disable-next-line test/no-import-node-test -- Runtime lifecycle contracts use Node's built-in runner.
import test from 'node:test'
import { bothMenus, dashHost, dashImplementations } from './helpers/dash-control.js'

const candidates = (await dashImplementations()).filter(item => item.name.startsWith('source') || item.name.startsWith('artifact'))
const { factory } = candidates[0]
for (const { sdk, name, factory } of candidates) {
  test(`DASH ${sdk} (${name}): supports the original SDK method generation and stable selection keys`, () => {
    const host = dashHost(sdk)
    factory(bothMenus())(host.art).update()
    const menu = host.controls.get('dash-quality')
    const selected = menu.selector.find(item => item.html === '720p')
    host.calls.length = 0
    assert.equal(menu.onSelect(selected), '720p')
    assert.deepEqual(host.calls[1], sdk === 4 ? ['setQualityFor', 'video', 1] : ['setRepresentationForTypeById', 'video', 'high'])
  })

  test(`DASH ${sdk} (${name}): empty lists clear owned UI and invalidate retained selectors`, () => {
    const host = dashHost(sdk)
    const plugin = factory(bothMenus())(host.art)
    plugin.update()
    const menu = host.controls.get('dash-quality')
    const { levels, tracks } = host.state
    host.state.levels = []
    host.state.tracks = []
    plugin.update()
    assert.equal(host.controls.size + host.settings.size, 0)
    host.calls.length = 0
    assert.equal(menu.onSelect(menu.selector[0]), '1080p')
    assert.equal(host.calls.length, 0)
    host.state.levels = levels
    host.state.tracks = tracks
    host.art.emit('restart')
    assert.equal(host.controls.size + host.settings.size, 4)
  })

  test(`DASH ${sdk} (${name}): disabling one surface removes only that surface`, () => {
    const host = dashHost(sdk)
    const options = bothMenus()
    const plugin = factory(options)(host.art)
    plugin.update()
    options.quality.control = false
    options.audio.setting = false
    plugin.update()
    assert.deepEqual([...host.controls.keys()], ['dash-audio'])
    assert.deepEqual([...host.settings.keys()], ['dash-quality'])
  })

  test(`DASH ${sdk} (${name}): destroy unsubscribes and makes update/retained callbacks inert without owning SDK`, () => {
    const host = dashHost(sdk)
    const other = dashHost(sdk)
    factory(bothMenus())(other.art).update()
    const plugin = factory(bothMenus())(host.art)
    plugin.update()
    const menu = host.controls.get('dash-audio')
    host.art.destroy()
    assert.equal(host.controls.size + host.settings.size, 0)
    assert.equal([...host.listeners.values()].reduce((sum, set) => sum + set.size, 0), 0)
    host.calls.length = 0
    plugin.update()
    host.art.emit('ready')
    host.art.emit('restart')
    host.art.destroy()
    assert.equal(menu.onSelect(menu.selector[1]), 'fr')
    assert.equal(host.calls.length, 0)
    assert.equal(other.controls.size + other.settings.size, 4)
  })

  test(`DASH ${sdk} (${name}): replacing SDK immediately silences old callbacks before and after update`, () => {
    const host = dashHost(sdk)
    const next = dashHost(sdk)
    const plugin = factory(bothMenus())(host.art)
    plugin.update()
    const menu = host.controls.get('dash-quality')
    next.state.video = host.video
    host.art.dash = next.dash
    host.calls.length = 0
    menu.onSelect(menu.selector[0])
    assert.equal(host.calls.length, 0)
    plugin.update()
    host.calls.length = 0
    menu.onSelect(menu.selector[0])
    assert.equal(host.calls.length, 0)
    assert.equal(next.calls.length, 0)
  })

  test(`DASH ${sdk} (${name}): duplicate labels preserve the current selectable object`, () => {
    const host = dashHost(sdk)
    host.state.settings.streaming.abr.autoSwitchBitrate.video = false
    host.state.levels[1].height = 360
    host.state.tracks[1].lang = 'en'
    host.state.currentTrack = host.state.tracks[1]
    factory(bothMenus())(host.art).update()
    const quality = host.controls.get('dash-quality')
    const selected = quality.selector.filter(item => item.default)
    assert.equal(selected.length, 1)
    host.calls.length = 0
    quality.onSelect(selected[0])
    assert.deepEqual(host.calls[1], sdk === 4 ? ['setQualityFor', 'video', 1] : ['setRepresentationForTypeById', 'video', 'high'])
    const audio = host.controls.get('dash-audio').selector.filter(item => item.default)
    assert.equal(audio.length, 1)
    assert.equal(audio[0].value, host.state.tracks[1])
  })

  test(`DASH ${sdk} (${name}): cloned current track matches a unique track but never fabricates ambiguous selection`, () => {
    const host = dashHost(sdk)
    const plugin = factory(bothMenus())(host.art)
    host.state.currentTrack = { ...host.state.tracks[1] }
    plugin.update()
    assert.equal(host.controls.get('dash-audio').selector.find(item => item.default).value, host.state.tracks[1])
    host.state.tracks.push({ ...host.state.tracks[1], lang: 'fr-duplicate' })
    host.state.currentTrack = { id: 'fr', index: 1 }
    plugin.update()
    assert.equal(host.controls.get('dash-audio').selector.some(item => item.default), false)
  })

  test(`DASH ${sdk} (${name}): reentrant getName destruction cannot repopulate menus`, () => {
    const host = dashHost(sdk)
    const options = bothMenus()
    let calls = 0
    options.quality.getName = (level) => {
      calls++
      host.art.destroy()
      return `${level.height}p`
    }
    factory(options)(host.art).update()
    assert.equal(host.controls.size + host.settings.size, 0)
    assert.equal(host.calls.length, 0)
    assert.equal(calls, 1)
  })

  test(`DASH ${sdk} (${name}): synchronous SDK destruction stops later selection writes and notifications`, () => {
    const host = dashHost(sdk)
    factory(bothMenus())(host.art).update()
    const menu = host.controls.get('dash-quality')
    const original = host.dash.updateSettings
    host.dash.updateSettings = (value) => {
      original.call(host.dash, value)
      host.art.destroy()
    }
    host.calls.length = 0
    assert.equal(menu.onSelect(menu.selector[0]), '1080p')
    assert.equal(host.calls.some(call => /^set(?:Quality|Representation)/.test(call[0])), false)
    assert.equal(host.calls.some(call => call[0] === 'notice' || call[0].endsWith('.check')), false)
  })

  test(`DASH ${sdk} (${name}): rendering errors clear partial own menus and allow an explicit retry`, () => {
    const host = dashHost(sdk)
    const failure = new Error('setting rendering failed')
    const original = host.art.setting.update
    host.art.setting.update = (option) => {
      original(option)
      throw failure
    }
    const plugin = factory(bothMenus())(host.art)
    assert.throws(plugin.update, error => error === failure)
    assert.equal(host.controls.size + host.settings.size, 0)
    host.art.setting.update = original
    plugin.update()
    assert.equal(host.controls.size + host.settings.size, 4)
  })

  test(`DASH ${sdk} (${name}): nested update from a formatter keeps the latest render`, () => {
    const host = dashHost(sdk)
    const options = bothMenus()
    const plugin = factory(options)(host.art)
    let nested = false
    options.quality.getName = (level) => {
      if (!nested) {
        nested = true
        host.state.levels = [host.state.levels[2]]
        plugin.update()
      }
      return `${level.height}p`
    }
    plugin.update()
    assert.deepEqual(Array.from(host.controls.get('dash-quality').selector, item => item.html), ['1080p', 'Auto'])
    assert.equal(host.controls.size + host.settings.size, 4)
  })

  test(`DASH ${sdk} (${name}): a cleanup-triggered restart does not remove newly installed menus`, () => {
    const host = dashHost(sdk)
    const plugin = factory(bothMenus())(host.art)
    plugin.update()
    const { levels } = host.state
    host.state.levels = []
    const remove = host.art.controls.remove
    host.art.controls.remove = (name) => {
      remove(name)
      host.state.levels = levels
      plugin.update()
    }
    plugin.update()
    assert.equal(host.controls.size + host.settings.size, 4)
  })

  test(`DASH ${sdk} (${name}): clearing a caller-replaced registry entry preserves the caller entry`, () => {
    const host = dashHost(sdk)
    host.art.controls.cache = { get: name => ({ option: host.controls.get(name) }) }
    host.art.setting.find = name => host.settings.get(name)
    factory(bothMenus())(host.art).update()
    const replacement = { onSelect() {} }
    host.controls.set('dash-quality', replacement)
    host.settings.set('dash-audio', replacement)
    host.art.destroy()
    assert.equal(host.controls.get('dash-quality'), replacement)
    assert.equal(host.settings.get('dash-audio'), replacement)
    assert.equal(host.controls.size + host.settings.size, 2)
  })

  test(`DASH ${sdk} (${name}): cleanup failure does not retain other surfaces or listeners`, () => {
    const host = dashHost(sdk)
    factory(bothMenus())(host.art).update()
    const failure = new Error('control cleanup failed')
    const remove = host.art.controls.remove
    host.art.controls.remove = (name) => {
      remove(name)
      throw failure
    }
    assert.throws(() => host.art.destroy(), error => error === failure)
    assert.equal(host.controls.size + host.settings.size, 0)
    assert.equal([...host.listeners.values()].reduce((sum, set) => sum + set.size, 0), 0)
    host.art.destroy()
  })
}

test('DASH v5: a numeric zero ID is a valid manually selected representation', () => {
  const host = dashHost(5)
  host.state.levels[1].id = 0
  host.state.settings.streaming.abr.autoSwitchBitrate.video = false
  factory(bothMenus())(host.art).update()
  assert.deepEqual(host.controls.get('dash-quality').selector.filter(item => item.default).map(item => item.id), [0])
})

test('DASH installation failure removes even the listener registered by a throwing host', () => {
  const host = dashHost()
  const failure = new Error('subscription failed')
  const on = host.art.on
  host.art.on = (name, callback) => {
    on(name, callback)
    if (name === 'destroy')
      throw failure
  }
  assert.throws(() => factory(bothMenus())(host.art), error => error === failure)
  assert.equal([...host.listeners.values()].reduce((sum, set) => sum + set.size, 0), 0)
})

test('DASH reentrant destruction during subscription cannot install later listeners', () => {
  const host = dashHost()
  const on = host.art.on
  host.art.on = (name, callback) => {
    on(name, callback)
    if (name === 'destroy')
      callback()
  }
  factory()(host.art)
  assert.equal([...host.listeners.values()].reduce((sum, set) => sum + set.size, 0), 0)
})
