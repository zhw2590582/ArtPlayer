import assert from 'node:assert/strict'
// eslint-disable-next-line test/no-import-node-test -- The repo uses Node's runner for controlled contracts.
import { test } from 'node:test'
import { bothMenus, hlsHost, hlsImplementations, selections } from './helpers/hls-control.js'

const implementations = await hlsImplementations()
for (const { name, factory } of implementations) {
  test(`${name}: optional factory, synchronous result and deferred core events`, () => {
    const { art, controls, calls, listeners } = hlsHost()
    const empty = factory()(art)
    assert.deepEqual(Object.keys(empty).sort(), ['name', 'update'])
    assert.equal(empty.name, 'artplayerPluginHlsControl')
    assert.equal(empty.update(), undefined)
    assert.equal(calls.length, 0)
    assert.equal(listeners.get('ready').has(empty.update), true)
    assert.equal(listeners.get('restart').has(empty.update), true)
    const plugin = factory(bothMenus())(art)
    assert.equal(controls.size, 0)
    art.emit('ready')
    assert.equal(controls.size, 2)
    calls.length = 0
    art.emit('restart', 'next.m3u8')
    assert.deepEqual(calls.map(call => call[0]), ['controls.update', 'setting.update', 'controls.update', 'setting.update'])
    assert.equal(plugin.update(), undefined)
  })

  test(`${name}: missing or foreign Hls fails before any menu changes`, () => {
    const { art, calls, hls } = hlsHost()
    const plugin = factory(bothMenus())(art)
    for (const invalid of [undefined, null, {}, { media: {} }]) {
      art.hls = invalid
      assert.throws(() => plugin.update(), { message: 'Cannot find instance of HLS from "art.hls"' })
      assert.equal(calls.length, 0)
    }
    art.hls = hls
    plugin.update()
    assert.equal(calls.length, 4)
  })

  test(`${name}: quality and audio retain names, ordering, defaults and UI fields`, () => {
    const { art, hls, controls, settings } = hlsHost()
    hls.levels = [{ name: 'SD', height: 360 }, { height: 720 }, { name: 'SD', height: 480 }, { height: 1080 }]
    hls.audioTracks.push({ id: 2, language: 'de' }, { id: 3, name: 'English' })
    const plugin = factory(bothMenus())(art)
    plugin.update()
    assert.deepEqual(selections(controls.get('hls-quality')), [['1080P', 3, false], ['720P', 1, false], ['SD', 0, false], ['Auto', -1, true]])
    assert.deepEqual(selections(controls.get('hls-audio')), [['English', 0, true], ['fr', 1, false], ['de', 2, false]])
    for (const [key, title] of [['hls-quality', 'Quality'], ['hls-audio', 'Audio']]) {
      const control = controls.get(key)
      const setting = settings.get(key)
      assert.equal(control.position, 'right')
      assert.equal(control.style.padding, '0 10px')
      assert.equal(setting.width, 200)
      assert.match(setting.icon, /<svg/)
      assert.equal(setting.html, title)
      assert.equal(setting.tooltip, control.html)
      assert.equal(setting.selector, control.selector)
      assert.equal(setting.onSelect, control.onSelect)
    }
  })

  test(`${name}: selection writes SDK then notice then checks the same item`, () => {
    for (const [key, field, title] of [['hls-quality', 'currentLevel', 'Quality'], ['hls-audio', 'audioTrack', 'Audio']]) {
      const { art, calls, controls, hls } = hlsHost()
      factory(bothMenus())(art).update()
      const menu = controls.get(key)
      const item = menu.selector[1]
      calls.length = 0
      assert.equal(menu.onSelect(item), item.html)
      assert.equal(hls[field], item.value)
      assert.deepEqual(calls, [[field, item.value], ['notice', `${title}: ${item.html}`], ['controls.check', item], ['setting.check', item]])
      if (key === 'hls-quality') {
        assert.equal(menu.onSelect(menu.selector.at(-1)), 'Auto')
        assert.equal(hls.currentLevel, -1)
      }
    }
  })

  test(`${name}: getName receives original SDK item and optional map index without binding`, () => {
    const { art, hls, controls } = hlsHost()
    hls.currentLevel = 1
    const invocations = []
    const option = bothMenus()
    option.quality.getName = function (...args) {
      invocations.push({ context: this, args })
      return `Level ${args[0].height}`
    }
    factory(option)(art).update()
    assert.equal(invocations.length, 4)
    assert.equal(invocations[0].args.length, 1)
    assert.equal(invocations[0].args[0], hls.levels[1])
    for (let index = 0; index < 3; index++) {
      assert.equal(invocations[index + 1].context, undefined)
      assert.equal(invocations[index + 1].args[0], hls.levels[index])
      assert.equal(invocations[index + 1].args[1], index)
    }
    assert.equal(controls.get('hls-quality').html, 'Level 720')
  })

  test(`${name}: callback failure is synchronous and later update can recover`, () => {
    const { art, calls, controls } = hlsHost()
    const failure = new Error('consumer callback failure')
    const option = bothMenus()
    option.audio.getName = () => {
      throw failure
    }
    const plugin = factory(option)(art)
    assert.throws(() => plugin.update(), error => error === failure)
    assert.deepEqual(calls.map(call => call[1]), ['hls-quality', 'hls-quality'])
    assert.equal(controls.has('hls-audio'), false)
    delete option.audio.getName
    assert.equal(plugin.update(), undefined)
    assert.equal(controls.has('hls-audio'), true)
  })

  test(`${name}: rejected SDK selection propagates before notice or checks`, () => {
    for (const [key, field] of [['hls-quality', 'currentLevel'], ['hls-audio', 'audioTrack']]) {
      const { art, hls, controls, calls } = hlsHost()
      factory(bothMenus())(art).update()
      const failure = new Error('SDK selection rejected')
      const selected = hls[field]
      Object.defineProperty(hls, field, {
        get: () => selected,
        set() {
          throw failure
        },
      })
      calls.length = 0
      const menu = controls.get(key)
      assert.throws(() => menu.onSelect(menu.selector[0]), error => error === failure)
      assert.equal(calls.length, 0)
    }
  })

  test(`${name}: individual surfaces, translated labels and falsy defaults`, () => {
    for (const surface of ['control', 'setting']) {
      const { art, controls, settings, calls } = hlsHost()
      const options = { quality: { [surface]: true, title: 'Definition', auto: 'Automatic' }, audio: { [surface]: true, title: '', auto: '' } }
      factory(options)(art).update()
      const active = surface === 'control' ? controls : settings
      assert.equal((surface === 'control' ? settings : controls).size, 0)
      const menu = active.get('hls-quality')
      assert.equal(menu.selector.at(-1).html, 'Automatic')
      calls.length = 0
      menu.onSelect(menu.selector[0])
      assert.equal(art.notice.show, 'Definition: 1080P')
      assert.deepEqual(calls.map(call => call[0]), ['currentLevel', 'notice', `${surface === 'control' ? 'controls' : 'setting'}.check`])
      active.get('hls-audio').onSelect(active.get('hls-audio').selector[0])
      assert.equal(art.notice.show, 'Audio: English')
    }
  })

  test(`${name}: update reads replacement engine and new list indexes`, () => {
    const host = hlsHost()
    const plugin = factory(bothMenus())(host.art)
    plugin.update()
    const replacement = hlsHost().hls
    replacement.media = host.art.template.$video
    replacement.levels = [{ height: 144 }, { height: 240 }]
    replacement.currentLevel = 1
    host.art.hls = replacement
    host.art.emit('restart')
    const menu = host.controls.get('hls-quality')
    assert.deepEqual(selections(menu), [['240P', 1, true], ['144P', 0, false], ['Auto', -1, false]])
    menu.onSelect(menu.selector[1])
    assert.equal(replacement.currentLevel, 0)
    assert.equal(host.hls.currentLevel, -1)
  })
}

