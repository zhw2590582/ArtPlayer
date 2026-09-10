import assert from 'node:assert/strict'
// eslint-disable-next-line test/no-import-node-test -- Use the built-in runner without adding a test framework.
import { mock, test } from 'node:test'
import { loadPackage } from './helpers/load.js'

const { default: dashControl } = await loadPackage('artplayer-plugin-dash-control')

function createPlayer() {
  const representations = [
    { id: 'low', height: 288, bitrateInKbit: 395 },
    { id: 'medium', height: 360, bitrateInKbit: 689 },
    { id: 'target', height: 480, bitrateInKbit: 885 },
    { id: 'high', height: 720, bitrateInKbit: 1474 },
    { id: 'highest', height: 1080, bitrateInKbit: 1967 },
  ]
  const settings = { streaming: { abr: { minBitrate: { video: -1 }, autoSwitchBitrate: { video: true } } } }
  const $video = {}
  let current = representations[2]
  const dash = {
    getVideoElement: () => $video,
    getSettings: () => settings,
    updateSettings: ({ streaming: { abr } }) => Object.assign(settings.streaming.abr, abr),
    getRepresentationsByType: () => representations.filter(item => item.bitrateInKbit >= settings.streaming.abr.minBitrate.video),
    getCurrentRepresentationForType: () => current,
    setRepresentationForTypeById: mock.fn((type, id) => {
      current = representations.find(item => item.id === id)
    }),
    setRepresentationForTypeByIndex: mock.fn((type, index) => {
      current = dash.getRepresentationsByType(type)[index]
    }),
    getTracksFor: () => [],
  }
  const controls = new Map()
  const setting = new Map()
  const art = {
    dash,
    template: { $video },
    constructor: { utils: { errorHandle: assert.ok } },
    notice: { show: '' },
    on: mock.fn(),
    controls: { update: option => controls.set(option.name, option), check: mock.fn() },
    setting: { update: option => setting.set(option.name, option), check: mock.fn() },
  }
  const plugin = dashControl({ quality: { control: true, setting: true } })(art)
  plugin.update()
  return { art, dash, plugin, representations, controls, setting }
}

for (const surface of ['controls', 'setting']) {
  test(`${surface}: bitrate filtering does not change the selected representation`, () => {
    const player = createPlayer()
    const { dash } = player
    const option = player[surface].get('dash-quality')
    const target = option.selector.find(item => item.html === '480p')
    dash.updateSettings({ streaming: { abr: { minBitrate: { video: 500 } } } })
    assert.equal(dash.getRepresentationsByType('video')[target.value].height, 720)

    option.onSelect(target)

    assert.equal(dash.getCurrentRepresentationForType('video').height, 480)
    assert.deepEqual(dash.setRepresentationForTypeById.mock.calls[0].arguments, ['video', 'target'])
    assert.equal(dash.setRepresentationForTypeByIndex.mock.callCount(), 0)
    assert.equal(dash.getSettings().streaming.abr.autoSwitchBitrate.video, false)
    assert.equal(player.art.notice.show, 'Quality: 480p')
    assert.equal(player.art.controls.check.mock.calls[0].arguments[0], target)
    assert.equal(player.art.setting.check.mock.calls[0].arguments[0], target)
  })
}

test('quality ordering, automatic selection and return to Auto are preserved', () => {
  const { controls, dash } = createPlayer()
  const option = controls.get('dash-quality')
  assert.deepEqual(option.selector.map(item => item.html), ['1080p', '720p', '480p', '360p', '288p', 'Auto'])
  assert.deepEqual(option.selector.filter(item => item.default).map(item => item.value), ['auto'])
  option.onSelect(option.selector[0])
  assert.equal(dash.getCurrentRepresentationForType('video').height, 1080)
  option.onSelect(option.selector.at(-1))
  assert.equal(dash.getSettings().streaming.abr.autoSwitchBitrate.video, true)
  assert.equal(dash.setRepresentationForTypeById.mock.callCount(), 1)
})

test('updating a filtered list preserves the manual selection by ID', () => {
  const { controls, dash, plugin } = createPlayer()
  const option = controls.get('dash-quality')
  option.onSelect(option.selector.find(item => item.html === '480p'))
  dash.updateSettings({ streaming: { abr: { minBitrate: { video: 500 } } } })
  plugin.update()
  const updated = controls.get('dash-quality')
  assert.equal(updated.html, '480p')
  assert.deepEqual(updated.selector.filter(item => item.default).map(item => item.id), ['target'])
})

test('a representation whose ID is auto remains a manual quality option', () => {
  const { controls, dash, plugin, representations } = createPlayer()
  representations[2].id = 'auto'
  plugin.update()
  const option = controls.get('dash-quality')
  option.onSelect(option.selector.find(item => item.html === '480p'))
  assert.equal(dash.getCurrentRepresentationForType('video').height, 480)
  assert.equal(dash.getSettings().streaming.abr.autoSwitchBitrate.video, false)
  assert.deepEqual(dash.setRepresentationForTypeById.mock.calls[0].arguments, ['video', 'auto'])
})
