import assert from 'node:assert/strict'
// eslint-disable-next-line test/no-import-node-test -- Controlled media contracts use Node's runner.
import { test } from 'node:test'
import { audioHost, audioImplementations, createAudioArt } from './helpers/audio-track.js'

const implementations = await audioImplementations()
for (const { name, factory } of implementations) {
  test(`${name}: synchronous lazy installation, exposed audio and initial media properties`, (t) => {
    const { art, instances } = audioHost(t)
    const option = { url: 'first.aac' }
    const attach = factory(option)
    assert.equal(instances.length, 0)
    option.url = 'before-install.aac'
    const plugin = attach(art)
    assert.equal(plugin.name, 'artplayerPluginAudioTrack')
    assert.deepEqual(Object.keys(plugin).sort(), ['audio', 'name', 'update'])
    assert.equal(plugin.audio, instances[0])
    assert.deepEqual(plugin.audio.calls, [['preload', 'auto'], ['src', 'before-install.aac'], ['volume', 0.6], ['muted', false], ['playbackRate', 1.25]])
    assert.equal(plugin.update({}), undefined)
    assert.equal(art.muted, false, 'Plugin must not mute the main video')
  })

  test(`${name}: default threshold is strict and offset applies in both directions`, (t) => {
    const { art } = audioHost(t)
    const { audio, update } = factory({ url: 'audio.aac' })(art)
    audio.calls.length = 0
    art.currentTime = 0.3
    art.emit('seek')
    assert.deepEqual(audio.calls, [])
    art.currentTime = 0.31
    art.emit('seek')
    assert.deepEqual(audio.calls, [['currentTime', 0.31]])
    update({ offset: 2, sync: 0 })
    art.currentTime = 4
    art.emit('seek')
    assert.equal(audio.currentTime, 6)
    update({ offset: -1 })
    art.emit('seek')
    assert.equal(audio.currentTime, 3)
  })

  test(`${name}: play synchronizes before playback and timeupdate only follows playing video`, (t) => {
    const { art } = audioHost(t)
    const { audio } = factory({ url: 'audio.aac' })(art)
    audio.calls.length = 0
    art.currentTime = 4
    art.emit('video:timeupdate')
    assert.deepEqual(audio.calls, [])
    art.emit('play')
    assert.deepEqual(audio.calls, [['currentTime', 4], ['play']])
    art.playing = true
    art.currentTime = 5
    art.emit('video:timeupdate')
    assert.equal(audio.currentTime, 5)
    art.video = null
    audio.calls.length = 0
    art.emit('seek')
    assert.deepEqual(audio.calls, [])
  })

  test(`${name}: waiting pauses, playing resumes conditionally, pause always stops audio`, (t) => {
    const { art } = audioHost(t)
    const { audio } = factory({ url: 'audio.aac' })(art)
    audio.calls.length = 0
    art.emit('video:waiting').emit('video:playing')
    assert.deepEqual(audio.calls, [['pause']])
    art.playing = true
    art.emit('video:playing').emit('pause')
    assert.deepEqual(audio.calls, [['pause'], ['play'], ['pause']])
  })

  test(`${name}: independent volume mute and rate changes follow the host`, (t) => {
    const { art } = audioHost(t)
    const { audio } = factory({ url: 'audio.aac' })(art)
    art.volume = 0
    art.muted = true
    art.video.playbackRate = 2
    art.emit('video:volumechange').emit('video:ratechange')
    assert.equal(audio.volume, 0)
    assert.equal(audio.muted, true)
    assert.equal(audio.playbackRate, 2)
    art.video = undefined
    assert.equal(factory({ url: '' })(art).audio.playbackRate, 1)
  })

  test(`${name}: same and empty URLs do not reload; changed source preserves audio identity`, (t) => {
    const { art, instances } = audioHost(t)
    const plugin = factory({ url: 'audio.aac' })(art)
    plugin.audio.calls.length = 0
    plugin.update({ url: 'audio.aac' })
    plugin.update({ url: '' })
    assert.deepEqual(plugin.audio.calls, [])
    assert.equal(plugin.update({ url: 'paused.aac' }), undefined)
    assert.deepEqual(plugin.audio.calls, [['src', 'paused.aac']])
    art.playing = true
    plugin.audio.calls.length = 0
    plugin.update({ url: 'playing.aac' })
    assert.deepEqual(plugin.audio.calls, [['src', 'playing.aac'], ['play']])
    assert.equal(plugin.audio, instances[0])
    assert.equal(instances.length, 1)
  })

  test(`${name}: an empty initial URL stays inert until configured`, (t) => {
    const { art } = audioHost(t)
    const { audio, update } = factory({ url: '' })(art)
    art.currentTime = 3
    art.playing = true
    audio.calls.length = 0
    art.emit('play').emit('seek').emit('video:timeupdate').emit('video:playing')
    assert.deepEqual(audio.calls, [])
    update({ url: 'configured.aac' })
    assert.deepEqual(audio.calls, [['src', 'configured.aac'], ['play']])
  })

  test(`${name}: rejection at all three play sites is observed as the original warning`, async (t) => {
    const { art, setPlay, warnings } = audioHost(t)
    const plugin = factory({ url: 'audio.aac' })(art)
    const rejection = new Error('Controlled NotAllowedError')
    setPlay(() => Promise.reject(rejection))
    art.playing = true
    art.emit('play')
    await Promise.resolve()
    art.emit('video:playing')
    await Promise.resolve()
    assert.equal(plugin.update({ url: 'next.aac' }), undefined)
    await Promise.resolve()
    assert.deepEqual(warnings, [rejection, rejection, rejection])
  })

  test(`${name}: destroy releases the exposed media and multiple hosts stay independent`, (t) => {
    const first = audioHost(t)
    const second = createAudioArt()
    const left = factory({ url: 'left.aac' })(first.art)
    const right = factory({ url: 'right.aac' })(second.art)
    assert.notEqual(left.audio, right.audio)
    left.audio.calls.length = 0
    right.audio.calls.length = 0
    first.art.emit('destroy')
    assert.deepEqual(left.audio.calls, [['pause'], ['src', ''], ['load']])
    assert.deepEqual(right.audio.calls, [])
    second.art.currentTime = 2
    second.art.emit('seek')
    assert.equal(right.audio.currentTime, 2)
  })
}

const historical = implementations.find(item => item.name === 'published-main').factory
test('published defect AUDIO-LIFE-01: retained update reloads audio after destroy', (t) => {
  const { art, listeners } = audioHost(t)
  const plugin = historical({ url: 'audio.aac' })(art)
  art.emit('destroy')
  plugin.audio.calls.length = 0
  plugin.update({ url: 'revived.aac' })
  assert.deepEqual(plugin.audio.calls, [['src', 'revived.aac']])
  assert.equal([...listeners.values()].reduce((count, set) => count + set.size, 0), 9)
})

test('published observation: offset update is deferred, negative target is written without clamping', (t) => {
  const { art } = audioHost(t)
  const plugin = historical({ url: 'audio.aac' })(art)
  plugin.audio.calls.length = 0
  plugin.update({ offset: -2 })
  assert.deepEqual(plugin.audio.calls, [])
  art.currentTime = 0
  art.emit('seek')
  assert.deepEqual(plugin.audio.calls, [['currentTime', -2]])
})