// Published-only observations freeze bugs, not requirements for the new implementation.
for (const { name, factory } of implementations.filter(item => item.name.startsWith('published-'))) {
  test(`${name}: historical empty topology and disabled flags retain stale menus`, () => {
    const { art, hls, controls, settings } = hlsHost()
    const option = bothMenus()
    const plugin = factory(option)(art)
    plugin.update()
    const old = controls.get('hls-quality')
    hls.levels = []
    hls.audioTracks = []
    plugin.update()
    assert.equal(controls.get('hls-quality'), old)
    assert.equal(settings.size, 2)
    hls.levels = [{ height: 240 }]
    option.quality.control = false
    option.quality.setting = false
    plugin.update()
    assert.equal(controls.get('hls-quality'), old)
  })

  test(`${name}: historical callbacks still write old engines after replacement and destroy`, () => {
    const { art, hls, controls, calls } = hlsHost()
    const plugin = factory(bothMenus())(art)
    plugin.update()
    const old = controls.get('hls-quality')
    const replacement = hlsHost().hls
    replacement.media = art.template.$video
    art.hls = replacement
    plugin.update()
    old.onSelect(old.selector[0])
    assert.equal(hls.currentLevel, 2)
    assert.equal(replacement.currentLevel, -1)
    art.emit('destroy')
    calls.length = 0
    plugin.update()
    assert.equal(calls.length, 4, 'Retained update remains active after core destroy event')
  })

  test(`${name}: historical Auto label follows playing level, duplicate default is lost`, () => {
    const { art, hls, controls } = hlsHost()
    hls.autoLevelEnabled = true
    hls.currentLevel = 1
    const plugin = factory(bothMenus())(art)
    plugin.update()
    assert.equal(controls.get('hls-quality').html, '720P')
    assert.equal(controls.get('hls-quality').selector.at(-1).default, false)
    hls.levels = [{ height: 720 }, { height: 720 }]
    plugin.update()
    assert.equal(controls.get('hls-quality').selector.some(item => item.default), false)
  })
}
